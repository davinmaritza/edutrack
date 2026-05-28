import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PpdbDashboardClient } from "@/components/dashboard/ppdb-client"

export const dynamic = 'force-dynamic'

export default async function PpdbDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const userId = (session.user as any).id
  
  const [registration, billings, exams] = await Promise.all([
    prisma.ppdbRegistration.findUnique({
      where: { userId },
      include: { user: true }
    }),
    prisma.billing.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.exam.findMany({
      where: { 
        subject: { name: { contains: 'PPDB', mode: 'insensitive' } } 
      },
      include: { 
        subject: true,
        attempts: { where: { studentId: userId } }
      }
    })
  ])

  return (
    <PpdbDashboardClient 
      initialRegistration={JSON.parse(JSON.stringify(registration))}
      initialBillings={JSON.parse(JSON.stringify(billings))}
      initialExams={JSON.parse(JSON.stringify(exams))}
      user={session.user}
    />
  )
}
