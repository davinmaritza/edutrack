import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, isPast, isFuture } from "date-fns";
import { id } from "date-fns/locale";
import { MonitorPlay, Clock, Calendar, CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";

export const metadata = {
  title: "Ujian Online (CBT) - Fokuspad",
};

export default async function StudentExamsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch student details to get classId
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { classId: true }
  });

  if (!student?.classId) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border max-w-2xl mx-auto mt-10">
        <MonitorPlay className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Anda Belum Memiliki Kelas</h2>
        <p className="text-muted-foreground">Silakan hubungi admin atau wali kelas untuk memasukkan Anda ke dalam kelas agar dapat mengikuti ujian CBT.</p>
      </div>
    );
  }

  // Fetch exams for this student's class that are PUBLISHED
  const exams = await prisma.exam.findMany({
    where: {
      OR: [
        { classId: student.classId },
        { classId: null } // Global exams
      ],
      status: "PUBLISHED"
    },
    include: {
      subject: true,
      teacher: { select: { name: true } },
      attempts: {
        where: { studentId: session.user.id }
      },
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { startTime: "asc" }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ujian Online (CBT)</h1>
        <p className="text-muted-foreground mt-1">Daftar ujian yang tersedia untuk Anda.</p>
      </div>

      <div className="grid gap-4">
        {exams.length === 0 ? (
          <div className="rounded-xl border bg-white shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <MonitorPlay className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">Belum Ada Ujian</h3>
            <p className="text-muted-foreground max-w-sm mt-1">Saat ini tidak ada ujian aktif yang dijadwalkan untuk kelas Anda.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const now = new Date();
            const start = new Date(exam.startTime);
            const end = new Date(exam.endTime);
            
            const isWaiting = isFuture(start);
            const isOngoing = !isWaiting && !isPast(end);
            const isFinished = isPast(end);

            const attempt = exam.attempts[0];
            const isAttempted = !!attempt;
            const isAttemptCompleted = attempt?.status === "COMPLETED";

            let statusBadge = null;
            if (isAttemptCompleted) {
              statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5"/> Sudah Selesai</span>;
            } else if (isAttempted && !isAttemptCompleted) {
              statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="h-3.5 w-3.5"/> Sedang Dikerjakan</span>;
            } else if (isWaiting) {
              statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"><Calendar className="h-3.5 w-3.5"/> Belum Mulai</span>;
            } else if (isFinished) {
              statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Berakhir</span>;
            } else {
              statusBadge = <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 animate-pulse"><PlayCircle className="h-3.5 w-3.5"/> Sedang Berlangsung</span>;
            }

            return (
              <div key={exam.id} className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-all \${isOngoing && !isAttemptCompleted ? 'ring-1 ring-blue-500/30' : ''}`}>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded uppercase" style={{ backgroundColor: exam.subject.color || '#0A84FF' }}>
                        {exam.subject.name}
                      </span>
                      {statusBadge}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                      {exam.description && <p className="text-sm text-slate-500 mt-1">{exam.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Guru</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{exam.teacher.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Durasi</p>
                        <p className="text-sm font-medium text-slate-700">{exam.durationMin} Menit</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Jumlah Soal</p>
                        <p className="text-sm font-medium text-slate-700">{exam._count.questions} Soal</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mode Ujian</p>
                        <p className="text-sm font-medium text-slate-700">{exam.isStrict ? "Strict (Anti-Cheat)" : "Normal"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Mulai: <span className="font-medium text-slate-900">{format(start, "dd MMM yyyy, HH:mm", { locale: id })}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>Berakhir: <span className="font-medium text-slate-900">{format(end, "dd MMM yyyy, HH:mm", { locale: id })}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 shrink-0 min-w-[160px]">
                    {isAttemptCompleted ? (
                      <div className="text-center w-full">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Nilai Anda</p>
                        <div className="text-4xl font-black text-emerald-600">{attempt.score ?? '?'}</div>
                        <Link href={`/dashboard/student/exams/\${exam.id}/result`} className="mt-3 block text-sm font-medium text-[#5483B3] hover:underline">
                          Lihat Detail
                        </Link>
                      </div>
                    ) : isOngoing || (isAttempted && !isFinished) ? (
                      <Link 
                        href={`/dashboard/student/exams/\${exam.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5483B3] text-white rounded-lg font-semibold hover:bg-[#3B638A] transition-colors shadow-sm"
                      >
                        {isAttempted ? "Lanjutkan Ujian" : "Mulai Ujian"}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : isWaiting ? (
                      <button disabled className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-semibold cursor-not-allowed">
                        Belum Waktunya
                      </button>
                    ) : (
                      <button disabled className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 rounded-lg font-semibold cursor-not-allowed">
                        Ujian Ditutup
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
