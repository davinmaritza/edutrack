import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TeacherSiswaClient } from "@/components/dashboard/teacher-siswa-client"

export default async function TeacherSiswaPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  if (role !== 'TEACHER' && role !== 'ADMIN') redirect("/dashboard")

  // Fetch all students in the school
  const school = (session.user as any).school
  const userId = (session.user as any).id
  
  const students = await prisma.user.findMany({
    where: { 
      school, 
      role: 'STUDENT',
      ...(role === 'TEACHER' ? {
        userSubjects: {
          some: {
            subject: {
              teacherId: userId
            }
          }
        }
      } : {})
    },
    include: { 
      class: true,
      progressLogs: {
        orderBy: { loggedAt: 'desc' },
        take: 10,
        include: { topic: { include: { subject: true } } }
      },
      userSubjects: {
        include: { subject: true }
      },
      studentSubmissions: {
        include: { assignment: { include: { subject: true } } },
        orderBy: { submittedAt: 'desc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <TeacherSiswaClient 
      students={students}
    />
  )
}
