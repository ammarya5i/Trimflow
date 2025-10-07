'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, Phone, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { formatCurrency, formatDate } from '@/lib/utils'

interface CalendarAppointment {
  id: string
  title: string
  start: string
  end: string
  status: string
  customer: { name: string; phone: string } | null
  staff: { name: string } | null
  service: { name: string; price: number } | null
  notes?: string
  totalPrice: number
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }
    
    // Only allow Ahmet to access dashboard
    if (session.user.email !== 'ahmet@salonahmetbarbers.com') {
      router.push('/')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.email === 'ahmet@salonahmetbarbers.com') {
      loadCalendarData()
    }
  }, [session, selectedDate])

  const loadCalendarData = async () => {
    try {
      const date = new Date(selectedDate)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      
      const response = await fetch(`/api/dashboard/calendar?month=${month}&year=${year}`)
      if (!response.ok) throw new Error('Failed to fetch calendar data')
      
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error loading calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch('/api/dashboard/calendar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status }),
      })
      
      if (response.ok) {
        loadCalendarData() // Reload data
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no_show':
        return 'bg-orange-100 text-orange-800'
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'no_show':
        return <AlertCircle className="w-4 h-4" />
      case 'scheduled':
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const appointmentsForDate = appointments.filter(apt => {
    const aptDate = new Date(apt.start).toISOString().split('T')[0]
    return aptDate === selectedDate
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.calendar')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.manageAppointments')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments for selected date */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(new Date(selectedDate))}</span>
                </CardTitle>
                <CardDescription>
                  {appointmentsForDate.length} {t('dashboard.appointments')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : appointmentsForDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('dashboard.noAppointments')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointmentsForDate.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">{appointment.status}</span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(appointment.start).toLocaleTimeString('tr-TR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(appointment.end).toLocaleTimeString('tr-TR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            
                            <h4 className="font-semibold">{appointment.service?.name}</h4>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              {appointment.customer && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{appointment.customer.name}</span>
                                </div>
                              )}
                              {appointment.customer?.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{appointment.customer.phone}</span>
                                </div>
                              )}
                              {appointment.staff && (
                                <div className="flex items-center space-x-1">
                                  <span>{appointment.staff.name}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{formatCurrency(appointment.totalPrice)}</span>
                              </div>
                            </div>
                            
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {appointment.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {t('dashboard.complete')}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                >
                                  {t('dashboard.cancel')}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.todayStats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('dashboard.scheduled')}</span>
                  <span className="font-medium">
                    {appointmentsForDate.filter(apt => apt.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('dashboard.completed')}</span>
                  <span className="font-medium">
                    {appointmentsForDate.filter(apt => apt.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('dashboard.totalRevenue')}</span>
                  <span className="font-medium">
                    {formatCurrency(
                      appointmentsForDate
                        .filter(apt => apt.status === 'completed')
                        .reduce((sum, apt) => sum + apt.totalPrice, 0)
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}