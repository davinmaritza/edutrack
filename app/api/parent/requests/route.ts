import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Create new Absence Request
export async function POST(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    const studentId = (session?.user as any)?.id

    if (!session || role !== "PARENT" || !studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { startDate, endDate, reason, description, attachmentUrl } = await req.json()

    if (!startDate || !endDate || !reason || !description) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.absenceRequest.create({
      data: {
        studentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        description,
        attachmentUrl: attachmentUrl || null,
        status: "PENDING"
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Absence request create error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    )
  }
}
