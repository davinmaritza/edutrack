'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  CalendarDays,
  MessagesSquare,
  FileCheck2,
  Wand2,
  Users2,
  ClipboardCheck,
  MonitorPlay,
  BellRing,
  Medal,
  Globe2,
  TriangleAlert,
  Github,
  Twitter,
  Instagram,
  ExternalLink,
  Layers,
  MousePointerClick,
  Zap,
  Crosshair,
  Building,
  School,
  BadgeCheck,
  ChevronRight,
  CircleCheck,
  Pencil,
  Database,
  Lock,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

/* ─── Fade-up animation wrapper ─── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Data ─── */
const PROBLEMS = [
  {
    icon: ClipboardCheck,
    color: 'text-red-500 bg-red-50',
    title: 'Administrasi masih dikerjakan manual',
    desc: 'Guru menghabiskan berjam-jam tiap minggu hanya untuk rekap nilai di spreadsheet dan cetak absensi — waktu yang seharusnya bisa dipakai untuk mengajar.',
  },
  {
    icon: MessagesSquare,
    color: 'text-orange-500 bg-orange-50',
    title: 'Informasi ke orang tua sering terlambat',
    desc: 'Pengumuman nilai atau jadwal ujian kadang baru diketahui orang tua seminggu kemudian. Di era sekarang, ini seharusnya tidak terjadi.',
  },
  {
    icon: BarChart3,
    color: 'text-amber-500 bg-amber-50',
    title: 'Tidak ada gambaran kemajuan siswa',
    desc: 'Tanpa data yang tersusun, guru susah tahu siapa yang butuh perhatian lebih sebelum ujian tiba. Semuanya baru ketahuan pas nilai sudah jelek.',
  },
  {
    icon: TriangleAlert,
    color: 'text-purple-500 bg-purple-50',
    title: 'Dokumen sekolah tersebar di mana-mana',
    desc: 'Data siswa ada di satu file, jadwal di file lain, absensi di buku fisik. Saat dibutuhkan mendadak, tidak ada yang tahu harus buka yang mana.',
  },
]

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard per Peran',
    desc: 'Tampilan berbeda untuk siswa, guru, orang tua, dan admin — masing-masing hanya lihat apa yang mereka butuhkan.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Pantau Progres Real-time',
    desc: 'Grafik perkembangan nilai, jam belajar, dan penguasaan materi diperbarui otomatis tanpa perlu input manual.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: CalendarDays,
    title: 'Kalender Akademik Terpusat',
    desc: 'Semua jadwal — kelas, ujian, ekskul, libur — ada di satu tempat. Tidak ada yang kelewatan lagi.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: FileCheck2,
    title: 'Tugas & Penilaian Online',
    desc: 'Siswa kumpul tugas digital, guru nilai langsung di platform. Hasilnya tersimpan rapi dan bisa diunduh kapan saja.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: BadgeCheck,
    title: 'Absensi Digital',
    desc: 'Presensi tercatat per mata pelajaran, direkap otomatis, dan langsung bisa dilihat orang tua di hari yang sama.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Pencil,
    title: 'Catatan Seperti Notion',
    desc: 'Editor blok untuk guru dan siswa — tulis materi, rangkuman, atau agenda kelas dengan format yang fleksibel.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: MessagesSquare,
    title: 'Diskusi Kelas',
    desc: 'Ruang tanya jawab per mata pelajaran. Pertanyaan siswa bisa dibalas guru kapan saja, tidak terpotong waktu kelas.',
    color: 'bg-fuchsia-50 text-fuchsia-600',
  },
  {
    icon: MonitorPlay,
    title: 'Jadwal Video Conference',
    desc: 'Buat link Google Meet atau Zoom langsung dari jadwal kelas. Siswa tidak perlu cari-cari link di grup WhatsApp.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Wand2,
    title: 'Asisten AI Belajar',
    desc: 'Bantu siswa merangkum materi panjang, bikin kisi-kisi latihan soal, atau minta penjelasan ulang dengan bahasa yang lebih mudah.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: BellRing,
    title: 'Notifikasi Email Otomatis',
    desc: 'Nilai baru masuk? Ada tugas yang belum dikumpulkan? Pengumuman sekolah? Semua langsung ke inbox orang tua dan siswa.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: School,
    title: 'Portal PPDB Online',
    desc: 'Pendaftaran siswa baru langsung terintegrasi dengan sistem sekolah. Tidak perlu antre panjang atau isi formulir kertas.',
    color: 'bg-lime-50 text-lime-600',
  },
  {
    icon: Globe2,
    title: 'Rapor Digital',
    desc: 'Rapor semester bisa dibagikan ke orang tua lewat platform — aman, bisa diunduh, tidak bisa dipalsukan.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: ShieldCheck,
    title: 'Ujian Online (CBT)',
    desc: 'Sistem ujian komprehensif dengan fitur anti-cheat (deteksi pindah tab), analitik per soal, dan nilai langsung terhubung ke orang tua.',
    color: 'bg-indigo-50 text-indigo-600',
  },
]

const HOW = [
  {
    step: '01',
    icon: Building,
    title: 'Sekolah daftar dan setup',
    desc: 'Admin atau operator sekolah daftarkan institusi, buat akun guru, dan susun data kelas sesuai struktur yang sudah ada. Biasanya selesai dalam sehari.',
  },
  {
    step: '02',
    icon: Users2,
    title: 'Guru siapkan kelasnya',
    desc: 'Guru masuk, buat jadwal, upload materi, dan atur sistem penilaian sesuai kurikulum. Tidak perlu training khusus — antarmukanya cukup intuitif.',
  },
  {
    step: '03',
    icon: GraduationCap,
    title: 'Siswa langsung bisa pakai',
    desc: 'Siswa login, lihat jadwal hari ini, kumpulkan tugas, dan pantau perkembangan nilai mereka sendiri. Orang tua bisa ikut memantau dari akun terpisah.',
  },
]

const STATS = [
  { value: '13+', label: 'Fitur akademik' },
  { value: '4', label: 'Peran pengguna' },
  { value: 'Gratis', label: 'Untuk mulai' },
  { value: 'Real-time', label: 'Update data' },
]

const FAQS = [
  {
    q: 'Apakah Fokuspad benar-benar gratis?',
    a: 'Ya, semua fitur inti — dashboard, absensi, tugas, penilaian, forum diskusi, dan kalender akademik — bisa dipakai tanpa biaya. Tidak ada kartu kredit yang dibutuhkan untuk mulai.',
  },
  {
    q: 'Seberapa aman data siswa di sini?',
    a: 'Data disimpan di database yang terenkripsi. Login dilindungi dengan bcrypt dan Google OAuth. Setiap guru hanya bisa lihat data siswa di kelas yang mereka ajar — tidak bisa lintas kelas, apalagi lintas sekolah.',
  },
  {
    q: 'Bisa dipakai lewat HP?',
    a: 'Bisa. Fokuspad sudah dioptimalkan untuk layar mobile. Guru bisa nilai tugas, siswa bisa cek jadwal, dan orang tua bisa pantau absensi — semuanya dari HP tanpa perlu install aplikasi tambahan.',
  },
  {
    q: 'Bagaimana guru bisa lihat data kelas yang dia ajar saja?',
    a: 'Sistem otomatis memfilter berdasarkan jadwal mengajar yang sudah diatur admin. Guru tidak perlu atur apa-apa — begitu login, yang tampil hanya kelas yang memang jadi tanggung jawabnya.',
  },
  {
    q: 'Orang tua bisa pantau perkembangan anak?',
    a: 'Bisa. Orang tua punya akun terpisah yang terhubung ke data anaknya — nilai, kehadiran, tugas yang belum dikumpulkan, sampai pengumuman kelas. Notifikasi email juga bisa diaktifkan.',
  },
  {
    q: 'Kalau sekolah kami mau pakai, mulainya dari mana?',
    a: 'Daftar lewat halaman PPDB atau langsung DM kami di Instagram @davinmaritza. Proses setup biasanya tidak sampai sehari. Kami bantu konfigurasi awal sesuai struktur kelas dan kurikulum sekolah Anda.',
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LandingPage() {
  const { data: session } = useSession()
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1E293B] selection:bg-[#5483B3]/25 font-sans antialiased overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#F9F9F7]/92 backdrop-blur-xl border-b border-slate-200/50 h-[66px]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">
          <Link href="/" aria-label="Fokuspad — Beranda" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Image
              src="/logo-cube-transparent.png"
              alt="Fokuspad Logo"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="text-[21px] font-black tracking-tight text-[#0F172A] font-sans">
              Fokus<span className="text-[#5483B3]">pad</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-slate-500">
            <button onClick={() => scrollTo('masalah')} className="hover:text-slate-900 transition-colors">Kenapa Fokuspad?</button>
            <button onClick={() => scrollTo('fitur')} className="hover:text-slate-900 transition-colors">Fitur</button>
            <button onClick={() => scrollTo('cara-kerja')} className="hover:text-slate-900 transition-colors">Cara Kerja</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-slate-900 transition-colors">FAQ</button>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/register-ppdb" className="hidden sm:block">
              <button className="h-9 px-5 text-[12.5px] font-bold rounded-full bg-[#5483B3] text-white hover:bg-[#4272A2] transition-all duration-200 shadow-md shadow-[#5483B3]/20 hover:-translate-y-px active:scale-[0.97]">
                Daftar PPDB
              </button>
            </Link>
            {session ? (
              <Link href="/dashboard">
                <button className="h-9 px-5 text-[12.5px] font-bold rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-all duration-200 hover:-translate-y-px active:scale-[0.97]">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="h-9 px-5 text-[12.5px] font-bold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-px active:scale-[0.97]">
                  Masuk
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>

        {/* ── HERO ── */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute top-[-8%] left-[8%] w-[480px] h-[480px] bg-[#5483B3]/7 rounded-full blur-[110px]" />
            <div className="absolute bottom-[12%] right-[4%] w-[360px] h-[360px] bg-[#93C5FD]/8 rounded-full blur-[90px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#5483B3]/10 border border-[#5483B3]/20 text-[#3B6FA0] text-[11px] font-bold tracking-[0.15em] uppercase">
                <Zap className="h-3 w-3" />
                Sistem Manajemen Sekolah Digital
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[42px] sm:text-5xl md:text-[66px] lg:text-[74px] font-extrabold tracking-tight text-[#0F172A] leading-[1.07] font-serif"
            >
              Sekolah lebih teratur,<br />
              <span className="text-[#5483B3]">belajar lebih fokus</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-[17px] text-slate-500 font-medium max-w-xl mx-auto leading-relaxed"
            >
              Fokuspad menggantikan tumpukan spreadsheet dan buku absensi fisik dengan satu platform yang rapi — dari nilai, jadwal, tugas, sampai komunikasi dengan orang tua.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1"
            >
              <Link href="/register-ppdb">
                <button className="group h-[52px] px-8 bg-[#5483B3] hover:bg-[#4272A2] text-white font-bold text-sm rounded-full shadow-lg shadow-[#5483B3]/22 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2.5">
                  Daftar PPDB Sekarang
                  <span className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </Link>
              <Link href="/login">
                <button className="h-[52px] px-8 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] shadow-sm">
                  Sudah punya akun? Masuk
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-10 pt-4 flex-wrap"
            >
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-[28px] font-black text-[#0F172A] tracking-tight">{s.value}</div>
                  <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-8 mt-14"
          >
            <div className="p-1.5 bg-white/60 ring-1 ring-slate-200/70 rounded-[1.75rem] shadow-2xl shadow-slate-900/8">
              <div className="bg-white rounded-[calc(1.75rem-6px)] overflow-hidden border border-slate-100/80">
                {/* Window bar */}
                <div className="h-9 bg-slate-50/80 border-b border-slate-100 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-5 max-w-[180px] mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-[9.5px] text-slate-400 font-medium">fokuspad.my.id/dashboard</span>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[270px]">
                  {/* Sidebar */}
                  <div className="hidden md:flex flex-col bg-[#0F172A] p-5 gap-2.5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#5483B3] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">Fokuspad</span>
                    </div>
                    {['Dashboard', 'Kelas Saya', 'Nilai', 'Absensi', 'Kalender'].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold ${i === 0 ? 'bg-[#5483B3]/20 text-[#93C5FD]' : 'text-slate-500'}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Main */}
                  <div className="md:col-span-3 p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Selamat datang kembali 👋</p>
                        <p className="text-sm font-bold text-slate-900">Dashboard Guru — Semester Ganjil 2025/2026</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-700">Online</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Siswa Aktif', value: '32', color: 'bg-blue-50 text-blue-600' },
                        { label: 'Tugas Menunggu', value: '5', color: 'bg-amber-50 text-amber-600' },
                        { label: 'Rata-rata Nilai', value: '78%', color: 'bg-emerald-50 text-emerald-600' },
                      ].map((c, i) => (
                        <div key={i} className={`${c.color} rounded-xl p-3`}>
                          <p className="text-[18px] font-black">{c.value}</p>
                          <p className="text-[10px] font-semibold opacity-65 mt-0.5">{c.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'Fajar Nugroho', kelas: 'XI RPL 1', progress: 91, no: 8 },
                        { name: 'Siti Rahayu', kelas: 'XI RPL 1', progress: 67, no: 24 },
                        { name: 'Bintang Pratama', kelas: 'XI RPL 1', progress: 45, no: 4 },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 w-5 text-center">{s.no}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">{s.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{s.kelas}</p>
                          </div>
                          <div className="w-20 text-right">
                            <p className="text-[10px] font-bold text-slate-600 mb-1">{s.progress}%</p>
                            <Progress
                              value={s.progress}
                              className="h-1.5 bg-slate-200"
                              indicatorClassName={s.progress > 75 ? 'bg-emerald-500' : s.progress > 55 ? 'bg-amber-500' : 'bg-rose-400'}
                            />
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

        {/* ── MASALAH ── */}
        <section id="masalah" className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[10.5px] font-black uppercase tracking-[0.18em] text-rose-500 block mb-4">Yang sering terjadi di sekolah</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Kenapa sekolah butuh<br />sesuatu yang lebih baik?
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Bukan soal teknologi canggih. Tapi soal waktu yang terbuang, informasi yang tertunda, dan keputusan yang dibuat tanpa data yang cukup.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PROBLEMS.map((p, i) => (
                <FadeUp key={i} delay={i * 0.07}>
                  <div className="group p-7 rounded-2xl bg-[#FAFAF8] border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/60 transition-all duration-400 hover:-translate-y-1 h-full">
                    <div className={`h-11 w-11 rounded-xl ${p.color} flex items-center justify-center mb-5`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#0F172A] mb-2.5 leading-snug">{p.title}</h3>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.25} className="flex flex-col items-center mt-14 gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#5483B3]">
                <Wand2 className="h-4 w-4" />
                Fokuspad dibuat untuk menyelesaikan ini semua
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </FadeUp>
          </div>
        </section>

        {/* ── FITUR ── */}
        <section id="fitur" className="py-28 md:py-36 bg-[#F9F9F7]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[10.5px] font-black uppercase tracking-[0.18em] text-[#5483B3] block mb-4">Apa saja yang ada di dalamnya</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Satu platform,<br />semua kebutuhan sekolah
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Lebih dari 12 fitur yang dirancang bersama — bukan sekadar ditumpuk, tapi saling terhubung satu sama lain.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                <FadeUp key={i} delay={i * 0.035}>
                  <div className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#5483B3]/25 hover:shadow-lg hover:shadow-[#5483B3]/6 transition-all duration-400 hover:-translate-y-1 h-full">
                    <div className={`h-10 w-10 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="h-[18px] w-[18px]" />
                    </div>
                    <h3 className="text-[13.5px] font-bold text-[#0F172A] mb-2 leading-snug">{f.title}</h3>
                    <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── PANTAU PROGRES (Visual Split) ── */}
        <section className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeUp>
                <span className="text-[10.5px] font-black uppercase tracking-[0.18em] text-[#5483B3] block mb-5">Untuk guru yang peduli</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight mb-5">
                  Tahu persis siapa<br />yang perlu dibantu
                </h2>
                <p className="text-[13.5px] text-slate-500 font-medium leading-relaxed mb-8">
                  Tidak perlu lagi nunggu ujian akhir buat tahu siswa mana yang tertinggal. Fokuspad kasih gambar lengkap per kompetensi, per minggu — biar intervensi bisa dilakukan jauh lebih awal.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Crosshair, title: 'Per kompetensi, bukan cuma angka akhir', desc: 'Lihat penguasaan tiap materi secara individual, bukan sekadar rata-rata kelas yang menyembunyikan masalah.' },
                    { icon: BellRing, title: 'Peringatan dini otomatis', desc: 'Sistem kasih notifikasi saat nilai siswa turun signifikan — sebelum terlambat.' },
                    { icon: BarChart3, title: 'Laporan bisa langsung diunduh', desc: 'Rekap semester dalam format yang rapi, tidak perlu bikin ulang di Word atau Excel.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#F9F9F7] border border-slate-100 hover:border-[#5483B3]/20 transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-[#5483B3]/10 flex items-center justify-center text-[#5483B3] shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-[#0F172A]">{item.title}</h4>
                        <p className="text-[11.5px] text-slate-500 font-medium mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* Mockup card */}
              <FadeUp delay={0.14}>
                <div className="p-2 bg-slate-50/80 ring-1 ring-slate-200/70 rounded-[1.75rem] shadow-2xl shadow-slate-900/7">
                  <div className="bg-white rounded-[calc(1.75rem-8px)] overflow-hidden border border-slate-100 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10.5px] text-slate-400 font-medium">Laporan Kelas</p>
                        <p className="text-[13.5px] font-bold text-slate-900">XI RPL 1 — Pemrograman Web</p>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold rounded-full px-2.5">Aktif</Badge>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'HTML & CSS Dasar', val: 94, color: 'bg-emerald-500' },
                        { name: 'JavaScript', val: 71, color: 'bg-[#5483B3]' },
                        { name: 'React / Framework', val: 55, color: 'bg-amber-500' },
                        { name: 'Database & API', val: 38, color: 'bg-rose-400' },
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
                              transition={{ duration: 0.9, delay: i * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full ${item.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Perlu perhatian lebih</p>
                      {[
                        { name: 'Hendri Saputra', score: 36, no: 11 },
                        { name: 'Nadia Kusuma', score: 41, no: 19 },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-rose-50/70 border border-rose-100/70 rounded-xl mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-[10px] font-bold">
                              {s.no}
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{s.name}</span>
                          </div>
                          <span className="text-[11px] font-black text-rose-500">{s.score}% ↓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── CARA KERJA ── */}
        <section id="cara-kerja" className="py-28 md:py-36 bg-[#F9F9F7]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-[10.5px] font-black uppercase tracking-[0.18em] text-[#5483B3] block mb-4">Tidak perlu training panjang</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                3 langkah,<br />sekolah sudah jalan
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-5 leading-relaxed">
                Desain yang intuitif bikin onboarding terasa ringan — bahkan bagi guru yang tidak terlalu akrab dengan teknologi.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-[#5483B3]/15 via-[#5483B3]/40 to-[#5483B3]/15" />
              {HOW.map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="text-center space-y-5 p-8">
                    <div className="relative inline-flex">
                      <div className="h-[76px] w-[76px] rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-900/5 flex items-center justify-center mx-auto">
                        <item.icon className="h-8 w-8 text-[#5483B3]" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#5483B3] text-white text-[11px] font-black flex items-center justify-center shadow-md shadow-[#5483B3]/25">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[15.5px] font-bold text-[#0F172A] mb-2.5">{item.title}</h3>
                      <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA DARK ── */}
        <section className="py-20 md:py-28 bg-[#0F172A]">
          <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
            <FadeUp>
              <div className="space-y-7">
                <span className="inline-block rounded-full px-4 py-1.5 bg-[#5483B3]/20 border border-[#5483B3]/25 text-[#93C5FD] text-[11px] font-bold tracking-[0.15em] uppercase">
                  Mulai hari ini, gratis
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white font-serif leading-tight">
                  Saatnya sekolah Anda<br />beralih ke cara yang lebih baik
                </h2>
                <p className="text-sm md:text-[15px] text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                  Tidak ada kontrak, tidak ada biaya tersembunyi. Daftar sekarang dan rasakan sendiri bedanya dalam seminggu pertama.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
                  <Link href="/register-ppdb">
                    <button className="group h-[52px] px-8 bg-[#5483B3] hover:bg-[#4272A2] text-white font-bold text-sm rounded-full shadow-lg shadow-[#5483B3]/28 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2.5">
                      Daftar PPDB
                      <span className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="h-[52px] px-8 bg-white/8 border border-white/15 text-white font-bold text-sm rounded-full hover:bg-white/12 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
                      Sudah punya akun? Masuk
                    </button>
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-28 md:py-36 bg-white border-y border-slate-100">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <FadeUp className="text-center mb-16">
              <span className="text-[10.5px] font-black uppercase tracking-[0.18em] text-[#5483B3] block mb-4">Yang sering ditanyakan</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                Pertanyaan yang<br />wajar untuk ditanyakan
              </h2>
            </FadeUp>

            <div className="space-y-2.5">
              {FAQS.map((item, idx) => (
                <FadeUp key={idx} delay={idx * 0.04}>
                  <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${activeAccordion === idx ? 'border-[#5483B3]/25 bg-[#5483B3]/4' : 'border-slate-100 bg-[#F9F9F7] hover:border-slate-200'}`}>
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                      aria-expanded={activeAccordion === idx}
                    >
                      <span className={`text-[13.5px] font-bold leading-snug ${activeAccordion === idx ? 'text-[#5483B3]' : 'text-[#0F172A]'}`}>
                        {item.q}
                      </span>
                      <ChevronDown className={`h-4 w-4 shrink-0 ml-4 transition-transform duration-300 ${activeAccordion === idx ? 'rotate-180 text-[#5483B3]' : 'text-slate-400'}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[12.5px] text-slate-600 font-medium leading-relaxed">
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

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo-cube-transparent.png"
                  alt="Fokuspad Logo"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-[21px] font-black tracking-tight text-white font-sans">
                  Fokus<span className="text-[#5483B3]">pad</span>
                </span>
              </div>
              <p className="text-[12px] leading-relaxed font-medium max-w-xs text-slate-500">
                Platform manajemen akademik sekolah yang menggantikan proses manual dengan sistem yang terhubung dan mudah dipakai semua pihak.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                {[
                  { href: 'https://github.com/davinmaritza', icon: Github },
                  { href: 'https://x.com/workwithsuzirz', icon: Twitter },
                  { href: 'https://instagram.com/davinmaritza', icon: Instagram },
                  { href: 'https://davinn.net', icon: Globe2 },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-white/6 hover:bg-white/12 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Platform</h5>
              <nav className="flex flex-col gap-2.5 text-[12px] font-semibold text-slate-500">
                <button onClick={() => scrollTo('fitur')} className="text-left hover:text-white transition-colors">Fitur Lengkap</button>
                <button onClick={() => scrollTo('cara-kerja')} className="text-left hover:text-white transition-colors">Cara Kerja</button>
                <Link href="/register-ppdb" className="hover:text-white transition-colors">Daftar PPDB</Link>
                <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Kontak & Bantuan</h5>
              <nav className="flex flex-col gap-2.5 text-[12px] font-semibold text-slate-500">
                <button onClick={() => scrollTo('faq')} className="text-left hover:text-white transition-colors">FAQ</button>
                <a href="https://instagram.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Instagram @davinmaritza <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <Link href="/login" className="hover:text-white transition-colors">Masuk ke Akun</Link>
                <a href="https://github.com/davinmaritza" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  Source Code <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </nav>
            </div>
          </div>

          <div className="pt-7 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] font-medium text-slate-600">
              © {new Date().getFullYear()} Fokuspad. Hak Cipta Dilindungi.
            </p>
            <p className="text-[11px] font-medium text-slate-600">
              Built by{' '}
              <a href="https://davinn.net" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white font-semibold transition-colors">
                davinn.net
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
