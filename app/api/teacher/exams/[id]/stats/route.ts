import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/teacher/exams/[id]/stats — detailed attempt statistics
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } },
        subject: true,
        class: true,
        attempts: {
          include: {
            student: { select: { id: true, name: true, nis: true, image: true } },
            answers: true
          },
          orderBy: { startTime: 'asc' }
        }
      }
    })

    if (!exam || exam.teacherId !== (session.user as any).id) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Compute per-question analytics
    const questionStats = exam.questions.map(q => {
      const allAnswers = exam.attempts
        .flatMap(a => a.answers)
        .filter(a => a.questionId === q.id)

      const correctCount = allAnswers.filter(a => a.isCorrect).length
      const total = allAnswers.length
      return {
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        order: q.order,
        correctCount,
        totalAttempted: total,
        correctRate: total > 0 ? Math.round((correctCount / total) * 100) : 0,
      }
    })

    // Compute overall stats
    const completedAttempts = exam.attempts.filter(a => a.status === 'COMPLETED')
    const scores = completedAttempts.map(a => a.score ?? 0)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0
    const passCount = scores.filter(s => s >= 70).length

    return NextResponse.json({
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMin: exam.durationMin,
        isStrict: exam.isStrict,
        status: exam.status,
        startTime: exam.startTime,
        endTime: exam.endTime,
        subject: exam.subject,
        class: exam.class,
      },
      questions: questionStats,
      attempts: completedAttempts.map(a => ({
        id: a.id,
        studentId: a.studentId,
        studentName: a.student.name,
        studentNis: a.student.nis,
        studentImage: a.student.image,
        score: a.score,
        cheatWarnings: a.cheatWarnings,
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
      })),
      summary: {
        totalAttempts: exam.attempts.length,
        completedAttempts: completedAttempts.length,
        avgScore,
        highestScore,
        lowestScore,
        passCount,
        passRate: completedAttempts.length > 0 ? Math.round((passCount / completedAttempts.length) * 100) : 0,
      }
    })
  } catch (error) {
    console.error("[EXAM_STATS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
