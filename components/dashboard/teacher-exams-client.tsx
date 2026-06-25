'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, BookOpen, Clock, Calendar, BarChart3, Users, Shield,
  ChevronRight, Trash2, CheckCircle2, XCircle, Eye, Send,
  AlertTriangle, PenLine, TrendingUp, Award, ArrowLeft
} from 'lucide-react'

type View = 'list' | 'stats' | 'questions'

export function TeacherExamsClient({ subjects, classes }: any) {
  const [view, setView] = useState<View>('list')
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isAddQOpen, setIsAddQOpen] = useState(false)
  const [activeExam, setActiveExam] = useState<any>(null)
  const [statsData, setStatsData] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '', description: '', subjectId: '',
    classId: 'all', startTime: '', endTime: '',
    durationMin: 60, isStrict: true, status: 'DRAFT'
  })

  const [qForm, setQForm] = useState({
    questionText: '', type: 'MULTIPLE_CHOICE',
    options: ['', '', '', ''],
    correctAnswer: '', points: 10, order: 0
  })

  useEffect(() => { fetchExams() }, [])

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/teacher/exams')
      if (res.ok) setExams(await res.json())
    } finally { setIsLoading(false) }
  }

  const fetchStats = async (examId: string) => {
    setStatsLoading(true)
    try {
      const res = await fetch(`/api/teacher/exams/${examId}/stats`)
      if (res.ok) setStatsData(await res.json())
    } finally { setStatsLoading(false) }
  }

  /* ── Create exam ── */
  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/teacher/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      toast.success('Ujian berhasil dibuat')
      setIsAddOpen(false)
      fetchExams()
    } else toast.error('Gagal membuat ujian')
  }

  /* ── Publish/Unpublish ── */
  const toggleStatus = async (exam: any) => {
    const newStatus = exam.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const res = await fetch(`/api/teacher/exams/${exam.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    if (res.ok) {
      toast.success(newStatus === 'PUBLISHED' ? 'Ujian dipublikasikan' : 'Ujian disimpan sebagai draft')
      fetchExams()
    }
  }

  /* ── Delete exam ── */
  const deleteExam = async (examId: string) => {
    if (!confirm('Hapus ujian ini beserta semua soal dan jawaban siswa?')) return
    const res = await fetch(`/api/teacher/exams/${examId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Ujian dihapus'); fetchExams() }
    else toast.error('Gagal menghapus ujian')
  }

  /* ── Add question ── */
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeExam) return
    const payload = {
      ...qForm,
      options: qForm.type === 'MULTIPLE_CHOICE' ? qForm.options.filter(o => o.trim()) : [],
    }
    const res = await fetch(`/api/teacher/exams/${activeExam.id}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      toast.success('Soal berhasil ditambahkan')
      setIsAddQOpen(false)
      setQForm({ questionText: '', type: 'MULTIPLE_CHOICE', options: ['', '', '', ''], correctAnswer: '', points: 10, order: 0 })
      // Refresh exam detail
      const refresh = await fetch(`/api/teacher/exams/${activeExam.id}`)
      if (refresh.ok) setActiveExam(await refresh.json())
    } else toast.error('Gagal menambah soal')
  }

  /* ─────────────────── VIEWS ─────────────────── */

  /* ── STATISTICS VIEW ── */
  if (view === 'stats') {
    if (statsLoading) return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#5483B3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--muted-foreground)]">Memuat statistik...</p>
        </div>
      </div>
    )

    if (!statsData) return null

    const { exam, questions, attempts, summary } = statsData

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setStatsData(null) }}
            className="flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <div className="h-4 w-px bg-[var(--border)]" />
          <div>
            <h1 className="text-xl font-extrabold text-[var(--foreground)]">{exam.title}</h1>
            <p className="text-xs text-[var(--muted-foreground)]">{exam.subject?.name} · Statistik Hasil Ujian</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Peserta Selesai', value: summary.completedAttempts, icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
            { label: 'Rata-rata Nilai', value: summary.avgScore, icon: TrendingUp, color: 'text-[#5483B3] bg-[#5483B3]/10' },
            { label: 'Nilai Tertinggi', value: summary.highestScore, icon: Award, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
            { label: 'Tingkat Lulus', value: `${summary.passRate}%`, icon: CheckCircle2, color: `${summary.passRate >= 70 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' : 'text-red-600 bg-red-50 dark:bg-red-950'}` },
          ].map((s, i) => (
            <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[var(--foreground)]">{s.value}</p>
                  <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cheat warnings summary */}
        {exam.isStrict && (
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 rounded-2xl">
            <CardContent className="p-5 flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Laporan Anti-Cheat</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {attempts.filter((a: any) => a.cheatWarnings > 0).length === 0 ? (
                    <p className="text-xs text-amber-700 dark:text-amber-500">Tidak ada pelanggaran terdeteksi.</p>
                  ) : attempts.filter((a: any) => a.cheatWarnings > 0).map((a: any) => (
                    <div key={a.id} className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800">
                      <AlertTriangle className="h-3 w-3" />
                      {a.studentName}: {a.cheatWarnings}× pelanggaran
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-question analytics */}
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
          <CardHeader className="border-b border-[var(--border)] pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#5483B3]" />
              Analitik Per Soal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-[var(--border)]">
            {questions.map((q: any, i: number) => (
              <div key={q.id} className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">Soal {i + 1}</span>
                    <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">{q.questionText}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xl font-black ${q.correctRate >= 70 ? 'text-emerald-600' : q.correctRate >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {q.correctRate}%
                    </p>
                    <p className="text-[9px] text-[var(--muted-foreground)] font-medium">jawab benar</p>
                  </div>
                </div>
                <Progress
                  value={q.correctRate}
                  className="h-2 bg-[var(--muted)]"
                  indicatorClassName={q.correctRate >= 70 ? 'bg-emerald-500' : q.correctRate >= 40 ? 'bg-amber-500' : 'bg-red-500'}
                />
                <div className="flex items-center gap-3 text-[10px] text-[var(--muted-foreground)] font-medium">
                  <span>{q.correctCount}/{q.totalAttempted} benar</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-bold">Jawaban: {q.correctAnswer}</span>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)] p-6 text-center">Belum ada soal.</p>
            )}
          </CardContent>
        </Card>

        {/* Student results table */}
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl">
          <CardHeader className="border-b border-[var(--border)] pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-[#5483B3]" />
              Nilai per Siswa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">Siswa</th>
                    <th className="text-center px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">Nilai</th>
                    <th className="text-center px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                    <th className="text-center px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">Anti-Cheat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {attempts.sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0)).map((att: any) => (
                    <tr key={att.id} className="hover:bg-[var(--muted)]/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] text-xs font-black shrink-0">
                            {att.studentName?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--foreground)]">{att.studentName}</p>
                            <p className="text-[10px] text-[var(--muted-foreground)]">{att.studentNis || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-lg font-black ${(att.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {att.score ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`text-[10px] font-bold rounded-full ${(att.score ?? 0) >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400'}`}>
                          {(att.score ?? 0) >= 70 ? 'LULUS' : 'TIDAK LULUS'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {att.cheatWarnings > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3" />
                            {att.cheatWarnings}×
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Bersih
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {attempts.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)] text-center py-8">Belum ada siswa yang mengumpulkan ujian ini.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ── QUESTIONS VIEW ── */
  if (view === 'questions' && activeExam) {
    const questions = activeExam.questions || []
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('list'); setActiveExam(null) }}
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              <ArrowLeft className="h-4 w-4" /> Kembali
            </button>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div>
              <h1 className="text-xl font-extrabold text-[var(--foreground)]">{activeExam.title}</h1>
              <p className="text-xs text-[var(--muted-foreground)]">{questions.length} soal terdaftar</p>
            </div>
          </div>
          <Button onClick={() => setIsAddQOpen(true)} className="bg-[#5483B3] hover:bg-[#4272A2] text-white rounded-xl">
            <Plus className="h-4 w-4 mr-1.5" /> Tambah Soal
          </Button>
        </div>

        <div className="space-y-3">
          {questions.map((q: any, i: number) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="h-7 w-7 rounded-lg bg-[#5483B3]/10 text-[#5483B3] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-[var(--foreground)] leading-relaxed">{q.questionText}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="text-[10px] bg-[#5483B3]/10 text-[#5483B3] border-none font-bold">
                    {q.points} poin
                  </Badge>
                </div>
              </div>

              {q.type === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-2 gap-2 ml-10">
                  {(q.options as string[]).map((opt: string, oi: number) => (
                    <div
                      key={oi}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
                        opt === q.correctAnswer
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400'
                          : 'bg-[var(--muted)]/50 border-[var(--border)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      {opt === q.correctAnswer && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                      <span className="font-bold uppercase text-[10px] mr-0.5">{['A','B','C','D','E'][oi]}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {questions.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-2xl">
              <BookOpen className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3 opacity-40" />
              <p className="text-sm font-bold text-[var(--muted-foreground)]">Belum ada soal</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Klik "Tambah Soal" untuk mulai membuat soal ujian</p>
            </div>
          )}
        </div>

        {/* Add question dialog */}
        <Dialog open={isAddQOpen} onOpenChange={setIsAddQOpen}>
          <DialogContent className="sm:max-w-[600px] bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
              <DialogTitle className="text-lg font-extrabold text-[var(--foreground)]">Tambah Soal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddQuestion} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Tipe Soal</Label>
                <select
                  value={qForm.type}
                  onChange={e => setQForm({ ...qForm, type: e.target.value })}
                  className="w-full h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 text-sm"
                >
                  <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                  <option value="ESSAY">Essay / Uraian</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Pertanyaan</Label>
                <textarea
                  required
                  value={qForm.questionText}
                  onChange={e => setQForm({ ...qForm, questionText: e.target.value })}
                  placeholder="Tulis pertanyaan di sini..."
                  className="w-full min-h-[80px] p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-sm resize-none focus:outline-none focus:border-[#5483B3]"
                />
              </div>

              {qForm.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold">Pilihan Jawaban</Label>
                  {qForm.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[var(--muted-foreground)] w-5">{['A','B','C','D'][i]}.</span>
                      <Input
                        value={opt}
                        onChange={e => {
                          const opts = [...qForm.options]
                          opts[i] = e.target.value
                          setQForm({ ...qForm, options: opts })
                        }}
                        placeholder={`Pilihan ${['A','B','C','D'][i]}`}
                        className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-bold">
                  {qForm.type === 'MULTIPLE_CHOICE' ? 'Jawaban Benar (isi sama persis dengan teks pilihan)' : 'Kata Kunci Jawaban'}
                </Label>
                <Input
                  required
                  value={qForm.correctAnswer}
                  onChange={e => setQForm({ ...qForm, correctAnswer: e.target.value })}
                  placeholder={qForm.type === 'MULTIPLE_CHOICE' ? 'Contoh: Jakarta' : 'Kata kunci yang harus ada di jawaban'}
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Poin</Label>
                <Input
                  type="number"
                  min={1}
                  value={qForm.points}
                  onChange={e => setQForm({ ...qForm, points: Number(e.target.value) })}
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10 w-28"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
                <Button type="button" variant="outline" onClick={() => setIsAddQOpen(false)} className="rounded-xl">Batal</Button>
                <Button type="submit" className="bg-[#5483B3] hover:bg-[#4272A2] text-white rounded-xl">Simpan Soal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  /* ── LIST VIEW ── */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Manajemen Ujian (CBT)</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Buat, kelola soal, dan lihat statistik hasil ujian siswa.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-[#5483B3] hover:bg-[#4272A2] text-white rounded-xl shrink-0">
          <Plus className="h-4 w-4 mr-1.5" /> Buat Ujian
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-52 rounded-2xl bg-[var(--muted)] animate-pulse" />)
        ) : exams.length > 0 ? exams.map((exam: any) => {
          const now = new Date()
          const start = new Date(exam.startTime)
          const end = new Date(exam.endTime)
          const isLive = exam.status === 'PUBLISHED' && now >= start && now <= end
          const isPast = now > end

          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-4 hover:shadow-md hover:border-[#5483B3]/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#5483B3]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-[#5483B3]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[var(--foreground)] line-clamp-1">{exam.title}</h3>
                    <p className="text-[10px] text-[var(--muted-foreground)] font-medium">{exam.subject?.name}</p>
                  </div>
                </div>
                <div className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full border ${
                  isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                  exam.status === 'PUBLISHED' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800' :
                  'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]'
                }`}>
                  {isLive ? '🔴 LIVE' : exam.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Soal', value: exam._count?.questions ?? 0 },
                  { label: 'Peserta', value: exam._count?.attempts ?? 0 },
                  { label: 'Menit', value: exam.durationMin },
                ].map((s, i) => (
                  <div key={i} className="bg-[var(--muted)]/50 rounded-xl py-2">
                    <p className="text-base font-black text-[var(--foreground)]">{s.value}</p>
                    <p className="text-[9px] text-[var(--muted-foreground)] font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)] font-medium">
                <Calendar className="h-3 w-3" />
                {new Date(exam.startTime).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                {exam.isStrict && (
                  <>
                    <span className="mx-1">·</span>
                    <Shield className="h-3 w-3 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Anti-Cheat</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/teacher/exams/${exam.id}`)
                    if (res.ok) { setActiveExam(await res.json()); setView('questions') }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  <PenLine className="h-3.5 w-3.5" /> Kelola Soal
                </button>
                <button
                  onClick={async () => { await fetchStats(exam.id); setView('stats') }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  <BarChart3 className="h-3.5 w-3.5" /> Statistik
                </button>
                <button
                  onClick={() => toggleStatus(exam)}
                  title={exam.status === 'PUBLISHED' ? 'Jadikan Draft' : 'Publikasikan'}
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs transition-all border ${
                    exam.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {exam.status === 'PUBLISHED' ? <Eye className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => deleteExam(exam.id)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center border border-[var(--border)] text-[var(--muted-foreground)] hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        }) : (
          <div className="col-span-3 text-center py-20 border border-dashed border-[var(--border)] rounded-2xl">
            <BookOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-30" />
            <p className="text-sm font-bold text-[var(--muted-foreground)]">Belum ada ujian</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Klik "Buat Ujian" untuk memulai</p>
          </div>
        )}
      </div>

      {/* Create exam dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[520px] bg-[var(--card)] border-[var(--border)] rounded-2xl overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <DialogTitle className="text-lg font-extrabold text-[var(--foreground)]">Buat Ujian Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExam} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Judul Ujian</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Misal: Ulangan Harian Bab 3" className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold">Deskripsi (opsional)</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Instruksi tambahan untuk siswa" className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Mata Pelajaran</Label>
                <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 text-sm">
                  <option value="">Pilih...</option>
                  {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Kelas</Label>
                <select value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}
                  className="w-full h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 text-sm">
                  <option value="all">Semua Kelas</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Waktu Mulai</Label>
                <Input type="datetime-local" required value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Waktu Selesai</Label>
                <Input type="datetime-local" required value={formData.endTime}
                  onChange={e => setFormData({...formData, endTime: e.target.value})}
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Durasi (menit)</Label>
                <Input type="number" min={5} value={formData.durationMin}
                  onChange={e => setFormData({...formData, durationMin: Number(e.target.value)})}
                  className="bg-[var(--card)] border-[var(--border)] rounded-xl h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">Status</Label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 text-sm">
                  <option value="DRAFT">Simpan sebagai Draft</option>
                  <option value="PUBLISHED">Langsung Publikasikan</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
              <input type="checkbox" id="isStrict" checked={formData.isStrict}
                onChange={e => setFormData({...formData, isStrict: e.target.checked})}
                className="h-4 w-4 accent-[#5483B3]" />
              <label htmlFor="isStrict" className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 cursor-pointer">
                <Shield className="h-3.5 w-3.5" /> Aktifkan Anti-Cheat (deteksi keluar halaman)
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">Batal</Button>
              <Button type="submit" className="bg-[#5483B3] hover:bg-[#4272A2] text-white rounded-xl">Buat Ujian</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
