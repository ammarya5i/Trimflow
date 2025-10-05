import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting demo data creation...')

    // Create demo barbershop owner
    const owner = await prisma.user.upsert({
      where: { email: 'demo@trimflow.com' },
      update: {},
      create: {
        email: 'demo@trimflow.com',
        name: 'Demo Owner',
        onboardingCompleted: true,
        subscriptionPlan: 'PRO',
        subscriptionStatus: 'active',
      },
    })

    // Create demo barbershop
    const barbershop = await prisma.barbershop.upsert({
      where: { slug: 'berber-ali' },
      update: {},
      create: {
        ownerId: owner.id,
        name: 'Berber Ali',
        slug: 'berber-ali',
        description: 'Professional barbershop offering modern cuts and traditional services',
        address: '123 Main Street',
        city: 'Istanbul',
        state: 'Istanbul',
        zipCode: '34000',
        country: 'TR',
        phone: '+90 212 555 0123',
        email: 'info@berberali.com',
        website: 'https://berberali.com',
        timezone: 'Europe/Istanbul',
        currency: 'TRY',
        language: 'tr',
        isActive: true,
      },
    })

    // Create staff members
    const staff1 = await prisma.staff.upsert({
      where: { id: 'demo-staff-1' },
      update: {},
      create: {
        id: 'demo-staff-1',
        barbershopId: barbershop.id,
        userId: owner.id,
        name: 'Ali Demir',
        email: 'ali@berberali.com',
        phone: '+90 212 555 0123',
        role: 'admin',
        bio: 'Master barber with 15 years of experience',
        specialties: ['Classic Cuts', 'Beard Styling', 'Hair Coloring'],
        isActive: true,
      },
    })

    const staff2 = await prisma.staff.upsert({
      where: { id: 'demo-staff-2' },
      update: {},
      create: {
        id: 'demo-staff-2',
        barbershopId: barbershop.id,
        name: 'Mehmet Yılmaz',
        email: 'mehmet@berberali.com',
        phone: '+90 212 555 0124',
        role: 'barber',
        bio: 'Specialist in modern cuts and fades',
        specialties: ['Fade Cuts', 'Modern Styles', 'Hair Washing'],
        isActive: true,
      },
    })

    // Create services
    const service1 = await prisma.service.upsert({
      where: { id: 'demo-service-1' },
      update: {},
      create: {
        id: 'demo-service-1',
        barbershopId: barbershop.id,
        name: 'Saç Kesimi',
        description: 'Profesyonel saç kesimi',
        duration: 30,
        price: 5000, // 50 TRY in kuruş
        category: 'Hair',
        isActive: true,
      },
    })

    const service2 = await prisma.service.upsert({
      where: { id: 'demo-service-2' },
      update: {},
      create: {
        id: 'demo-service-2',
        barbershopId: barbershop.id,
        name: 'Sakal Tıraşı',
        description: 'Sakal düzeltme ve şekillendirme',
        duration: 20,
        price: 3000, // 30 TRY in kuruş
        category: 'Beard',
        isActive: true,
      },
    })

    const service3 = await prisma.service.upsert({
      where: { id: 'demo-service-3' },
      update: {},
      create: {
        id: 'demo-service-3',
        barbershopId: barbershop.id,
        name: 'Saç + Sakal',
        description: 'Komple bakım hizmeti',
        duration: 45,
        price: 7000, // 70 TRY in kuruş
        category: 'Complete',
        isActive: true,
      },
    })

    // Create working hours
    const workingHoursData = [
      // Monday to Friday: 9:00 - 18:00
      ...Array.from({ length: 5 }, (_, i) => ({
        barbershopId: barbershop.id,
        dayOfWeek: i + 1, // Monday = 1, Friday = 5
        startTime: '09:00',
        endTime: '18:00',
        isWorking: true,
      })),
      // Saturday: 9:00 - 16:00
      {
        barbershopId: barbershop.id,
        dayOfWeek: 6, // Saturday
        startTime: '09:00',
        endTime: '16:00',
        isWorking: true,
      },
      // Sunday: Closed
      {
        barbershopId: barbershop.id,
        dayOfWeek: 0, // Sunday
        startTime: '09:00',
        endTime: '18:00',
        isWorking: false,
      },
    ]

    for (const hours of workingHoursData) {
      await prisma.workingHours.upsert({
        where: {
          barbershopId_dayOfWeek: {
            barbershopId: barbershop.id,
            dayOfWeek: hours.dayOfWeek,
          },
        },
        update: {},
        create: hours,
      })
    }

    // Link staff to services
    const staffServices = [
      { staffId: staff1.id, serviceId: service1.id },
      { staffId: staff1.id, serviceId: service2.id },
      { staffId: staff1.id, serviceId: service3.id },
      { staffId: staff2.id, serviceId: service1.id },
      { staffId: staff2.id, serviceId: service2.id },
      { staffId: staff2.id, serviceId: service3.id },
    ]

    for (const staffService of staffServices) {
      await prisma.staffService.upsert({
        where: {
          staffId_serviceId: {
            staffId: staffService.staffId,
            serviceId: staffService.serviceId,
          },
        },
        update: {},
        create: staffService,
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data created successfully!',
      barbershop: {
        id: barbershop.id,
        slug: barbershop.slug,
        name: barbershop.name,
        url: `/s/${barbershop.slug}`
      }
    })

  } catch (error) {
    console.error('❌ Error creating demo data:', error)
    return NextResponse.json({ error: 'Failed to create demo data' }, { status: 500 })
  }
}