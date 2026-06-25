'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3,
  LayoutDashboard,
  ChevronDown,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  Sparkles,
  Users,
  ClipboardList,
  Video,
  Bell,
  Award,
  Globe,
  AlertTriangle,
  Github,
  Twitter,
  Instagram,
  ExternalLink,
  Star,
  Code2,
  Mail,
  Cpu,
  Zap,
  Target,
  Building2,
  BookMarked,
  GraduationCap as Cap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

/* ─── Fade-up animation wrapper ─── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const PROBLEMS = [
  { icon: AlertTriangle, color: 'text-red-400 bg-red-50', title: 'Data Siswa Masih Manual', desc: 'Ratusan sekolah masih mencatat nilai dan absensi di buku fisik, rentan hilang, rusak, atau tidak akurat.' },
  { icon: MessageSquare, color: 'text-orange-400 bg-orange-50', title: 'Komunikasi Tidak Efisien', desc: 'Informasi dari guru ke orang tua/siswa sering terlambat atau tidak sampai, menyebabkan kesalahpahaman.' },
  { icon: BarChart3, color: 'text-yellow-500 bg-yellow-50', title: 'Tanpa Analitik Kemajuan', desc: 'Guru kesulitan mengidentifikasi siswa yang tertinggal tanpa data progres belajar yang terstruktur dan real-time.' },
  { icon: ClipboardList, color: 'text-purple-400 bg-purple-50', title: 'Administrasi Membuang Waktu', desc: 'Kepala sekolah dan staf TU menghabiskan jam kerja hanya untuk rekap data yang bisa diotomasi sistem.' },
]

const FEATURES = [
  { icon: LayoutDashboard, title: 'Dashboard Multi-Peran', desc: 'Panel kontrol terpisah untuk Siswa, Guru, Orang Tua, dan Admin — masing-masing melihat data yang relevan.', color: 'bg-blue-50 text-blue-600' },
  { icon: TrendingUp, title: 'Progress Tracker Real-time', desc: 'Pantau persentase penguasaan kompetensi dasar, jam belajar mandiri, dan tren nilai per semester.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Calendar, title: 'Kalender Akademik Terpadu', desc: 'Jadwal kelas, ujian, ekskul, dan event sekolah dalam satu kalender terintegrasi dengan notifikasi otomatis.', color: 'bg-violet-50 text-violet-600' },
  { icon: FileText, title: 'Tugas & Penilaian Digital', desc: 'Pengumpulan tugas online, sistem grading otomatis, dan arsip nilai terstruktur yang bisa diunduh.', color: 'bg-rose-50 text-rose-600' },
  { icon: ShieldCheck, title: 'Absensi Terotorisasi', desc: 'Sistem presensi digital dengan nomor absen per kelas, rekap kehadiran otomatis, dan laporan per periode.', color: 'bg-amber-50 text-amber-600' },
  { icon: BookOpen, title: 'Catatan Block Editor', desc: 'Editor catatan bergaya Notion — tulis, format, dan susun materi pelajaran secara interaktif dan terstruktur.', color: 'bg-cyan-50 text-cyan-600' },
  { icon: MessageSquare, title: 'Forum Diskusi Kelas', desc: 'Tanya jawab asinkronus antara guru dan siswa dalam satu thread diskusi per mata pelajaran.', color: 'bg-fuchsia-50 text-fuchsia-600' },
  { icon: Video, title: 'Penjadwalan Video Conference', desc: 'Integrasi Google Meet / Zoom — buat sesi belajar online langsung dari jadwal kelas digital.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Sparkles, title: 'Asisten Belajar AI', desc: 'Rangkumankan materi, bantu buat soal latihan, dan berikan saran belajar personal berbasis kecerdasan buatan.', color: 'bg-orange-50 text-orange-600' },
  { icon: Bell, title: 'Notifikasi Email Otomatis', desc: 'Kirim notifikasi nilai, pengumuman, dan reminder tugas langsung ke inbox siswa dan orang tua.', color: 'bg-teal-50 text-teal-600' },
  { icon: Award, title: 'PPDB Online', desc: 'Portal pendaftaran peserta didik baru terintegrasi langsung dengan sistem administrasi sekolah.', color: 'bg-lime-50 text-lime-600' },
  { icon: Globe, title: 'Rapor Digital', desc: 'Hasilkan dan distribusikan rapor semester dalam format digital yang bisa diakses kapan saja oleh orang tua.', color: 'bg-sky-50 text-sky-600' },
]

const HOW = [
  { step: '01', icon: Building2, title: 'Admin Daftarkan Sekolah', desc: 'Kepala sekolah atau operator mendaftarkan institusi, membuat akun guru, dan menyusun data kelas & kurikulum.' },
  { step: '02', icon: Users, title: 'Guru Siapkan Kelas Digital', desc: 'Guru memetakan topik, membuat tugas, mengatur jadwal, dan mengonfigurasi sistem penilaian per kompetensi.' },
  { step: '03', icon: Cap, title: 'Siswa Belajar & Berkembang', desc: 'Siswa memantau progres harian, mengumpulkan tugas, mencatat materi, dan berdiskusi dengan guru dalam platform.' },
]

const STATS = [
  { value: '12+', label: 'Fitur Akademik' },
  { value: '4', label: 'Jenis Pengguna' },
  { value: '100%', label: 'Gratis Dasar' },
  { value: 'Real-time', label: 'Pembaruan Data' },
]

const FAQS = [
  {
    q: 'Apakah EduTrack gratis untuk sekolah?',
    a: 'Ya! EduTrack menyediakan akses penuh untuk sekolah tanpa biaya registrasi dasar. Semua fitur inti — dashboard, absensi, penilaian, dan forum diskusi — tersedia tanpa biaya. Fitur premium seperti AI Assistant dan integrasi lanjutan dapat diaktifkan sesuai kebutuhan.'
  },
  {
    q: 'Bagaimana sistem keamanan data siswa dijaga?',
    a: 'Data siswa dilindungi dengan enkripsi end-to-end, autentikasi berlapis (Google OAuth + password), dan pembatasan akses berbasis peran. Guru hanya dapat melihat data siswa di kelas yang mereka ajar. Admin sekolah memiliki kontrol penuh atas akses pengguna.'
  },
  {
    q: 'Apakah EduTrack bisa digunakan di ponsel?',
    a: 'Tentu saja! EduTrack dibangun dengan desain responsif penuh yang bekerja sempurna di perangkat mobile, tablet, maupun desktop. Siswa dan orang tua dapat memantau perkembangan belajar kapan saja dan di mana saja.'
  },
  {
    q: 'Bagaimana cara guru membatasi tampilan data hanya ke kelasnya?',
    a: 'Sistem secara otomatis memfilter data berdasarkan jadwal mengajar guru. Guru hanya melihat siswa dari kelas mata pelajaran yang mereka ampu — tidak perlu pengaturan manual. Admin sekolah mengatur pemetaan ini satu kali saat setup awal.'
  },
  {
    q: 'Apakah orang tua bisa memantau perkembangan anak?',
    a: 'Ya! Portal orang tua memungkinkan pemantauan real-time: nilai tugas, persentase kehadiran, pengumuman kelas, dan jadwal ujian. Notifikasi email otomatis juga dikirimkan saat ada nilai baru atau pengumuman penting.'
  },
  {
    q: 'Bagaimana cara memulai menggunakan EduTrack untuk sekolah saya?',
    a: 'Cukup daftarkan akun sekolah melalui form PPDB atau hubungi developer secara langsung. Proses onboarding biasanya membutuhkan waktu kurang dari 1 hari kerja. Tim kami siap membantu konfigurasi awal sesuai kurikulum dan struktur kelas sekolah Anda.'
  },
]

export default function LandingPage() {
  const { data: session } = useSession()
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1E293B] selection:bg-[#5483B3]/30 font-sans antialiased overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAFAF8]/90 backdrop-blur-xl border-b border-slate-200/60 h-[68px]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="EduTrack Beranda">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52" className="h-7 w-auto" fill="none">
              <text x="0" y="42" fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-2" fill="#0F172A">
                Edu<tspan fontWeight="800" fill="#5483B3">Track</tspan>
              </text>
            </svg>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-500">
            <a href="#masalah" className="hover:text-slate-900 transition-colors duration-200">Masalah</a>
            <a href="#fitur" className="hover:text-slate-900 transition-colors duration-200">Fitur</a>
            <a href="#cara-kerja" className="hover:text-slate-900 transition-colors duration-200">Cara Kerja</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors duration-200">FAQ</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/register-ppdb" className="hidden sm:block">
              <button className="h-9 px-5 text-xs font-bold rounded-full bg-[#5483B3] text-white hover:bg-[#4070A0] transition-all duration-300 shadow-md shadow-[#5483B3]/20 hover:shadow-[#5483B3]/30 hover:-translate-y-px active:scale-[0.98]">
                Daftar PPDB
              </button>
            </Link>
            {session ? (
              <Link href="/dashboard">
                <button className="h-9 px-5 text-xs font-bold rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-all duration-300 hover:-translate-y-px active:scale-[0.98]">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="h-9 px-5 text-xs font-bold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-px active:scale-[0.98]">
                  Masuk
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-0 overflow-hidden">
          {/* Background gradient blobs */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#5483B3]/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#93C5FD]/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center space-y-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#5483B3]/10 border border-[#5483B3]/20 text-[#5483B3] text-[11px] font-bold tracking-widest uppercase">
                <Zap className="h-3 w-3" />
                Platform Manajemen Sekolah Digital
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-[68px] lg:text-[76px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08] font-serif"
            >
              Kelola Akademik Sekolah<br />
              <span className="text-[#5483B3]">Lebih Cerdas & Efisien</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              EduTrack adalah platform edukasi digital terpadu yang menggantikan sistem manual dengan teknologi modern — dari absensi, penilaian, jadwal, hingga monitoring progres belajar siswa secara real-time.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link href="/register-ppdb">
                <button className="group h-13 px-8 py-3.5 bg-[#5483B3] hover:bg-[#4070A0] text-white font-bold text-sm rounded-full shadow-lg shadow-[#5483B3]/25 hover:shadow-[#5483B3]/35 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2">
                  Mulai Daftar PPDB
                  <span className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-300">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </Link>
              <Link href="/login">
                <button className="h-13 px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-sm">
                  Login ke Dashboard
                </button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-8 pt-6 flex-wrap"
            >
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight">{s.value}</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero illustration / dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-8 mt-16 mb-0"
          >
            {/* Mock Dashboard Preview */}
            <div className="p-1.5 bg-white/60 ring-1 ring-slate-200/80 rounded-[2rem] backdrop-blur-sm shadow-2xl shadow-slate-900/10">
              <div className="bg-white rounded-[calc(2rem-6px)] overflow-hidden border border-slate-100">
                {/* Window chrome */}
                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  <div className="flex-1 mx-4">
                    <div className="h-5 max-w-[200px] mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-medium">edutrack.davinn.net/dashboard</span>
                    </div>
                  </div>
                </div>
                {/* Dashboard preview content */}
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[280px]">
                  {/* Sidebar */}
                  <div className="hidden md:flex flex-col bg-[#0F172A] p-5 gap-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#5483B3] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">EduTrack</span>
                    </div>
                    {['Dashboard', 'Kelas Saya', 'Nilai', 'Absensi', 'Kalender'].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${i === 0 ? 'bg-[#5483B3]/20 text-[#93C5FD]' : 'text-slate-500 hover:text-slate-300'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div className="md:col-span-3 p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Selamat Datang 👋</p>
                        <p className="text-sm font-bold text-slate-900">Dashboard Guru — Semester Ganjil 2025/2026</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-700">Online</span>
                      </div>
                    </div>
                    {/* Progress cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Siswa Aktif', value: '124', color: 'bg-blue-50 text-blue-600' },
                        { label: 'Tugas Menunggu', value: '8', color: 'bg-amber-50 text-amber-600' },
                        { label: 'Avg Progres', value: '72%', color: 'bg-emerald-50 text-emerald-600' },
                      ].map((c, i) => (
                        <div key={i} className={`${c.color} rounded-xl p-3`}>
                          <p className="text-[18px] font-black">{c.value}</p>
                          <p className="text-[10px] font-semibold opacity-70 mt-0.5">{c.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Student list */}
                    <div className="space-y-2">
                      {[
                        { name: 'Alya Ramadhani', kelas: 'XI RPL 1', progress: 89, no: 1 },
                        { name: 'Budi Santoso', kelas: 'XI RPL 1', progress: 54, no: 2 },
                        { name: 'Cindy Permata', kelas: 'XI RPL 1', progress: 76, no: 3 },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 w-5 text-center">{s.no}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">{s.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{s.kelas}</p>
                          </div>
                          <div className="w-20 text-right">
                            <p className="text-[10px] font-bold text-slate-600 mb-1">{s.progress}%</p>
                            <Progress value={s.progress} className="h-1.5 bg-slate-200" indicatorClassName={s.progress > 75 ? 'bg-emerald-500' : s.progress > 50 ? 'bg-amber-500' : 'bg-red-400'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            MASALAH (Problem Section)
        ══════════════════════════════════════════ */}
        <section id="masalah" className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 block mb-4">Masalah Nyata</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Sistem Lama Menghambat<br />Kemajuan Pendidikan
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Mayoritas sekolah di Indonesia masih berjuang dengan proses administrasi manual yang memboroskan waktu, energi, dan sumber daya — padahal semuanya bisa diotomasi.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEMS.map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="group relative p-7 rounded-[1.5rem] bg-[#FAFAF8] border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/80 transition-all duration-500 hover:-translate-y-1 h-full">
                    <div className={`h-11 w-11 rounded-2xl ${p.color} flex items-center justify-center mb-5`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] mb-3">{p.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Transition arrow */}
            <FadeUp delay={0.3} className="flex flex-col items-center mt-16 gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="flex items-center gap-3 text-sm font-bold text-[#5483B3]">
                <Sparkles className="h-4 w-4" />
                EduTrack hadir sebagai solusinya
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </FadeUp>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SOLUSI + FITUR
        ══════════════════════════════════════════ */}
        <section id="fitur" className="py-28 md:py-36 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5483B3] block mb-4">Solusi Terpadu</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Semua yang Dibutuhkan<br />Sekolah Modern
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                12+ fitur akademik terintegrasi dalam satu platform — dirancang khusus untuk ekosistem pendidikan Indonesia.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <FadeUp key={i} delay={i * 0.04}>
                  <div className="group p-6 rounded-[1.5rem] bg-white border border-slate-100 hover:border-[#5483B3]/20 hover:shadow-xl hover:shadow-[#5483B3]/8 transition-all duration-500 hover:-translate-y-1 h-full">
                    <div className={`h-10 w-10 rounded-xl ${f.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] mb-2 leading-snug">{f.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INTERACTIVE MOCKUP
        ══════════════════════════════════════════ */}
        <section className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeUp>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5483B3] block mb-5">Pantau Secara Menyeluruh</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight mb-6">
                  Visibilitas Penuh<br />Kemajuan Belajar Siswa
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Guru dapat mengidentifikasi siswa yang membutuhkan perhatian lebih, memantau tren nilai per kompetensi, dan memberikan feedback langsung — semua dari satu dashboard yang bersih.
                </p>
                <div className="space-y-5">
                  {[
                    { icon: Target, title: 'Pantau Per Kompetensi Dasar', desc: 'Lihat penguasaan setiap KD secara individual dan per kelas.' },
                    { icon: Bell, title: 'Alert Siswa Berisiko', desc: 'Notifikasi otomatis saat siswa mendekati batas nilai minimum.' },
                    { icon: BarChart3, title: 'Laporan Analitik Semester', desc: 'Grafik interaktif performa kelas untuk evaluasi periodik.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAFAF8] border border-slate-100 hover:border-[#5483B3]/20 transition-colors duration-300">
                      <div className="h-9 w-9 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* Visual card */}
              <FadeUp delay={0.15}>
                <div className="p-2 bg-slate-50 ring-1 ring-slate-200/80 rounded-[2rem] shadow-2xl shadow-slate-900/8">
                  <div className="bg-white rounded-[calc(2rem-8px)] overflow-hidden border border-slate-100 p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Laporan Kelas</p>
                        <p className="text-sm font-bold text-slate-900">XI RPL 1 — Pemrograman Web</p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold rounded-full px-2.5">Aktif</Badge>
                    </div>

                    {/* Chart bars visual */}
                    <div className="space-y-3">
                      {[
                        { name: 'HTML & CSS', val: 91, color: 'bg-emerald-500' },
                        { name: 'JavaScript', val: 73, color: 'bg-[#5483B3]' },
                        { name: 'Framework', val: 58, color: 'bg-amber-500' },
                        { name: 'Database', val: 44, color: 'bg-rose-400' },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1.5">
                            <span>{item.name}</span>
                            <span>{item.val}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.val}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full ${item.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Student list */}
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Siswa Butuh Perhatian</p>
                      {[
                        { name: 'Dian Saputra', score: 38, trend: '↓' },
                        { name: 'Rizky Maulana', score: 42, trend: '→' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-rose-50/60 border border-rose-100/80 rounded-xl mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-[10px] font-bold">
                              {s.name.charAt(0)}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{s.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-rose-500">{s.score}%</span>
                            <span className="text-[10px] text-rose-400">{s.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CARA KERJA
        ══════════════════════════════════════════ */}
        <section id="cara-kerja" className="py-28 md:py-36 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5483B3] block mb-4">Cara Kerja</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                3 Langkah Menuju<br />Sekolah Digital
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Onboarding mudah, cepat, dan tidak membutuhkan keahlian teknis khusus.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-12 left-[33%] right-[33%] h-px bg-gradient-to-r from-[#5483B3]/20 via-[#5483B3]/50 to-[#5483B3]/20" />

              {HOW.map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="relative text-center space-y-5 p-8">
                    <div className="relative inline-flex">
                      <div className="h-20 w-20 rounded-[1.5rem] bg-white border border-slate-100 shadow-lg shadow-slate-900/5 flex items-center justify-center mx-auto">
                        <item.icon className="h-8 w-8 text-[#5483B3]" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#5483B3] text-white text-xs font-black flex items-center justify-center shadow-md shadow-[#5483B3]/30">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] mb-3">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-[#0F172A]">
          <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
            <FadeUp>
              <div className="space-y-7">
                <span className="inline-block rounded-full px-4 py-1.5 bg-[#5483B3]/20 border border-[#5483B3]/30 text-[#93C5FD] text-[11px] font-bold tracking-widest uppercase">
                  Mulai Sekarang — Gratis
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white font-serif leading-tight">
                  Transformasi Digital<br />Sekolah Anda Dimulai di Sini
                </h2>
                <p className="text-sm md:text-base text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                  Bergabunglah dengan sekolah-sekolah yang sudah merasakan efisiensi nyata dalam pengelolaan akademik dengan EduTrack.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <Link href="/register-ppdb">
                    <button className="group h-13 px-8 py-3.5 bg-[#5483B3] hover:bg-[#4070A0] text-white font-bold text-sm rounded-full shadow-lg shadow-[#5483B3]/30 hover:shadow-[#5483B3]/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2">
                      Daftar PPDB Sekarang
                      <span className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="h-13 px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-full hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]">
                      Sudah punya akun? Masuk
                    </button>
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section id="faq" className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5483B3] block mb-4">FAQ</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Pertanyaan yang Sering<br />Ditanyakan
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Masih ada pertanyaan? Hubungi developer langsung melalui kontak di bawah.
              </p>
            </FadeUp>

            <div className="space-y-3">
              {FAQS.map((item, idx) => (
                <FadeUp key={idx} delay={idx * 0.04}>
                  <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${activeAccordion === idx ? 'border-[#5483B3]/30 bg-[#5483B3]/5' : 'border-slate-100 bg-[#FAFAF8] hover:border-slate-200'}`}>
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between p-5 text-left"
                      aria-expanded={activeAccordion === idx}
                    >
                      <span className={`text-sm font-bold leading-snug ${activeAccordion === idx ? 'text-[#5483B3]' : 'text-[#0F172A]'}`}>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 ml-4 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-[#5483B3]' : 'text-slate-400'}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            DEVELOPER / ABOUT
        ══════════════════════════════════════════ */}
        <section className="py-28 md:py-36 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeUp>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5483B3] block mb-5">Developer</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight mb-5">
                  Dibangun oleh<br />
                  <span className="text-[#5483B3]">Davin Maritza</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  EduTrack dikembangkan sebagai solusi nyata untuk permasalahan administrasi pendidikan di Indonesia. Proyek ini dibangun dengan semangat open-source dan komitmen untuk membuat teknologi pendidikan yang benar-benar berguna bagi sekolah.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: Code2, label: 'Tech Stack', value: 'Next.js 15, Prisma, PostgreSQL, Tailwind CSS' },
                    { icon: Globe, label: 'Website', value: 'davinn.net' },
                    { icon: Mail, label: 'Kontak', value: 'melalui social media di bawah' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a href="https://github.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-700 transition-all duration-300 hover:-translate-y-px active:scale-[0.98]">
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </a>
                  <a href="https://x.com/workwithsuzirz" target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-px transition-all duration-300 active:scale-[0.98]">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://instagram.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-px transition-all duration-300 active:scale-[0.98]">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-px transition-all duration-300 active:scale-[0.98]">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </FadeUp>

              {/* Profile card */}
              <FadeUp delay={0.15}>
                <div className="p-2 bg-white ring-1 ring-slate-200/80 rounded-[2rem] shadow-2xl shadow-slate-900/8 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                  <div className="rounded-[calc(2rem-8px)] overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] p-8 text-white text-center space-y-6">
                    {/* Avatar */}
                    <div className="relative inline-flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-[#5483B3]/30 border-2 border-[#5483B3]/50 flex items-center justify-center text-3xl font-black text-white mx-auto">
                        DM
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-2 border-[#0F172A] flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xl font-extrabold">Davin Maritza</p>
                      <p className="text-slate-400 text-xs font-semibold mt-1">Full-Stack Developer & EdTech Builder</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Proyek Aktif', value: '1' },
                        { label: 'Stack Utama', value: 'Next.js' },
                        { label: 'Fokus', value: 'EdTech' },
                        { label: 'Status', value: 'Open' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/8 rounded-xl p-3">
                          <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                          <p className="text-sm font-bold mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      Membangun solusi nyata untuk pendidikan Indonesia
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="md:col-span-2 space-y-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52" className="h-7 w-auto" fill="none">
                <text x="0" y="42" fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-2" fill="#F1F5F9">
                  Edu<tspan fontWeight="800" fill="#5483B3">Track</tspan>
                </text>
              </svg>
              <p className="text-xs leading-relaxed font-medium max-w-xs">
                Platform manajemen akademik digital terpadu — menggantikan administrasi manual dengan sistem yang cerdas, efisien, dan transparan untuk ekosistem pendidikan Indonesia.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://github.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
                  <Github className="h-4 w-4" />
                </a>
                <a href="https://x.com/workwithsuzirz" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-5">
              <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Platform</h5>
              <nav className="flex flex-col gap-3 text-xs font-semibold">
                <a href="#fitur" className="hover:text-white transition-colors duration-200">Fitur Utama</a>
                <a href="#cara-kerja" className="hover:text-white transition-colors duration-200">Cara Kerja</a>
                <Link href="/register-ppdb" className="hover:text-white transition-colors duration-200">Daftar PPDB</Link>
                <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>
              </nav>
            </div>

            {/* Support */}
            <div className="space-y-5">
              <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Support</h5>
              <nav className="flex flex-col gap-3 text-xs font-semibold">
                <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
                <Link href="/login" className="hover:text-white transition-colors duration-200">Login</Link>
                <a href="https://github.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                  GitHub <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                  davinn.net <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-semibold text-slate-500">
              © {new Date().getFullYear()} EduTrack. Hak Cipta Dilindungi.
            </p>
            <p className="text-[11px] font-semibold text-slate-500">
              Dibuat dengan ❤️ oleh{' '}
              <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                Davin Maritza
              </a>
              {' '}untuk pendidikan Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
