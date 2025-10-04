import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's barbershop
    const barbershop = await prisma.barbershop.findFirst({
      where: { ownerId: user.id },
      select: { id: true },
    })

    if (!barbershop) {
      return NextResponse.json({ 
        stats: {
          totalAppointments: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          todayAppointments: 0,
          upcomingAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          noShowAppointments: 0,
        },
        recentAppointments: []
      })
    }

    // Get appointments with related data
    const appointments = await prisma.appointment.findMany({
      where: { barbershopId: barbershop.id },
      include: {
        customer: true,
        staff: true,
        service: true,
      },
    })

    // Get customers count
    const customersCount = await prisma.customer.count({
      where: { barbershopId: barbershop.id },
    })

    // Calculate stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const totalAppointments = appointments.length
    const totalRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.totalPrice, 0)
    
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      return aptDate >= today && aptDate < tomorrow
    }).length

    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      return aptDate > new Date() && apt.status === 'scheduled'
    }).length

    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length
    const noShowAppointments = appointments.filter(apt => apt.status === 'no_show').length

    // Get recent appointments (last 5)
    const recentAppointments = appointments
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalAppointments,
        totalRevenue,
        totalCustomers: customersCount,
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        noShowAppointments,
      },
      recentAppointments,
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
