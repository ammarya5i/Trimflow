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

    const { appointmentId } = payload
    if (!appointmentId) {
      return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 })
    }

    const apt = await prisma.appointment.findUnique({ where: { id: appointmentId } })
    if (!apt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Only allow cancel if more than 2 hours before start
    if (new Date(apt.startTime).getTime() - Date.now() <= 2 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Too late to cancel' }, { status: 400 })
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'cancelled' },
    })

    return NextResponse.redirect(`/booking/appointment/${appointmentId}`, 302)
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


