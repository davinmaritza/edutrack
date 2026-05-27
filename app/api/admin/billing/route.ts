import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Create new billing
export async function POST(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId, title, description, amount, dueDate } = await req.json()

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.billing.create({
      data: {
        studentId,
        title,
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: "UNPAID"
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Create billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}

// Update billing status (Verify payment)
export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await prisma.billing.update({
      where: { id },
      data: { 
        status,
        paymentDate: status === "PAID" ? new Date() : null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update billing error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 })
  }
}
