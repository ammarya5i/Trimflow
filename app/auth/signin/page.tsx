'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast.success('Check your email for the magic link!')
    } catch (error) {
      toast.error('Failed to send magic link. Please try again.')
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
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold">TrimFlow</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/" className="text-primary hover:underline">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
