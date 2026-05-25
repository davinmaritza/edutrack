'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Mail, 
  GraduationCap, 
  Download, 
  ClipboardList, 
  FileText,
  Filter,
  Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

export function TeacherSiswaClient({ students }: any) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('ALL')
  const [groupByClass, setGroupByClass] = useState(false)

  // Get unique classes for filtering
  const uniqueClasses = Array.from(
    new Set(students.map((s: any) => s.class?.id).filter(Boolean))
  ).map(id => {
    const s = students.find((x: any) => x.class?.id === id)
    return s.class
  })

  // Filter students based on search and selected class
  const filteredStudents = students.filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.class?.name.toLowerCase().includes(search.toLowerCase())
    const matchesClass = classFilter === 'ALL' || s.classId === classFilter
    return matchesSearch && matchesClass
  })

  // Sort students by attendance number (noAbsen) if available, otherwise by name
  const sortedStudents = [...filteredStudents].sort((a: any, b: any) => {
    if (a.noAbsen !== null && b.noAbsen !== null) {
      return (a.noAbsen || 0) - (b.noAbsen || 0)
    }
    return a.name.localeCompare(b.name)
  })

  // Group students by class if toggle is on
  const groupedStudents = groupByClass
    ? sortedStudents.reduce((acc: any, student: any) => {
        const className = student.class?.name || 'Tanpa Kelas'
        if (!acc[className]) acc[className] = []
        acc[className].push(student)
        return acc
      }, {})
    : null

  if (selectedStudent) {
    return (
      <div className="space-y-10 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedStudent(null)}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] p-2 rounded-xl h-auto font-bold text-xs gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Siswa
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
           <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-[#5483B3]/20 rounded-2xl">
                 <AvatarImage src={selectedStudent.image} className="object-cover" />
                 <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] text-2xl font-bold rounded-2xl">{selectedStudent.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                 <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">{selectedStudent.name}</h1>
                    {selectedStudent.noAbsen !== null && selectedStudent.noAbsen !== undefined && (
                      <Badge className="bg-[#5483B3]/10 text-[#5483B3] font-bold border-none rounded px-2.5 py-0.5 text-xs">
                        No. Absen {selectedStudent.noAbsen}
                      </Badge>
                    )}
                 </div>
                 <div className="flex flex-wrap items-center gap-4 text-[var(--muted-foreground)] text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-[#5483B3]" /> {selectedStudent.class?.name || 'Belum Ada Kelas'}</span>
                    <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-[#5483B3]" /> {selectedStudent.email}</span>
                 </div>
              </div>
           </div>
           
           <div>
              <Button 
                onClick={() => window.print()}
                className="bg-[#5483B3] hover:bg-[#3B6FA0] text-white rounded-xl font-bold text-xs h-11 shadow-sm px-6 gap-2"
              >
                <Download className="h-4 w-4" /> Unduh Laporan PDF
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-10">
              <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                 <CardHeader className="border-b border-[var(--border)] pb-6 bg-[var(--muted)]/20">
                    <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                      <GraduationCap className="h-4.5 w-4.5 text-[#5483B3]" /> Progres Mata Pelajaran
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 md:p-8 space-y-6">
                    {selectedStudent.userSubjects && selectedStudent.userSubjects.length > 0 ? (
                      selectedStudent.userSubjects.map((us: any) => {
                        const subjectTopics = us.subject.topics?.length || 0
                        const subjectCompleted = new Set(selectedStudent.progressLogs.filter((l: any) => l.topic?.subjectId === us.subjectId).map((l: any) => l.topicId)).size
                        const subProgress = subjectTopics > 0 ? Math.round((subjectCompleted / subjectTopics) * 100) : 0
                        return (
                          <div key={us.id} className="group">
                             <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{us.subject.name}</p>
                                <span className="text-xs font-bold text-[#5483B3]">{subProgress}% Selesai</span>
                             </div>
                             <Progress value={subProgress} className="h-2 rounded-full bg-[var(--muted)]" indicatorClassName="bg-[#5483B3]" />
                          </div>
                        )
                      })
                    ) : (
                      <div className="py-6 text-center text-sm text-[var(--muted-foreground)]">Belum ada progres mapel terdaftar.</div>
                    )}
                 </CardContent>
              </Card>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-[#5483B3]" />
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Riwayat Pengerjaan Tugas</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {selectedStudent.studentSubmissions?.length > 0 ? (
                      selectedStudent.studentSubmissions.map((sub: any) => (
                        <Card key={sub.id} className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:border-[#5483B3]/30 transition-all group overflow-hidden shadow-sm">
                           <CardContent className="p-6 flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                 <div className="h-11 w-11 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-xl flex items-center justify-center text-[#5483B3]">
                                    <FileText className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors">{sub.assignment.title}</h4>
                                    <p className="text-xs font-semibold text-[var(--muted-foreground)] mt-1">
                                       {sub.assignment.subject.name} • Diserahkan {new Date(sub.submittedAt).toLocaleDateString('id-ID')}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-bold text-[#5483B3]">{sub.score || 'N/A'}</p>
                                 <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Skor</p>
                              </div>
                           </CardContent>
                        </Card>
                      ))
                    ) : (
                       <div className="py-12 bg-[var(--card)] border border-dashed border-[var(--border)] rounded-2xl text-center">
                          <p className="text-xs font-bold text-[var(--muted-foreground)]">Belum ada riwayat tugas</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#5483B3]" />
                    <h3 className="text-sm font-bold text-[var(--foreground)]">Log Belajar Terbaru</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                  {selectedStudent.progressLogs?.length > 0 ? (
                    selectedStudent.progressLogs.map((log: any, i: number) => (
                      <Card key={i} className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm">
                         <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                               <div className="text-center w-12 border-r border-[var(--border)] pr-4">
                                  <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">{new Date(log.loggedAt).toLocaleDateString('id-ID', { month: 'short' })}</p>
                                  <p className="text-lg font-extrabold text-[var(--foreground)]">{new Date(log.loggedAt).getDate()}</p>
                               </div>
                               <div>
                                  <h4 className="text-sm font-bold text-[var(--foreground)]">{log.topic.name}</h4>
                                  <p className="text-xs font-semibold text-[var(--muted-foreground)] mt-1">{log.topic.subject.name} • {log.duration} Menit</p>
                               </div>
                            </div>
                            <Badge className="bg-[#5483B3]/10 text-[#5483B3] border-none rounded px-2.5 py-0.5 text-xs font-bold">Level {log.difficulty}</Badge>
                         </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="py-12 bg-[var(--card)] border border-dashed border-[var(--border)] rounded-2xl text-center">
                      <p className="text-xs font-bold text-[var(--muted-foreground)]">Belum ada aktivitas belajar terbaru</p>
                    </div>
                  )}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                 <CardHeader className="border-b border-[var(--border)] pb-6 bg-[var(--muted)]/20">
                    <CardTitle className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">Ringkasan Analitik</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 md:p-8 space-y-6">
                    {(() => {
                       const totalMins = selectedStudent.progressLogs?.reduce((acc: number, l: any) => acc + (Number(l.duration) || 0), 0) || 0
                       const submissionsWithScore = selectedStudent.studentSubmissions?.filter((s: any) => s.score !== null && !isNaN(Number(s.score))) || []
                       const avgScore = submissionsWithScore.length > 0
                          ? (submissionsWithScore.reduce((acc: number, s: any) => acc + (Number(s.score) || 0), 0) / submissionsWithScore.length).toFixed(1)
                          : 0
                       return (
                          <>
                            <div className="bg-[var(--muted)]/30 p-6 border border-[var(--border)] rounded-2xl text-center hover:border-[#5483B3]/30 transition-all">
                               <Clock className="h-8 w-8 text-[#5483B3] mx-auto mb-3" />
                               <p className="text-3xl font-extrabold text-[var(--foreground)]">{(totalMins / 60).toFixed(1)} jam</p>
                               <p className="text-xs font-semibold text-[var(--muted-foreground)] mt-1">Total Waktu Belajar</p>
                            </div>
                            <div className="bg-[var(--muted)]/30 p-6 border border-[var(--border)] rounded-2xl text-center hover:border-[#5483B3]/30 transition-all">
                               <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                               <p className="text-3xl font-extrabold text-[var(--foreground)]">{avgScore}</p>
                               <p className="text-xs font-semibold text-[var(--muted-foreground)] mt-1">Skor Rata-rata Tugas</p>
                            </div>
                          </>
                       )
                    })()}
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    )
  }

  // Helper function to render a single student card
  const renderStudentCard = (student: any, i: number) => {
    const totalTopics = student.userSubjects?.reduce((acc: number, us: any) => acc + (us.subject.topics?.length || 0), 0) || 0
    const completedTopics = new Set(student.progressLogs?.map((log: any) => log.topicId)).size
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

    return (
      <motion.div
        key={student.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03 }}
        onClick={() => setSelectedStudent(student)}
        className="cursor-pointer h-full"
      >
        <Card className="bg-[var(--card)] border-[var(--border)] rounded-2xl hover:shadow-md transition-all group overflow-hidden h-full flex flex-col hover:-translate-y-1">
           <CardContent className="p-6 md:p-8 flex flex-col h-full space-y-6">
              <div className="flex justify-between items-start">
                 <div className="relative">
                    <Avatar className="h-16 w-16 border border-[var(--border)] rounded-2xl shadow-sm">
                       <AvatarImage src={student.image} className="object-cover" />
                       <AvatarFallback className="bg-[var(--muted)] text-[var(--muted-foreground)] font-bold text-xl rounded-2xl">{student.name[0]}</AvatarFallback>
                    </Avatar>
                    {student.isActive && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[var(--card)] rounded-full" />
                    )}
                 </div>
                 {student.noAbsen !== null && student.noAbsen !== undefined && (
                   <Badge className="bg-[#5483B3]/10 text-[#5483B3] hover:bg-[#5483B3]/20 border-none rounded-md text-xs font-bold px-2 py-0.5">
                      No. Absen {student.noAbsen}
                   </Badge>
                 )}
              </div>
              
              <div className="flex-1 space-y-1.5">
                 <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)] group-hover:text-[#5483B3] transition-colors truncate">{student.name}</h3>
                 <p className="text-xs font-semibold text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="h-3.5 w-3.5 text-[#5483B3]" />
                    {student.class?.name || 'Belum Ada Kelas'}
                 </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                 <div className="text-left">
                    <p className="text-lg font-bold text-[var(--foreground)]">{progress}%</p>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase mt-0.5">Avg. Progres</p>
                 </div>
                 <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[#5483B3] transition-colors" />
              </div>
           </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-[#5483B3] font-bold uppercase tracking-wider text-xs mb-2">Student Directory</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">Data Siswa</h1>
          <p className="text-[var(--muted-foreground)] font-medium mt-2">Daftar siswa yang terdaftar pada mata pelajaran yang Anda ajar.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative group min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
              <Input 
                placeholder="Cari nama siswa..." 
                className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs rounded-xl w-full focus-visible:ring-[#5483B3] transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>

           <div className="relative group">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] group-focus-within:text-[#5483B3] transition-colors" />
              <Select value={classFilter} onValueChange={setClassFilter}>
                 <SelectTrigger className="bg-[var(--card)] border-[var(--border)] pl-10 h-11 text-xs font-semibold rounded-xl w-48 focus-visible:ring-[#5483B3] transition-all shadow-sm">
                    <SelectValue placeholder="Pilih Kelas" />
                 </SelectTrigger>
                 <SelectContent className="bg-[var(--card)] border-[var(--border)] rounded-xl shadow-lg z-50">
                    <SelectItem value="ALL">Semua Kelas</SelectItem>
                    {uniqueClasses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
           </div>

           <div className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl h-11 px-4 shadow-sm">
              <Switch 
                id="group-by-class"
                checked={groupByClass}
                onCheckedChange={setGroupByClass}
              />
              <Label htmlFor="group-by-class" className="text-xs font-bold cursor-pointer text-[var(--foreground)] select-none">
                 Kelompokkan Kelas
              </Label>
           </div>
        </div>
      </div>

      {sortedStudents.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)]">
            <div className="h-16 w-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[var(--muted-foreground)] opacity-50" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">Tidak ada siswa</h3>
            <p className="text-xs font-medium text-[var(--muted-foreground)]">Belum ada siswa yang sesuai dengan filter pencarian.</p>
        </div>
      ) : groupByClass ? (
        // Grouped view
        <div className="space-y-12">
           {Object.keys(groupedStudents).map((className) => (
             <div key={className} className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-[#5483B3]/10 border border-[#5483B3]/20 rounded-lg flex items-center justify-center text-[#5483B3]">
                      <GraduationCap className="h-4 w-4" />
                   </div>
                   <h2 className="text-lg font-bold text-[var(--foreground)]">{className}</h2>
                   <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-none text-[10px] font-extrabold rounded-md px-2 py-0.5">
                      {groupedStudents[className].length} Siswa
                   </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {groupedStudents[className].map((student: any, i: number) => renderStudentCard(student, i))}
                </div>
             </div>
           ))}
        </div>
      ) : (
        // Flat grid view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedStudents.map((student: any, i: number) => renderStudentCard(student, i))}
        </div>
      )}
    </div>
  )
}
