import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_request: NextRequest) {
  try {
    const existing = await prisma.barbershop.findFirst({ where: { slug: 'berber-ali' } })
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Demo already seeded', slug: 'berber-ali' })
    }

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

    const barbershop = await prisma.barbershop.create({
      data: {
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

    const staff1 = await prisma.staff.create({
      data: {
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
    const staff2 = await prisma.staff.create({
      data: {
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

    const service1 = await prisma.service.create({
      data: { barbershopId: barbershop.id, name: 'Saç Kesimi', description: 'Profesyonel saç kesimi', duration: 30, price: 5000, category: 'Hair', isActive: true },
    })
    const service3 = await prisma.service.create({
      data: { barbershopId: barbershop.id, name: 'Saç + Sakal', description: 'Komple bakım hizmeti', duration: 45, price: 7000, category: 'Complete', isActive: true },
    })
    const service5 = await prisma.service.create({
      data: { barbershopId: barbershop.id, name: 'Fade Kesim', description: 'Modern fade kesim', duration: 40, price: 6000, category: 'Modern', isActive: true },
    })

    await prisma.staffService.createMany({
      data: [
        { staffId: staff1.id, serviceId: service1.id },
        { staffId: staff1.id, serviceId: service3.id },
        { staffId: staff1.id, serviceId: service5.id },
        { staffId: staff2.id, serviceId: service1.id },
        { staffId: staff2.id, serviceId: service3.id },
      ],
      skipDuplicates: true,
    })

    // Basic working hours Mon-Fri 09:00-18:00
    const hours: Array<{ dayOfWeek: number; startTime: string; endTime: string; isWorking: boolean }> = []
    for (let d = 1; d <= 5; d++) hours.push({ dayOfWeek: d, startTime: '09:00', endTime: '18:00', isWorking: true })
    hours.push({ dayOfWeek: 6, startTime: '09:00', endTime: '16:00', isWorking: true })
    hours.push({ dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isWorking: false })
    await prisma.$transaction(
      hours.map((h) =>
        prisma.workingHours.create({ data: { barbershopId: barbershop.id, ...h } })
      )
    )

    return NextResponse.json({ ok: true, slug: 'berber-ali', ownerEmail: 'demo@trimflow.com' })
  } catch (error) {
    console.error('Demo seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  // Mirror POST for convenience when triggering via browser or simple curl
  return POST(_request)
}


