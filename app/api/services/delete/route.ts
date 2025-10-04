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
      return NextResponse.json({ error: 'Missing service id' }, { status: 400 })
    }

    await prisma.service.delete({ where: { id } })
    return NextResponse.redirect('/dashboard/settings', 302)
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


