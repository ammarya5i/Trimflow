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

    // Get customers from memory store
    const customers = memoryStore.getCustomers(barbershopId)
    const appointments = memoryStore.getAppointments(barbershopId)

    // Enhance customers with appointment data
    const customersWithStats = customers.map(customer => {
      const customerAppointments = appointments.filter(apt => apt.customerId === customer.id)
      
      return {
        ...customer,
        totalAppointments: customerAppointments.length,
        lastAppointment: customerAppointments.length > 0 
          ? customerAppointments.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0].startTime
          : null,
        totalSpent: customerAppointments
          .filter(apt => apt.status === 'completed')
          .reduce((sum, apt) => sum + apt.totalPrice, 0),
      }
    })

    return NextResponse.json({ customers: customersWithStats })

  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
