"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startExam, submitAnswer, finishExam } from "./actions";
import { Clock, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function ExamPlayer({ exam, initialAttempt }: { exam: any, initialAttempt: any }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(initialAttempt);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize answers from existing attempt
  useEffect(() => {
    if (attempt?.answers) {
      const map: Record<string, string> = {};
      attempt.answers.forEach((ans: any) => {
        map[ans.questionId] = ans.answerText;
      });
      setAnswers(map);
    }
  }, [attempt]);

  // Handle timer
  useEffect(() => {
    if (!attempt || attempt.status === "COMPLETED") return;
    
    // Calculate end time
    const start = new Date(attempt.startTime).getTime();
    const durationMs = exam.durationMin * 60 * 1000;
    const end = start + durationMs;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((end - now) / 1000);
      
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        handleAutoSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [attempt]);

  const handleAutoSubmit = async () => {
    toast.error("Waktu Habis! Ujian akan diselesaikan otomatis.");
    await submitFinishedExam();
  };

  const handleStart = async () => {
    try {
      setIsSubmitting(true);
      const newAttempt = await startExam(exam.id);
      setAttempt(newAttempt);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
    try {
      await submitAnswer(attempt.id, questionId, text);
    } catch (e) {
      toast.error("Gagal menyimpan jawaban");
    }
  };

  const submitFinishedExam = async () => {
    try {
      setIsSubmitting(true);
      await finishExam(attempt.id);
      toast.success("Ujian berhasil diselesaikan!");
      router.push("/dashboard/student/exams");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `\${h}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}`;
    return `\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}`;
  };

  // Pre-Start View
  if (!attempt) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-sm border p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{exam.title}</h1>
        <p className="text-muted-foreground mt-2">{exam.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-slate-50 p-4 rounded-xl border">
            <p className="text-sm font-semibold text-slate-500 uppercase">Durasi</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{exam.durationMin} Menit</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border">
            <p className="text-sm font-semibold text-slate-500 uppercase">Soal</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{exam.questions.length} Butir</p>
          </div>
        </div>

        {exam.isStrict && (
          <div className="mt-6 flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-left">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block mb-1">Mode Anti-Cheat Aktif</span>
              Ujian ini menggunakan mode Strict. Anda tidak diizinkan membuka tab lain atau meminimalkan browser selama ujian berlangsung. Pelanggaran akan dicatat.
            </div>
          </div>
        )}

        <button 
          onClick={handleStart}
          disabled={isSubmitting}
          className="w-full mt-8 py-4 bg-[#5483B3] text-white text-lg font-bold rounded-xl hover:bg-[#3B638A] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Memproses..." : "Mulai Ujian Sekarang"}
        </button>
      </div>
    );
  }

  if (attempt.status === "COMPLETED") {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Ujian Selesai</h2>
          <p className="text-muted-foreground mt-2">Anda telah menyelesaikan ujian ini.</p>
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Nilai Akhir</p>
            <p className="text-6xl font-black text-slate-900 mt-2">{attempt.score}</p>
          </div>
          <button onClick={() => router.push("/dashboard/student/exams")} className="w-full mt-8 py-3 bg-slate-100 font-semibold rounded-lg hover:bg-slate-200">
            Kembali ke Daftar Ujian
          </button>
        </div>
      </div>
    );
  }

  // Active Exam View
  const currentQuestion = exam.questions[currentQuestionIdx];
  const options = currentQuestion.options as any[];

  return (
    <div className="max-w-6xl mx-auto flex gap-6 h-[calc(100vh-140px)]">
      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/50">
          <h2 className="font-bold text-lg text-slate-900">Soal No. {currentQuestionIdx + 1}</h2>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full border border-rose-200 font-bold tabular-nums tracking-wider">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="prose max-w-none mb-10 text-lg text-slate-800" dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
          
          <div className="space-y-3">
            {options.map((opt, i) => {
              const text = typeof opt === 'string' ? opt : opt.text;
              const isSelected = answers[currentQuestion.id] === text;
              const letter = String.fromCharCode(65 + i);
              
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQuestion.id, text)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all \${
                    isSelected 
                      ? "border-[#5483B3] bg-[#5483B3]/5 ring-4 ring-[#5483B3]/10" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold \${
                    isSelected ? "bg-[#5483B3] text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {letter}
                  </div>
                  <div className="mt-1 flex-1 text-slate-700">
                    {text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <button 
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="px-5 py-2.5 flex items-center gap-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" /> Sebelumnya
          </button>
          
          {currentQuestionIdx === exam.questions.length - 1 ? (
            <button 
              onClick={() => {
                if (confirm("Yakin ingin menyelesaikan ujian? Anda tidak bisa mengubah jawaban setelah ini.")) {
                  submitFinishedExam();
                }
              }}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm"
            >
              {isSubmitting ? "Menyimpan..." : "Selesai & Kumpulkan"}
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIdx(prev => Math.min(exam.questions.length - 1, prev + 1))}
              className="px-5 py-2.5 flex items-center gap-2 font-semibold text-white bg-[#5483B3] hover:bg-[#3B638A] rounded-lg shadow-sm"
            >
              Selanjutnya <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Grid */}
      <div className="w-80 shrink-0 bg-white rounded-2xl shadow-sm border p-5 flex flex-col hidden lg:flex">
        <h3 className="font-bold text-slate-900 mb-4 pb-4 border-b">Navigasi Soal</h3>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2">
            {exam.questions.map((q: any, i: number) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = currentQuestionIdx === i;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(i)}
                  className={`aspect-square flex items-center justify-center font-bold text-sm rounded-lg border-2 transition-all \${
                    isCurrent
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                      : isAnswered
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex flex-col gap-2 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-50"></div> Sudah Dijawab</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-slate-200"></div> Belum Dijawab</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div> Sedang Dilihat</div>
        </div>
      </div>
    </div>
  );
}
