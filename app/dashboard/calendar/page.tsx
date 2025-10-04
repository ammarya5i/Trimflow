import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, onboardingCompleted: true },
  })
  if (!user?.onboardingCompleted) {
    redirect('/onboarding')
  }

  const barbershop = await prisma.barbershop.findFirst({
    where: { ownerId: user.id },
    select: { id: true },
  })

  const now = new Date()
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const [todayAppointments, upcomingAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: { barbershopId: barbershop?.id, startTime: { gte: startOfToday, lte: endOfToday } },
      orderBy: { startTime: 'asc' },
      include: { customer: true, staff: true, service: true },
    }),
    prisma.appointment.findMany({
      where: { barbershopId: barbershop?.id, startTime: { gt: now }, status: 'scheduled' },
      orderBy: { startTime: 'asc' },
      include: { customer: true, staff: true, service: true },
      take: 20,
    }),
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments today.</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{apt.customer?.name || 'Customer'}</div>
                        <div className="text-xs text-muted-foreground">
                          {apt.service?.name} • {apt.staff?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatDateTime(apt.startTime)}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(apt.totalPrice)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{apt.customer?.name || 'Customer'}</div>
                        <div className="text-xs text-muted-foreground">
                          {apt.service?.name} • {apt.staff?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatDateTime(apt.startTime)}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(apt.totalPrice)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}


