'use client'

import { notFound } from 'next/navigation'
import { BookingPage } from '@/components/booking-page'
import { useParams } from 'next/navigation'

interface BookingPageProps {
  params: {
    slug: string
  }
}

// Static data for Salon Ahmet Barbers
const SALON_AHMET_DATA = {
  id: 'salon-ahmet-id',
  ownerId: 'ahmet-owner-id',
  name: 'Salon Ahmet Barbers',
  slug: 'salon-ahmet-barbers',
  description: 'Professional barbershop in Mecidiyeköy, Istanbul. Offering traditional Turkish barbering and modern grooming services with 4.9-star rating from 608+ reviews.',
  address: 'Mecidiyeköy, Şht. Er Cihan Namlı Cd No:9 D:2B',
  city: 'Istanbul',
  state: 'Şişli',
  zipCode: '34387',
  country: 'TR',
  phone: '+90 541 883 31 20',
  email: 'info@salonahmetbarbers.com',
  website: 'https://www.instagram.com/salonahmetbarbers/',
  logoUrl: null,
  coverImageUrl: null,
  timezone: 'Europe/Istanbul',
  currency: 'TRY',
  language: 'tr',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  services: [
    {
      id: 'service-1',
      barbershopId: 'salon-ahmet-id',
      name: 'Model Saç Kesimi',
      description: 'Professional model haircut with styling',
      duration: 45,
      price: 20000, // 200 TRY
      category: 'Hair',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'service-2',
      barbershopId: 'salon-ahmet-id',
      name: 'Sakal Kesimi & Şekillendirme',
      description: 'Beard cutting and professional styling',
      duration: 30,
      price: 15000, // 150 TRY
      category: 'Beard',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'service-3',
      barbershopId: 'salon-ahmet-id',
      name: 'Komple Bakım',
      description: 'Complete grooming package - hair + beard + facial care',
      duration: 60,
      price: 35000, // 350 TRY
      category: 'Complete',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'service-4',
      barbershopId: 'salon-ahmet-id',
      name: 'Tıraş & Yüz Bakımı',
      description: 'Traditional shave with facial care',
      duration: 40,
      price: 18000, // 180 TRY
      category: 'Shave',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'service-5',
      barbershopId: 'salon-ahmet-id',
      name: 'Saç Boyama',
      description: 'Professional hair coloring service',
      duration: 90,
      price: 25000, // 250 TRY
      category: 'Coloring',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  staff: [
    {
      id: 'staff-1',
      barbershopId: 'salon-ahmet-id',
      userId: 'ahmet-owner-id',
      name: 'Ahmet Usta',
      email: 'ahmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 20',
      role: 'admin' as const,
      avatarUrl: null,
      bio: 'Master barber with 15+ years of experience in traditional Turkish barbering and modern techniques',
      specialties: ['Model Cuts', 'Beard Styling', 'Traditional Shaves', 'Hair Coloring'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'staff-2',
      barbershopId: 'salon-ahmet-id',
      userId: null,
      name: 'Mehmet Usta',
      email: 'mehmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 21',
      role: 'barber' as const,
      avatarUrl: null,
      bio: 'Specialist in modern cuts, fades, and contemporary styling',
      specialties: ['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  workingHours: [
    { 
      id: 'wh-1', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 1, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Monday
    { 
      id: 'wh-2', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 2, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Tuesday
    { 
      id: 'wh-3', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 3, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Wednesday
    { 
      id: 'wh-4', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 4, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Thursday
    { 
      id: 'wh-5', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 5, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Friday
    { 
      id: 'wh-6', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 6, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Saturday
    { 
      id: 'wh-7', 
      barbershopId: 'salon-ahmet-id', 
      staffId: null, 
      dayOfWeek: 0, 
      startTime: '09:00', 
      endTime: '23:45', 
      isWorking: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, // Sunday
  ],
}

export default function BarbershopBookingPage() {
  const params = useParams()
  const slug = params.slug as string

  if (slug !== 'salon-ahmet-barbers') {
    notFound()
  }

  return <BookingPage barbershop={SALON_AHMET_DATA} />
}
