'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { formatCurrency, formatDate, isValidEmail, isValidPhone } from '@/lib/utils'
import { Calendar, Clock, User, Phone, Mail, MapPin, Star, CheckCircle } from 'lucide-react'

import { BarbershopWithDetails } from '@/types'

interface BookingPageProps {
  barbershop: BarbershopWithDetails
}

export function BookingPage({ barbershop }: BookingPageProps) {
  const [step, setStep] = useState(1)
  const [appointmentId, setAppointmentId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: '',
  })
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const steps = [
    { id: 1, title: 'Select Service', description: 'Choose your service' },
    { id: 2, title: 'Select Staff', description: 'Pick your barber' },
    { id: 3, title: 'Select Date & Time', description: 'Choose your appointment' },
    { id: 4, title: 'Your Details', description: 'Enter your information' },
    { id: 5, title: 'Confirmation', description: 'Review and confirm' },
  ]


  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    // Generate dates for the next 30 days (all days are available since salon is open 7 days a week)
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        workingHours: { start: '09:00', end: '23:45' }
      })
    }
    
    return dates
  }

  const loadAvailableSlots = async (date: string, staffId: string, serviceId: string) => {
    if (!date || !staffId || !serviceId) return

    setLoadingSlots(true)
    try {
      const response = await fetch(
        `/api/booking/availability?date=${date}&staffId=${staffId}&serviceId=${serviceId}&barbershopId=${barbershop.id}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || [])
      } else {
        // Fallback to basic time slots if API fails
        const slots = []
        for (let hour = 9; hour <= 23; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 23 && minute > 45) break // Stop at 11:45 PM
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            slots.push(timeString)
          }
        }
        setAvailableSlots(slots)
      }
    } catch (error) {
      console.error('Error loading available slots:', error)
      // Fallback to basic time slots
      const slots = []
      for (let hour = 9; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 23 && minute > 45) break // Stop at 11:45 PM
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          slots.push(timeString)
        }
      }
      setAvailableSlots(slots)
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (selectedDate && selectedStaff && selectedService) {
      loadAvailableSlots(selectedDate, selectedStaff, selectedService)
    }
  }, [selectedDate, selectedStaff, selectedService])

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const validateEmail = (email: string) => {
    if (!email) return ''
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address (e.g., user@example.com)'
    }
    return ''
  }

  const validatePhone = (phone: string) => {
    if (!phone) return ''
    if (!isValidPhone(phone)) {
      return 'Please enter a valid phone number (e.g., +90 541 883 31 20 or 0541 883 31 20)'
    }
    return ''
  }

  const handleEmailChange = (email: string) => {
    setCustomerInfo(prev => ({ ...prev, email }))
    setValidationErrors(prev => ({ ...prev, email: validateEmail(email) }))
  }

  const handlePhoneChange = (phone: string) => {
    setCustomerInfo(prev => ({ ...prev, phone }))
    setValidationErrors(prev => ({ ...prev, phone: validatePhone(phone) }))
  }

  const handleBooking = async () => {
    // Validate all required fields
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({ title: 'Please complete all required fields', variant: 'destructive' })
      return
    }

    // Validate email format
    const emailError = validateEmail(customerInfo.email)
    if (emailError) {
      setValidationErrors(prev => ({ ...prev, email: emailError }))
      toast({ title: 'Please enter a valid email address', variant: 'destructive' })
      return
    }

    // Validate phone format
    const phoneError = validatePhone(customerInfo.phone)
    if (phoneError) {
      setValidationErrors(prev => ({ ...prev, phone: phoneError }))
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
          barbershopId: barbershop.id,
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
        title: 'Appointment created successfully!', 
        description: 'Your appointment has been scheduled. You will receive a confirmation shortly.' 
      })
      setStep(6) // Success step
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast({ 
        title: 'Failed to create appointment', 
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
              {barbershop.services.map((service: any) => (
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
                        {service.description && (
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        )}
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
              {barbershop.staff.map((staff) => (
                <Card 
                  key={staff.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedStaff === staff.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedStaff(staff.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{staff.name}</h4>
                        {staff.bio && (
                          <p className="text-sm text-muted-foreground">{staff.bio}</p>
                        )}
                        {staff.specialties && staff.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {staff.specialties.map((specialty, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-muted text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
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
            
            {/* Date Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Select Date</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {getAvailableDates().slice(0, 8).map((dateInfo) => (
                  <Button
                    key={dateInfo.date}
                    variant={selectedDate === dateInfo.date ? 'default' : 'outline'}
                    className="h-auto p-3 flex flex-col"
                    onClick={() => setSelectedDate(dateInfo.date)}
                  >
                    <span className="text-sm">{dateInfo.display}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <Label className="text-base font-medium mb-3 block">Select Time</Label>
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading available times...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
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
                    {availableSlots.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No available slots for this date and staff member.
                      </p>
                    )}
                  </>
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
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter your phone number (e.g., +90 541 883 31 20)"
                  required
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.phone}</p>
                )}
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
        const selectedServiceData = barbershop.services.find(s => s.id === selectedService)
        const selectedStaffData = barbershop.staff.find(s => s.id === selectedStaff)
        
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
                    <p className="font-medium">{formatDate(selectedDate)}</p>
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
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" asChild>
                <a href={`/s/${barbershop.slug}`}>Book Another Appointment</a>
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
      case 4: 
        return customerInfo.name !== '' && 
               customerInfo.email !== '' && 
               customerInfo.phone !== '' &&
               !validationErrors.email &&
               !validationErrors.phone
      case 5: return true
      default: return false
    }
  }

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
                <h1 className="text-xl font-bold">{barbershop.name}</h1>
                <p className="text-sm text-muted-foreground">Book an appointment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{barbershop.city}{barbershop.state ? `, ${barbershop.state}` : ''}</span>
              {barbershop.phone && (
                <a href={`tel:${barbershop.phone}`} className="hover:text-foreground">Call</a>
              )}
              {barbershop.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${barbershop.address} ${barbershop.city ?? ''} ${barbershop.state ?? ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Directions
                </a>
              )}
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
                    onClick={handlePrevious}
                    disabled={step === 1}
                  >
                    Previous
                  </Button>
                  
                  {step === 5 ? (
                    <Button onClick={handleBooking} disabled={loading}>
                      {loading ? 'Sending Request...' : 'Send Appointment Request'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!canProceed()}>
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
