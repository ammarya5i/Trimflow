import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { AuthSessionProvider } from '@/components/session-provider'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/language-context'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salon Ahmet Barbers - Premium Barbershop in Mecidiyeköy, Istanbul',
  description: 'Experience premium grooming services in Mecidiyeköy, Istanbul. Book your appointment online at Salon Ahmet Barbers. 4.9-star rating from 608+ customers.',
  keywords: ['barbershop', 'mecidiyeköy', 'istanbul', 'haircut', 'beard trim', 'shave', 'grooming', 'turkish barber', 'salon ahmet barbers'],
  authors: [{ name: 'Salon Ahmet Barbers' }],
  creator: 'Salon Ahmet Barbers',
  publisher: 'Salon Ahmet Barbers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://salonahmetbarbers.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://salonahmetbarbers.vercel.app',
    title: 'Salon Ahmet Barbers - Premium Barbershop in Mecidiyeköy, Istanbul',
    description: 'Experience premium grooming services in Mecidiyeköy, Istanbul. Book your appointment online at Salon Ahmet Barbers.',
    siteName: 'Salon Ahmet Barbers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salon Ahmet Barbers - Premium Barbershop in Mecidiyeköy, Istanbul',
    description: 'Experience premium grooming services in Mecidiyeköy, Istanbul. Book your appointment online at Salon Ahmet Barbers.',
    creator: '@salonahmetbarbers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Salon Ahmet Barbers" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="theme-barbershop"
              enableSystem={false}
              themes={['theme-barbershop','theme-barbershop-dark','light','dark']}
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthSessionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
