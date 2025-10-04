import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Support both form-encoded and JSON
    const contentType = request.headers.get('content-type') || ''
    let payload: any
    if (contentType.includes('application/json')) {
      payload = await request.json()
    } else {
      const form = await request.formData()
      payload = Object.fromEntries(form.entries())
    }

    const { barbershopId, name, email, phone } = payload

    if (!barbershopId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        barbershopId,
        name,
        email: email || null,
        phone: phone || null,
      },
    })

    return NextResponse.redirect(`/dashboard/customers`, 302)
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


