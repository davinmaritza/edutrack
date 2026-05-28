import { NextResponse } from 'next/server'
import crypto from 'crypto'

const CAPTCHA_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-captcha'

export async function GET() {
  const num1 = Math.floor(Math.random() * 9) + 1
  const num2 = Math.floor(Math.random() * 9) + 1
  const answer = num1 + num2
  
  const hash = crypto.createHmac('sha256', CAPTCHA_SECRET).update(answer.toString()).digest('hex')
  
  const response = NextResponse.json({ question: `${num1} + ${num2} = ?` })
  
  response.cookies.set('captcha_hash', hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300 // 5 minutes
  })
  
  return response
}
