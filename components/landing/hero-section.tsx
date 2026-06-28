'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'

const STATS = [
  { value: '13+', label: 'Fitur akademik' },
  { value: '4', label: 'Peran pengguna' },
  { value: 'Gratis', label: 'Untuk mulai' },
  { value: 'Real-time', label: 'Update data' },
]

export function HeroSection() {
  return (
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
    </section>
  )
}
