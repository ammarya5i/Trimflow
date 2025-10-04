'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Authentication Error</h1>
        <p className="text-muted-foreground">Please try signing in again.</p>
        <Button asChild>
          <Link href="/auth/signin">Back to sign in</Link>
        </Button>
      </div>
    </div>
  )
}


