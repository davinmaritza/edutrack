'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  PartyPopper, 
  Flag, 
  FileText, 
  Plus, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileCode,
  Edit2,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format, isSameDay, parseISO } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { BlockEditor } from './block-editor'
import { toast } from 'sonner'

// Hari Libur Nasional Indonesia 2026
const INDONESIAN_HOLIDAYS_2026 = [
  { date: '2026-01-01', title: 'Tahun Baru Masehi', type: 'holiday' },
  { date: '2026-01-29', title: 'Tahun Baru Imlek 2577', type: 'holiday' },
  { date: '2026-02-17', title: "Isra' Mi'raj Nabi Muhammad SAW", type: 'holiday' },
  { date: '2026-03-20', title: 'Hari Raya Nyepi (Tahun Baru Saka 1948)', type: 'holiday' },
  { date: '2026-03-20', title: 'Hari Suci Nyepi', type: 'holiday' },
  { date: '2026-04-03', title: 'Wafat Isa Al Masih (Jumat Agung)', type: 'holiday' },
  { date: '2026-05-01', title: 'Hari Buruh Internasional', type: 'holiday' },
  { date: '2026-05-14', title: 'Kenaikan Isa Al Masih', type: 'holiday' },
  { date: '2026-05-16', title: 'Hari Raya Waisak 2570', type: 'holiday' },
  { date: '2026-06-01', title: 'Hari Lahir Pancasila', type: 'holiday' },
  { date: '2026-06-17', title: 'Hari Raya Idul Adha 1447 H', type: 'holiday' },
  { date: '2026-07-07', title: 'Tahun Baru Islam 1448 H', type: 'holiday' },
  { date: '2026-08-17', title: 'Hari Kemerdekaan Republik Indonesia', type: 'holiday' },
  { date: '2026-09-15', title: 'Maulid Nabi Muhammad SAW', type: 'holiday' },
  { date: '2026-12-25', title: 'Hari Raya Natal', type: 'holiday' },
  { date: '2026-01-02', title: 'Cuti Bersama Tahun Baru', type: 'cuti' },
  { date: '2026-03-21', title: 'Cuti Bersama Nyepi', type: 'cuti' },
  { date: '2026-12-24', title: 'Cuti Bersama Natal', type: 'cuti' },
  { date: '2026-12-26', title: 'Cuti Bersama Natal', type: 'cuti' },
  { date: '2026-12-31', title: 'Cuti Bersama Tahun Baru', type: 'cuti' },
]

// Hari Libur Nasional Indonesia 2025
const INDONESIAN_HOLIDAYS_2025 = [
  { date: '2025-01-01', title: 'Tahun Baru Masehi', type: 'holiday' },
  { date: '2025-01-27', title: "Isra' Mi'raj Nabi Muhammad SAW", type: 'holiday' },
  { date: '2025-01-29', title: 'Tahun Baru Imlek 2576', type: 'holiday' },
  { date: '2025-03-29', title: 'Hari Raya Nyepi', type: 'holiday' },
  { date: '2025-03-30', title: 'Hari Raya Idul Fitri 1446 H (Hari 1)', type: 'holiday' },
  { date: '2025-03-31', title: 'Hari Raya Idul Fitri 1446 H (Hari 2)', type: 'holiday' },
  { date: '2025-04-18', title: 'Wafat Isa Al Masih', type: 'holiday' },
  { date: '2025-05-01', title: 'Hari Buruh Internasional', type: 'holiday' },
  { date: '2025-05-12', title: 'Hari Raya Waisak 2569', type: 'holiday' },
  { date: '2025-05-29', title: 'Kenaikan Isa Al Masih', type: 'holiday' },
  { date: '2025-06-01', title: 'Hari Lahir Pancasila', type: 'holiday' },
  { date: '2025-06-06', title: 'Hari Raya Idul Adha 1446 H', type: 'holiday' },
  { date: '2025-06-27', title: 'Tahun Baru Islam 1447 H', type: 'holiday' },
  { date: '2025-08-17', title: 'Hari Kemerdekaan RI', type: 'holiday' },
  { date: '2025-09-05', title: 'Maulid Nabi Muhammad SAW', type: 'holiday' },
  { date: '2025-12-25', title: 'Hari Raya Natal', type: 'holiday' },
]

function getHolidaysForYear(year: number) {
  if (year === 2026) return INDONESIAN_HOLIDAYS_2026
  if (year === 2025) return INDONESIAN_HOLIDAYS_2025
  return []
}

export function CalendarClient() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'schedule' | 'notes'>('schedule')

  // Document Editor states
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editorSaveStatus, setEditorSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [expandedDocIds, setExpandedDocIds] = useState<{ [key: string]: boolean }>({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [docToDelete, setDocToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
    fetchDocuments()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents')
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error("Failed to fetch documents")
    }
  }

  // Get holidays for the current visible year
  const holidays = useMemo(() => {
    const year = currentMonth.getFullYear()
    return getHolidaysForYear(year)
  }, [currentMonth])

  // Combine events + holidays for the selected date
  const selectedDateEvents = useMemo(() => {
    if (!date) return []
    const apiEvents = events.filter(e => isSameDay(parseISO(e.date), date)).map(e => ({ ...e, eventType: 'assignment' }))
    const holidayEvents = holidays.filter(h => isSameDay(parseISO(h.date), date)).map((h, i) => ({ 
      id: `holiday-${i}`, 
      title: h.title, 
      date: h.date, 
      eventType: h.type 
    }))
    return [...holidayEvents, ...apiEvents]
  }, [date, events, holidays])

  // Filter documents/notes associated with the selected date (root docs only)
  const selectedDateDocs = useMemo(() => {
    if (!date) return []
    return documents.filter(doc => doc.date && isSameDay(parseISO(doc.date), date) && !doc.parentId)
  }, [date, documents])

  // Check if a date has any event/holiday/note
  const hasEvent = (d: Date) => events.some(e => isSameDay(parseISO(e.date), d))
  const hasNote = (d: Date) => documents.some(doc => doc.date && isSameDay(parseISO(doc.date), d))
  const isHoliday = (d: Date) => holidays.some(h => h.type === 'holiday' && isSameDay(parseISO(h.date), d))
  const isCuti = (d: Date) => holidays.some(h => h.type === 'cuti' && isSameDay(parseISO(h.date), d))

  // Create a new note document for the selected date
  const handleAddNote = async (parentId?: string) => {
    if (!date) return
    const loadingToast = toast.loading('Membuat catatan baru...')
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Catatan Baru',
          parentId: parentId || null,
          date: parentId ? null : date.toISOString(), // associate date only with root docs
          position: documents.length
        })
      })

      if (res.ok) {
        const newDoc = await res.json()
        toast.success('Catatan berhasil dibuat', { id: loadingToast })
        await fetchDocuments()
        
        // Open the newly created note in editor
        setSelectedDoc(newDoc)
        setIsEditorOpen(true)
      } else {
        toast.error('Gagal membuat catatan', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi', { id: loadingToast })
    }
  }

  const triggerDeleteDoc = (docId: string) => {
    setDocToDelete(docId)
    setDeleteConfirmOpen(true)
  }

  // Delete a document note
  const handleDeleteDoc = async () => {
    if (!docToDelete) return
    const docId = docToDelete
    setDeleteConfirmOpen(false)
    setDocToDelete(null)
    const loadingToast = toast.loading('Menghapus catatan...')
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Catatan berhasil dihapus', { id: loadingToast })
        await fetchDocuments()
        if (selectedDoc?.id === docId) {
          setIsEditorOpen(false)
          setSelectedDoc(null)
        }
      } else {
        toast.error('Gagal menghapus catatan', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi', { id: loadingToast })
    }
  }

  // Move document position (ordering)
  const handleMoveDoc = async (docId: string, direction: 'up' | 'down') => {
    const list = documents.filter(d => d.parentId === selectedDoc?.parentId)
    const index = list.findIndex(d => d.id === docId)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === list.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const targetDoc = list[targetIndex]

    try {
      // Swap positions in database
      await fetch(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: targetDoc.position })
      })
      await fetch(`/api/documents/${targetDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: list[index].position })
      })
      
      await fetchDocuments()
    } catch (e) {
      toast.error('Gagal mengubah urutan')
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedDocIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Document Tree recursive renderer
  const renderDocTree = (parentId: string | null = null, depth = 0) => {
    const filtered = documents
      .filter(doc => doc.parentId === parentId && (!parentId ? (doc.date && isSameDay(parseISO(doc.date), date || new Date())) : true))
      .sort((a, b) => a.position - b.position)

    if (filtered.length === 0 && depth > 0) return null

    return (
      <div className="space-y-1.5 mt-1">
        {filtered.map(doc => {
          const isExpanded = expandedDocIds[doc.id]
          const subPages = documents.filter(d => d.parentId === doc.id)
          const hasChildren = subPages.length > 0

          return (
            <div key={doc.id} className="space-y-1">
              <div 
                className={`flex items-center justify-between group rounded-xl p-2.5 transition-all text-sm font-medium ${
                  selectedDoc?.id === doc.id 
                    ? 'bg-[#5483B3]/15 text-[#5483B3] border-l-4 border-[#5483B3]' 
                    : 'hover:bg-[var(--muted)] text-[var(--foreground)] border-l-4 border-transparent'
                }`}
                style={{ paddingLeft: `${Math.max(10, depth * 15)}px` }}
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0" 
                  onClick={() => {
                    setSelectedDoc(doc)
                    setIsEditorOpen(true)
                  }}
                >
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(doc.id)
                    }}
                    className="p-0.5 hover:bg-[var(--border)] rounded text-[var(--muted-foreground)]"
                  >
                    {hasChildren ? (
                      isExpanded ? <ChevronDown className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />
                    ) : (
                      <FileText className="h-4.5 w-4.5 opacity-60" />
                    )}
                  </button>
                  <span className="truncate">{doc.title}</span>
                </div>

                {/* Hover actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleAddNote(doc.id)}
                    className="p-1 hover:bg-[var(--muted)] hover:text-[#5483B3] rounded"
                    title="Tambah Sub-halaman"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDoc(doc.id, 'up')}
                    className="p-1 hover:bg-[var(--muted)] text-[var(--muted-foreground)] rounded"
                    title="Pindahkan ke atas"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDoc(doc.id, 'down')}
                    className="p-1 hover:bg-[var(--muted)] text-[var(--muted-foreground)] rounded"
                    title="Pindahkan ke bawah"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerDeleteDoc(doc.id)}
                    className="p-1 hover:bg-[var(--muted)] text-red-500 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {isExpanded && renderDocTree(doc.id, depth + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">
          Academic Planner
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Kalender Akademik</h1>
        <p className="text-sm font-medium text-[var(--muted-foreground)] mt-2">Pantau jadwal, tugas, cuti, serta buat catatan khusus agenda kegiatan Anda.</p>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <div className="h-3 w-3 rounded-full border-2 border-[#5483B3]" />
            <span>Tugas / Jadwal</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Hari Libur Nasional</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span>Cuti Bersama</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Catatan Kegiatan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Calendar view */}
        <div className="lg:col-span-7">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden h-full">
            <CardContent className="p-6 md:p-10 flex justify-center h-full items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full h-full [&_.rdp-cell]:h-16 md:[&_.rdp-cell]:h-24 [&_.rdp-button]:w-full [&_.rdp-button]:h-full [&_.rdp-button]:rounded-xl [&_.rdp-button:hover]:bg-[#5483B3]/10 [&_.rdp-button[aria-selected='true']]:bg-[#5483B3] [&_.rdp-button[aria-selected='true']]:text-white transition-all [&_.rdp-head_th]:font-bold [&_.rdp-head_th]:text-[#5483B3] [&_.rdp-month]:w-full"
                modifiers={{
                  hasEvent: (d) => hasEvent(d),
                  hasNote: (d) => hasNote(d),
                  holiday: (d) => isHoliday(d),
                  cuti: (d) => isCuti(d),
                }}
                modifiersStyles={{
                  hasEvent: { fontWeight: 'bold', border: '2.5px solid #5483B3' },
                  hasNote: { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderBottom: '3px solid #22c55e' },
                  holiday: { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontWeight: '800' },
                  cuti: { backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', fontWeight: '700' },
                  today: { border: '2.5px solid #3B6FA0', color: '#3B6FA0', fontWeight: '900', backgroundColor: 'rgba(84, 131, 179, 0.1)' }
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right: Notes and schedules manager */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-[var(--border)] bg-[var(--muted)]/30 p-6">
              <CardTitle className="text-lg font-extrabold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#5483B3]" />
                  <span>Jadwal & Agenda</span>
                </div>
                <div className="flex bg-[var(--muted)] p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'schedule' 
                        ? 'bg-[#5483B3] text-white shadow-sm' 
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Jadwal
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'notes' 
                        ? 'bg-[#5483B3] text-white shadow-sm' 
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Catatan Kegiatan ({selectedDateDocs.length})
                  </button>
                </div>
              </CardTitle>
              <CardDescription className="text-xs font-bold text-[#5483B3] uppercase tracking-wider mt-1.5">
                {date ? format(date, 'EEEE, dd MMMM yyyy', { locale: idLocale }) : 'Pilih Tanggal'}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 flex-1 overflow-y-auto min-h-[350px]">
              {activeTab === 'schedule' ? (
                /* Tab 1: Schedules list */
                loading ? (
                   <div className="p-8 text-center text-[var(--muted-foreground)] text-sm">Memuat jadwal...</div>
                ) : selectedDateEvents.length === 0 ? (
                   <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                     <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                       <Clock className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
                     </div>
                     <p className="text-sm font-bold text-[var(--foreground)] mb-1">Tidak ada jadwal</p>
                     <p className="text-xs font-medium text-[var(--muted-foreground)]">Hari ini bebas dari tenggat waktu tugas maupun acara.</p>
                   </div>
                ) : (
                   <div className="space-y-3">
                     {selectedDateEvents.map(event => {
                       const isHol = event.eventType === 'holiday'
                       const isCut = event.eventType === 'cuti'
                       const isAssignment = event.eventType === 'assignment'
                       
                       return (
                         <div key={event.id} className="p-4 border border-[var(--border)] rounded-2xl bg-[var(--background)] hover:shadow-md hover:shadow-[#5483B3]/5 transition-all group">
                           <div className="flex items-start gap-4">
                             <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                               isHol ? 'bg-red-100 dark:bg-red-500/20' : 
                               isCut ? 'bg-amber-100 dark:bg-amber-500/20' : 
                               'bg-blue-100 dark:bg-[#5483B3]/20'
                             }`}>
                               {isHol ? (
                                 <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                               ) : isCut ? (
                                 <PartyPopper className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                               ) : (
                                 <AlertCircle className="h-5 w-5 text-[#5483B3]" />
                               )}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className={`font-bold text-sm leading-tight mb-1 ${
                                 isHol ? 'text-red-700 dark:text-red-400' : 
                                 isCut ? 'text-amber-700 dark:text-amber-400' : 
                                 'text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors'
                               }`}>
                                 {event.title}
                               </p>
                               <div className="flex items-center gap-2">
                                 {isHol && (
                                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                                     Libur Nasional
                                   </span>
                                 )}
                                 {isCut && (
                                   <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                                     Cuti Bersama
                                   </span>
                                 )}
                                 {isAssignment && (
                                   <p className="text-xs font-medium text-[var(--muted-foreground)]">
                                     Tenggat: {format(parseISO(event.date), 'HH:mm')} WIB
                                   </p>
                                 )}
                                </div>
                             </div>
                           </div>
                         </div>
                       )
                     })}
                   </div>
                )
              ) : (
                /* Tab 2: Notion style Documents tree list */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Struktur Dokumen Kegiatan</span>
                    <Button 
                      onClick={() => handleAddNote()}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs h-8 flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Catatan
                    </Button>
                  </div>

                  {selectedDateDocs.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--background)]/50 mt-2">
                      <FileText className="h-8 w-8 mx-auto text-[var(--muted-foreground)] opacity-40 mb-3" />
                      <p className="text-xs font-bold text-[var(--foreground)] mb-0.5">Belum ada catatan kegiatan</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">Klik tombol di atas untuk membuat catatan kegiatan.</p>
                    </div>
                  ) : (
                    <div className="border border-[var(--border)] rounded-2xl bg-[var(--background)] p-3">
                      {renderDocTree(null)}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block Editor Dialog popup */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">Editor Catatan Kegiatan</DialogTitle>
          <DialogDescription className="sr-only">Kelola catatan dan sub-halaman kegiatan di sini</DialogDescription>
          <div className="flex h-full">
            {/* Left dialog column: Sidebar pages tree navigation */}
            <div className="w-64 border-r border-[var(--border)] bg-[var(--muted)]/20 p-5 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider">Halaman Catatan</span>
                <Button 
                  onClick={() => handleAddNote(selectedDoc?.id)}
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 border-[var(--border)] text-[#5483B3] hover:bg-[#5483B3]/10"
                  title="Tambah Sub-halaman"
                >
                  <Plus className="h-4.5 w-4.5" />
                </Button>
              </div>

              <div className="flex-1 space-y-2">
                {/* List all document tree in the editor sidebar */}
                {renderDocTree(null)}
              </div>
            </div>

            {/* Right dialog column: Content page editor */}
            <div className="flex-1 flex flex-col h-full bg-[var(--card)] overflow-y-auto p-8 relative">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="absolute right-5 top-5 p-2 rounded-full hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors z-20"
              >
                <X className="h-5 w-5" />
              </button>

              {selectedDoc ? (
                <BlockEditor
                  key={selectedDoc.id}
                  documentId={selectedDoc.id}
                  initialTitle={selectedDoc.title}
                  initialContent={selectedDoc.content || ''}
                  onTitleChange={(newTitle) => {
                    // Sync title changes back to list locally
                    setDocuments(prev => prev.map(doc => doc.id === selectedDoc.id ? { ...doc, title: newTitle } : doc))
                  }}
                  onSaveStatusChange={setEditorSaveStatus}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--muted-foreground)]">
                  <FileText className="h-12 w-12 opacity-35 mb-4" />
                  <p className="text-sm font-bold">Pilih halaman dari sidebar untuk mulai mengedit.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-[var(--card)] border-[var(--border)] rounded-2xl p-6 shadow-2xl">
          <DialogTitle className="text-lg font-extrabold flex items-center gap-2.5 text-red-600">
            <AlertCircle className="h-5.5 w-5.5 text-red-500 animate-pulse" />
            Hapus Catatan?
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-[var(--muted-foreground)] mt-2">
            Apakah Anda yakin ingin menghapus catatan ini beserta seluruh sub-halamannya? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </DialogDescription>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false)
                setDocToDelete(null)
              }}
              className="border-[var(--border)] rounded-xl font-bold h-11 px-5 hover:bg-[var(--muted)] text-[var(--foreground)]"
            >
              Batal
            </Button>
            <Button
              onClick={handleDeleteDoc}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-11 px-5 shadow-lg shadow-red-600/10"
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
