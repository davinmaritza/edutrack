'use client'

import React, { forwardRef } from 'react'
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

interface ReportCardProps {
  student: any
}

export const ReportCardPDF = forwardRef<HTMLDivElement, ReportCardProps>(({ student }, ref) => {
  if (!student) return null

  // Calculate stats
  const totalSubmissions = student.studentSubmissions?.length || 0
  const gradedSubmissions = student.studentSubmissions?.filter((s: any) => s.score !== null).length || 0
  const averageScore = gradedSubmissions > 0 
    ? Math.round(student.studentSubmissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / gradedSubmissions)
    : 0

  const sickCount = student.attendances?.filter((a: any) => a.status === 'SICK').length || 0
  const permissionCount = student.attendances?.filter((a: any) => a.status === 'PERMISSION').length || 0
  const absentCount = student.attendances?.filter((a: any) => a.status === 'ABSENT').length || 0

  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: idLocale })

  // Aggregate scores by subject
  const subjectScores: Record<string, { total: number, count: number, name: string }> = {}
  
  student.studentSubmissions?.forEach((sub: any) => {
    if (sub.score !== null) {
      const subjId = sub.assignment.subject.id
      if (!subjectScores[subjId]) {
        subjectScores[subjId] = { total: 0, count: 0, name: sub.assignment.subject.name }
      }
      subjectScores[subjId].total += sub.score
      subjectScores[subjId].count += 1
    }
  })

  const subjectList = Object.values(subjectScores).map(s => ({
    name: s.name,
    average: Math.round(s.total / s.count)
  }))

  return (
    <div style={{ display: 'none' }}>
      <div 
        ref={ref} 
        style={{ 
          padding: '40px', 
          fontFamily: 'Arial, sans-serif', 
          color: '#000', 
          backgroundColor: '#fff',
          width: '210mm',
          minHeight: '297mm' 
        }}
        className="print-container"
      >
        {/* Header / Kop Surat */}
        <div style={{ textAlign: 'center', borderBottom: '3px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>Fokuspad Academy</h1>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Jl. Pendidikan No. 123, Kota Pelajar, Indonesia 40123</p>
          <p style={{ margin: 0, fontSize: '14px' }}>Telp: (022) 1234567 | Email: info@fokuspad.com | Web: www.fokuspad.com</p>
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', margin: '0 0 30px 0', textDecoration: 'underline' }}>
          LAPORAN HASIL BELAJAR (RAPOR)
        </h2>

        {/* Student Info */}
        <table style={{ width: '100%', marginBottom: '30px', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ width: '20%', padding: '4px 0', fontWeight: 'bold' }}>Nama Peserta Didik</td>
              <td style={{ width: '2%', padding: '4px 0' }}>:</td>
              <td style={{ width: '48%', padding: '4px 0' }}>{student.name}</td>
              <td style={{ width: '10%', padding: '4px 0', fontWeight: 'bold' }}>Kelas</td>
              <td style={{ width: '2%', padding: '4px 0' }}>:</td>
              <td style={{ width: '18%', padding: '4px 0' }}>{student.class?.name || '-'}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Nomor Induk Siswa</td>
              <td style={{ padding: '4px 0' }}>:</td>
              <td style={{ padding: '4px 0' }}>{student.nis || '-'}</td>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Semester</td>
              <td style={{ padding: '4px 0' }}>:</td>
              <td style={{ padding: '4px 0' }}>Ganjil</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Nama Sekolah</td>
              <td style={{ padding: '4px 0' }}>:</td>
              <td style={{ padding: '4px 0' }}>{student.school || '-'}</td>
              <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Tahun Ajaran</td>
              <td style={{ padding: '4px 0' }}>:</td>
              <td style={{ padding: '4px 0' }}>2026/2027</td>
            </tr>
          </tbody>
        </table>

        {/* Academic Grades */}
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '15px' }}>
          A. Nilai Akademik
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '14px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', width: '10%' }}>No</th>
              <th style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', width: '50%', textAlign: 'left' }}>Mata Pelajaran</th>
              <th style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', width: '20%' }}>Nilai Akhir</th>
              <th style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', width: '20%' }}>Predikat</th>
            </tr>
          </thead>
          <tbody>
            {subjectList.length > 0 ? (
              subjectList.map((subj, idx) => {
                let predikat = 'D'
                if (subj.average >= 90) predikat = 'A'
                else if (subj.average >= 80) predikat = 'B'
                else if (subj.average >= 70) predikat = 'C'

                return (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}>{subj.name}</td>
                    <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{subj.average}</td>
                    <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>{predikat}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontStyle: 'italic' }}>
                  Belum ada nilai mata pelajaran.
                </td>
              </tr>
            )}
            {/* Average Row */}
            <tr>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                RATA-RATA KESELURUHAN
              </td>
              <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{averageScore}</td>
              <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>-</td>
            </tr>
          </tbody>
        </table>

        {/* Attendance */}
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '15px' }}>
          B. Ketidakhadiran
        </h3>
        <table style={{ width: '50%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px', width: '60%' }}>Sakit</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{sickCount} hari</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px' }}>Izin</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{permissionCount} hari</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #000', padding: '8px' }}>Tanpa Keterangan</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{absentCount} hari</td>
            </tr>
          </tbody>
        </table>

        {/* Signature Area */}
        <table style={{ width: '100%', fontSize: '14px', marginTop: '50px' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', textAlign: 'center' }}>
                <p style={{ margin: '0 0 80px 0' }}>Mengetahui,<br/>Orang Tua / Wali</p>
                <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>................................................</p>
              </td>
              <td style={{ width: '50%', textAlign: 'center' }}>
                <p style={{ margin: '0 0 80px 0' }}>Kota Pelajar, {currentDate}<br/>Wali Kelas</p>
                <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>Guru Pengampu</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
})

ReportCardPDF.displayName = 'ReportCardPDF'
