import { RBAC } from "@/lib/rbac"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !RBAC.isAdminLevel((session.user as any).role)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, school, gradeYear } = body

    const newClass = await prisma.class.create({
      data: {
        name,
        school,
        gradeYear: parseInt(gradeYear)
      }
    })

    return NextResponse.json(newClass)
  } catch (error) {
    console.error("[ADMIN_CLASS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
