'use client'

import { useEffect } from 'react'
import DatabaseOfflinePage from '@/components/database-offline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled system/rendering error:', error)
  }, [error])

  // Check if error is related to Prisma or database connection issues
  const isPrismaError = 
    error.message?.includes('Prisma') || 
    error.message?.includes('database') || 
    error.message?.includes('5432') ||
    error.message?.includes('Can\'t reach database server') ||
    error.stack?.includes('prisma') ||
    error.stack?.includes('PrismaClient') ||
    error.message?.includes('initialization')

  if (isPrismaError) {
    return <DatabaseOfflinePage />
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center p-6 text-center font-sans">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-md w-full space-y-5 text-center">
        <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-serif">Terjadi Kesalahan Sistem</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Aplikasi mendeteksi adanya kendala tidak terduga pada sistem. Silakan coba hubungkan kembali atau hubungi Administrator.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full h-11 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:shadow-lg"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
