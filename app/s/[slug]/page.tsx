import { notFound } from 'next/navigation'
import { BookingPage } from '@/components/booking-page'

interface BookingPageProps {
  params: {
    slug: string
  }
}

// Static data for Salon Ahmet Barbers
const SALON_AHMET_DATA = {
  id: 'salon-ahmet-id',
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
  timezone: 'Europe/Istanbul',
  currency: 'TRY',
  language: 'tr',
  isActive: true,
  services: [
    {
      id: 'service-1',
      name: 'Model Saç Kesimi',
      description: 'Professional model haircut with styling',
      duration: 45,
      price: 20000, // 200 TRY
      category: 'Hair',
      isActive: true,
    },
    {
      id: 'service-2',
      name: 'Sakal Kesimi & Şekillendirme',
      description: 'Beard cutting and professional styling',
      duration: 30,
      price: 15000, // 150 TRY
      category: 'Beard',
      isActive: true,
    },
    {
      id: 'service-3',
      name: 'Komple Bakım',
      description: 'Complete grooming package - hair + beard + facial care',
      duration: 60,
      price: 35000, // 350 TRY
      category: 'Complete',
      isActive: true,
    },
    {
      id: 'service-4',
      name: 'Tıraş & Yüz Bakımı',
      description: 'Traditional shave with facial care',
      duration: 40,
      price: 18000, // 180 TRY
      category: 'Shave',
      isActive: true,
    },
    {
      id: 'service-5',
      name: 'Saç Boyama',
      description: 'Professional hair coloring service',
      duration: 90,
      price: 25000, // 250 TRY
      category: 'Coloring',
      isActive: true,
    },
  ],
  staff: [
    {
      id: 'staff-1',
      name: 'Ahmet Usta',
      email: 'ahmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 20',
      role: 'admin',
      bio: 'Master barber with 15+ years of experience in traditional Turkish barbering and modern techniques',
      specialties: ['Model Cuts', 'Beard Styling', 'Traditional Shaves', 'Hair Coloring'],
      isActive: true,
    },
    {
      id: 'staff-2',
      name: 'Mehmet Usta',
      email: 'mehmet@salonahmetbarbers.com',
      phone: '+90 541 883 31 21',
      role: 'barber',
      bio: 'Specialist in modern cuts, fades, and contemporary styling',
      specialties: ['Fade Cuts', 'Modern Styles', 'Hair Washing', 'Styling'],
      isActive: true,
    },
  ],
  workingHours: [
    { dayOfWeek: 1, startTime: '09:00', endTime: '23:45', isWorking: true }, // Monday
    { dayOfWeek: 2, startTime: '09:00', endTime: '23:45', isWorking: true }, // Tuesday
    { dayOfWeek: 3, startTime: '09:00', endTime: '23:45', isWorking: true }, // Wednesday
    { dayOfWeek: 4, startTime: '09:00', endTime: '23:45', isWorking: true }, // Thursday
    { dayOfWeek: 5, startTime: '09:00', endTime: '23:45', isWorking: true }, // Friday
    { dayOfWeek: 6, startTime: '09:00', endTime: '23:45', isWorking: true }, // Saturday
    { dayOfWeek: 0, startTime: '09:00', endTime: '23:45', isWorking: true }, // Sunday
  ],
}

export async function generateMetadata({ params }: BookingPageProps) {
  if (params.slug !== 'salon-ahmet-barbers') {
    return {
      title: 'Barbershop Not Found',
    }
  }

  return {
    title: `Book Appointment - ${SALON_AHMET_DATA.name}`,
    description: SALON_AHMET_DATA.description,
  }
}

export default async function BarbershopBookingPage({ params }: BookingPageProps) {
  if (params.slug !== 'salon-ahmet-barbers') {
    notFound()
  }

  return <BookingPage barbershop={SALON_AHMET_DATA} />
}
