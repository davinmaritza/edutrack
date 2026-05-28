import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import crypto from "crypto"

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

    if (captcha !== undefined) {
      const cookieStore = await cookies()
      const captchaHash = cookieStore.get('captcha_hash')?.value
      if (!captchaHash) {
        return NextResponse.json({ error: "Sesi CAPTCHA kedaluwarsa. Silakan muat ulang." }, { status: 400 })
      }
      const CAPTCHA_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-captcha'
      const userHash = crypto.createHmac('sha256', CAPTCHA_SECRET).update(captcha.trim()).digest('hex')
      if (userHash !== captchaHash) {
        return NextResponse.json({ error: "Jawaban CAPTCHA salah. Silakan coba lagi." }, { status: 400 })
      }
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
