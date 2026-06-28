'use client'

import Link from 'next/link'
import Image from 'next/image'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingNavbar({ hasSession }: { hasSession: boolean }) {
  return (
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
          {hasSession ? (
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
  )
}
