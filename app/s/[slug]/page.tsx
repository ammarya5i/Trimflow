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
  owner_id: 'ahmet-owner-id',
  name: 'Salon Ahmet Barbers',
  slug: 'salon-ahmet-barbers',
  description: 'Professional barbershop in Mecidiyeköy, Istanbul. Offering traditional Turkish barbering and modern grooming services with 4.9-star rating from 608+ reviews.',
  address: 'Mecidiyeköy, Şht. Er Cihan Namlı Cd No:9 D:2B',
  city: 'Istanbul',
  state: 'Şişli',
  zip_code: '34387',
  country: 'TR',
  phone: '+90 541 883 31 20',
  email: 'info@salonahmetbarbers.com',
  website: 'https://www.instagram.com/salonahmetbarbers/',
  logo_url: null,
  cover_image_url: null,
  timezone: 'Europe/Istanbul',
  currency: 'TRY',
  language: 'tr',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  services: [
    {
      id: 'service-1',
      barbershop_id: 'salon-ahmet-id',
      name: 'Model Saç Kesimi',
      description: 'Professional model haircut with styling',
      duration: 45,
      price: 20000, // 200 TRY
      category: 'Hair',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'service-2',
      barbershop_id: 'salon-ahmet-id',
      name: 'Sakal Kesimi & Şekillendirme',
      description: 'Beard cutting and professional styling',
      duration: 30,
      price: 15000, // 150 TRY
      category: 'Beard',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'service-3',
      barbershop_id: 'salon-ahmet-id',
      name: 'Komple Bakım',
      description: 'Complete grooming package - hair + beard + facial care',
      duration: 60,
      price: 35000, // 350 TRY
      category: 'Complete',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'service-4',
      barbershop_id: 'salon-ahmet-id',
      name: 'Tıraş & Yüz Bakımı',
      description: 'Traditional shave with facial care',
      duration: 40,
      price: 18000, // 180 TRY
      category: 'Shave',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'service-5',
      barbershop_id: 'salon-ahmet-id',
      name: 'Saç Boyama',
      description: 'Professional hair coloring service',
      duration: 90,
      price: 25000, // 250 TRY
      category: 'Coloring',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  staff: [
    {
      id: 'staff-1',
      barbershop_id: 'salon-ahmet-id',
      user_id: 'ahmet-owner-id',
      name: 'Ahmet Usta',
      email: 'ahmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 20',
      role: 'admin' as const,
      avatar_url: null,
      bio: 'Master barber with 15+ years of experience in traditional Turkish barbering and modern techniques',
      specialties: ['Model Cuts', 'Beard Styling', 'Traditional Shaves', 'Hair Coloring'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'staff-2',
      barbershop_id: 'salon-ahmet-id',
      user_id: null,
      name: 'Mehmet Usta',
      email: 'mehmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 21',
      role: 'barber' as const,
      avatar_url: null,
      bio: 'Specialist in modern cuts, fades, and contemporary styling',
      specialties: ['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  workingHours: [
    { 
      id: 'wh-1', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 1, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Monday
    { 
      id: 'wh-2', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 2, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Tuesday
    { 
      id: 'wh-3', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 3, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Wednesday
    { 
      id: 'wh-4', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 4, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Thursday
    { 
      id: 'wh-5', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 5, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Friday
    { 
      id: 'wh-6', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 6, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, // Saturday
    { 
      id: 'wh-7', 
      barbershop_id: 'salon-ahmet-id', 
      staff_id: null, 
      day_of_week: 0, 
      start_time: '09:00', 
      end_time: '23:45', 
      is_working: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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
