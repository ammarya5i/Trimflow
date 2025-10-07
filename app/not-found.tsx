'use client'

import { LanguageProvider } from '@/lib/language-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

function NotFoundContent() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">404</span>
            </div>
            <CardTitle className="text-2xl">{t('common.pageNotFound')}</CardTitle>
            <CardDescription>
              {t('common.pageNotFoundDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  {t('common.goHome')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.goBack')}
                </Link>
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Looking for a barbershop?</p>
              <p>Try visiting: <Link href="/s" className="text-primary hover:underline">trimflow.vercel.app/s</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <LanguageProvider>
      <NotFoundContent />
    </LanguageProvider>
  )
}