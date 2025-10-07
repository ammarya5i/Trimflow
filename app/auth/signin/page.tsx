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
import { useLanguage } from '@/lib/language-context'

function SignInForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const isSignup = searchParams.get('signup') === '1'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toastError(t('auth.emailRequired'))
      return
    }
    if (!password || password.length < 6) {
      toastError(t('auth.passwordMinLength'))
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
        toastError(t('auth.signInFailed'))
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toastError(t('auth.signInFailed'))
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
              {t('common.back')} {t('navigation.home')}
            </Link>
          </Button>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">{t('salon.name')}</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{isSignup ? t('auth.bookYourAppointment') : t('auth.welcomeBack')}</CardTitle>
            <CardDescription>
              {isSignup ? t('auth.enterDetailsToBook') : t('auth.signInToManage')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.enterPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (isSignup ? t('auth.booking') : t('auth.signingIn')) : (isSignup ? t('auth.bookAppointment') : t('auth.signIn'))}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    {t('auth.signIn')}
                  </Link>
                </>
              ) : (
                <>
                  {t('auth.newCustomer')}{' '}
                  <Link href="/auth/signin?signup=1" className="text-primary hover:underline">
                    {t('auth.bookFirstAppointment')}
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
