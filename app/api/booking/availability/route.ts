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
