'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const navigation = [
    { name: t('dashboard.overview'), href: '/dashboard', icon: BarChart3 },
    { name: t('dashboard.calendar'), href: '/dashboard/calendar', icon: Calendar },
    { name: t('dashboard.customers'), href: '/dashboard/customers', icon: Users },
    { name: t('dashboard.settings'), href: '/dashboard/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      toast({ title: t('auth.signOut') + ' ' + t('common.success') })
    } catch (error) {
      toast({ title: t('auth.signOut') + ' ' + t('common.error'), variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-background border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">TrimFlow</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-background border-r">
          <div className="flex items-center space-x-2 p-4 border-b">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold">TrimFlow</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-background border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  className="pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => {
                  setIsNotificationsOpen((v) => !v)
                  setIsProfileMenuOpen(false)
                }}>
                  <Bell className="w-5 h-5" />
                </Button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md border bg-background shadow-lg z-50">
                    <div className="p-3 border-b">
                      <div className="text-sm font-medium">{t('common.notifications')}</div>
                    </div>
                    <div className="p-4 text-sm text-muted-foreground">{t('common.noNotifications')}</div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => {
                  setIsProfileMenuOpen((v) => !v)
                  setIsNotificationsOpen(false)
                }}>
                  <User className="w-5 h-5" />
                </Button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md border bg-background shadow-lg z-50">
                    <Link href="/dashboard/settings" className="block px-3 py-2 text-sm hover:bg-muted">{t('dashboard.settings')}</Link>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted" onClick={handleSignOut}>{t('auth.signOut')}</button>
                  </div>
                )}
              </div>
              <LanguageSwitcher />
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {t('auth.signOut')}
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
