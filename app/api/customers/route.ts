import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // For now, return static customer data since we're using static data
    // In production, this would fetch from the database
    const customers = [
      {
        id: 'customer-1',
        name: 'Mehmet Yılmaz',
        email: 'mehmet@example.com',
        phone: '+90 555 123 4567',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'customer-2',
        name: 'Ali Demir',
        email: 'ali@example.com',
        phone: '+90 555 987 6543',
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
