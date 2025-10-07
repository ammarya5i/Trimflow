import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTimeSlots, isTimeSlotAvailable } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const staffId = searchParams.get('staffId')
    const serviceId = searchParams.get('serviceId')
    const barbershopId = searchParams.get('barbershopId')

    if (!date || !staffId || !serviceId || !barbershopId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
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

    // Get existing appointments for the selected date and staff
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const appointments = await prisma.appointment.findMany({
      where: {
        barbershopId,
        staffId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['scheduled', 'confirmed'],
        },
      },
      select: {
        startTime: true,
        duration: true,
      },
    })

    // Get working hours for the selected date
    const selectedDateObj = new Date(date)
    const dayOfWeek = selectedDateObj.getDay()
    
    const workingHours = await prisma.workingHours.findFirst({
      where: {
        barbershopId,
        dayOfWeek,
        isWorking: true,
      },
    })

    // For Salon Ahmet Barbers, return basic time slots without database check
    if (barbershopId === 'salon-ahmet-id') {
      // Generate basic time slots (9:00 AM to 11:30 PM, 30-minute intervals)
      const slots = []
      for (let hour = 9; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 23 && minute > 30) break // Stop at 23:30
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          slots.push(timeString)
        }
      }
      
      return NextResponse.json({ availableSlots: slots })
    }

    if (!workingHours) {
      return NextResponse.json({ availableSlots: [] })
    }

    // Generate time slots
    const slots = getTimeSlots(workingHours.startTime, workingHours.endTime, service.duration)
    
    // Transform appointments to match expected format
    const transformedAppointments = appointments.map(apt => ({
      start_time: apt.startTime.toTimeString().slice(0, 5),
      duration: apt.duration
    }))

    // Filter available slots
    const available = slots.filter((slot: string) => 
      isTimeSlotAvailable(slot, transformedAppointments, service.duration)
    )

    return NextResponse.json({ availableSlots: available })

  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
