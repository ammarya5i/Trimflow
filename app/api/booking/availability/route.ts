import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { memoryStore } from '@/lib/memory-store'
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

    // For Salon Ahmet Barbers, check real appointments from memory store
    if (barbershopId === 'salon-ahmet-id') {
      const appointments = memoryStore.getAppointments(barbershopId)
      
      // Filter appointments for the selected date and staff
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.startTime)
        const selectedDateObj = new Date(date)
        return aptDate.toDateString() === selectedDateObj.toDateString() && 
               apt.staffId === staffId &&
               apt.status === 'scheduled'
      })

      // Generate basic time slots (9:00 AM to 11:30 PM, 30-minute intervals)
      const slots = []
      for (let hour = 9; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 23 && minute > 30) break // Stop at 23:30
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          slots.push(timeString)
        }
      }

      // Filter out occupied slots
      const availableSlots = slots.filter(slot => {
        const slotTime = new Date(`${date}T${slot}`)
        return !dayAppointments.some(apt => {
          const aptStart = new Date(apt.startTime)
          const aptEnd = new Date(apt.endTime)
          return slotTime >= aptStart && slotTime < aptEnd
        })
      })
      
      return NextResponse.json({ availableSlots })
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
