'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { toastError } from '@/hooks/use-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isSignup = searchParams.get('signup') === '1'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toastError('Email is required')
      return
    }
    if (!password || password.length < 6) {
      toastError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      console.log('Attempting sign in with:', { email, hasPassword: !!password })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.error('Sign in error:', result.error)
        throw new Error(result.error)
      }

      if (result?.ok) {
        console.log('Sign in successful, redirecting...')
        // Successful login, redirect based on user role
        // Check if user is admin (Ahmet)
        if (email === 'ahmet@salonahmetbarbers.com') {
          console.log('Admin user detected, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          console.log('Customer user detected, redirecting to home')
          // For customers, redirect to main page or booking page
          router.push('/')
        }
      } else {
        console.log('Sign in failed - no error but not ok')
        toastError('Sign in failed. Please try again.')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toastError('Failed to sign in. Please check your credentials and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">Salon Ahmet Barbers</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isSignup ? 'Book Your Appointment' : 'Welcome back'}</CardTitle>
            <CardDescription>
              {isSignup ? 'Enter your details to book an appointment' : 'Sign in to manage your appointments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (isSignup ? 'Booking...' : 'Signing in...') : (isSignup ? 'Book Appointment' : 'Sign In')}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  New customer?{' '}
                  <Link href="/auth/signin?signup=1" className="text-primary hover:underline">
                    Book your first appointment
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
