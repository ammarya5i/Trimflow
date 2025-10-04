import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let payload: any
    if (contentType.includes('application/json')) {
      payload = await request.json()
    } else {
      const form = await request.formData()
      payload = Object.fromEntries(form.entries())
    }

    const { barbershopId, name, duration, price, description } = payload

    if (!barbershopId || !name || !duration || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        barbershopId,
        name,
        duration: Number(duration),
        price: Number(price),
        description: description || null,
      },
    })

    return NextResponse.redirect(`/dashboard/settings`, 302)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


