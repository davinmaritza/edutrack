import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const userId = (session.user as any).id

    const registration = await prisma.ppdbRegistration.findUnique({
      where: { userId },
      include: { user: true }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error("[PPDB_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const userId = (session.user as any).id
    const body = await req.json()

    const {
      nisn, nik, birthPlace, birthDate, originSchool,
      fatherName, fatherOccupation, fatherPhone,
      motherName, motherOccupation, motherPhone,
      documentKk, documentAkta, documentKtpOrtu, documentFoto,
      documentIjazah, documentRapor, documentPrestasi, documentPernyataan,
      documentSehat, documentBebasNarkoba, documentButaWarna
    } = body

    const registration = await prisma.ppdbRegistration.upsert({
      where: { userId },
      create: {
        userId,
        nisn, 
        nik, 
        birthPlace, 
        birthDate: birthDate ? new Date(birthDate) : null, 
        originSchool,
        fatherName, 
        fatherOccupation, 
        fatherPhone,
        motherName, 
        motherOccupation, 
        motherPhone,
        documentKk, 
        documentAkta, 
        documentKtpOrtu, 
        documentFoto,
        documentIjazah, 
        documentRapor, 
        documentPrestasi, 
        documentPernyataan,
        documentSehat, 
        documentBebasNarkoba, 
        documentButaWarna,
        status: 'PENDING'
      },
      update: {
        nisn, 
        nik, 
        birthPlace, 
        birthDate: birthDate ? new Date(birthDate) : null, 
        originSchool,
        fatherName, 
        fatherOccupation, 
        fatherPhone,
        motherName, 
        motherOccupation, 
        motherPhone,
        documentKk, 
        documentAkta, 
        documentKtpOrtu, 
        documentFoto,
        documentIjazah, 
        documentRapor, 
        documentPrestasi, 
        documentPernyataan,
        documentSehat, 
        documentBebasNarkoba, 
        documentButaWarna,
        status: 'PENDING'
      }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error("[PPDB_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
