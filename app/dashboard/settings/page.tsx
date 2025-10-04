import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function SettingsPage() {
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

  const services = await prisma.service.findMany({
    where: { barbershopId: barbershop?.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Service</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="/api/services/create" method="post" className="space-y-3">
                <input type="hidden" name="barbershopId" value={barbershop?.id || ''} />
                <Input name="name" placeholder="Service name" required />
                <Input name="duration" placeholder="Duration (minutes)" type="number" min="5" step="5" required />
                <Input name="price" placeholder="Price (cents)" type="number" min="0" step="50" required />
                <Input name="description" placeholder="Description (optional)" />
                <Button type="submit">Add</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services yet.</p>
              ) : (
                <div className="space-y-2">
                  {services.map((s) => (
                    <div key={s.id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.duration} min • {(s.price / 100).toFixed(2)} USD</div>
                      </div>
                      <form action="/api/services/delete" method="post">
                        <input type="hidden" name="id" value={s.id} />
                        <Button type="submit" variant="destructive" size="sm">Delete</Button>
                      </form>
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


