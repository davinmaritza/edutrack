import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { UksClient } from "@/components/dashboard/uks-client"

export const metadata = {
  title: "Dashboard UKS | Fokuspad",
  description: "Manajemen Unit Kesehatan Sekolah"
}

export default async function UksPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  
  if (role !== "PETUGAS_UKS" && role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const inventory = await prisma.medicalInventory.findMany({
    orderBy: { name: 'asc' }
  })

  const records = await prisma.medicalRecord.findMany({
    include: {
      student: { select: { name: true, nis: true, class: { select: { name: true } } } },
      handledBy: { select: { name: true } },
      medicine: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  const students = await prisma.user.findMany({
    where: { 
      role: { in: ["STUDENT", "SISWA"] },
      isActive: true 
    },
    select: { id: true, name: true, nis: true, class: { select: { name: true } } }
  })

  return <UksClient inventory={inventory} records={records} students={students} />
}
