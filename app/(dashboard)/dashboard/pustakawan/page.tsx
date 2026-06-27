import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PustakawanClient } from "@/components/dashboard/pustakawan-client"
import { RBAC } from "@/lib/rbac"

export const metadata = {
  title: "Dashboard Pustakawan | Fokuspad",
  description: "Manajemen Perpustakaan dan Sirkulasi Buku"
}

export default async function PustakawanPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  
  // Only Pustakawan or Super Admin can access this
  if (role !== "PUSTAKAWAN" && role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const circulations = await prisma.bookCirculation.findMany({
    include: {
      book: true,
      student: { select: { name: true, nis: true, email: true } }
    },
    orderBy: { borrowDate: 'desc' }
  })
  
  // Also get list of all students for the dropdown when borrowing a book
  const students = await prisma.user.findMany({
    where: { 
      role: { in: ["STUDENT", "SISWA"] },
      isActive: true 
    },
    select: { id: true, name: true, nis: true }
  })

  return <PustakawanClient books={books} circulations={circulations} students={students} />
}
