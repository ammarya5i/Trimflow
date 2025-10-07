import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailReal } from '@/lib/real-verification'

export async function POST(request: NextRequest) {
  try {
    const { type, email, phone } = await request.json()

    if (!type) {
      return NextResponse.json({ error: 'Missing verification type' }, { status: 400 })
    }

    let result

    if (type === 'email' && email) {
      result = await verifyEmailReal(email)
    } else if (type === 'phone' && phone) {
      // Server-side phone verification with SMS
      result = await verifyPhoneWithSMS(phone)
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Verification send error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Server-side phone verification with SMS
async function verifyPhoneWithSMS(phone: string) {
  try {
    // Clean and format phone number
    const cleanPhone = phone.replace(/\D/g, '')
    
    // Turkish mobile number validation (5XX XXX XXXX format)
    const mobileRegex = /^5[0-9]{9}$/
    
    if (!mobileRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Geçersiz Türk mobil numarası formatı' }
    }

    // Check carrier codes
    const carrierCode = cleanPhone.substring(1, 4)
    const validCarriers = ['050', '051', '052', '053', '054', '055', '059']
    
    if (!validCarriers.includes(carrierCode)) {
      return { isValid: false, error: 'Geçersiz operatör kodu' }
    }

    // Check for suspicious patterns
    if (cleanPhone.match(/(\d)\1{4,}/)) {
      return { isValid: false, error: 'Şüpheli telefon numarası (çok fazla tekrar eden rakam)' }
    }

    // Check for test numbers
    const testNumbers = ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666', '7777777777', '8888888888', '9999999999', '0000000000']
    if (testNumbers.includes(cleanPhone)) {
      return { isValid: false, error: 'Test numaraları kabul edilmez' }
    }

    // Format phone number
    const formattedPhone = `+90 ${carrierCode} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7)}`

    // Generate SMS verification code
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store verification code in a temporary store (in production, use Redis)
    // For now, we'll use a simple in-memory store
    global.verificationCodes = global.verificationCodes || {}
    global.verificationCodes[cleanPhone] = smsCode

    // Send SMS via Twilio (if configured)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
      try {
        const twilio = require('twilio')
        const client = twilio(twilioAccountSid, twilioAuthToken)

        await client.messages.create({
          body: `Salon Ahmet Barbers doğrulama kodu: ${smsCode}. Bu kodu kimseyle paylaşmayın.`,
          from: twilioPhoneNumber,
          to: formattedPhone
        })

        return { 
          isValid: true, 
          formatted: formattedPhone,
          verificationSent: true,
          message: 'Doğrulama kodu telefon numaranıza gönderildi'
        }
      } catch (smsError) {
        console.error('SMS sending error:', smsError)
        return { 
          isValid: true, 
          formatted: formattedPhone,
          verificationSent: false,
          message: 'Telefon numarası geçerli (SMS gönderilemedi)'
        }
      }
    } else {
      console.warn('Twilio not configured, skipping SMS verification')
      return { 
        isValid: true, 
        formatted: formattedPhone,
        verificationSent: false,
        message: 'Telefon numarası geçerli (SMS doğrulama devre dışı)'
      }
    }

  } catch (error) {
    console.error('Phone verification error:', error)
    return { 
      isValid: false, 
      error: 'Telefon doğrulama hatası. Lütfen geçerli bir Türk telefon numarası girin.'
    }
  }
}
