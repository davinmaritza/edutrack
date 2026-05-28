import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RBAC } from "@/lib/rbac"
import { AdminPpdbClient } from "@/components/dashboard/admin-ppdb-client"

export const dynamic = 'force-dynamic'

export default async function AdminPpdbPage() {
  const session = await auth()
  const role = (session?.user as any)?.role

  if (!session || (!RBAC.canAccessAdminDashboard(role) && role !== 'PANITIA_PPDB')) {
    redirect("/dashboard")
  }

  const registrations = await prisma.ppdbRegistration.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <AdminPpdbClient 
      initialRegistrations={JSON.parse(JSON.stringify(registrations))}
    />
  )
}
