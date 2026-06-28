'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { FadeUp } from './fade-up'

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

export function FAQSection() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  return (
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
  )
}
