import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'STUDENT') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const studentId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    const singleId = searchParams.get('id')

    // Single exam fetch (for exam runner — includes questions)
    if (singleId) {
      const exam = await prisma.exam.findUnique({
        where: { id: singleId, status: 'PUBLISHED' },
        include: {
          subject: true,
          teacher: { select: { name: true } },
          questions: { orderBy: { order: 'asc' } },
          attempts: {
            where: { studentId },
            include: { answers: true }
          }
        }
      })

      if (!exam) return new NextResponse("Not found", { status: 404 })

      // Don't expose correctAnswer to student during active exam
      const attempt = exam.attempts?.[0]
      const isCompleted = attempt?.status === 'COMPLETED'

      const sanitized = {
        ...exam,
        questions: exam.questions.map((q: any) => ({
          ...q,
          // Only reveal correct answer after completion
          correctAnswer: isCompleted ? q.correctAnswer : undefined,
        }))
      }

      return NextResponse.json(sanitized)
    }

    // List all available exams
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { classId: true }
    })

    const exams = await prisma.exam.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { classId: student?.classId || undefined },
          { classId: null }
        ]
      },
      include: {
        subject: true,
        teacher: { select: { name: true } },
        attempts: { where: { studentId } }
      },
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error("[STUDENT_EXAMS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

