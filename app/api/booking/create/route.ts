import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      barbershopId,
      serviceId,
      staffId,
      date,
      time,
      customerInfo,
    } = body

    if (!barbershopId || !serviceId || !staffId || !date || !time || !customerInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get service details
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        barbershopId,
        isActive: true,
      },
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calculate appointment times
    const startTime = new Date(`${date}T${time}`)
    const endTime = new Date(startTime.getTime() + service.duration * 60000)

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: {
        barbershopId,
        email: customerInfo.email,
      },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          barbershopId,
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
      })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        barbershopId,
        customerId: customer.id,
        staffId,
        serviceId,
        startTime,
        endTime,
        duration: service.duration,
        status: 'scheduled',
        notes: customerInfo.notes,
        totalPrice: service.price,
        paymentStatus: 'pending',
      },
    })

    return NextResponse.json({ 
      success: true, 
      appointmentId: appointment.id 
    })

  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
