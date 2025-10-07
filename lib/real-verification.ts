// Real verification services for Turkish phone numbers and emails
// This prevents fake bookings and ensures real customer data

// Client-side verification helpers
export const validateTurkishPhoneClient = (phone: string): { isValid: boolean; error?: string; formatted?: string } => {
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

  return { isValid: true, formatted: formattedPhone }
}

// Email verification using EmailJS
export const verifyEmailReal = async (email: string): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // First, validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Geçersiz e-posta formatı' }
    }

    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'yopmail.com', 'throwaway.email', 'temp-mail.org', 'sharklasers.com',
      'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'bccto.me',
      'chacuo.net', 'dispostable.com', 'mailnesia.com', 'maildrop.cc',
      'mailcatch.com', 'inboxalias.com', 'mailme.lv', 'mailmetrash.com',
      'trashmail.com', 'tempail.com', 'fakeinbox.com', 'mailnull.com'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Geçici e-posta adresleri kabul edilmez' }
    }

    // Use EmailJS to send verification email
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store verification code temporarily (in production, use Redis or database)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`email_verification_${email}`, verificationCode)
    }

    // Send verification email via EmailJS
    const emailServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!emailServiceId || !templateId || !publicKey) {
      console.warn('EmailJS not configured, skipping email verification')
      return { isValid: true } // Allow for development
    }

    // Import EmailJS dynamically
    const emailjs = await import('@emailjs/browser')
    
    await emailjs.default.send(
      emailServiceId,
      templateId,
      {
        to_email: email,
        verification_code: verificationCode,
        salon_name: 'Salon Ahmet Barbers',
      },
      publicKey
    )

    return { 
      isValid: true, 
      verificationSent: true,
      message: 'Doğrulama kodu e-posta adresinize gönderildi'
    }

  } catch (error) {
    console.error('Email verification error:', error)
    return { 
      isValid: false, 
      error: 'E-posta doğrulama hatası. Lütfen geçerli bir e-posta adresi girin.'
    }
  }
}

// Verify email code
export const verifyEmailCode = (email: string, code: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const storedCode = sessionStorage.getItem(`email_verification_${email}`)
  return storedCode === code
}

// Client-side phone verification (calls server API)
export const verifyTurkishPhoneClient = async (phone: string): Promise<{ isValid: boolean; error?: string; formatted?: string }> => {
  try {
    // First validate on client side
    const clientValidation = validateTurkishPhoneClient(phone)
    if (!clientValidation.isValid) {
      return clientValidation
    }

    // Call server API for SMS sending
    const response = await fetch('/api/verification/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'phone', phone })
    })

    const result = await response.json()
    return result

  } catch (error) {
    console.error('Phone verification error:', error)
    return { 
      isValid: false, 
      error: 'Telefon doğrulama hatası. Lütfen geçerli bir Türk telefon numarası girin.'
    }
  }
}

// Verify SMS code
export const verifySMSCode = (phone: string, code: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const cleanPhone = phone.replace(/\D/g, '')
  const storedCode = sessionStorage.getItem(`sms_verification_${cleanPhone}`)
  return storedCode === code
}

// Comprehensive verification for booking
export const verifyBookingData = async (name: string, email: string, phone: string) => {
  const results = {
    name: { isValid: true, error: null },
    email: { isValid: false, error: null, verificationSent: false },
    phone: { isValid: false, error: null, verificationSent: false, formatted: null }
  }

  // Validate name
  if (!name || name.trim().length < 2) {
    results.name = { isValid: false, error: 'İsim en az 2 karakter olmalıdır' }
  }

  // Verify email
  const emailResult = await verifyEmailReal(email)
  results.email = emailResult

  // Verify phone
  const phoneResult = await verifyTurkishPhoneClient(phone)
  results.phone = phoneResult

  return results
}

// Check if all verifications are complete
export const isVerificationComplete = (email: string, phone: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const cleanPhone = phone.replace(/\D/g, '')
  const emailVerified = sessionStorage.getItem(`email_verified_${email}`) === 'true'
  const phoneVerified = sessionStorage.getItem(`phone_verified_${cleanPhone}`) === 'true'
  
  return emailVerified && phoneVerified
}

// Mark verification as complete
export const markVerificationComplete = (email: string, phone: string) => {
  if (typeof window === 'undefined') return
  
  const cleanPhone = phone.replace(/\D/g, '')
  sessionStorage.setItem(`email_verified_${email}`, 'true')
  sessionStorage.setItem(`phone_verified_${cleanPhone}`, 'true')
}
