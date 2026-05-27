import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TeacherRequestsClient } from "@/components/dashboard/teacher-requests-client"

export const dynamic = 'force-dynamic'

export default async function TeacherRequestsPage() {
  const session = await auth()
  const role = (session?.user as any)?.role

  if (!session || (role !== "TEACHER" && role !== "ADMIN")) {
    redirect("/login")
  }

  // Fetch all absence requests
  const requests = await prisma.absenceRequest.findMany({
    include: {
      student: {
        select: { name: true, nis: true, class: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <TeacherRequestsClient requests={requests} />
}
