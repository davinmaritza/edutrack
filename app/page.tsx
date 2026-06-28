'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import {
  GraduationCap,
  ArrowRight,
  TrendingUp,
  BarChart3,
  LayoutDashboard,
  ChevronDown,
  CalendarDays,
  MessagesSquare,
  FileCheck2,
  Wand2,
  Users2,
  ClipboardCheck,
  MonitorPlay,
  BellRing,
  Globe2,
  TriangleAlert,
  Github,
  Twitter,
  Instagram,
  ExternalLink,
  Zap,
  Crosshair,
  Building,
  School,
  BadgeCheck,
  Pencil,
  ShieldCheck,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

/* ─── Premium Fluid Motion Wrappers ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function MagneticButton({ children, className = '', onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative overflow-hidden flex items-center justify-center gap-3 rounded-full ${className}`}
    >
      {children}
    </motion.button>
  )
}

/* ─── Data Arrays ─── */
const PROBLEMS = [
  { icon: ClipboardCheck, title: 'Administrasi Manual', desc: 'Guru menghabiskan berjam-jam untuk rekap absen & nilai.' },
  { icon: MessagesSquare, title: 'Informasi Terlambat', desc: 'Pengumuman sekolah sering tak sampai ke orang tua.' },
  { icon: BarChart3, title: 'Blind Spot Progres', desc: 'Tidak ada data real-time kemajuan belajar per siswa.' },
  { icon: TriangleAlert, title: 'Dokumen Tersebar', desc: 'Sistem terpisah bikin pencarian data jadi kacau.' },
]

const STATS = [
  { value: '13+', label: 'Fitur Akademik' },
  { value: '4', label: 'Peran Terpisah' },
  { value: 'Gratis', label: 'Untuk Sekolah' },
  { value: 'Live', label: 'Sinkronisasi' },
]

const FAQS = [
  { q: 'Apakah Fokuspad benar-benar gratis?', a: 'Ya, semua fitur inti bisa dipakai tanpa biaya. Tidak ada kontrak tersembunyi.' },
  { q: 'Bagaimana keamanan data siswa?', a: 'Data dienkripsi penuh. Sistem role-based access memastikan guru hanya melihat data kelasnya.' },
  { q: 'Apakah bisa diakses lewat HP?', a: 'Sangat bisa. Kami merancang Fokuspad untuk melar (stretch) dan bekerja optimal di layar sentuh sekecil apapun.' },
  { q: 'Bagaimana cara sekolah mendaftar?', a: 'Hubungi kami lewat Instagram atau daftar via portal PPDB. Setup biasanya kurang dari 24 jam.' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LandingPage() {
  const { data: session } = useSession()
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)
  const { scrollY } = useScroll()
  const yHero = useTransform(scrollY, [0, 1000], [0, 250])

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] font-sans antialiased overflow-x-hidden selection:bg-[#5483B3] selection:text-white">
      
      {/* ── HIGH-END NAV ── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-max z-50 glass rounded-full border border-white/20 shadow-2xl shadow-black/5 px-4 py-2.5 flex items-center justify-between md:justify-center gap-10"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo-cube-transparent.png" alt="Logo" width={28} height={28} className="group-hover:rotate-12 transition-transform duration-500" />
          <span className="text-[17px] font-black tracking-tight font-serif hidden sm:block">Fokus<span className="text-[#5483B3]">pad</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-widest text-slate-500">
          <button onClick={() => scrollTo('masalah')} className="hover:text-[#0F172A] transition-colors">Visi</button>
          <button onClick={() => scrollTo('fitur')} className="hover:text-[#0F172A] transition-colors">Ekosistem</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-[#0F172A] transition-colors">FAQ</button>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/dashboard">
              <button className="h-9 px-6 text-[11px] font-black uppercase tracking-widest rounded-full bg-[#0F172A] text-white hover:scale-95 transition-transform duration-300">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="h-9 px-6 text-[11px] font-black uppercase tracking-widest rounded-full bg-[#5483B3] text-white hover:scale-95 transition-transform duration-300">
                Masuk
              </button>
            </Link>
          )}
        </div>
      </motion.nav>

      <main>
        {/* ── CINEMATIC HERO ── */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden px-4">
          <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
          
          <motion.div style={{ y: yHero }} className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white/50 border border-slate-200/50 backdrop-blur-md shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5483B3] animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-600">Era Baru Manajemen Sekolah</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-[12vw] sm:text-[8vw] md:text-[80px] lg:text-[100px] font-bold tracking-tighter leading-[0.9] text-[#0F172A]">
                Belajar Fokus.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5483B3] to-[#3B6FA0] italic pr-4">Tanpa Distraksi.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Fokuspad menggantikan kerumitan spreadsheet dan kertas dengan arsitektur digital tingkat agensi. Untuk guru, siswa, dan orang tua.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/register-ppdb" className="w-full sm:w-auto">
                <MagneticButton className="w-full h-14 px-10 bg-[#0F172A] text-white font-bold text-[13px] uppercase tracking-wider">
                  Daftar PPDB 
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </MagneticButton>
              </Link>
            </Reveal>

            <Reveal delay={0.4} className="flex items-center justify-center gap-6 sm:gap-14 pt-8 flex-wrap">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black tracking-tighter text-[#0F172A]">{s.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </Reveal>
          </motion.div>

          {/* Z-Axis Floating Dashboard */}
          <Reveal delay={0.6} className="relative z-20 w-full max-w-5xl mx-auto mt-24 px-2 md:px-0 perspective-1000">
            <motion.div 
              initial={{ rotateX: 10, y: 100, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
              className="double-bezel shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]"
            >
              <div className="double-bezel-inner min-h-[300px] md:min-h-[500px] bg-slate-50 p-2 md:p-8 flex flex-col md:flex-row gap-6">
                {/* Simulated Sidebar */}
                <div className="hidden md:flex w-64 bg-white rounded-3xl p-6 shadow-sm flex-col gap-4">
                  <div className="w-full h-8 bg-slate-100 rounded-lg mb-4" />
                  {[1,2,3,4].map(i => <div key={i} className="w-3/4 h-5 bg-slate-50 rounded-md" />)}
                </div>
                {/* Simulated Main Content */}
                <div className="flex-1 space-y-4">
                  <div className="w-full h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 gap-3">
                     <div className="w-3 h-3 rounded-full bg-red-400" />
                     <div className="w-3 h-3 rounded-full bg-amber-400" />
                     <div className="w-3 h-3 rounded-full bg-green-400" />
                     <span className="text-[10px] font-bold text-slate-400 font-mono ml-4">fokuspad.my.id/dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-32 bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col justify-end">
                         <div className="w-10 h-10 rounded-full bg-blue-50 mb-auto" />
                         <div className="w-full h-4 bg-slate-50 rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-48 bg-white rounded-3xl shadow-sm border border-slate-100" />
                </div>
              </div>
            </motion.div>
          </Reveal>
        </section>

        {/* ── ASYMMETRICAL BENTO (Fitur) ── */}
        <section id="fitur" className="py-32 md:py-48 px-4 max-w-7xl mx-auto">
          <Reveal className="mb-20">
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-[#0F172A] max-w-2xl">
              Tidak Ada Lagi Data Berserakan.
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Box 1 (Large) */}
            <Reveal delay={0.1} className="md:col-span-8 double-bezel group">
              <div className="double-bezel-inner p-10 flex flex-col justify-between h-full bg-gradient-to-br from-blue-50 to-white">
                <LayoutDashboard className="h-10 w-10 text-[#5483B3] mb-6" />
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Dashboard Per Peran</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm">Guru, siswa, dan orang tua mendapatkan interface unik yang hanya menampilkan data relevan.</p>
                </div>
              </div>
            </Reveal>

            {/* Box 2 */}
            <Reveal delay={0.2} className="md:col-span-4 double-bezel group">
              <div className="double-bezel-inner p-10 flex flex-col justify-between h-full bg-[#0F172A] text-white">
                <Crosshair className="h-10 w-10 text-[#93C5FD] mb-6" />
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Analisis Real-time</h3>
                  <p className="text-sm text-slate-400 font-medium">Intervensi dini untuk siswa yang tertinggal.</p>
                </div>
              </div>
            </Reveal>

            {/* Box 3 */}
            <Reveal delay={0.3} className="md:col-span-4 double-bezel group">
              <div className="double-bezel-inner p-10 flex flex-col justify-between h-full">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mb-6" />
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">CBT Ujian Online</h3>
                  <p className="text-sm text-slate-500 font-medium">Anti-cheat otomatis dan penilaian instan.</p>
                </div>
              </div>
            </Reveal>

            {/* Box 4 (Wide) */}
            <Reveal delay={0.4} className="md:col-span-8 double-bezel group">
              <div className="double-bezel-inner p-10 flex flex-col justify-between h-full bg-slate-50 relative overflow-hidden">
                <div className="relative z-10">
                  <MessagesSquare className="h-10 w-10 text-rose-500 mb-6" />
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Komunikasi Tanpa Batas</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-sm">Forum kelas per materi, notifikasi email ke orang tua, dan pengumuman instan.</p>
                </div>
                {/* Decorative element */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-5 md:px-8">
            <Reveal className="mb-16">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#0F172A]">
                Validasi Logis.
              </h2>
            </Reveal>

            <div className="space-y-4">
              {FAQS.map((item, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="double-bezel !p-[2px] transition-all duration-300">
                    <div className="double-bezel-inner bg-[#F9F9F7] transition-colors hover:bg-white">
                      <button
                        onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                      >
                        <span className="text-lg md:text-xl font-bold tracking-tight text-[#0F172A]">{item.q}</span>
                        <div className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-500 ${activeAccordion === idx ? 'rotate-180 bg-[#0F172A] text-white border-transparent' : 'bg-white'}`}>
                           <ChevronDown className="h-5 w-5" />
                        </div>
                      </button>
                      <AnimatePresence>
                        {activeAccordion === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 md:px-8 pb-8 text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] text-slate-400 py-20 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <Image src="/logo-cube-transparent.png" alt="Logo" width={40} height={40} />
              <span className="text-2xl font-black tracking-tight text-white font-serif">Fokus<span className="text-[#5483B3]">pad</span></span>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-sm">Arsitektur akademik digital tanpa kompromi. Membawa manajemen sekolah ke era komputasi spasial.</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Navigasi</h5>
              <div className="flex flex-col gap-4 text-sm font-semibold">
                <button onClick={() => scrollTo('fitur')} className="text-left hover:text-white transition-colors w-max">Fitur</button>
                <Link href="/register-ppdb" className="hover:text-white transition-colors w-max">Daftar PPDB</Link>
                <Link href="/login" className="hover:text-white transition-colors w-max">Masuk Dashboard</Link>
              </div>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Sosial</h5>
              <div className="flex flex-col gap-4 text-sm font-semibold">
                <a href="#" className="hover:text-white transition-colors w-max">Instagram</a>
                <a href="#" className="hover:text-white transition-colors w-max">Twitter / X</a>
                <a href="#" className="hover:text-white transition-colors w-max">GitHub</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest">
          <span>&copy; 2026 Fokuspad. Dikembangkan oleh Davin Maritza.</span>
        </div>
      </footer>
    </div>
  )
}
