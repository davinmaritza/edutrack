import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Invalid IDs", { status: 400 })
    }

    // Delete related data for all selected users (Manual Cascade)
    await prisma.progressLog.deleteMany({ where: { userId: { in: ids } } })
    await prisma.userSubject.deleteMany({ where: { userId: { in: ids } } })
    await prisma.notification.deleteMany({ where: { userId: { in: ids } } })
    await prisma.assignmentSubmission.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.account.deleteMany({ where: { userId: { in: ids } } })
    await prisma.session.deleteMany({ where: { userId: { in: ids } } })
    await prisma.calendarReminder.deleteMany({ where: { userId: { in: ids } } })
    await prisma.attendance.deleteMany({ where: { userId: { in: ids } } })
    await prisma.extracurricularMember.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.extracurricularAttendance.deleteMany({ where: { studentId: { in: ids } } })
    await prisma.operator.deleteMany({ where: { userId: { in: ids } } })

    // Cascade for teachers/notes/etc.
    await prisma.comment.deleteMany({ where: { authorId: { in: ids } } })
    await prisma.assignmentSubmission.deleteMany({ where: { assignment: { teacherId: { in: ids } } } })
    await prisma.assignment.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.material.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.classSchedule.deleteMany({ where: { teacherId: { in: ids } } })
    await prisma.userNote.deleteMany({ where: { authorId: { in: ids } } })
    await prisma.userNote.deleteMany({ where: { userId: { in: ids } } })
    await prisma.subject.updateMany({ where: { teacherId: { in: ids } }, data: { teacherId: null } })
    await prisma.extracurricular.updateMany({ where: { leaderId: { in: ids } }, data: { leaderId: null } })
    await prisma.extracurricular.updateMany({ where: { coachId: { in: ids } }, data: { coachId: null } })
    
    // Delete users
    await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return new NextResponse("Users deleted", { status: 200 })
  } catch (error) {
    console.error("[ADMIN_USERS_BULK_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
