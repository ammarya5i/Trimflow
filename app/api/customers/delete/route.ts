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

    const { id } = payload
    if (!id) {
      return NextResponse.json({ error: 'Missing customer id' }, { status: 400 })
    }

    await prisma.customer.delete({ where: { id } })
    return NextResponse.redirect('/dashboard/customers', 302)
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


