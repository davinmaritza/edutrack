"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Wallet, CheckCircle, XCircle, Search, PlusCircle } from "lucide-react"

export function AdminBillingClient({ students, billings }: { students: any[], billings: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    studentId: "",
    title: "SPP Bulan ",
    description: "",
    amount: "500000",
    dueDate: ""
  })

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success("Tagihan berhasil dibuat")
        setOpen(false)
        router.refresh()
      } else {
        toast.error("Gagal membuat tagihan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })

      if (res.ok) {
        toast.success("Status pembayaran diperbarui")
        router.refresh()
      } else {
        toast.error("Gagal memverifikasi")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Manajemen Keuangan & SPP</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Kelola tagihan dan verifikasi pembayaran siswa.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white">
              <PlusCircle className="w-4 h-4 mr-2" /> Buat Tagihan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[var(--background)] dark:bg-slate-900 border-[var(--border)] shadow-xl z-50">
            <DialogHeader>
              <DialogTitle>Buat Tagihan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBill} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Pilih Siswa</Label>
                <Select value={formData.studentId} onValueChange={v => setFormData({...formData, studentId: v})}>
                  <SelectTrigger className="bg-[var(--background)] dark:bg-slate-800">
                    <SelectValue placeholder="Pilih siswa" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--background)] dark:bg-slate-800 border-[var(--border)] z-50">
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} - {s.class?.name || "Tanpa Kelas"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Judul Tagihan</Label>
                <Input className="bg-[var(--background)] dark:bg-slate-800" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Nominal (Rp)</Label>
                <Input className="bg-[var(--background)] dark:bg-slate-800" type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label>Jatuh Tempo</Label>
                <Input className="bg-[var(--background)] dark:bg-slate-800" type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>

              <Button type="submit" className="w-full bg-[#5483B3] hover:bg-[#3B6FA0]" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
        <CardHeader className="border-b border-[var(--border)] pb-4">
          <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#5483B3]" /> Daftar Tagihan Siswa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">Siswa</th>
                <th className="px-6 py-4 font-bold">Tagihan</th>
                <th className="px-6 py-4 font-bold">Jatuh Tempo</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {billings.map((bill) => (
                <tr key={bill.id} className="hover:bg-[var(--muted)]/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[var(--foreground)]">{bill.student.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{bill.student.class?.name || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--foreground)]">{bill.title}</p>
                    <p className="text-xs font-bold text-[#5483B3]">{formatRupiah(bill.amount)}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-[var(--muted-foreground)]">
                    {format(new Date(bill.dueDate), 'dd MMM yyyy', { locale: idLocale })}
                  </td>
                  <td className="px-6 py-4">
                    {bill.status === 'PAID' ? (
                      <Badge className="bg-green-100 text-green-700">Lunas</Badge>
                    ) : bill.status === 'PENDING' ? (
                      <Badge className="bg-yellow-100 text-yellow-700">Perlu Verifikasi</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">Belum Bayar</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {bill.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleVerify(bill.id, 'PAID')} title="Setujui Bukti">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVerify(bill.id, 'UNPAID')} title="Tolak Bukti">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {bill.status === 'PENDING' && bill.proofUrl && (
                      <a href={bill.proofUrl} target="_blank" rel="noreferrer" className="block mt-2 text-[10px] font-bold text-blue-600 hover:underline">
                        Lihat Bukti
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {billings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    Belum ada tagihan terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
