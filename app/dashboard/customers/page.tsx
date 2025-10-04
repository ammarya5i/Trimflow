import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function CustomersPage() {
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

  const customers = await prisma.customer.findMany({
    where: { barbershopId: barbershop?.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="/api/customers/create" method="post" className="space-y-3">
                <input type="hidden" name="barbershopId" value={barbershop?.id || ''} />
                <Input name="name" placeholder="Full name" required />
                <Input name="email" placeholder="Email" type="email" />
                <Input name="phone" placeholder="Phone" />
                <Button type="submit">Add</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No customers yet.</p>
              ) : (
                <div className="space-y-2">
                  {customers.map((c) => (
                    <div key={c.id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email || '—'} • {c.phone || '—'}</div>
                      </div>
                      <form action="/api/customers/delete" method="post">
                        <input type="hidden" name="id" value={c.id} />
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


