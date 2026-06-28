'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  TrendingUp, 
  ClipboardList, 
  BookOpen, 
  Calendar, 
  FileBarChart, 
  Trophy, 
  Bell, 
  Settings, 
  Users, 
  GraduationCap, 
  Megaphone,
  HelpCircle,
  LogOut,
  UserCheck,
  ChevronRight,
  MessageSquare,
  Wallet,
  Library,
  HeartPulse,
  School
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RBAC } from '@/lib/rbac'

interface SidebarLink {
  label: string
  icon: any
  href: string
  category: 'Utama' | 'Akademik' | 'Administrasi' | 'Layanan' | 'Sistem'
}

const sidebarLinks: Record<string, SidebarLink[]> = {
  STUDENT: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard', category: 'Utama' },
    { label: 'Progres Saya', icon: TrendingUp, href: '/dashboard/progress', category: 'Utama' },
    { label: 'Peringkat', icon: Trophy, href: '/dashboard/leaderboard', category: 'Utama' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', category: 'Utama' },
    
    { label: 'Tugas', icon: ClipboardList, href: '/dashboard/assignments', category: 'Akademik' },
    { label: 'Ujian Online', icon: ClipboardList, href: '/dashboard/student/exams', category: 'Akademik' },
    { label: 'Mata Pelajaran', icon: BookOpen, href: '/dashboard/subjects', category: 'Akademik' },
    { label: 'Jadwal Kelas', icon: ClipboardList, href: '/dashboard/schedule', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions', category: 'Layanan' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/reports', category: 'Layanan' },
    
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  TEACHER: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard', category: 'Utama' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', category: 'Utama' },
    
    { label: 'Kelola Kelas', icon: GraduationCap, href: '/dashboard/admin/classes', category: 'Akademik' },
    { label: 'Materi Saya', icon: BookOpen, href: '/dashboard/materi', category: 'Akademik' },
    { label: 'Kelola Materi', icon: ClipboardList, href: '/dashboard/kelola-materi', category: 'Akademik' },
    { label: 'Kelola Tugas', icon: ClipboardList, href: '/dashboard/kelola-tugas', category: 'Akademik' },
    { label: 'Kelola Ujian', icon: ClipboardList, href: '/dashboard/teacher/exams', category: 'Akademik' },
    { label: 'Jadwal Kelas', icon: ClipboardList, href: '/dashboard/schedule', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    
    { label: 'Data Siswa', icon: Users, href: '/dashboard/siswa-guru', category: 'Administrasi' },
    { label: 'Verifikasi Izin', icon: UserCheck, href: '/dashboard/teacher/requests', category: 'Administrasi' },
    { label: 'Keuangan & SPP', icon: Wallet, href: '/dashboard/teacher/billing', category: 'Administrasi' },
    
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions', category: 'Layanan' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/reports', category: 'Layanan' },
    { label: 'Ekskul Saya', icon: Trophy, href: '/dashboard/ekskul-guru', category: 'Layanan' },
    
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  ADMIN: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Pengumuman', icon: Megaphone, href: '/dashboard/admin/announcements', category: 'Utama' },
    
    { label: 'Kelola Kelas', icon: School, href: '/dashboard/admin/classes', category: 'Akademik' },
    { label: 'Kelola Mapel', icon: BookOpen, href: '/dashboard/admin/subjects', category: 'Akademik' },
    { label: 'Kelola Materi', icon: ClipboardList, href: '/dashboard/kelola-materi', category: 'Akademik' },
    { label: 'Kelola Tugas', icon: ClipboardList, href: '/dashboard/kelola-tugas', category: 'Akademik' },
    { label: 'Jadwal', icon: Calendar, href: '/dashboard/admin/schedules', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Ekskul', icon: Trophy, href: '/dashboard/admin/extracurriculars', category: 'Akademik' },
    
    { label: 'Kelola Pengguna', icon: Users, href: '/dashboard/admin/users', category: 'Administrasi' },
    { label: 'Kelola Siswa', icon: GraduationCap, href: '/dashboard/admin/students', category: 'Administrasi' },
    { label: 'Kelola PPDB', icon: ClipboardList, href: '/dashboard/admin/ppdb', category: 'Administrasi' },
    { label: 'Keuangan', icon: Wallet, href: '/dashboard/admin/billing', category: 'Administrasi' },
    { label: 'Verifikasi Izin', icon: UserCheck, href: '/dashboard/teacher/requests', category: 'Administrasi' },
    
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions', category: 'Layanan' },
    { label: 'Laporan', icon: FileBarChart, href: '/dashboard/admin/reports', category: 'Layanan' },
    
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  YAYASAN: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Laporan Akademik', icon: FileBarChart, href: '/dashboard/admin/reports', category: 'Layanan' },
    { label: 'Laporan Keuangan', icon: Wallet, href: '/dashboard/admin/billing', category: 'Layanan' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  LEADERSHIP: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Kelola Pengguna', icon: Users, href: '/dashboard/admin/users', category: 'Administrasi' },
    { label: 'Laporan Akademik', icon: FileBarChart, href: '/dashboard/admin/reports', category: 'Layanan' },
    { label: 'Laporan Keuangan', icon: Wallet, href: '/dashboard/admin/billing', category: 'Layanan' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  WAKASEK: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Kelola Siswa', icon: GraduationCap, href: '/dashboard/admin/students', category: 'Administrasi' },
    { label: 'Kelola Kelas', icon: School, href: '/dashboard/admin/classes', category: 'Akademik' },
    { label: 'Kelola Mapel', icon: BookOpen, href: '/dashboard/admin/subjects', category: 'Akademik' },
    { label: 'Ekskul', icon: Trophy, href: '/dashboard/admin/extracurriculars', category: 'Akademik' },
    { label: 'Jadwal', icon: Calendar, href: '/dashboard/admin/schedules', category: 'Akademik' },
    { label: 'Verifikasi Izin', icon: UserCheck, href: '/dashboard/teacher/requests', category: 'Administrasi' },
    { label: 'Portal Alumni', icon: GraduationCap, href: '/dashboard/alumni', category: 'Administrasi' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  FINANCE: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Keuangan & SPP', icon: Wallet, href: '/dashboard/admin/billing', category: 'Administrasi' },
    { label: 'Data Siswa', icon: GraduationCap, href: '/dashboard/admin/students', category: 'Administrasi' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  OPERATIONAL: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Kelola Pengguna', icon: Users, href: '/dashboard/admin/users', category: 'Administrasi' },
    { label: 'Kelola Siswa', icon: GraduationCap, href: '/dashboard/admin/students', category: 'Administrasi' },
    { label: 'Kelola Kelas', icon: School, href: '/dashboard/admin/classes', category: 'Akademik' },
    { label: 'Kelola Mapel', icon: BookOpen, href: '/dashboard/admin/subjects', category: 'Akademik' },
    { label: 'Jadwal', icon: Calendar, href: '/dashboard/admin/schedules', category: 'Akademik' },
    { label: 'Pengumuman', icon: Megaphone, href: '/dashboard/admin/announcements', category: 'Utama' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ],
  COACH: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard', category: 'Utama' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', category: 'Utama' },
    { label: 'Ekskul Saya', icon: Trophy, href: '/dashboard/ekskul-guru', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Forum Diskusi', icon: MessageSquare, href: '/dashboard/discussions', category: 'Layanan' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  USER: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard', category: 'Utama' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', category: 'Utama' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  PARENT: [
    { label: 'Beranda Anak', icon: LayoutDashboard, href: '/dashboard/parent', category: 'Utama' },
    { label: 'Notifikasi', icon: Bell, href: '/dashboard/notifications', category: 'Utama' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  PUSTAKAWAN: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/pustakawan', category: 'Utama' },
    { label: 'Sirkulasi Buku', icon: Library, href: '/dashboard/pustakawan', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  PETUGAS_UKS: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/uks', category: 'Utama' },
    { label: 'Rekam Medis', icon: HeartPulse, href: '/dashboard/uks', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  ALUMNI: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/alumni', category: 'Utama' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings', category: 'Sistem' },
  ],
  PANITIA_PPDB: [
    { label: 'Beranda', icon: LayoutDashboard, href: '/dashboard/admin', category: 'Utama' },
    { label: 'Pengumuman', icon: Megaphone, href: '/dashboard/admin/announcements', category: 'Utama' },
    { label: 'Kelola PPDB', icon: Users, href: '/dashboard/admin/ppdb', category: 'Administrasi' },
    { label: 'Jadwal Seleksi', icon: Calendar, href: '/dashboard/admin/schedules', category: 'Akademik' },
    { label: 'Kalender', icon: Calendar, href: '/dashboard/calendar', category: 'Akademik' },
    { label: 'Bantuan', icon: HelpCircle, href: '/dashboard/help', category: 'Sistem' },
    { label: 'Pengaturan', icon: Settings, href: '/dashboard/admin/settings', category: 'Sistem' },
  ]
}

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps = {}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const rawRole = (session?.user as any)?.role || 'USER'
  
  // Resolve sidebar menu based on role
  let roleKey: keyof typeof sidebarLinks = 'USER'
  if (rawRole === 'PUSTAKAWAN') roleKey = 'PUSTAKAWAN'
  else if (rawRole === 'PETUGAS_UKS') roleKey = 'PETUGAS_UKS'
  else if (RBAC.isAlumniLevel(rawRole)) roleKey = 'ALUMNI'
  else if (RBAC.isParentLevel(rawRole)) roleKey = 'PARENT'
  else if (rawRole === 'COACH') roleKey = 'COACH'
  else if (rawRole === 'WALI_KELAS' || rawRole === 'GURU_BK') roleKey = 'TEACHER'
  else if (rawRole === 'KETUA_YAYASAN' || rawRole === 'BENDAHARA_YAYASAN') roleKey = 'YAYASAN'
  else if (rawRole === 'KEPALA_SEKOLAH') roleKey = 'LEADERSHIP'
  else if (rawRole === 'WAKASEK_KURIKULUM' || rawRole === 'WAKASEK_KESISWAAN' || rawRole === 'WAKASEK_HUBIN') roleKey = 'WAKASEK'
  else if (rawRole === 'BENDAHARA_SEKOLAH') roleKey = 'FINANCE'
  else if (rawRole === 'PANITIA_PPDB') roleKey = 'PANITIA_PPDB'
  else if (rawRole === 'TATA_USAHA' || rawRole === 'KAPROG' || rawRole === 'KEPALA_LAB' || rawRole === 'STAF_SARPRAS') roleKey = 'OPERATIONAL'
  else if (RBAC.canAccessAdminDashboard(rawRole)) roleKey = 'ADMIN'
  else if (RBAC.isTeacherLevel(rawRole)) roleKey = 'TEACHER'
  else if (RBAC.isStudentLevel(rawRole)) roleKey = 'STUDENT'

  const links = sidebarLinks[roleKey] || sidebarLinks['USER']

  // Group links by categories
  const categoriesList: ('Utama' | 'Akademik' | 'Administrasi' | 'Layanan' | 'Sistem')[] = [
    'Utama',
    'Akademik',
    'Administrasi',
    'Layanan',
    'Sistem'
  ]

  // Accordion open states
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Utama: true,
    Akademik: true,
    Administrasi: false,
    Layanan: false,
    Sistem: false
  })

  // Auto-expand category that has active link
  useEffect(() => {
    const activeCategory = links.find(link => {
      return pathname === link.href || 
        (link.href !== '/dashboard' && link.href !== '/dashboard/admin' && pathname.startsWith(link.href + '/'))
    })?.category

    if (activeCategory) {
      setOpenCategories(prev => ({
        ...prev,
        [activeCategory]: true
      }))
    }
  }, [pathname, links])

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }))
  }

  return (
    <aside className={cn(
      "flex flex-col transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] h-full w-full select-none",
      isMobile 
        ? "bg-[var(--sidebar-bg)]/95 backdrop-blur-2xl" 
        : "fixed left-0 top-0 h-[100dvh] w-[256px] bg-[var(--sidebar-bg)]/90 backdrop-blur-2xl border-r border-slate-200/50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-50 hidden lg:flex"
    )}>
      {/* Logo Section */}
      <div className="px-5 py-5 flex items-center justify-between shrink-0 border-b border-[var(--border)] bg-[var(--sidebar-bg)]/80 backdrop-blur-md sticky top-0 z-10">
        <Link 
          href="/" 
          onClick={() => {
            if (isMobile) setTimeout(() => onClose?.(), 100)
          }} 
          className="flex items-center gap-2.5"
        >
          <Image
            src="/logo.svg"
            alt="Fokuspad Logo"
            width={130}
            height={32}
            className="h-8 w-auto dark:invert transition-transform hover:scale-105 duration-200"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Link>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-hide">
        {categoriesList.map((category) => {
          const categoryItems = links.filter(link => link.category === category)
          if (categoryItems.length === 0) return null

          const isOpen = openCategories[category]
          const hasActiveItem = categoryItems.some(link => {
            return pathname === link.href || 
              (link.href !== '/dashboard' && link.href !== '/dashboard/admin' && pathname.startsWith(link.href + '/'))
          })

          return (
            <div key={category} className="space-y-0.5">
              {/* Category Header (Clickable Accordion Trigger) */}
              <button
                onClick={() => toggleCategory(category)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                  hasActiveItem 
                    ? "text-[#5483B3] bg-[#5483B3]/5"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]"
                )}
              >
                <span>{category}</span>
                <ChevronRight 
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isOpen && "rotate-90 text-[#5483B3]"
                  )} 
                />
              </button>

              {/* Collapsible List Items */}
              <div className={cn(
                "grid transition-all duration-200 ease-in-out pl-1.5",
                isOpen ? "grid-rows-[1fr] opacity-100 py-1" : "grid-rows-[0fr] opacity-0 overflow-hidden pointer-events-none"
              )}>
                <div className="overflow-hidden space-y-0.5">
                  {categoryItems.map((link) => {
                    const isActive = pathname === link.href || 
                      (link.href !== '/dashboard' && link.href !== '/dashboard/admin' && pathname.startsWith(link.href + '/')) ||
                      (link.href === '/dashboard' && pathname === '/dashboard') ||
                      (link.href === '/dashboard/admin' && pathname === '/dashboard/admin')
                    
                    const Icon = link.icon

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => {
                          if (isMobile) setTimeout(() => onClose?.(), 100)
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 group relative text-xs font-medium",
                          isActive 
                            ? "bg-[#5483B3]/10 text-[#5483B3] font-semibold shadow-sm" 
                            : "text-[var(--muted-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#5483B3] rounded-r-full" />
                        )}
                        <Icon className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-[#5483B3]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                        )} />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* User Info & Footer */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--sidebar-bg)] p-3 space-y-2">
        {/* Sign Out Button (Keep clean and separate) */}
        <button
          onClick={() => {
            if (isMobile) {
              setTimeout(() => onClose?.(), 100)
            } else {
              onClose?.()
            }
            signOut({ callbackUrl: '/login' })
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform flex-shrink-0" />
          <span>Keluar</span>
        </button>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 px-2 py-1.5 bg-[var(--sidebar-hover)]/30 rounded-xl border border-[var(--border)]/50">
          <Avatar className="h-8 w-8 rounded-full ring-1 ring-[var(--border)]">
            <AvatarImage src={(session?.user as any)?.image} />
            <AvatarFallback className="bg-[#5483B3]/10 text-[#5483B3] font-semibold text-xs rounded-full">
              {session?.user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[var(--foreground)] truncate leading-tight">{session?.user?.name}</p>
            <p className="text-[10px] text-[var(--muted-foreground)] capitalize mt-0.5 leading-none">
              {(session?.user as any)?.role?.toLowerCase()?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
