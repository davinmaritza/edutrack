import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, parentId, position, date } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = typeof content === 'string' ? content : JSON.stringify(content)
    if (parentId !== undefined) updateData.parentId = parentId || null
    if (position !== undefined) updateData.position = position
    if (date !== undefined) updateData.date = date ? new Date(date) : null

    const updatedDoc = await prisma.document.update({
      where: {
        id,
        userId: session.user.id
      },
      data: updateData
    })

    return NextResponse.json(updatedDoc)
  } catch (error) {
    console.error("[DOCUMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.document.delete({
      where: {
        id,
        userId: session.user.id
      }
    })

    return new NextResponse("Document deleted", { status: 200 })
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
