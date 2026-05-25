import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get("date")

  try {
    const whereClause: any = {
      userId: session.user.id
    }

    if (dateStr) {
      const parsedDate = new Date(dateStr)
      // Set to start and end of day
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999))
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      orderBy: [
        { position: 'asc' },
        { createdAt: 'asc' }
      ],
      include: {
        subDocs: {
          select: {
            id: true,
            title: true,
            parentId: true,
            position: true
          }
        }
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, parentId, date, position } = body

    const newDoc = await prisma.document.create({
      data: {
        title: title || "Tanpa Judul",
        content: content ? JSON.stringify(content) : JSON.stringify([
          { id: "block-1", type: "paragraph", content: "Mulai menulis catatan kegiatan di sini..." }
        ]),
        userId: session.user.id,
        parentId: parentId || null,
        date: date ? new Date(date) : null,
        position: position || 0
      }
    })

    return NextResponse.json(newDoc)
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
