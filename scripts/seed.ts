import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
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
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Ali Demir'
        }
      },
      update: {},
      create: {
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
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Mehmet Yılmaz'
        }
      },
      update: {},
      create: {
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

    const staff3 = await prisma.staff.upsert({
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Ayşe Kaya'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Ayşe Kaya',
        email: 'ayse@berberali.com',
        phone: '+90 212 555 0125',
        role: 'reception',
        bio: 'Friendly receptionist and customer service specialist',
        specialties: ['Customer Service', 'Appointment Management'],
        isActive: true,
      },
    })

    // Create services
    const service1 = await prisma.service.upsert({
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Saç Kesimi'
        }
      },
      update: {},
      create: {
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
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Sakal Tıraşı'
        }
      },
      update: {},
      create: {
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
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Saç + Sakal'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Saç + Sakal',
        description: 'Komple bakım hizmeti',
        duration: 45,
        price: 7000, // 70 TRY in kuruş
        category: 'Complete',
        isActive: true,
      },
    })

    const service4 = await prisma.service.upsert({
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Saç Yıkama'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Saç Yıkama',
        description: 'Profesyonel saç yıkama ve bakım',
        duration: 15,
        price: 2000, // 20 TRY in kuruş
        category: 'Hair Care',
        isActive: true,
      },
    })

    const service5 = await prisma.service.upsert({
      where: { 
        barbershopId_name: {
          barbershopId: barbershop.id,
          name: 'Fade Kesim'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Fade Kesim',
        description: 'Modern fade kesim',
        duration: 40,
        price: 6000, // 60 TRY in kuruş
        category: 'Modern',
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

    // Create sample customers
    const customer1 = await prisma.customer.upsert({
      where: { 
        barbershopId_email: {
          barbershopId: barbershop.id,
          email: 'ahmet@example.com'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 212 555 0101',
        dateOfBirth: new Date('1985-03-15'),
        notes: 'Prefers short cuts, allergic to certain products',
      },
    })

    const customer2 = await prisma.customer.upsert({
      where: { 
        barbershopId_email: {
          barbershopId: barbershop.id,
          email: 'mehmet@example.com'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Mehmet Özkan',
        email: 'mehmet@example.com',
        phone: '+90 212 555 0102',
        dateOfBirth: new Date('1990-07-22'),
        notes: 'Regular customer, likes beard styling',
      },
    })

    const customer3 = await prisma.customer.upsert({
      where: { 
        barbershopId_email: {
          barbershopId: barbershop.id,
          email: 'can@example.com'
        }
      },
      update: {},
      create: {
        barbershopId: barbershop.id,
        name: 'Can Demir',
        email: 'can@example.com',
        phone: '+90 212 555 0103',
        dateOfBirth: new Date('1995-11-08'),
        notes: 'New customer, interested in modern styles',
      },
    })

    // Create sample appointments
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    await prisma.appointment.upsert({
      where: { id: 'demo-appointment-1' },
      update: {},
      create: {
        id: 'demo-appointment-1',
        barbershopId: barbershop.id,
        customerId: customer1.id,
        staffId: staff1.id,
        serviceId: service1.id,
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 30 * 60 * 1000),
        duration: 30,
        status: 'scheduled',
        notes: 'Regular haircut',
        totalPrice: 5000,
        paymentStatus: 'pending',
      },
    })

    await prisma.appointment.upsert({
      where: { id: 'demo-appointment-2' },
      update: {},
      create: {
        id: 'demo-appointment-2',
        barbershopId: barbershop.id,
        customerId: customer2.id,
        staffId: staff2.id,
        serviceId: service3.id,
        startTime: dayAfterTomorrow,
        endTime: new Date(dayAfterTomorrow.getTime() + 45 * 60 * 1000),
        duration: 45,
        status: 'scheduled',
        notes: 'Complete grooming service',
        totalPrice: 7000,
        paymentStatus: 'pending',
      },
    })

    await prisma.appointment.upsert({
      where: { id: 'demo-appointment-3' },
      update: {},
      create: {
        id: 'demo-appointment-3',
        barbershopId: barbershop.id,
        customerId: customer3.id,
        staffId: staff1.id,
        serviceId: service5.id,
        startTime: twoHoursAgo,
        endTime: new Date(twoHoursAgo.getTime() + 40 * 60 * 1000),
        duration: 40,
        status: 'completed',
        notes: 'Fade cut completed successfully',
        totalPrice: 6000,
        paymentStatus: 'paid',
        paymentMethod: 'cash',
      },
    })

    // Link staff to services
    const staffServices = [
      // Ali (admin) can do all services
      { staffId: staff1.id, serviceId: service1.id },
      { staffId: staff1.id, serviceId: service2.id },
      { staffId: staff1.id, serviceId: service3.id },
      { staffId: staff1.id, serviceId: service4.id },
      { staffId: staff1.id, serviceId: service5.id },
      // Mehmet (barber) can do most services
      { staffId: staff2.id, serviceId: service1.id },
      { staffId: staff2.id, serviceId: service2.id },
      { staffId: staff2.id, serviceId: service3.id },
      { staffId: staff2.id, serviceId: service4.id },
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

    console.log('✅ Database seeded successfully!')
    console.log(`📱 Demo barbershop: https://trimflow.vercel.app/s/berber-ali`)
    console.log(`👤 Demo login: demo@trimflow.com`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seed completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seed failed:', error)
    process.exit(1)
  })