import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate slug from barbershop name
    const slug = formData.barbershopSlug || formData.barbershopName.toLowerCase().replace(/\s+/g, '-')
    
    // Create barbershop
    const barbershop = await prisma.barbershop.create({
      data: {
        ownerId: user.id,
        name: formData.barbershopName,
        slug,
        description: formData.barbershopDescription,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currency: 'USD',
        language: 'en',
      },
    })

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: formData.fullName,
        onboardingCompleted: true,
      },
    })

    // Create services
    const servicesData = formData.services.map((service: any) => ({
      barbershopId: barbershop.id,
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
    }))

    await prisma.service.createMany({
      data: servicesData,
    })

    // Create working hours
    const workingHoursData = Object.entries(formData.workingHours).map(([day, hours]: [string, any]) => ({
      barbershopId: barbershop.id,
      dayOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day),
      startTime: hours.start,
      endTime: hours.end,
      isWorking: hours.isWorking,
    }))

    await prisma.workingHours.createMany({
      data: workingHoursData,
    })

    // Create staff (owner as admin)
    await prisma.staff.create({
      data: {
        barbershopId: barbershop.id,
        userId: user.id,
        name: formData.fullName,
        email: session.user.email,
        role: 'admin',
      },
    })

    return NextResponse.json({ success: true, barbershopId: barbershop.id })

  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
