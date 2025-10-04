'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { OnboardingWizard } from '@/components/onboarding-wizard'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setLoading(false)
  }, [session, status, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return <OnboardingWizard user={session.user} />
}
