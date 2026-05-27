import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { RBAC } from "@/lib/rbac"
import prisma from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  const role = (session?.user as any)?.role

  let dbUser = null
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })
  }

  return NextResponse.json({
    session,
    role,
    dbRole: dbUser?.role,
    canAccessAdmin: RBAC.canAccessAdminDashboard(role),
    isSuperAdmin: RBAC.isSuperAdmin(role)
  })
}
