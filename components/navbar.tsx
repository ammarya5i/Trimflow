'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useLanguage()

  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '#services', label: t('navigation.services') },
    { href: '#features', label: t('navigation.about') },
    { href: '#testimonials', label: t('navigation.reviews') },
  ]

  const isDashboard = pathname?.startsWith('/dashboard')
  if (isDashboard) return null

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold">Salon Ahmet Barbers</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors',
                pathname === link.href && 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <Button asChild>
            <Link href="/s/salon-ahmet-barbers">{t('navigation.bookAppointment')}</Link>
          </Button>
          {/* Only show admin access for Ahmet */}
          {session?.user?.email === 'ahmet@salonahmetbarbers.com' && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">{t('navigation.dashboard')}</Link>
              </Button>
              <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>{t('navigation.signOut')}</Button>
            </>
          )}
          
          {/* Show sign in for Ahmet only */}
          {!session?.user && (
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">{t('navigation.adminLogin')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


