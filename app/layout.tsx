import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthSessionProvider } from '@/components/session-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrimFlow - Barber Appointment Management',
  description: 'Professional barber appointment booking and management system',
  keywords: ['barber', 'appointment', 'booking', 'management', 'scheduling'],
  authors: [{ name: 'TrimFlow Team' }],
  creator: 'TrimFlow',
  publisher: 'TrimFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://trimflow.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trimflow.vercel.app',
    title: 'TrimFlow - Barber Appointment Management',
    description: 'Professional barber appointment booking and management system',
    siteName: 'TrimFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrimFlow - Barber Appointment Management',
    description: 'Professional barber appointment booking and management system',
    creator: '@trimflow',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TrimFlow" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
