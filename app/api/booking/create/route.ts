import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { memoryStore } from '@/lib/memory-store'

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

    // Get service details from memory store
    let service = memoryStore.getService(barbershopId, serviceId)

    // Fallback to database for other barbershops
    if (!service) {
      service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          barbershopId,
          isActive: true,
        },
      })
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calculate appointment times
    const startTime = new Date(`${date}T${time}`)
    const endTime = new Date(startTime.getTime() + service.duration * 60000)

    // Create or find customer
    let customer = memoryStore.findCustomerByEmail(barbershopId, customerInfo.email)
    
    if (!customer) {
      customer = memoryStore.createCustomer({
        barbershopId,
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
      })
    }

    // Create appointment in memory store
    const appointment = memoryStore.createAppointment({
      barbershopId,
      customerId: customer.id,
      staffId,
      serviceId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: service.duration,
      status: 'scheduled',
      notes: customerInfo.notes,
      totalPrice: service.price,
      paymentStatus: 'pending',
    })

    console.log('New appointment created:', appointment)

    return NextResponse.json({ 
      success: true, 
      appointmentId: appointment.id,
      message: 'Appointment request received. Ahmet will contact you to confirm.'
    })


  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
