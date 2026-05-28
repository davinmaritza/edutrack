'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, User, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function RegisterPpdbPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistrationDisabled, setIsRegistrationDisabled] = useState(false)
  const [captchaQuestion, setCaptchaQuestion] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Laki-laki',
  })

  const loadCaptcha = async () => {
    try {
      const res = await fetch('/api/auth/captcha')
      if (res.ok) {
        const data = await res.json()
        setCaptchaQuestion(data.question)
      }
    } catch (err) {
      console.error("Failed to load captcha", err)
    }
  }

  useEffect(() => {
    // Check if PPDB registration is closed
    fetch('/api/auth/register')
      .then(res => res.json())
      .then(data => {
        if (data?.disableRegistration) {
          setIsRegistrationDisabled(true)
        }
      })
      .catch(() => {})

    loadCaptcha()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captcha: captchaAnswer
        })
      })

      if (res.ok) {
        toast.success('Registrasi akun PPDB berhasil! Silakan login untuk melengkapi berkas.')
        router.push('/login')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal registrasi. Silakan periksa kembali jawaban CAPTCHA Anda.')
        loadCaptcha()
        setCaptchaAnswer('')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistrationDisabled) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-[#FDFCF7]">
        <div className="w-full max-w-md text-center space-y-6 bg-white border border-[#E2E8F0] p-10 rounded-3xl shadow-sm">
          <div className="inline-flex h-16 w-16 bg-rose-100 text-rose-600 rounded-full items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] font-serif">Pendaftaran PPDB Ditutup</h2>
          <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
            Pendaftaran peserta didik baru (PPDB) saat ini sedang dinonaktifkan oleh administrator sistem. Silakan hubungi sekretariat sekolah untuk info lebih lanjut.
          </p>
          <Button asChild className="w-full h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl text-xs">
            <Link href="/login">Kembali ke Halaman Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FDFCF7] overflow-hidden">
      {/* Left Branding Screen */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E293B] relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-10 mix-blend-overlay" />
        <Link href="/" className="relative z-10 block text-3xl font-extrabold tracking-tight">
          Edu<span className="text-[#5483B3]">track</span> PPDB
        </Link>

        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-bold leading-[1.2] font-serif">
            Portal Penerimaan<br />Siswa Baru.
          </h1>
          <p className="text-sm text-slate-300 font-medium max-w-md leading-relaxed">
            Buat akun pendaftaran Anda hari ini untuk memulai pengisian berkas persyaratan, verifikasi administrasi, dan seleksi online.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Sistem Keamanan Registrasi Aktif</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* Right Form Screen */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFCF7]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-3xl shadow-sm"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] font-serif">Registrasi Akun PPDB</h2>
            <p className="text-xs text-[#64748B] font-semibold">Buat akun untuk mengisi berkas & administrasi calon siswa baru.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-[#0F172A]">Nama Lengkap Calon Siswa</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama sesuai akta kelahiran"
                  className="pl-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-xs focus:bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-[#0F172A]">Alamat Email Aktif</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email.aktif@gmail.com"
                  className="pl-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-xs focus:bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-[#0F172A]">Password Akun</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="pl-11 pr-11 h-11 bg-[#F8FAFC] border-[#E2E8F0] rounded-xl text-xs focus:bg-white"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-xs font-bold text-[#0F172A]">Jenis Kelamin</Label>
              <select
                id="gender"
                className="w-full h-11 bg-[#F8FAFC] border-[#E2E8F0] border rounded-xl text-xs px-3 text-[#0F172A] outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Captcha Box */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="captcha" className="text-xs font-bold text-[#0F172A]">Verifikasi Spam (CAPTCHA)</Label>
                <button 
                  type="button" 
                  onClick={loadCaptcha}
                  className="text-[#5483B3] hover:text-[#1E293B] transition-colors p-1"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-sm font-extrabold text-[#1E293B] bg-white border border-[#CBD5E1] px-4 py-2 rounded-xl shadow-xs tracking-wider select-none">
                  {captchaQuestion || 'Loading...'}
                </span>
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Jawaban"
                  className="h-11 bg-white border-[#E2E8F0] rounded-xl text-center font-bold text-xs"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-4 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1E293B]/20 active:scale-[0.98] group text-xs gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Daftar PPDB Sekarang
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-[11px] font-semibold text-[#64748B] mt-6">
              Sudah punya akun PPDB? <Link href="/login" className="font-bold text-[#1E293B] hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
