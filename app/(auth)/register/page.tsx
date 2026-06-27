'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, User, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Laki-laki',
  })

  useEffect(() => {
    fetch('/api/auth/register')
      .then(res => res.json())
      .then(data => {
        if (data?.disableRegistration) {
          setIsRegistrationDisabled(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!captchaToken) {
      toast.error('Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captcha: captchaToken
        })
      })

      if (res.ok) {
        toast.success('Pendaftaran berhasil! Silakan login.')
        router.push('/login')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal mendaftar. Email mungkin sudah digunakan.')
        setCaptchaToken('')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistrationDisabled) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen bg-[#FDFCF7] overflow-hidden"
      >
        {/* Left side - App Mockup/Branding */}
        <motion.div 
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex lg:w-1/2 bg-[#1E293B] relative overflow-hidden flex-col justify-between p-12 text-white"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          
          <Link href="/" className="relative z-10 block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-8 w-auto" fill="none">
              <text x="0" y="40" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="800" letterSpacing="-2" fill="#F1F5F9">
                Edu<tspan fontWeight="800" fill="#5483B3">track</tspan>
              </text>
            </svg>
          </Link>
  
          <div className="relative z-10 space-y-4">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] font-serif">
              Mulai Perjalanan<br />
              Belajar Anda.
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-sm leading-relaxed">
              Bergabunglah dengan ekosistem pendidikan digital terlengkap. Pantau progres, kelola tugas, dan tingkatkan performa akademik.
            </p>
          </div>
  
          <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Keamanan Data Terjamin</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </motion.div>
  
        {/* Right side - Disabled Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFCF7]">
          <motion.div 
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md text-center space-y-6 bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-3xl shadow-sm"
          >
            <div className="inline-flex h-16 w-16 bg-rose-100 text-rose-600 rounded-full items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] font-serif">Pendaftaran Ditutup</h2>
            <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
              Pendaftaran akun baru saat ini sedang dinonaktifkan oleh administrator sistem.
              Silakan hubungi administrator sekolah Anda untuk mendapatkan akun akses.
            </p>
            <Button asChild className="w-full h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1E293B]/20 active:scale-[0.98] text-xs">
              <Link href="/login">Kembali ke Halaman Login</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-[#FDFCF7] overflow-hidden"
    >
      {/* Left side - Premium Branding Panel */}
      <motion.div 
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-14 text-white"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[#0F172A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5483B3]/30 via-[#1E293B]/80 to-[#0F172A] mix-blend-screen" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#93C5FD]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        
        <Link href="/" className="relative z-10 block transition-transform hover:scale-[1.02] active:scale-95 duration-300 w-max">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-9 w-auto" fill="none">
            <text x="0" y="40" fontFamily="'Geist', 'Inter', system-ui, sans-serif" fontSize="42" fontWeight="800" letterSpacing="-2" fill="#F1F5F9">
              Edu<tspan fontWeight="800" fill="#5483B3">track</tspan>
            </text>
          </svg>
        </Link>

        <div className="relative z-10 space-y-10">
          <div className="space-y-6">
            <h1 className="text-[3.5rem] leading-[1.05] font-bold tracking-tight font-serif text-white/95">
              Mulai Perjalanan<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Belajar Anda.</span>
            </h1>
            <p className="text-base text-slate-300 font-medium max-w-sm leading-relaxed opacity-90">
              Bergabunglah dengan ekosistem pendidikan digital terlengkap. Pantau progres, kelola tugas, dan tingkatkan performa akademik dalam satu platform.
            </p>
          </div>
          
          <div className="flex bg-white/5 border border-white/10 p-6 rounded-3xl gap-10 inline-flex backdrop-blur-md shadow-2xl shadow-black/20">
            <div className="space-y-1.5">
              <div className="text-3xl font-extrabold font-serif text-white/95">10K+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#93C5FD]">Siswa Aktif</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="space-y-1.5">
              <div className="text-3xl font-extrabold font-serif text-white/95">500+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#93C5FD]">Guru Bergabung</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <span className="text-slate-400">Keamanan Data Terjamin</span>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-500/50 to-transparent" />
        </div>
      </motion.div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] space-y-8"
        >
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">Buat Akun Baru</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Lengkapi data di bawah ini untuk bergabung dengan EduTrack.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[12px] font-bold text-slate-700">Nama Lengkap</Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#5483B3] transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-11 h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[12px] font-bold text-slate-700">Alamat Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#5483B3] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@sekolah.sch.id"
                  className="pl-11 h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[12px] font-bold text-slate-700">Kata Sandi</Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#5483B3] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="pl-11 pr-11 h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[12px] font-bold text-slate-700">Jenis Kelamin</Label>
              <select
                id="gender"
                className="w-full h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm px-3 text-[#0F172A] outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Turnstile Captcha Box */}
            <div className="flex justify-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <Turnstile 
                siteKey="0x4AAAAAADX4nRxaGOi9LSGI" 
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => {
                  toast.error('Gagal memuat sistem CAPTCHA Cloudflare')
                  setCaptchaToken('')
                }}
                onExpire={() => {
                  toast.error('Sesi CAPTCHA kedaluwarsa, silakan verifikasi kembali')
                  setCaptchaToken('')
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0F172A]/20 active:scale-[0.98] group text-[13px] gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400">Atau</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-[13px]"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.92-2.76 3.51-4.51 6.76-4.51z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.91 3.43-8.61z" />
                <path fill="#FBBC05" d="M5.24 14.55c-.24-.72-.38-1.49-.38-2.29c0-.8.14-1.57.38-2.29L1.39 6.98C.5 8.79 0 10.83 0 13s.5 4.21 1.39 6.02l3.85-3.47z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1c-3.25 0-5.84-1.75-6.76-4.51L1.39 17.3C3.37 21.19 7.35 23 12 23z" />
              </svg>
              Daftar dengan Google
            </Button>

            <p className="text-center text-[12px] font-semibold text-slate-500 mt-8">
              Sudah punya akun? <Link href="/login" className="font-bold text-[#0F172A] hover:text-[#5483B3] transition-colors hover:underline underline-offset-2">Masuk sekarang</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
