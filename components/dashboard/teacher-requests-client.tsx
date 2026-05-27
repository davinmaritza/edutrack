"use client"

import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CalendarDays, CheckCircle, XCircle, Paperclip, ClipboardList } from "lucide-react"

export function TeacherRequestsClient({ requests }: { requests: any[] }) {
  const router = useRouter()

  const handleReview = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/teacher/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        toast.success(`Pengajuan berhasil di${status === 'APPROVED' ? 'setujui' : 'tolak'}`)
        router.refresh()
      } else {
        toast.error("Gagal memperbarui status pengajuan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Verifikasi Izin Siswa</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Setujui permohonan izin sakit atau absen dari orang tua. Jika disetujui, kehadiran otomatis diperbarui.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <Card key={req.id} className={`bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm ${req.status === 'PENDING' ? 'ring-2 ring-[#5483B3]/20' : ''}`}>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">{req.student.name}</h3>
                  <p className="text-[10px] text-[var(--muted-foreground)] font-bold">{req.student.class?.name || "Tanpa Kelas"}</p>
                </div>
                <Badge variant="outline" className={`border-none ${req.reason === 'SICK' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {req.reason === 'SICK' ? '🤒 Sakit' : '📄 Izin'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center text-xs text-[var(--foreground)] font-bold gap-2 bg-[var(--muted)]/50 p-2 rounded-md">
                <CalendarDays className="w-4 h-4 text-[#5483B3]" />
                {format(new Date(req.startDate), 'dd MMM yyyy', { locale: idLocale })} 
                {req.startDate !== req.endDate && ` - ${format(new Date(req.endDate), 'dd MMM yyyy', { locale: idLocale })}`}
              </div>
              
              <p className="text-sm text-[var(--foreground)] leading-relaxed italic">
                "{req.description}"
              </p>

              {req.attachmentUrl && (
                <a href={req.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline">
                  <Paperclip className="w-3 h-3 mr-1" /> Lihat Surat/Bukti
                </a>
              )}

              {req.status === 'PENDING' ? (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleReview(req.id, 'APPROVED')}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Setujui
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReview(req.id, 'REJECTED')}>
                    <XCircle className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  {req.status === 'APPROVED' ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[var(--muted-foreground)] bg-[var(--muted)]/20 rounded-2xl border border-dashed border-[var(--border)]">
            <ClipboardList className="w-12 h-12 mx-auto text-[var(--muted-foreground)] opacity-50 mb-3" />
            Belum ada permohonan izin dari siswa.
          </div>
        )}
      </div>
    </div>
  )
}
