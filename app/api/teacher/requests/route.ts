import { RBAC } from "@/lib/rbac"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role
    const teacherId = (session?.user as any)?.id

    if (!session || (!RBAC.isTeacherLevel(role) && !RBAC.canAccessAdminDashboard(role))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const request = await prisma.absenceRequest.findUnique({
      where: { id }
    })

    if (!request) {
      return NextResponse.json({ error: "Pengajuan tidak ditemukan" }, { status: 404 })
    }

    // Update Request status
    await prisma.absenceRequest.update({
      where: { id },
      data: { 
        status,
        reviewedById: teacherId
      }
    })

    // Jika disetujui, tambahkan data ke Attendance secara otomatis
    if (status === "APPROVED") {
      // Loop from startDate to endDate
      const start = new Date(request.startDate)
      const end = new Date(request.endDate)
      
      const attendanceData = []
      let currentDate = start
      while (currentDate <= end) {
        // Skip weekends if you want, but for now insert for all days in range
        attendanceData.push({
          userId: request.studentId,
          date: new Date(currentDate),
          status: request.reason, // SICK or PERMISSION
          notes: `(Otomatis) ${request.description}`,
          recordedById: teacherId
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      if (attendanceData.length > 0) {
        // We use createMany to insert them
        // If there's already attendance for that day, we might get conflicts if there is a unique constraint on (studentId, date).
        // Let's just create them assuming no unique constraint or we use upsert if we need to.
        // Looking at schema, Attendance doesn't have unique constraint on (studentId, date).
        await prisma.attendance.createMany({
          data: attendanceData
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}
