import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import crypto from "crypto"
import { rateLimit, getIp } from "@/lib/rate-limit"


export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
      select: { disableRegistration: true, maintenanceMode: true }
    })
    return NextResponse.json({
      disableRegistration: settings?.disableRegistration || settings?.maintenanceMode || false
    })
  } catch (error) {
    return NextResponse.json({ disableRegistration: false })
  }
}

export async function POST(req: Request) {
  // Rate limit: 5 registrations per 10 minutes per IP
  const ip = getIp(req)
  const rl = rateLimit({ key: `register:${ip}`, limit: 5, windowMs: 10 * 60 * 1000 })
  if (!rl.success) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi dalam beberapa menit." },
      { status: 429 }
    )
  }

  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    })

    if (settings?.disableRegistration || settings?.maintenanceMode) {
      return NextResponse.json(
        { error: "Pendaftaran dinonaktifkan oleh administrator atau sistem dalam perbaikan." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, email, password, role, school, className, subject, gender, captcha } = body

    // Verify Cloudflare Turnstile CAPTCHA (cara 1: server verify using the secret key)
    if (!captcha) {
      return NextResponse.json({ error: "Verifikasi CAPTCHA diperlukan." }, { status: 400 })
    }

    try {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAADX4nfBjRLGqwoF85tsNo5YC2V0',
          response: captcha,
        }),
      })

      const turnstileData = await turnstileRes.json()
      if (!turnstileData.success) {
        return NextResponse.json(
          { error: "Verifikasi CAPTCHA (Turnstile) gagal. Silakan coba kembali." },
          { status: 400 }
        )
      }
    } catch (err) {
      console.error("Turnstile error:", err)
      return NextResponse.json(
        { error: "Gagal melakukan verifikasi keamanan. Silakan coba lagi." },
        { status: 500 }
      )
    }

    if (!email || !password || !name) {
      return new NextResponse("Missing information", { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle class for students
    let classId = null
    if (role === 'STUDENT' && className) {
      const existingClass = await prisma.class.findFirst({
        where: { name: className, school }
      })
      
      if (existingClass) {
        classId = existingClass.id
      } else {
        const newClass = await prisma.class.create({
          data: { name: className, school, gradeYear: 10 }
        })
        classId = newClass.id
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        gender: gender || 'Laki-laki',
        school,
        classId,
        isActive: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[REGISTER_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
