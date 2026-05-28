import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { RBAC } from "@/lib/rbac"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || !RBAC.canAccessAdminDashboard((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const registrations = await prisma.ppdbRegistration.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("[ADMIN_PPDB_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || !RBAC.canAccessAdminDashboard((session.user as any).role)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { action, registrationId, status, revisionNotes, interviewScore, reportCardScore, cbtScore, isPassed } = body

    if (action === 'verify') {
      const updated = await prisma.ppdbRegistration.update({
        where: { id: registrationId },
        data: { status, revisionNotes },
        include: { user: true }
      })
      return NextResponse.json(updated)
    }

    if (action === 'score') {
      const current = await prisma.ppdbRegistration.findUnique({
        where: { id: registrationId }
      })
      if (!current) return new NextResponse("Not Found", { status: 404 })

      const reportScore = reportCardScore !== undefined ? parseFloat(reportCardScore) : current.reportCardScore || 0
      const intScore = interviewScore !== undefined ? parseFloat(interviewScore) : current.interviewScore || 0
      const testScore = cbtScore !== undefined ? parseFloat(cbtScore) : current.cbtScore || 0
      
      const finalScore = (reportScore * 0.4) + (intScore * 0.3) + (testScore * 0.3)

      const updated = await prisma.ppdbRegistration.update({
        where: { id: registrationId },
        data: {
          reportCardScore: reportScore,
          interviewScore: intScore,
          cbtScore: testScore,
          finalScore
        },
        include: { user: true }
      })
      return NextResponse.json(updated)
    }

    if (action === 'selection') {
      const updated = await prisma.ppdbRegistration.update({
        where: { id: registrationId },
        data: { isPassed },
        include: { user: true }
      })

      if (isPassed) {
        const existingBilling = await prisma.billing.findFirst({
          where: {
            studentId: updated.userId,
            title: "Biaya Daftar Ulang PPDB"
          }
        })

        if (!existingBilling) {
          await prisma.billing.create({
            data: {
              studentId: updated.userId,
              title: "Biaya Daftar Ulang PPDB",
              description: "Tagihan pembayaran awal daftar ulang siswa baru tahun ajaran aktif.",
              amount: 1500000,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
              status: 'UNPAID'
            }
          })
        }
      }

      return NextResponse.json(updated)
    }

    return new NextResponse("Bad Request", { status: 400 })
  } catch (error) {
    console.error("[ADMIN_PPDB_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
