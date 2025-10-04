import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookingPage } from '@/components/booking-page'

interface BookingPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BookingPageProps) {
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      slug: params.slug,
      isActive: true,
    },
    select: {
      name: true,
      description: true,
    },
  })

  if (!barbershop) {
    return {
      title: 'Barbershop Not Found',
    }
  }

  return {
    title: `Book Appointment - ${barbershop.name}`,
    description: barbershop.description || `Book an appointment at ${barbershop.name}`,
  }
}

export default async function BookingPageRoute({ params }: BookingPageProps) {
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      slug: params.slug,
      isActive: true,
    },
    include: {
      services: {
        where: { isActive: true },
      },
      staff: {
        where: { isActive: true },
      },
      workingHours: true,
    },
  })

  if (!barbershop) {
    notFound()
  }

  return <BookingPage barbershop={barbershop} />
}
