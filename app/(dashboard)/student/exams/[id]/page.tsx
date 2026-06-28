import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ExamPlayer } from "./ExamPlayer";

export const metadata = {
  title: "Mengerjakan Ujian - Fokuspad",
};

export default async function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!exam) return notFound();

  const attempt = await prisma.examAttempt.findUnique({
    where: { examId_studentId: { examId: id, studentId: session.user.id } },
    include: { answers: true }
  });

  // Ensure exam is published
  if (exam.status !== "PUBLISHED") {
    return (
      <div className="p-12 text-center text-slate-500 max-w-lg mx-auto bg-white rounded-xl border mt-10 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ujian Tidak Tersedia</h2>
        <p>Ujian ini sedang tidak aktif atau belum dipublikasikan oleh guru.</p>
      </div>
    );
  }

  // Ensure questions have no correct answers exposed to frontend
  // Strip out the 'correctAnswer' from options/payload before passing to client
  const sanitizedExam = {
    ...exam,
    questions: exam.questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      type: q.type,
      // intentionally omitting correctAnswer to prevent cheating via React DevTools
    }))
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-64px)] bg-slate-50">
      <ExamPlayer exam={sanitizedExam} initialAttempt={attempt} />
    </div>
  );
}
