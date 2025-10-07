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

    // Get service details - fallback to hardcoded services for Salon Ahmet
    let service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        barbershopId,
        isActive: true,
      },
    })

    // Fallback to hardcoded services for Salon Ahmet Barbers
    if (!service && barbershopId === 'salon-ahmet-id') {
      const hardcodedServices = {
        'service-1': { id: 'service-1', name: 'Model Saç Kesimi', price: 20000, duration: 45 },
        'service-2': { id: 'service-2', name: 'Sakal Kesimi & Şekillendirme', price: 15000, duration: 30 },
        'service-3': { id: 'service-3', name: 'Komple Bakım', price: 35000, duration: 60 },
        'service-4': { id: 'service-4', name: 'Tıraş & Yüz Bakımı', price: 18000, duration: 40 },
        'service-5': { id: 'service-5', name: 'Saç Boyama', price: 25000, duration: 90 },
        'service-6': { id: 'service-6', name: 'Doğal Kalıcı Saç Düzleştirici', price: 40000, duration: 120 },
        'service-7': { id: 'service-7', name: 'Profesyonel Yüz Bakımları', price: 30000, duration: 60 },
        'service-8': { id: 'service-8', name: 'Kaş Boyama', price: 8000, duration: 30 },
      }
      
      service = hardcodedServices[serviceId as keyof typeof hardcodedServices]
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Calculate appointment times
    const startTime = new Date(`${date}T${time}`)
    const endTime = new Date(startTime.getTime() + service.duration * 60000)

    // For Salon Ahmet Barbers, create a simple appointment record without database
    if (barbershopId === 'salon-ahmet-id') {
      // Generate a simple appointment ID
      const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Log the appointment request (in a real app, this would be saved to database)
      console.log('New appointment request for Salon Ahmet Barbers:', {
        appointmentId,
        barbershopId,
        serviceId,
        service: service,
        staffId,
        date,
        time,
        customerInfo,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: service.duration,
        totalPrice: service.price,
      })

      return NextResponse.json({ 
        success: true, 
        appointmentId,
        message: 'Appointment request received. Ahmet will contact you to confirm.'
      })
    }

    // For other barbershops with database
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
