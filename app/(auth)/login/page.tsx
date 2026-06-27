'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginMaintenance, setIsLoginMaintenance] = useState(false)
  const [loginType, setLoginType] = useState<'user' | 'parent'>('user')

  useEffect(() => {
    if (error === 'AccessDenied' || error === 'Callback') {
      toast.error('Akses ditutup: Halaman login sedang dalam pemeliharaan')
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.loginMaintenance) {
          setIsLoginMaintenance(true)
        }
      })
      .catch(() => {})
  }, [error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes("pemeliharaan") || result.error.includes("Maintenance")) {
          toast.error('Akses ditutup: Halaman login sedang dalam pemeliharaan')
        } else {
          toast.error(loginType === 'parent' ? 'NIS Siswa atau PIN salah' : 'Email atau password salah')
        }
      } else {
        toast.success('Login berhasil! Mengalihkan...')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
    }
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
              Platform Edukasi<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Digital Terpadu.</span>
            </h1>
            <p className="text-base text-slate-300 font-medium max-w-sm leading-relaxed opacity-90">
              Monitoring progres belajar secara real-time, analisis performa otomatis, dan ekosistem pendidikan yang transparan dalam satu tempat.
            </p>
          </div>
          
          <div className="flex bg-white/5 border border-white/10 p-6 rounded-3xl gap-10 inline-flex backdrop-blur-md shadow-2xl shadow-black/20">
            <div className="space-y-1.5">
              <div className="text-3xl font-extrabold font-serif text-white/95">10K+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#93C5FD]">Siswa Aktif</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="space-y-1.5">
              <div className="text-3xl font-extrabold font-serif text-white/95">99%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#93C5FD]">Kepuasan</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <span className="text-slate-400">Dikembangkan oleh Davin Maritza</span>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-500/50 to-transparent" />
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] space-y-8"
        >
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#0F172A] font-serif leading-tight">Selamat Datang</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">Masuk ke akun EduTrack Anda untuk melanjutkan aktivitas akademik.</p>
          </div>

          <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 shadow-inner">
            <button 
              type="button"
              onClick={() => { setLoginType('user'); setEmail(''); setPassword(''); }}
              className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all duration-300 ${loginType === 'user' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Akun Sekolah
            </button>
            <button 
              type="button"
              onClick={() => { setLoginType('parent'); setEmail(''); setPassword(''); }}
              className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all duration-300 ${loginType === 'parent' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Wali Murid
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isLoginMaintenance && (
              <div className="p-4 bg-amber-50/50 border border-amber-200/50 text-amber-700 rounded-2xl text-[12px] font-semibold flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="leading-relaxed">
                  Halaman login sedang dalam pemeliharaan. Hanya Administrator yang diperkenankan masuk.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[12px] font-bold text-slate-700">
                  {loginType === 'parent' ? "NIS Siswa (Nomor Induk)" : "Alamat Email"}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#5483B3] transition-colors" />
                  <Input
                    id="email"
                    type={loginType === 'parent' ? "text" : "email"}
                    placeholder={loginType === 'parent' ? "Contoh: 12209432" : "nama@sekolah.sch.id"}
                    className="pl-11 h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[12px] font-bold text-slate-700">
                    {loginType === 'parent' ? "PIN Orang Tua" : "Kata Sandi"}
                  </Label>
                  {loginType !== 'parent' && (
                    <Link href="#" className="text-[10px] font-bold uppercase tracking-wider text-[#5483B3] hover:text-[#3B6FA0] transition-colors">Lupa Sandi?</Link>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#5483B3] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={loginType === 'parent' ? "PIN 6 digit" : "••••••••"}
                    className="pl-11 pr-11 h-12 bg-white border-slate-200 focus:bg-white focus:border-[#5483B3] focus:ring-4 focus:ring-[#5483B3]/10 rounded-xl transition-all text-[13px] font-medium shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
            </div>

            <div className="flex items-center space-x-2.5">
              <Checkbox id="remember" className="h-4 w-4 rounded-[4px] border-slate-300 data-[state=checked]:bg-[#0F172A] data-[state=checked]:border-[#0F172A]" />
              <label htmlFor="remember" className="text-[12px] font-semibold text-slate-500 cursor-pointer select-none">Ingat saya untuk 30 hari</label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0F172A]/20 active:scale-[0.98] group text-[13px] gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Masuk Sekarang
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
              onClick={() => signIn('google')}
              className="w-full h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-[13px]"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Masuk dengan Google
            </Button>

            <div className="relative my-6 pt-2">
              <div className="absolute inset-0 flex items-center pt-2">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest pt-2">
                <span className="bg-white px-4 text-slate-400">Jelajahi Demo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button type="button" variant="outline" className="h-10 text-[10px] font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-all" onClick={() => { setLoginType('user'); setEmail('admin@demo.com'); setPassword('password123'); }}>Admin</Button>
              <Button type="button" variant="outline" className="h-10 text-[10px] font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-all" onClick={() => { setLoginType('user'); setEmail('guru@demo.com'); setPassword('password123'); }}>Guru</Button>
              <Button type="button" variant="outline" className="h-10 text-[10px] font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-all md:col-span-1 col-span-2" onClick={() => { setLoginType('user'); setEmail('pelatih@demo.com'); setPassword('password123'); }}>Pelatih</Button>
              <Button type="button" variant="outline" className="h-10 text-[10px] font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-all" onClick={() => { setLoginType('user'); setEmail('siswa@demo.com'); setPassword('password123'); }}>Siswa</Button>
              <Button type="button" variant="outline" className="h-10 text-[10px] font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-all" onClick={() => { setLoginType('parent'); setEmail('12345678'); setPassword('123456'); }}>Wali</Button>
            </div>

            <p className="text-center text-[12px] font-semibold text-slate-500 mt-8">
              Belum punya akun? <Link href="/register" className="font-bold text-[#0F172A] hover:text-[#5483B3] transition-colors hover:underline underline-offset-2">Daftar sekarang</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
