'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { formatCurrency, isValidEmail, isValidPhone } from '@/lib/utils'
import { Calendar, Clock, User, Phone, Mail, MapPin, Star, CheckCircle } from 'lucide-react'

export default function SalonAhmetBarbersBooking() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [appointmentId, setAppointmentId] = useState('')

  const services = [
    { id: 'service-1', name: 'Model Saç Kesimi', price: 20000, duration: 45, description: 'Professional model haircut with modern styling techniques' },
    { id: 'service-2', name: 'Sakal Kesimi & Şekillendirme', price: 15000, duration: 30, description: 'Beard cutting and professional styling with hot towel treatment' },
    { id: 'service-3', name: 'Komple Bakım', price: 35000, duration: 60, description: 'Complete grooming package - hair + beard + facial care (Most Popular)' },
    { id: 'service-4', name: 'Tıraş & Yüz Bakımı', price: 18000, duration: 40, description: 'Traditional shave with facial care and hot towel treatment' },
    { id: 'service-5', name: 'Saç Boyama', price: 25000, duration: 90, description: 'Professional hair coloring service with premium products' },
    { id: 'service-6', name: 'Doğal Kalıcı Saç Düzleştirici (KRİSTAL&BOTOX)', price: 40000, duration: 120, description: 'Natural permanent hair straightening with Krystal & Botox treatment' },
    { id: 'service-7', name: 'Profesyonel Yüz Bakımları', price: 30000, duration: 60, description: 'Professional facial care and skincare treatments' },
    { id: 'service-8', name: 'Kaş Boyama', price: 8000, duration: 30, description: 'Eyebrow tinting and shaping service' },
  ]

  const staff = [
    { id: 'staff-1', name: 'Ahmet Usta', bio: 'Master barber and salon owner with 15+ years of experience in traditional Turkish barbering and modern techniques' },
    { id: 'staff-2', name: 'Mehmet Usta', bio: 'Specialist in modern cuts, fades, and contemporary styling' },
    { id: 'staff-3', name: 'Can Usta', bio: 'Expert in beard grooming, luxury treatments, and hair coloring' },
  ]

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  
  const loadAvailableSlots = async (date: string, staffId: string, serviceId: string) => {
    if (!date || !staffId || !serviceId) return

    setLoadingSlots(true)
    try {
      const response = await fetch(
        `/api/booking/availability?date=${date}&staffId=${staffId}&serviceId=${serviceId}&barbershopId=salon-ahmet-id`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableTimeSlots(data.availableSlots || [])
      } else {
        // Fallback to basic time slots if API fails
        const slots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
          '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
          '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
          '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ]
        setAvailableTimeSlots(slots)
      }
    } catch (error) {
      console.error('Error loading available slots:', error)
      // Fallback to basic time slots
      const slots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
      ]
      setAvailableTimeSlots(slots)
    } finally {
      setLoadingSlots(false)
    }
  }

  // Load available slots when date, staff, or service changes
  useEffect(() => {
    if (selectedDate && selectedStaff && selectedService) {
      loadAvailableSlots(selectedDate, selectedStaff, selectedService)
    }
  }, [selectedDate, selectedStaff, selectedService])

  const handleBooking = async () => {
    // Validate all required fields
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({ title: 'Please complete all required fields', variant: 'destructive' })
      return
    }

    // Validate email format
    if (!isValidEmail(customerInfo.email)) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' })
      return
    }

    // Validate phone format
    if (!isValidPhone(customerInfo.phone)) {
      toast({ title: 'Please enter a valid phone number', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Create appointment via API
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barbershopId: 'salon-ahmet-id',
          serviceId: selectedService,
          staffId: selectedStaff,
          date: selectedDate,
          time: selectedTime,
          customerInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create appointment')
      }

      const result = await response.json()
      setAppointmentId(result.appointmentId)
      
      toast({ 
        title: 'Appointment request sent!', 
        description: 'Ahmet will contact you within 2 hours to confirm your appointment. Please keep your phone available.' 
      })
      setStep(6) // Success step
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast({ 
        title: 'Failed to send appointment request', 
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Service</h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedService === service.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(service.price)}</div>
                        <div className="text-sm text-muted-foreground">{service.duration} min</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Staff</h3>
            <div className="grid gap-4">
              {staff.map((staffMember) => (
                <Card 
                  key={staffMember.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedStaff === staffMember.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedStaff(staffMember.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{staffMember.name}</h4>
                        <p className="text-sm text-muted-foreground">{staffMember.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
            
            <div>
              <Label className="text-base font-medium mb-3 block">Select Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {selectedDate && (
              <div>
                <Label className="text-base font-medium mb-3 block">Select Time</Label>
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading available times...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? 'default' : 'outline'}
                        className="h-10"
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Contact Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide your details so Ahmet can contact you to confirm your appointment.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number (Ahmet will call you)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">Special Requests or Notes</Label>
                <Textarea
                  id="notes"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special requests, preferred barber, or notes for Ahmet..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        const selectedServiceData = services.find(s => s.id === selectedService)
        const selectedStaffData = staff.find(s => s.id === selectedStaff)
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Confirm Your Appointment Request</h3>
            <p className="text-sm text-muted-foreground">
              Please review your appointment details. Ahmet will contact you to confirm availability.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Appointment Request Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedDate}</p>
                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedTime}</p>
                    <p className="text-sm text-muted-foreground">Preferred Time</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedStaffData?.name}</p>
                    <p className="text-sm text-muted-foreground">Preferred Barber</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedServiceData?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedServiceData?.duration} minutes • {formatCurrency(selectedServiceData?.price || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {customerInfo.name}</p>
                <p><strong>Email:</strong> {customerInfo.email}</p>
                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                {customerInfo.notes && <p><strong>Special Requests:</strong> {customerInfo.notes}</p>}
              </CardContent>
            </Card>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">Appointment Request Sent!</h2>
              <p className="text-muted-foreground mt-2">
                Your appointment request has been sent to Ahmet. He will contact you shortly to confirm your appointment.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Ahmet will call you to confirm the appointment</p>
              <p>• Please keep your phone available for the next few hours</p>
              <p>• You can also call directly: <strong>+90 541 883 31 20</strong></p>
              {appointmentId && (
                <p>• Reference ID: <strong>{appointmentId}</strong></p>
              )}
            </div>
            
            {/* Business Policies */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Cancellation:</strong> Please cancel at least 2 hours before your appointment</li>
                <li>• <strong>Payment:</strong> Cash or card payment accepted at the salon</li>
                <li>• <strong>Arrival:</strong> Please arrive 5 minutes early for your appointment</li>
                <li>• <strong>Location:</strong> Mecidiyeköy, Şht. Er Cihan Namlı Cd No:9 D:2B</li>
              </ul>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Book Another Appointment
              </Button>
              <Button asChild>
                <a href="tel:+905418833120">Call Ahmet Now</a>
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== ''
      case 2: return selectedStaff !== ''
      case 3: return selectedDate !== '' && selectedTime !== ''
      case 4: return customerInfo.name !== '' && customerInfo.email !== '' && customerInfo.phone !== ''
      case 5: return true
      default: return false
    }
  }

  const steps = [
    { id: 1, title: 'Hizmet Seçin', description: 'Hizmetinizi seçin' },
    { id: 2, title: 'Berber Seçin', description: 'Berberinizi seçin' },
    { id: 3, title: 'Tarih & Saat', description: 'Randevu tarihini seçin' },
    { id: 4, title: 'Bilgileriniz', description: 'Bilgilerinizi girin' },
    { id: 5, title: 'Onay', description: 'Gözden geçirin ve onaylayın' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Salon Ahmet Barbers</h1>
                <p className="text-sm text-muted-foreground">Book an appointment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Mecidiyeköy, Şişli</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <a href="tel:+905418833120" className="hover:text-foreground font-medium">+90 541 883 31 20</a>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">4.9 (608+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepItem.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > stepItem.id ? <CheckCircle className="w-4 h-4" /> : stepItem.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepItem.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{steps[step - 1]?.title}</h2>
              <p className="text-sm text-muted-foreground">{steps[step - 1]?.description}</p>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="pt-6">
              {renderStepContent()}
              
              {step < 6 && (
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  
                  {step === 5 ? (
                    <Button onClick={handleBooking} disabled={loading}>
                      {loading ? 'Sending Request...' : 'Send Appointment Request'}
                    </Button>
                  ) : (
                    <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                      Next
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
