import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // Create Ahmet Salon owner
    const owner = await prisma.user.upsert({
      where: { email: 'ahmet@ahmetsalon.com' },
      update: {},
      create: {
        email: 'ahmet@ahmetsalon.com',
        name: 'Ahmet Salon',
        onboardingCompleted: true,
        subscriptionPlan: 'PRO',
        subscriptionStatus: 'active',
      },
    })

    // Create Ahmet Salon barbershop
    const barbershop = await prisma.barbershop.upsert({
      where: { slug: 'ahmet-salon' },
      update: {},
      create: {
        ownerId: owner.id,
        name: 'Ahmet Salon',
        slug: 'ahmet-salon',
        description: 'Istanbul\'s premier barbershop for traditional and modern grooming services. Experience the perfect blend of Turkish barbering heritage and contemporary style.',
        address: 'Nişantaşı Mahallesi, Teşvikiye Caddesi No: 45',
        city: 'Istanbul',
        state: 'Istanbul',
        zipCode: '34365',
        country: 'TR',
        phone: '+90 212 123 45 67',
        email: 'info@ahmetsalon.com',
        website: 'https://ahmetsalon.com',
        timezone: 'Europe/Istanbul',
        currency: 'TRY',
        language: 'tr',
        isActive: true,
      },
    })

    // Create staff members
    const staff1 = await prisma.staff.create({
      data: {
        barbershopId: barbershop.id,
        userId: owner.id,
        name: 'Ahmet Usta',
        email: 'ahmet@ahmetsalon.com',
        phone: '+90 212 123 45 67',
        role: 'admin',
        bio: 'Master barber with 20 years of experience in traditional Turkish barbering and modern techniques',
        specialties: ['Classic Turkish Cuts', 'Beard Styling', 'Hot Towel Shaves', 'Traditional Services'],
        isActive: true,
      },
    })

    const staff2 = await prisma.staff.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Mehmet Usta',
        email: 'mehmet@ahmetsalon.com',
        phone: '+90 212 123 45 68',
        role: 'barber',
        bio: 'Specialist in modern cuts, fades, and contemporary styling',
        specialties: ['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'],
        isActive: true,
      },
    })

    const staff3 = await prisma.staff.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Can Usta',
        email: 'can@ahmetsalon.com',
        phone: '+90 212 123 45 69',
        role: 'barber',
        bio: 'Expert in beard grooming and luxury treatments',
        specialties: ['Beard Grooming', 'Luxury Treatments', 'Face Massage', 'Premium Services'],
        isActive: true,
      },
    })

    // Create services
    const service1 = await prisma.service.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Classic Cut',
        description: 'Traditional Turkish barbering with professional haircut, beard trim, hot towel treatment, hair wash, and styling',
        duration: 30,
        price: 15000, // 150 TRY in kuruş
        category: 'Classic',
        isActive: true,
      },
    })

    const service2 = await prisma.service.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Premium Cut',
        description: 'Our most popular service with premium haircut, beard styling, hot towel shave, hair wash & conditioning, professional styling, face massage, and aftercare consultation',
        duration: 45,
        price: 25000, // 250 TRY in kuruş
        category: 'Premium',
        isActive: true,
      },
    })

    const service3 = await prisma.service.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Luxury Experience',
        description: 'Complete grooming package with everything in Premium plus full beard treatment, eyebrow trimming, nose hair trimming, premium products, extended massage, and complimentary refreshments',
        duration: 60,
        price: 40000, // 400 TRY in kuruş
        category: 'Luxury',
        isActive: true,
      },
    })

    const service4 = await prisma.service.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Beard Trim & Style',
        description: 'Professional beard trimming, shaping, and styling with hot towel treatment',
        duration: 25,
        price: 8000, // 80 TRY in kuruş
        category: 'Beard',
        isActive: true,
      },
    })

    const service5 = await prisma.service.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Hot Towel Shave',
        description: 'Traditional Turkish hot towel shave with premium products and face massage',
        duration: 35,
        price: 12000, // 120 TRY in kuruş
        category: 'Traditional',
        isActive: true,
      },
    })

    // Create working hours
    const workingHoursData = [
      // Monday to Saturday: 9:00 - 20:00
      ...Array.from({ length: 6 }, (_, i) => ({
        barbershopId: barbershop.id,
        dayOfWeek: i + 1, // Monday = 1, Saturday = 6
        startTime: '09:00',
        endTime: '20:00',
        isWorking: true,
      })),
      // Sunday: 10:00 - 18:00
      {
        barbershopId: barbershop.id,
        dayOfWeek: 0, // Sunday
        startTime: '10:00',
        endTime: '18:00',
        isWorking: true,
      },
    ]

    for (const hours of workingHoursData) {
      await prisma.workingHours.create({
        data: hours,
      })
    }

    // Create sample customers
    const customer1 = await prisma.customer.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        phone: '+90 212 555 0101',
        dateOfBirth: new Date('1985-03-15'),
        notes: 'Prefers short cuts, allergic to certain products',
      },
    })

    const customer2 = await prisma.customer.create({
      data: {
        barbershopId: barbershop.id,
        name: 'Mehmet Özkan',
        email: 'mehmet@example.com',
        phone: '+90 212 555 0102',
        dateOfBirth: new Date('1990-07-22'),
        notes: 'Regular customer, likes beard styling',
      },
    })

    const customer3 = await prisma.customer.create({
      data: {
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

    await prisma.appointment.create({
      data: {
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

    await prisma.appointment.create({
      data: {
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

    await prisma.appointment.create({
      data: {
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
      await prisma.staffService.create({
        data: staffService,
      })
    }

    console.log('✅ Database seeded successfully!')
    console.log(`📱 Salon Ahmet Barbers: https://salonahmetbarbers.vercel.app/s/salon-ahmet-barbers`)
    console.log(`👤 Owner login: ahmet@salonahmetbarbers.com`)
    console.log(`📄 Schema file: schema.sql`)

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