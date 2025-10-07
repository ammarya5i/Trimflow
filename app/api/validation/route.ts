import { NextRequest, NextResponse } from 'next/server'
import { validateEmail, validateTurkishPhone, validateName } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    if (!type || !value) {
      return NextResponse.json({ error: 'Missing type or value' }, { status: 400 })
    }

    let result

    switch (type) {
      case 'email':
        result = validateEmail(value)
        break
      case 'phone':
        result = validateTurkishPhone(value)
        break
      case 'name':
        result = validateName(value)
        break
      default:
        return NextResponse.json({ error: 'Invalid validation type' }, { status: 400 })
    }

    return NextResponse.json({
      isValid: result.isValid,
      error: result.error || null,
      type,
      value
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Batch validation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    const results = {
      name: validateName(name || ''),
      email: validateEmail(email || ''),
      phone: validateTurkishPhone(phone || ''),
    }

    const isValid = results.name.isValid && results.email.isValid && results.phone.isValid

    return NextResponse.json({
      isValid,
      results,
      errors: {
        name: results.name.error || null,
        email: results.email.error || null,
        phone: results.phone.error || null,
      }
    })

  } catch (error) {
    console.error('Batch validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
