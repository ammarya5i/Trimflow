import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { memoryStore } from '@/lib/memory-store'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For Ahmet's admin account, use Salon Ahmet Barbers data
    const barbershopId = session.user.email === 'ahmet@salonahmetbarbers.com' 
      ? 'salon-ahmet-id' 
      : null

    if (!barbershopId) {
      return NextResponse.json({ error: 'Barbershop not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // YYYY-MM format
    const year = searchParams.get('year')

    // Get appointments from memory store
    const appointments = memoryStore.getAppointments(barbershopId)
    
    // Filter appointments for the requested month/year
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      const aptYear = aptDate.getFullYear()
      const aptMonth = aptDate.getMonth() + 1
      
      if (month && year) {
        return aptYear === parseInt(year) && aptMonth === parseInt(month)
      }
      
      // Default to current month if no params provided
      const now = new Date()
      return aptYear === now.getFullYear() && aptMonth === now.getMonth() + 1
    })

    // Format appointments for calendar display
    const calendarAppointments = filteredAppointments.map(apt => {
      const customer = memoryStore.findCustomerById(apt.customerId)
      const staff = memoryStore.getStaff(barbershopId).find(s => s.id === apt.staffId)
      const service = memoryStore.getService(barbershopId, apt.serviceId)
      
      return {
        id: apt.id,
        title: service?.name || 'Service',
        start: apt.startTime,
        end: apt.endTime,
        status: apt.status,
        customer: customer ? { name: customer.name, phone: customer.phone } : null,
        staff: staff ? { name: staff.name } : null,
        service: service ? { name: service.name, price: service.price } : null,
        notes: apt.notes,
        totalPrice: apt.totalPrice,
      }
    })

    return NextResponse.json({ appointments: calendarAppointments })

  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update appointment status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const barbershopId = session.user.email === 'ahmet@salonahmetbarbers.com' 
      ? 'salon-ahmet-id' 
      : null

    if (!barbershopId) {
      return NextResponse.json({ error: 'Barbershop not found' }, { status: 404 })
    }

    const { appointmentId, status } = await request.json()

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing appointmentId or status' }, { status: 400 })
    }

    const updatedAppointment = memoryStore.updateAppointment(appointmentId, { status })

    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, appointment: updatedAppointment })

  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
