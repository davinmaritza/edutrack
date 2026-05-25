'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  ArrowLeft, 
  Users, 
  ClipboardList, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', name: 'Ringkasan Sistem' },
    { id: 'admin', name: '1. Peran Administrator' },
    { id: 'teacher', name: '2. Peran Guru Mata Pelajaran' },
    { id: 'student', name: '3. Peran Siswa' },
    { id: 'features', name: '4. Fitur Unggulan' },
    { id: 'faq', name: 'Pertanyaan Terkait Alur' }
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
    <div className="min-h-screen bg-[#FDFCF7] text-[#1E293B] font-sans antialiased">
      {/* Top Banner Navbar */}
      <header className="sticky top-0 w-full z-50 bg-[#FDFCF7]/90 backdrop-blur-xl border-b border-[#E2E8F0] h-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 bg-[#1E293B] rounded-xl flex items-center justify-center text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1E293B]">EduTrack</span>
            </Link>
            <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block" />
            <span className="text-xs font-bold text-[#64748B] hidden sm:block">Dokumentasi Cara Kerja</span>
          </div>

          <Link href="/">
            <Button variant="ghost" className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-3 lg:sticky lg:top-32 h-fit">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] px-3 mb-4">DAFTAR ISI</p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group",
                    activeSection === section.id 
                      ? "bg-[#1E293B] text-white shadow-sm" 
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <span>{section.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-16">
            {/* Overview Section */}
            <section id="overview" className="space-y-6 scroll-mt-32">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">CARA KERJA</span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] font-serif">Bagaimana EduTrack Beroperasi?</h1>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                EduTrack adalah ekosistem pendidikan digital modern yang mempermudah kolaborasi guru, siswa, dan sekolah secara asinkronus dan transparan. Sistem kami dirancang secara spesifik dengan batasan otorisasi peran (*role-based access control*) untuk menjamin keamanan data akademik.
              </p>
              <Card className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
                <CardContent className="p-6 md:p-8 space-y-4">
                  <h4 className="font-bold text-sm text-[#0F172A]">Tiga Pilar Otorisasi Utama:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                      <div className="h-8 w-8 bg-[#1E293B] text-white rounded-lg flex items-center justify-center"><Key className="h-4 w-4" /></div>
                      <h5 className="text-xs font-bold text-[#0F172A]">Administrator</h5>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">Mengelola penuh basis data sekolah, membuat mata pelajaran, menetapkan guru, dan menyusun jadwal kelas.</p>
                    </div>
                    <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                      <div className="h-8 w-8 bg-[#1E293B] text-white rounded-lg flex items-center justify-center"><Users className="h-4 w-4" /></div>
                      <h5 className="text-xs font-bold text-[#0F172A]">Guru Mata Pelajaran</h5>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">Membagikan modul/materi, membuat penugasan, melakukan absensi mandiri, serta merekap progress belajar siswa.</p>
                    </div>
                    <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                      <div className="h-8 w-8 bg-[#1E293B] text-white rounded-lg flex items-center justify-center"><GraduationCap className="h-4 w-4" /></div>
                      <h5 className="text-xs font-bold text-[#0F172A]">Siswa Terdaftar</h5>
                      <p className="text-[11px] text-[#64748B] leading-relaxed">Mengisi lembar kemajuan belajar topik mandiri, mengumpulkan lembar tugas, dan menyusun notes kegiatan harian.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Admin Section */}
            <section id="admin" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">PILAR PERTAMA</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Alur Kerja Administrator (Admin)</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Administrator bertindak sebagai pemegang kendali utama di EduTrack. Admin berkewajiban menyiapkan data sekolah sebelum guru dan siswa mulai berinteraksi dengan sistem.
              </p>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Pembuatan Pengguna (User Management)', desc: 'Admin membuat akun untuk Guru, Siswa, dan Pelatih Ekskul secara manual melalui dashboard atau impor massal berbasis JSON/CSV.' },
                  { step: '2', title: 'Pembuatan Rombongan Belajar (Rombel/Kelas)', desc: 'Menyusun daftar kelas (contoh: XI RPL 1, X DKV 2) beserta jenjang tingkatannya untuk pengelompokan siswa.' },
                  { step: '3', title: 'Pemetaan Mata Pelajaran & Guru Pengampu', desc: 'Membuat modul subjek pelajaran (contoh: Matematika, Pemrograman Web) dan menugaskan guru tertentu sebagai pengampu utama subjek tersebut.' },
                  { step: '4', title: 'Penyusunan Jadwal Belajar (Class Schedule)', desc: 'Menghubungkan ruang kelas, hari, waktu mulai/selesai, mata pelajaran, dan guru pengampu ke dalam sistem penjadwalan terpadu.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                    <span className="h-8 w-8 rounded-lg bg-[#E2E8F0]/50 flex items-center justify-center text-xs font-bold text-[#1E293B] shrink-0">{item.step}</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-xs text-[#64748B] leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Teacher Section */}
            <section id="teacher" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">PILAR KEDUA</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Alur Kerja Guru Mata Pelajaran (Teacher)</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Guru memiliki kontrol penuh atas aktivitas pembelajaran mandiri dan manajemen tugas di dalam ruang kelas yang mereka ajar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl space-y-3 shadow-sm">
                  <div className="h-9 w-9 bg-[#E0F2FE] text-[#0369A1] rounded-xl flex items-center justify-center"><Users className="h-5 w-5" /></div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Directory Siswa Terbatas</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Guru hanya memiliki otorisasi untuk melihat profil dan log belajar siswa yang terdaftar di dalam mata pelajaran yang mereka ampu saja.
                  </p>
                </div>
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl space-y-3 shadow-sm">
                  <div className="h-9 w-9 bg-[#E0F2FE] text-[#0369A1] rounded-xl flex items-center justify-center"><ClipboardList className="h-5 w-5" /></div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Sistem Manajemen Tugas (Classroom)</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Membagikan modul materi digital (PDF/link eksternal), menerbitkan instruksi penugasan, menetapkan tenggat waktu, dan langsung memberikan feedback berupa skor nilai tugas.
                  </p>
                </div>
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl space-y-3 shadow-sm">
                  <div className="h-9 w-9 bg-[#E0F2FE] text-[#0369A1] rounded-xl flex items-center justify-center"><Clock className="h-5 w-5" /></div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Absensi Guru Mandiri</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Melakukan pencatatan jam kehadiran (check-in) dan kepulangan (check-out) kerja secara real-time yang langsung diarsipkan ke dalam basis data admin pusat untuk keperluan audit.
                  </p>
                </div>
                <div className="p-6 bg-white border border-[#E2E8F0] rounded-3xl space-y-3 shadow-sm">
                  <div className="h-9 w-9 bg-[#E0F2FE] text-[#0369A1] rounded-xl flex items-center justify-center"><GraduationCap className="h-5 w-5" /></div>
                  <h4 className="text-sm font-bold text-[#0F172A]">Rapi Berdasarkan Absen</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Daftar siswa di dalam kelas diurutkan secara konsisten berdasarkan nomor absen kelas untuk memudahkan entri rekapitulasi nilai mingguan.
                  </p>
                </div>
              </div>
            </section>

            {/* Student Section */}
            <section id="student" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">PILAR KETIGA</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Alur Kerja Siswa (Student)</h2>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Siswa didorong untuk proaktif memantau kemajuan belajarnya serta menyelesaikan target pembelajaran mingguan.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Mengakses Progress Tracker', desc: 'Siswa dapat melihat log durasi belajar, persentase penguasaan setiap kompetensi dasar (topik), dan tingkat kesulitan materi yang telah diselesaikan.' },
                  { title: 'Melakukan Pengumpulan Tugas', desc: 'Melihat tenggat penugasan dari guru, mengunggah berkas lampiran penyerahan tugas, serta memantau skor/umpan balik langsung dari guru pengampu.' },
                  { title: 'Membuat Catatan & Agenda Harian (Block Editor)', desc: 'Fitur mirip Notion yang memungkinkan siswa membuat rangkuman materi belajar menggunakan blok tulisan interaktif, langsung tertaut pada kalender akademik.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-2">
                    <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-[#1E293B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">INTEGRATED FEATURES</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Fitur Penunjang Unggulan</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 text-[#5483B3] flex items-center justify-center mb-4"><Calendar className="h-4 w-4" /></div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Notion-Style Notes</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Editor kaya fitur berbasis blok untuk menulis materi, menambahkan checklist kegiatan, dan menyusun peta belajar.</p>
                </div>
                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 text-[#5483B3] flex items-center justify-center mb-4"><TrendingUp className="h-4 w-4" /></div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Gamifikasi Belajar</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Sistem peringkat dan leaderboard interaktif di sekolah berdasarkan akumulasi total durasi belajar mandiri siswa.</p>
                </div>
                <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 text-[#5483B3] flex items-center justify-center mb-4"><MessageSquare className="h-4 w-4" /></div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Kolaborasi & Diskusi</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Forum komunikasi digital per kelas untuk mendukung diskusi asinkronus dan tanya jawab materi secara interaktif.</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="space-y-6 scroll-mt-32">
              <div className="h-px bg-[#E2E8F0] w-full" />
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#5483B3] block">SUPPORT & RESOLUTIONS</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Pertanyaan Terkait Alur Kerja</h2>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#0F172A] mb-2">Bagaimana jika siswa belum masuk ke kelas mana pun?</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Siswa tersebut akan masuk ke kelompok unassigned siswa. Admin sekolah atau guru wali kelas dapat membuka pengaturan kelas dan menambahkan siswa tersebut langsung dari dropdown daftar nama.</p>
                </div>
                <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                  <h4 className="text-xs font-bold text-[#0F172A] mb-2">Apakah guru dapat mengubah nomor absensi siswa secara langsung?</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">Tidak. Nomor absensi siswa dikelola terpusat oleh Admin pada dashboard Kelola Pengguna untuk menghindari tumpang tindih data. Guru hanya bertindak sebagai pembaca informasi saat melakukan penilaian.</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Mini Footer */}
      <footer className="py-8 bg-[#1E293B] text-[#94A3B8] border-t border-[#334155] text-center text-xs">
        <p>© {new Date().getFullYear()} EduTrack — Dikembangkan oleh Davin Maritza. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  )
}
