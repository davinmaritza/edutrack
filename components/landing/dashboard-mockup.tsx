'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-5 md:px-8 mt-14"
    >
      <div className="double-bezel shadow-2xl shadow-slate-900/10">
        <div className="double-bezel-inner overflow-hidden bg-white">
          {/* Window bar */}
          <div className="h-10 bg-slate-50/90 backdrop-blur-md border-b border-slate-100 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <div className="flex-1 mx-4">
              <div className="h-6 max-w-[200px] mx-auto rounded-md bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono tracking-tight">fokuspad.my.id/dashboard</span>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[270px]">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col bg-[#0F172A] p-5 gap-2.5">
              <div className="flex items-center gap-2 mb-4">
                 <Image src="/logo-cube-transparent.png" alt="Logo" width={24} height={24} className="h-6 w-6 object-contain" />
                 <span className="text-[12px] font-black tracking-tight text-white font-serif">Fokuspad</span>
              </div>
              {['Dashboard', 'Kelas Saya', 'Nilai', 'Absensi', 'Kalender'].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold transition-colors ${i === 0 ? 'bg-[#5483B3]/20 text-[#93C5FD]' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-current' : 'bg-slate-600'}`} />
                  {item}
                </div>
              ))}
            </div>
            {/* Main */}
            <div className="md:col-span-3 p-5 md:p-6 space-y-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Selamat datang kembali 👋</p>
                  <p className="text-[13px] sm:text-sm font-bold text-slate-900 mt-0.5">Dashboard Guru — Semester Ganjil 2025</p>
                </div>
                <div className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Online</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Siswa Aktif', value: '32', color: 'bg-white border-blue-100 text-blue-600', valColor: 'text-[#0F172A]' },
                  { label: 'Tugas Menunggu', value: '5', color: 'bg-white border-amber-100 text-amber-600', valColor: 'text-[#0F172A]' },
                  { label: 'Rata-rata Nilai', value: '78%', color: 'bg-white border-emerald-100 text-emerald-600', valColor: 'text-[#0F172A]' },
                ].map((c, i) => (
                  <div key={i} className={`${c.color} border shadow-sm rounded-2xl p-4 transition-transform hover:-translate-y-0.5 duration-300`}>
                    <p className={`text-[20px] font-black ${c.valColor}`}>{c.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mt-1">{c.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Fajar Nugroho', kelas: 'XI RPL 1', progress: 91, no: 8 },
                  { name: 'Siti Rahayu', kelas: 'XI RPL 1', progress: 67, no: 24 },
                  { name: 'Bintang Pratama', kelas: 'XI RPL 1', progress: 45, no: 4 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 w-5 text-center">{s.no}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-bold text-slate-800 truncate">{s.name}</p>
                      <p className="text-[9.5px] text-slate-400 font-medium">{s.kelas}</p>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-[10px] font-bold text-slate-600 mb-1.5">{s.progress}% Selesai</p>
                      <Progress
                        value={s.progress}
                        className="h-1.5 bg-slate-100"
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
  )
}
