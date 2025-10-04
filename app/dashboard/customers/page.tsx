import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'

export default async function CustomersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { onboardingCompleted: true },
  })
  if (!user?.onboardingCompleted) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>
    </DashboardLayout>
  )
}


