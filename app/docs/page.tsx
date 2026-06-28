'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  ArrowLeft,
  Users2,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  MessagesSquare,
  Clock,
  TrendingUp,
  ShieldCheck,
  ListTodo,
  FileCheck2,
  Trophy,
  ChevronRight,
  Settings2,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', name: 'Ringkasan Sistem' },
    { id: 'admin', name: 'Otoritas Administrator' },
    { id: 'teacher', name: 'Panduan Guru' },
    { id: 'student', name: 'Panduan Siswa' },
    { id: 'faq', name: 'Tanya Jawab' }
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1E293B] selection:bg-[#5483B3]/25 font-sans antialiased">
      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#F9F9F7]/92 backdrop-blur-xl border-b border-slate-200/50 h-[66px]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <div className="h-4 w-px bg-slate-300 hidden sm:block" />
            <span className="text-[13px] font-bold text-slate-500 hidden sm:block tracking-wide">DOKUMENTASI</span>
          </div>

          <Link href="/">
            <button className="h-9 px-5 text-[12.5px] font-bold rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 hover:-translate-y-px shadow-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 xl:gap-16">
          
          {/* ── SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-1 space-y-3 lg:sticky lg:top-32 h-fit"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5483B3] px-4 mb-5">Daftar Isi</p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between group",
                    activeSection === section.id
                      ? "bg-[#0F172A] text-white shadow-md"
                      : "text-slate-500 hover:bg-white hover:text-[#0F172A] hover:shadow-sm"
                  )}
                >
                  <span>{section.name}</span>
                  {activeSection === section.id && <ChevronRight className="h-4 w-4 text-[#5483B3]" />}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* ── MAIN CONTENT ── */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 space-y-24"
          >
            {/* OVERVIEW */}
            <section id="overview" className="space-y-6 scroll-mt-32">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-[#5483B3]/10 border border-[#5483B3]/20 text-[#3B6FA0] text-[11px] font-bold tracking-[0.15em] uppercase">
                  MEMULAI
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">
                  Cara Kerja Ekosistem Fokuspad
                </h1>
              </div>
              <p className="text-[15px] text-slate-500 leading-relaxed max-w-3xl">
                Fokuspad dibangun dengan filosofi bahwa administrasi sekolah seharusnya tidak membebani pendidik. 
                Sistem ini merajut interaksi antara Administrator, Guru, dan Siswa ke dalam satu lingkungan digital yang transparan, otomatis, dan minim gesekan. 
                Setiap peran diberikan instrumen yang spesifik untuk tugasnya tanpa dibanjiri fitur yang tidak relevan.
              </p>

              <div className="double-bezel shadow-xl shadow-slate-900/5 mt-10">
                <div className="double-bezel-inner p-8 md:p-10 bg-[#0F172A] text-white overflow-hidden relative">
                  <div className="absolute top-[-20%] right-[-10%] opacity-5 pointer-events-none rotate-12">
                    <GraduationCap className="h-96 w-96" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-[#93C5FD]" /> Arsitektur Berbasis Peran
                  </h3>
                  <p className="text-[14px] text-slate-300 leading-relaxed max-w-2xl">
                    Sistem keamanan dan privasi kami berjalan secara hierarkis. 
                    <strong className="text-white"> Siswa</strong> diisolasi untuk hanya melihat progres dan jadwal mereka sendiri. 
                    <strong className="text-white"> Guru</strong> dipagari hanya pada kelas yang mereka ampu untuk menjaga fokus dan privasi nilai. Sementara itu, 
                    <strong className="text-white"> Admin</strong> bertindak sebagai nahkoda yang mendistribusikan kewenangan, kelas, dan jadwal tanpa ikut campur dalam ranah akademis harian.
                  </p>
                </div>
              </div>
            </section>

            {/* ADMIN */}
            <section id="admin" className="space-y-8 scroll-mt-32">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#5483B3] block">OTORISASI TERTINGGI</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-serif">1. Peran Administrator</h2>
                <p className="text-[14.5px] text-slate-500 leading-relaxed max-w-3xl">
                  Administrator adalah jantung dari operasional Fokuspad. Sebelum tahun ajaran dimulai, Admin bertanggung jawab meletakkan pondasi sekolah digital melalui tiga pilar utama:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    icon: UserCog,
                    title: 'Manajemen Entitas',
                    desc: 'Mendaftarkan akun Guru dan Siswa secara massal maupun satuan. Pada tahap ini, penentuan Nomor Absen dan pembuatan kredensial login awal dilakukan.'
                  },
                  {
                    icon: Users2,
                    title: 'Struktur Kelas',
                    desc: 'Membangun arsitektur kelas (misal: X MIPA 1, XI RPL 2). Admin memetakan ribuan siswa ke dalam kelas-kelas ini agar sistem mengetahui siapa berada di mana.'
                  },
                  {
                    icon: CalendarDays,
                    title: 'Ploting Jadwal',
                    desc: 'Menyusun matriks jadwal pelajaran yang menghubungkan Guru, Mata Pelajaran, Kelas, dan Jam Belajar. Logika filter guru bergantung sepenuhnya pada jadwal ini.'
                  }
                ].map((item, i) => (
                  <div key={i} className="p-7 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#5483B3]/20 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#5483B3] flex items-center justify-center mb-5">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-[15px] font-bold text-[#0F172A] mb-2">{item.title}</h4>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* TEACHER */}
            <section id="teacher" className="space-y-8 scroll-mt-32">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#5483B3] block">PANDUAN PENGAJAR</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-serif">2. Fitur Guru Pengampu</h2>
                <p className="text-[14.5px] text-slate-500 leading-relaxed max-w-3xl">
                  Dirancang untuk memangkas waktu administratif, antarmuka guru di Fokuspad mengotomatisasi penyortiran data, sehingga guru dapat memfokuskan energi pada pedagogi:
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Isolasi Ruang Lingkup Kelas',
                    desc: 'Anda tidak akan tenggelam dalam lautan data satu sekolah. Sistem secara cerdas menyaring halaman "Kelola Kelas" sehingga Anda hanya melihat kelas yang secara spesifik ditugaskan kepada Anda oleh Admin di jadwal.'
                  },
                  {
                    icon: ListTodo,
                    title: 'Direktori Siswa & Filter Cerdas',
                    desc: 'Buku absen digital yang revolusioner. Daftar siswa diurutkan otomatis berdasarkan Nomor Absen. Anda bisa memanfaatkan filter "Kelompokkan Kelas" untuk melakukan penilaian massal dengan sangat cepat tanpa perlu mencari nama satu per satu.'
                  },
                  {
                    icon: FileCheck2,
                    title: 'Distribusi Materi & Penilaian Berkelanjutan',
                    desc: 'Classroom Feed memungkinkan Anda mengunggah modul, membuat penugasan dengan tenggat waktu, dan memberikan umpan balik (feedback) teks langsung pada lembar kerja siswa. Nilai yang dimasukkan akan langsung terkapitalisasi dalam buku nilai digital.'
                  },
                  {
                    icon: Clock,
                    title: 'Log Absensi Presensi Guru',
                    desc: 'Catat jam kedatangan dan kepulangan secara instan. Fitur Check-in/Check-out harian mendukung pelampiran surat izin sakit digital yang langsung masuk ke rekapitulasi tata usaha.'
                  },
                  {
                    icon: MessagesSquare,
                    title: 'Forum Diskusi Asinkron',
                    desc: 'Miliki ruang tanya jawab khusus per mata pelajaran. Selesaikan kebingungan siswa di luar jam kelas dengan format forum yang terstruktur dan mudah dilacak.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[15px] font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* STUDENT */}
            <section id="student" className="space-y-8 scroll-mt-32">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#5483B3] block">PANDUAN PELAJAR</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-serif">3. Ruang Belajar Siswa</h2>
                <p className="text-[14.5px] text-slate-500 leading-relaxed max-w-3xl">
                  Fokuspad mengubah siswa dari penerima pasif menjadi pembelajar proaktif melalui instrumen manajemen waktu dan gamifikasi akademik:
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: TrendingUp,
                    title: 'Jurnal Belajar Mandiri (Progress Tracker)',
                    desc: 'Setelah mempelajari suatu materi di luar sekolah, catat progres Anda! Masukkan durasi belajar, nilai tingkat kesulitan materi (1-5 bintang), dan tuliskan refleksi singkat. Ini membantu Anda melacak konsistensi belajar dari waktu ke waktu.'
                  },
                  {
                    icon: BookOpen,
                    title: 'Catatan Gaya Notion Terintegrasi',
                    desc: 'Tinggalkan buku tulis yang mudah hilang. Gunakan Block-Editor bawaan untuk mengetik rangkuman, membuat to-do list, atau menyisipkan gambar referensi yang tersimpan rapi secara kronologis.'
                  },
                  {
                    icon: ClipboardCheck,
                    title: 'Lacak Tugas Tanpa Terlewat',
                    desc: 'Satu dasbor untuk semua tenggat waktu. Kumpulkan tugas secara digital dan pantau status penilaian dari guru Anda secara real-time. Tidak ada lagi drama "tugas tertinggal di rumah".'
                  },
                  {
                    icon: Trophy,
                    title: 'Gamifikasi & Papan Peringkat (Leaderboard)',
                    desc: 'Ubah belajar menjadi kompetisi yang sehat. Durasi jam belajar mandiri yang Anda log di Progress Tracker akan diakumulasi ke Papan Peringkat sekolah. Lihat siapa yang paling rajin bulan ini!'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[15px] font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="space-y-8 scroll-mt-32">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#5483B3] block">TANYA JAWAB</span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-serif">Seputar Alur Kerja</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-7 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 leading-snug">Bagaimana jika Nomor Absen saya salah atau ganda?</h4>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                    Nomor absen dikelola mutlak oleh Administrator untuk memastikan tidak ada duplikasi data di dalam satu kelas. Jika Anda mendapati nomor absen Anda keliru di profil, Anda tidak bisa menggantinya sendiri. Segera hubungi Admin Tata Usaha untuk penyesuaian.
                  </p>
                </div>
                <div className="p-7 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 leading-snug">Mengapa saya (Siswa) tidak melihat tugas atau jadwal apapun?</h4>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                    Hal ini terjadi jika akun Anda belum dipetakan (di-assign) ke dalam Rombongan Belajar (Kelas) oleh Admin. Sistem Fokuspad bergantung pada relasi Kelas untuk menampilkan mata pelajaran. Silakan lapor ke Admin agar akun Anda dimasukkan ke kelas yang tepat.
                  </p>
                </div>
                <div className="p-7 bg-white border border-slate-100 rounded-2xl shadow-sm md:col-span-2">
                  <h4 className="text-[14px] font-bold text-[#0F172A] mb-3 leading-snug">Saya (Guru) sudah ditugaskan mengajar, tapi kelasnya tidak muncul?</h4>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                    Pastikan Administrator sudah membuat <strong>Jadwal Pelajaran (Schedule)</strong> yang mencantumkan nama Anda sebagai pengampu mata pelajaran di kelas tersebut. Jika jadwal belum dibuat di sistem, relasi mengajar Anda tidak akan terdeteksi oleh filter pintar kami.
                  </p>
                </div>
              </div>
            </section>
          </motion.main>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="py-10 bg-[#0F172A] text-slate-400 border-t border-white/5 text-center text-[12px] font-medium">
        <p>&copy; {new Date().getFullYear()} Fokuspad. Dirancang untuk memudahkan ekosistem pendidikan.</p>
      </footer>
    </div>
  )
}
