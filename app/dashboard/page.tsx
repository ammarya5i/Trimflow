import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DashboardOverview } from '@/components/dashboard-overview'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { onboardingCompleted: true },
  })

  if (!user?.onboardingCompleted) {
    redirect('/onboarding')
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}
