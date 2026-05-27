import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AdminBillingClient } from "@/components/dashboard/admin-billing-client"

export const dynamic = 'force-dynamic'

export default async function AdminBillingPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch all students to select when creating bill
  const students = await prisma.user.findMany({
    where: { role: "USER" },
    include: { class: true },
    orderBy: { name: 'asc' }
  })

  // Fetch all billings
  const billings = await prisma.billing.findMany({
    include: {
      student: {
        select: { name: true, nis: true, class: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <AdminBillingClient students={students} billings={billings} />
}
