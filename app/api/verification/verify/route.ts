import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailCode } from '@/lib/real-verification'

export async function POST(request: NextRequest) {
  try {
    const { type, email, phone, code } = await request.json()

    if (!type || !code) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    let isValid = false

    if (type === 'email' && email) {
      isValid = verifyEmailCode(email, code)
    } else if (type === 'phone' && phone) {
      isValid = verifySMSCodeServer(phone, code)
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    return NextResponse.json({ 
      isValid,
      message: isValid ? 'Doğrulama başarılı' : 'Geçersiz doğrulama kodu'
    })

  } catch (error) {
    console.error('Verification verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Server-side SMS code verification
function verifySMSCodeServer(phone: string, code: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  const storedCode = global.verificationCodes?.[cleanPhone]
  return storedCode === code
}
