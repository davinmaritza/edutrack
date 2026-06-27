import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AlumniClient } from "@/components/dashboard/alumni-client"

export const metadata = {
  title: "Portal Alumni | Fokuspad",
  description: "Portal Tracer Study dan Lowongan Kerja Alumni"
}

export default async function AlumniPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  const userId = (session.user as any)?.id
  
  if (role !== "ALUMNI" && role !== "SUPER_ADMIN" && role !== "WAKASEK_HUBIN") {
    redirect("/dashboard")
  }

  // If user is alumni, get their profile
  const profile = await prisma.alumniProfile.findUnique({
    where: { userId }
  })

  // Get all job postings
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Get all alumni profiles for directory (only visible to WAKASEK_HUBIN or SUPER_ADMIN or other alumni)
  const alumniDirectory = await prisma.alumniProfile.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true, image: true } }
    },
    orderBy: { graduationYear: 'desc' }
  })

  return <AlumniClient 
    profile={profile} 
    jobs={jobs} 
    directory={alumniDirectory} 
    isAlumni={role === "ALUMNI"} 
    userId={userId} 
  />
}
