"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function startExam(examId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if attempt exists
  const existing = await prisma.examAttempt.findUnique({
    where: { examId_studentId: { examId, studentId: session.user.id } }
  });

  if (existing) {
    if (existing.status === "COMPLETED") throw new Error("Ujian sudah diselesaikan");
    return existing; // Resume
  }

  // Create new attempt
  const attempt = await prisma.examAttempt.create({
    data: {
      examId,
      studentId: session.user.id,
      status: "ONGOING",
    }
  });

  revalidatePath(`/dashboard/student/exams/${examId}`);
  return attempt;
}

export async function submitAnswer(attemptId: string, questionId: string, answerText: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { exam: true }
  });

  if (!attempt || attempt.studentId !== session.user.id) throw new Error("Invalid attempt");
  if (attempt.status === "COMPLETED") throw new Error("Ujian sudah ditutup");

  // Upsert answer
  await prisma.examAnswer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    update: { answerText },
    create: { attemptId, questionId, answerText }
  });
  
  return { success: true };
}

export async function finishExam(attemptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { 
      exam: { include: { questions: true } },
      answers: true
    }
  });

  if (!attempt || attempt.studentId !== session.user.id) throw new Error("Invalid attempt");

  // Calculate score
  let totalScore = 0;
  const maxScore = attempt.exam.questions.reduce((sum, q) => sum + q.points, 0);

  for (const answer of attempt.answers) {
    const question = attempt.exam.questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.answerText) {
      totalScore += question.points;
      await prisma.examAnswer.update({
        where: { id: answer.id },
        data: { isCorrect: true, pointsAwarded: question.points }
      });
    }
  }

  const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: { 
      status: "COMPLETED", 
      endTime: new Date(),
      score: finalScore
    }
  });

  revalidatePath(`/dashboard/student/exams`);
  revalidatePath(`/dashboard/student/exams/${attempt.examId}`);
  return { success: true, score: finalScore };
}
