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

    // Get real stats from memory store
    const stats = memoryStore.getStats(barbershopId)
    const recentAppointments = memoryStore.getRecentAppointments(barbershopId, 5)

    return NextResponse.json({
      stats,
      recentAppointments,
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}