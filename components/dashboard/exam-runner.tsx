'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  BookOpen,
  BarChart3,
  XCircle,
  Shield,
  Flag,
} from 'lucide-react'

interface Question {
  id: string
  questionText: string
  type: string
  options: string[]
  points: number
  order: number
}

interface Exam {
  id: string
  title: string
  description: string
  durationMin: number
  isStrict: boolean
  questions: Question[]
  subject: { name: string }
  startTime: string
  endTime: string
}

interface Attempt {
  id: string
  status: string
  score?: number
  cheatWarnings?: number
  answers?: any[]
}

interface ExamRunnerProps {
  examId: string
}

type Phase = 'loading' | 'briefing' | 'running' | 'submitting' | 'result'

export function ExamRunner({ examId }: ExamRunnerProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [exam, setExam] = useState<Exam | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [cheatWarnings, setCheatWarnings] = useState(0)
  const [showCheatAlert, setShowCheatAlert] = useState(false)
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [resultData, setResultData] = useState<any>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const cheatRef = useRef(0)

  /* ─── Load exam ─── */
  useEffect(() => {
    fetchExam()
  }, [examId])

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/student/exams?id=${examId}`)
      if (!res.ok) { router.push('/dashboard/student/exams'); return }
      const data = await res.json()
      // Find the specific exam from the list
      const exams = Array.isArray(data) ? data : [data]
      const found = exams.find((e: any) => e.id === examId)
      if (!found) { router.push('/dashboard/student/exams'); return }
      setExam(found)
      // Check if already has completed attempt
      if (found.attempts?.[0]?.status === 'COMPLETED') {
        setAttempt(found.attempts[0])
        setResultData(found.attempts[0])
        setPhase('result')
      } else {
        setPhase('briefing')
      }
    } catch { router.push('/dashboard/student/exams') }
  }

  /* ─── Start exam ─── */
  const startExam = async () => {
    if (!exam) return
    try {
      const res = await fetch(`/api/student/exams/${examId}/attempt`, { method: 'POST' })
      if (!res.ok) return
      const att = await res.json()
      setAttempt(att)
      setTimeLeft(exam.durationMin * 60)
      setPhase('running')
    } catch {}
  }

  /* ─── Timer ─── */
  useEffect(() => {
    if (phase !== 'running') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          submitExam()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  /* ─── Anti-cheat: tab/window blur detection ─── */
  useEffect(() => {
    if (phase !== 'running' || !exam?.isStrict) return

    const handleBlur = () => {
      cheatRef.current += 1
      setCheatWarnings(cheatRef.current)
      setShowCheatAlert(true)
      setTimeout(() => setShowCheatAlert(false), 4000)
      // Auto submit after 3 violations
      if (cheatRef.current >= 3) {
        submitExam()
      }
    }

    const handleVisibility = () => {
      if (document.hidden) handleBlur()
    }

    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [phase, exam])

  /* ─── Submit ─── */
  const submitExam = useCallback(async () => {
    if (phase === 'submitting' || phase === 'result') return
    setPhase('submitting')
    clearInterval(timerRef.current!)
    try {
      const answerPayload = Object.entries(answers).map(([questionId, answerText]) => ({
        questionId,
        answerText,
      }))
      const res = await fetch(`/api/student/exams/${examId}/attempt`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerPayload, cheatWarnings: cheatRef.current }),
      })
      if (res.ok) {
        const result = await res.json()
        setResultData(result)
        setAttempt(result)
        setPhase('result')
      }
    } catch { setPhase('running') }
  }, [phase, answers, examId])

  /* ─── Format time ─── */
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const answered = Object.keys(answers).length
  const total = exam?.questions.length || 0

  /* ════════════════════════════
     LOADING
  ════════════════════════════ */
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#5483B3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Memuat soal ujian...</p>
        </div>
      </div>
    )
  }

  /* ════════════════════════════
     BRIEFING
  ════════════════════════════ */
  if (phase === 'briefing' && exam) {
    const now = new Date()
    const start = new Date(exam.startTime)
    const end = new Date(exam.endTime)
    const isOpen = now >= start && now <= end

    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-2xl bg-[#5483B3]/10 flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-[#5483B3]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">{exam.title}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">{exam.subject?.name}</p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Soal', value: exam.questions.length },
              { label: 'Durasi', value: `${exam.durationMin} mnt` },
              { label: 'Anti-Cheat', value: exam.isStrict ? 'Aktif' : 'Nonaktif' },
            ].map((item, i) => (
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-center">
                <p className="text-xl font-black text-[var(--foreground)]">{item.value}</p>
                <p className="text-[11px] text-[var(--muted-foreground)] font-semibold mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {exam.description && (
            <div className="bg-[var(--muted)]/50 border border-[var(--border)] rounded-2xl p-4">
              <p className="text-sm text-[var(--foreground)] font-medium">{exam.description}</p>
            </div>
          )}

          {/* Anti-cheat notice */}
          {exam.isStrict && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Mode Anti-Cheat Aktif</p>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5 leading-relaxed">
                  Ujian ini terdeteksi jika kamu berpindah tab, minimize browser, atau keluar dari halaman. Setiap pelanggaran dicatat dan dilaporkan ke guru. Setelah 3 pelanggaran, ujian akan otomatis dikumpulkan.
                </p>
              </div>
            </div>
          )}

          <button
            disabled={!isOpen}
            onClick={startExam}
            className="w-full h-12 rounded-2xl bg-[#5483B3] hover:bg-[#4272A2] text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isOpen ? 'Mulai Ujian Sekarang' : 'Ujian Belum Dibuka'}
          </button>
          <button
            onClick={() => router.push('/dashboard/student/exams')}
            className="w-full text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            ← Kembali ke daftar ujian
          </button>
        </motion.div>
      </div>
    )
  }

  /* ════════════════════════════
     RUNNING
  ════════════════════════════ */
  if (phase === 'running' && exam) {
    const q = exam.questions[currentQ]
    const isLast = currentQ === total - 1
    const isAnswered = !!answers[q?.id]
    const isFlagged = flagged.has(q?.id)
    const timePercent = (timeLeft / (exam.durationMin * 60)) * 100
    const timerDanger = timeLeft < 60

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">

        {/* Anti-cheat alert */}
        <AnimatePresence>
          {showCheatAlert && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className="fixed top-0 inset-x-0 z-[100] bg-red-600 text-white px-6 py-3 flex items-center justify-center gap-3 shadow-lg"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">
                ⚠️ Pelanggaran #{cheatWarnings} terdeteksi! Kamu keluar dari jendela ujian.
                {cheatWarnings >= 2 && ' 1 pelanggaran lagi = ujian otomatis dikumpulkan.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--border)] px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[#5483B3]/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-[#5483B3]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-[var(--foreground)] truncate">{exam.title}</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">{answered}/{total} terjawab</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm font-black border ${timerDanger ? 'bg-red-50 border-red-200 text-red-600 animate-pulse dark:bg-red-950 dark:border-red-800 dark:text-red-400' : 'bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)]'}`}>
            <Clock className="h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </div>

          {/* Cheat warnings */}
          {exam.isStrict && (
            <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${cheatWarnings > 0 ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              <Shield className="h-3 w-3" />
              {cheatWarnings}/3 pelanggaran
            </div>
          )}

          <button
            onClick={() => {
              if (confirm('Yakin ingin mengumpulkan ujian sekarang? Jawaban yang belum diisi akan dianggap kosong.')) {
                submitExam()
              }
            }}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#5483B3] text-white text-xs font-bold hover:bg-[#4272A2] transition-all"
          >
            <Send className="h-3 w-3" />
            <span className="hidden sm:inline">Kumpulkan</span>
          </button>
        </div>

        {/* Timer progress bar */}
        <div className="h-1 bg-[var(--muted)]">
          <div
            className={`h-full transition-all duration-1000 ${timerDanger ? 'bg-red-500' : 'bg-[#5483B3]'}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Question navigator sidebar */}
          <div className="hidden lg:flex flex-col w-48 border-r border-[var(--border)] bg-[var(--card)] p-3 overflow-y-auto gap-1.5 shrink-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)] px-1 mb-1">Navigasi Soal</p>
            <div className="grid grid-cols-5 gap-1">
              {exam.questions.map((q, i) => {
                const ans = !!answers[q.id]
                const fl = flagged.has(q.id)
                const isCur = i === currentQ
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    title={`Soal ${i + 1}`}
                    className={`h-8 w-8 rounded-lg text-[11px] font-bold transition-all ${
                      isCur ? 'bg-[#5483B3] text-white shadow-md' :
                      fl ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-700' :
                      ans ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-700' :
                      'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 space-y-1.5 text-[10px]">
              {[
                { color: 'bg-[#5483B3]', label: 'Soal aktif' },
                { color: 'bg-emerald-100 dark:bg-emerald-950 border border-emerald-200', label: 'Sudah dijawab' },
                { color: 'bg-amber-100 dark:bg-amber-950 border border-amber-200', label: 'Ditandai' },
                { color: 'bg-[var(--muted)] border border-[var(--border)]', label: 'Belum dijawab' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <div className={`h-4 w-4 rounded ${item.color} shrink-0`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main question area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {q && (
                  <>
                    {/* Question header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">
                            Soal {currentQ + 1} dari {total}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5483B3]/10 text-[#5483B3]">
                            {q.points} poin
                          </span>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-[var(--foreground)] leading-relaxed">
                          {q.questionText}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const nf = new Set(flagged)
                          if (nf.has(q.id)) nf.delete(q.id)
                          else nf.add(q.id)
                          setFlagged(nf)
                        }}
                        title={isFlagged ? 'Hapus tanda' : 'Tandai soal ini'}
                        className={`p-2 rounded-xl border transition-all shrink-0 ${isFlagged ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950 dark:border-amber-700' : 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-amber-300 hover:text-amber-600'}`}
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Options (Multiple Choice) */}
                    {q.type === 'MULTIPLE_CHOICE' && (
                      <div className="space-y-3">
                        {(q.options as string[]).map((opt, oi) => {
                          const isSelected = answers[q.id] === opt
                          const labels = ['A', 'B', 'C', 'D', 'E']
                          return (
                            <button
                              key={oi}
                              onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 group ${
                                isSelected
                                  ? 'bg-[#5483B3] border-[#5483B3] text-white shadow-md shadow-[#5483B3]/20'
                                  : 'bg-[var(--card)] border-[var(--border)] hover:border-[#5483B3]/40 hover:bg-[#5483B3]/4'
                              }`}
                            >
                              <span className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[#5483B3]/10 group-hover:text-[#5483B3]'
                              }`}>
                                {labels[oi] || oi + 1}
                              </span>
                              <span className="text-sm font-medium leading-relaxed">{opt}</span>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white ml-auto shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Essay type */}
                    {q.type === 'ESSAY' && (
                      <textarea
                        className="w-full min-h-[180px] p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[#5483B3] focus:ring-2 focus:ring-[#5483B3]/20 resize-none transition-all"
                        placeholder="Tulis jawaban kamu di sini..."
                        value={answers[q.id] || ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      />
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <button
                        disabled={currentQ === 0}
                        onClick={() => setCurrentQ(c => c - 1)}
                        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                      </button>

                      <div className="text-xs text-[var(--muted-foreground)] font-medium hidden sm:block">
                        {answered} dari {total} soal terjawab
                      </div>

                      {isLast ? (
                        <button
                          onClick={() => {
                            const unanswered = total - answered
                            const msg = unanswered > 0
                              ? `Ada ${unanswered} soal yang belum dijawab. Yakin ingin mengumpulkan?`
                              : 'Semua soal sudah dijawab. Kumpulkan sekarang?'
                            if (confirm(msg)) submitExam()
                          }}
                          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#5483B3] text-white text-sm font-bold hover:bg-[#4272A2] transition-all"
                        >
                          <Send className="h-4 w-4" />
                          Kumpulkan
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentQ(c => c + 1)}
                          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-bold hover:opacity-80 transition-all"
                        >
                          Selanjutnya
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile question nav (bottom) */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[var(--card)] border-t border-[var(--border)] p-3 z-40">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {exam.questions.map((q, i) => {
                const ans = !!answers[q.id]
                const fl = flagged.has(q.id)
                const isCur = i === currentQ
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    className={`h-8 w-8 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                      isCur ? 'bg-[#5483B3] text-white' :
                      fl ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                      ans ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                      'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════
     SUBMITTING
  ════════════════════════════ */
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#5483B3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-base font-bold text-[var(--foreground)]">Mengumpulkan jawaban...</p>
          <p className="text-sm text-[var(--muted-foreground)]">Jangan tutup halaman ini</p>
        </div>
      </div>
    )
  }

  /* ════════════════════════════
     RESULT
  ════════════════════════════ */
  if (phase === 'result' && resultData && exam) {
    const score = resultData.score ?? 0
    const warnings = resultData.cheatWarnings ?? 0
    const isPassed = score >= 70
    const totalPts = exam.questions.reduce((a: number, q: Question) => a + q.points, 0)
    const answeredCount = exam.questions.filter((q: Question) => answers[q.id]).length || 'N/A'

    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full space-y-6"
        >
          {/* Score display */}
          <div className="text-center space-y-4">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto border-4 shadow-xl ${isPassed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-700' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-700'}`}>
              {isPassed
                ? <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                : <XCircle className="h-12 w-12 text-red-500" />}
            </div>
            <div>
              <p className={`text-6xl font-black ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {score}
              </p>
              <p className="text-[var(--muted-foreground)] text-sm font-medium">dari 100 poin</p>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
                {isPassed ? 'Selamat! Ujian selesai 🎉' : 'Ujian Selesai'}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{exam.title} — {exam.subject?.name}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-[var(--foreground)]">{total}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-semibold">Total Soal</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-[#5483B3]">{totalPts}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-semibold">Total Poin</p>
            </div>
            <div className={`rounded-2xl p-4 text-center border ${warnings > 0 ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800'}`}>
              <p className={`text-2xl font-black ${warnings > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{warnings}</p>
              <p className={`text-[11px] font-semibold ${warnings > 0 ? 'text-red-700 dark:text-red-500' : 'text-emerald-700 dark:text-emerald-500'}`}>Pelanggaran Anti-Cheat</p>
            </div>
            <div className={`rounded-2xl p-4 text-center border ${isPassed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}`}>
              <p className={`text-2xl font-black ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPassed ? 'LULUS' : 'TIDAK LULUS'}
              </p>
              <p className={`text-[11px] font-semibold ${isPassed ? 'text-emerald-700 dark:text-emerald-500' : 'text-red-700 dark:text-red-500'}`}>KKM 70</p>
            </div>
          </div>

          {warnings > 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                Tercatat {warnings} pelanggaran keluar dari jendela ujian. Data ini sudah dilaporkan ke guru untuk ditinjau.
              </p>
            </div>
          )}

          <button
            onClick={() => router.push('/dashboard/student/exams')}
            className="w-full h-12 rounded-2xl bg-[#5483B3] hover:bg-[#4272A2] text-white font-bold text-sm transition-all"
          >
            Kembali ke Daftar Ujian
          </button>
        </motion.div>
      </div>
    )
  }

  return null
}
