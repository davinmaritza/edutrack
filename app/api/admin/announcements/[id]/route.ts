import { RBAC } from "@/lib/rbac"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || !RBAC.isAdminLevel((session.user as any).role)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { id: announcementId } = await params
    
    // Deleting the announcement will also cascade delete notifications 
    // due to the onDelete: Cascade in the schema
    await prisma.announcement.delete({
      where: { id: announcementId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session || !RBAC.isAdminLevel((session.user as any).role)) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { id: announcementId } = await params
    const body = await req.json()
    const { title, message, type } = body

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcementId },
      data: { title, message, type }
    })

    // Update related notifications
    await prisma.notification.updateMany({
      where: { announcementId: announcementId },
      data: { title, message, type: type as any }
    })

    return NextResponse.json(updatedAnnouncement)
  } catch (error) {
    console.error("[ADMIN_ANNOUNCEMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
