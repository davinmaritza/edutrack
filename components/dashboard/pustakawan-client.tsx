'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Search, 
  Plus, 
  Trash2, 
  Library,
  BookOpenCheck,
  AlertCircle,
  Save,
  Edit
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function PustakawanClient({ books: initialBooks, circulations: initialCirculations, students }: any) {
  const [books, setBooks] = useState(initialBooks)
  const [circulations, setCirculations] = useState(initialCirculations)
  
  // Tabs: 'katalog' or 'sirkulasi'
  const [activeTab, setActiveTab] = useState('katalog')
  const [search, setSearch] = useState('')

  // Modals
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const [isBorrowOpen, setIsBorrowOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Forms
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', stock: 1 })
  const [borrowForm, setBorrowForm] = useState({ bookId: '', studentId: '', days: 7 })

  const filteredBooks = books.filter((b: any) => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCirculations = circulations.filter((c: any) => 
    c.book.title.toLowerCase().includes(search.toLowerCase()) || 
    c.student.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/pustakawan/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm)
      })
      if (res.ok) {
        const newBook = await res.json()
        setBooks([newBook, ...books])
        toast.success('Buku berhasil ditambahkan ke katalog')
        setIsAddBookOpen(false)
        setBookForm({ title: '', author: '', isbn: '', stock: 1 })
      } else {
        toast.error('Gagal menambahkan buku')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Hapus buku ini dari katalog?')) return
    try {
      const res = await fetch(`/api/pustakawan/books?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBooks(books.filter((b: any) => b.id !== id))
        toast.success('Buku dihapus')
      } else {
        toast.error('Gagal menghapus buku. Pastikan tidak ada yang sedang meminjam.')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + borrowForm.days)

      const res = await fetch('/api/pustakawan/circulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: borrowForm.bookId,
          studentId: borrowForm.studentId,
          dueDate: dueDate.toISOString()
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        setCirculations([data.circulation, ...circulations])
        // Update book stock locally
        setBooks(books.map((b: any) => b.id === borrowForm.bookId ? { ...b, stock: b.stock - 1 } : b))
        
        toast.success('Peminjaman berhasil dicatat')
        setIsBorrowOpen(false)
        setBorrowForm({ bookId: '', studentId: '', days: 7 })
      } else {
        const err = await res.json()
        toast.error(err.error || 'Gagal mencatat peminjaman')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturn = async (id: string, bookId: string) => {
    if (!confirm('Tandai buku ini sudah dikembalikan?')) return
    try {
      const res = await fetch(`/api/pustakawan/circulations?id=${id}`, { method: 'PATCH' })
      if (res.ok) {
        setCirculations(circulations.map((c: any) => c.id === id ? { ...c, status: 'RETURNED', returnDate: new Date().toISOString() } : c))
        // Increment book stock
        setBooks(books.map((b: any) => b.id === bookId ? { ...b, stock: b.stock + 1 } : b))
        toast.success('Pengembalian berhasil dicatat')
      } else {
        toast.error('Gagal memproses pengembalian')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
            <Library className="h-4 w-4" />
            MODUL PUSTAKAWAN
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Manajemen Perpustakaan
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-3">
            Kelola katalog buku, sirkulasi peminjaman, dan inventaris perpustakaan digital.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#5483B3]/10 flex items-center justify-center">
              <Book className="h-6 w-6 text-[#5483B3]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--muted-foreground)]">Total Judul Buku</p>
              <h3 className="text-2xl font-extrabold text-[var(--foreground)]">{books.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <BookOpenCheck className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--muted-foreground)]">Sedang Dipinjam</p>
              <h3 className="text-2xl font-extrabold text-[var(--foreground)]">
                {circulations.filter((c: any) => c.status === 'BORROWED').length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--muted-foreground)]">Terlambat</p>
              <h3 className="text-2xl font-extrabold text-[var(--foreground)]">
                {circulations.filter((c: any) => c.status === 'OVERDUE' || (c.status === 'BORROWED' && new Date(c.dueDate) < new Date())).length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 border-b border-[var(--border)]">
        <button 
          onClick={() => setActiveTab('katalog')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'katalog' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
        >
          Katalog Buku
        </button>
        <button 
          onClick={() => setActiveTab('sirkulasi')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'sirkulasi' ? 'border-[#5483B3] text-[#5483B3]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
        >
          Sirkulasi Peminjaman
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input 
            placeholder={`Cari ${activeTab === 'katalog' ? 'judul buku/pengarang' : 'buku atau nama siswa'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11 bg-[var(--card)]"
          />
        </div>
        {activeTab === 'katalog' ? (
          <Button onClick={() => setIsAddBookOpen(true)} className="w-full md:w-auto h-11 rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] font-bold text-xs gap-2">
            <Plus className="h-4 w-4" /> Tambah Buku
          </Button>
        ) : (
          <Button onClick={() => setIsBorrowOpen(true)} className="w-full md:w-auto h-11 rounded-xl bg-[#5483B3] hover:bg-[#3B6FA0] font-bold text-xs gap-2">
            <Plus className="h-4 w-4" /> Catat Peminjaman
          </Button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'katalog' ? (
        <Card className="rounded-2xl border-[var(--border)] overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[var(--muted)]/50">
              <TableRow>
                <TableHead className="font-bold">Judul Buku</TableHead>
                <TableHead className="font-bold">Pengarang</TableHead>
                <TableHead className="font-bold">ISBN</TableHead>
                <TableHead className="font-bold">Stok Tersedia</TableHead>
                <TableHead className="text-right font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={5} className="text-center py-10 text-[var(--muted-foreground)] font-medium">Tidak ada buku ditemukan</TableCell>
                 </TableRow>
              ) : (
                filteredBooks.map((book: any) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-bold text-[var(--foreground)]">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={book.stock > 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                        {book.stock} {book.stock === 0 ? 'Habis' : 'Tersedia'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="rounded-2xl border-[var(--border)] overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[var(--muted)]/50">
              <TableRow>
                <TableHead className="font-bold">Peminjam</TableHead>
                <TableHead className="font-bold">Buku</TableHead>
                <TableHead className="font-bold">Tgl Pinjam</TableHead>
                <TableHead className="font-bold">Tenggat Waktu</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCirculations.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center py-10 text-[var(--muted-foreground)] font-medium">Belum ada data peminjaman</TableCell>
                 </TableRow>
              ) : 
                filteredCirculations.map((circ: any) => {
                  const isOverdue = circ.status === 'BORROWED' && new Date(circ.dueDate) < new Date()
                  return (
                  <TableRow key={circ.id}>
                    <TableCell>
                      <p className="font-bold text-[var(--foreground)] text-sm">{circ.student.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">NIS: {circ.student.nis || '-'}</p>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{circ.book.title}</TableCell>
                    <TableCell className="text-sm">{new Date(circ.borrowDate).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-sm">
                       <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                         {new Date(circ.dueDate).toLocaleDateString('id-ID')}
                       </span>
                    </TableCell>
                    <TableCell>
                      {circ.status === 'RETURNED' ? (
                        <Badge className="bg-green-500/10 text-green-500 border-none font-bold">Dikembalikan</Badge>
                      ) : isOverdue || circ.status === 'OVERDUE' ? (
                        <Badge className="bg-red-500/10 text-red-500 border-none font-bold">Terlambat</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-none font-bold">Dipinjam</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {circ.status === 'BORROWED' && (
                        <Button 
                          onClick={() => handleReturn(circ.id, circ.bookId)} 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg h-8 text-xs"
                        >
                          Tandai Kembali
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add Book Modal */}
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Tambah Katalog Buku</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBook} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Judul Buku</Label>
              <Input required value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="rounded-xl h-11" placeholder="Masukkan judul..." />
            </div>
            <div className="space-y-2">
              <Label>Pengarang</Label>
              <Input required value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} className="rounded-xl h-11" placeholder="Masukkan nama pengarang..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ISBN</Label>
                <Input value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} className="rounded-xl h-11" placeholder="Opsional" />
              </div>
              <div className="space-y-2">
                <Label>Stok Awal</Label>
                <Input required type="number" min="1" value={bookForm.stock} onChange={e => setBookForm({...bookForm, stock: Number(e.target.value)})} className="rounded-xl h-11" />
              </div>
            </div>
            <Button disabled={isSubmitting} className="w-full h-11 rounded-xl bg-[#5483B3] text-white font-bold hover:bg-[#3B6FA0]">
              Simpan Buku
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Borrow Modal */}
      <Dialog open={isBorrowOpen} onOpenChange={setIsBorrowOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Catat Peminjaman Buku</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBorrow} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Siswa Peminjam</Label>
              <Select value={borrowForm.studentId} onValueChange={v => setBorrowForm({...borrowForm, studentId: v})}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Pilih siswa..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.nis})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buku yang Dipinjam</Label>
              <Select value={borrowForm.bookId} onValueChange={v => setBorrowForm({...borrowForm, bookId: v})}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Pilih buku..." />
                </SelectTrigger>
                <SelectContent>
                  {books.filter((b: any) => b.stock > 0).map((b: any) => (
                    <SelectItem key={b.id} value={b.id}>{b.title} (Sisa: {b.stock})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lama Peminjaman (Hari)</Label>
              <Input required type="number" min="1" max="30" value={borrowForm.days} onChange={e => setBorrowForm({...borrowForm, days: Number(e.target.value)})} className="rounded-xl h-11" />
            </div>
            <Button disabled={isSubmitting || !borrowForm.bookId || !borrowForm.studentId} className="w-full h-11 rounded-xl bg-[#5483B3] text-white font-bold hover:bg-[#3B6FA0]">
              Proses Peminjaman
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
