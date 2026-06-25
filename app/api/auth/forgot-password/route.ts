import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/mail"
import crypto from "crypto"
import { rateLimit, getIp } from "@/lib/rate-limit"

export async function POST(req: Request) {
  // Rate limit: 3 requests per 15 minutes per IP
  const ip = getIp(req)
  const rl = rateLimit({ key: `forgot-pw:${ip}`, limit: 3, windowMs: 15 * 60 * 1000 })
  if (!rl.success) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi." },
      { status: 429 }
    )
  }

  try {
    const { email } = await req.json()


    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Security: Don't reveal if user exists
      return NextResponse.json({ message: "Jika email terdaftar, instruksi reset telah dikirim." })
    }

    // Generate 6-digit numeric code
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.passwordResetToken.upsert({
      where: { email },
      update: { token, expires },
      create: { email, token, expires },
    })

    // Send email via Supabase SMTP
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: "Jika email terdaftar, instruksi reset telah dikirim." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
