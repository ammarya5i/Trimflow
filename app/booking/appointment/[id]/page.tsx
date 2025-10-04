import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/utils'

interface AppointmentDetailsPageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'

export default async function AppointmentDetailsPage({ params }: AppointmentDetailsPageProps) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      staff: true,
      service: true,
      barbershop: true,
    },
  })

  if (!appointment) {
    notFound()
  }

  const isCancelable = appointment.status === 'scheduled' && new Date(appointment.startTime).getTime() - Date.now() > 2 * 60 * 60 * 1000

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href={`/s/${appointment.barbershop.slug}`} className="text-sm text-primary hover:underline">← Back to booking</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Barbershop</div>
                <div className="font-medium">{appointment.barbershop.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">When</div>
                <div className="font-medium">{formatDateTime(appointment.startTime)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Service</div>
                <div className="font-medium">{appointment.service.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">{formatCurrency(appointment.totalPrice)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Barber</div>
                <div className="font-medium">{appointment.staff.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{appointment.status.replace('_', ' ')}</div>
              </div>
            </div>

            {isCancelable ? (
              <form action="/api/booking/cancel" method="post" className="pt-2">
                <input type="hidden" name="appointmentId" value={appointment.id} />
                <Button type="submit" variant="destructive">Cancel Appointment</Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">This appointment can no longer be canceled online.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


