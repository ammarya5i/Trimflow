'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast, toastError, toastSuccess } from '@/hooks/use-toast'
import { generateSlug } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Store,
  User,
  Clock,
  Scissors,
  Globe,
  Bell,
  CreditCard
} from 'lucide-react'

interface OnboardingWizardProps {
  user: any
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to TrimFlow',
    description: 'Let\'s set up your barbershop in just a few steps',
    icon: Check,
  },
  {
    id: 'barbershop',
    title: 'Barbershop Information',
    description: 'Tell us about your barbershop',
    icon: Store,
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Complete your personal information',
    icon: User,
  },
  {
    id: 'services',
    title: 'Services & Pricing',
    description: 'Add your services and set prices',
    icon: Scissors,
  },
  {
    id: 'schedule',
    title: 'Working Hours',
    description: 'Set your availability',
    icon: Clock,
  },
  {
    id: 'location',
    title: 'Location & Contact',
    description: 'Add your address and contact details',
    icon: Globe,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Choose how you want to be notified',
    icon: Bell,
  },
  {
    id: 'billing',
    title: 'Choose Your Plan',
    description: 'Select the plan that fits your needs',
    icon: CreditCard,
  },
]

export function OnboardingWizard({ user }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Barbershop info
    barbershopName: '',
    barbershopDescription: '',
    barbershopSlug: '',
    
    // Profile info
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    
    // Services
    services: [
      { name: 'Haircut', duration: 30, price: 2500, description: 'Professional haircut' },
      { name: 'Beard Trim', duration: 20, price: 1500, description: 'Beard trimming and styling' },
      { name: 'Haircut + Beard', duration: 45, price: 3500, description: 'Complete grooming service' },
    ],
    
    // Working hours
    workingHours: {
      monday: { start: '09:00', end: '18:00', isWorking: true },
      tuesday: { start: '09:00', end: '18:00', isWorking: true },
      wednesday: { start: '09:00', end: '18:00', isWorking: true },
      thursday: { start: '09:00', end: '18:00', isWorking: true },
      friday: { start: '09:00', end: '18:00', isWorking: true },
      saturday: { start: '09:00', end: '16:00', isWorking: true },
      sunday: { start: '09:00', end: '16:00', isWorking: false },
    },
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    email: user?.email || '',
    website: '',
    
    // Notifications
    notifications: {
      email: true,
      sms: false,
      bookingConfirmation: true,
      bookingReminder: true,
      newBooking: true,
    },
    
    // Plan
    selectedPlan: 'FREE',
  })
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!formData.barbershopName?.trim()) {
        toastError('Barbershop name is required')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.fullName?.trim()) {
        toastError('Full name is required')
        return
      }
      if (!formData.phone?.trim()) {
        toastError('Phone number is required')
        return
      }
    }
    if (currentStep === 3) {
      const validServices = formData.services.filter(s => s.name.trim() && s.duration > 0 && s.price >= 0)
      if (validServices.length === 0) {
        toastError('Add at least one valid service')
        return
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleServiceChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', duration: 30, price: 2500, description: '' }]
    }))
  }

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Final validations
      if (!formData.barbershopName?.trim() || !formData.fullName?.trim()) {
        toastError('Please complete required fields')
        setLoading(false)
        return
      }
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          barbershopSlug: generateSlug(formData.barbershopName),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete onboarding')
      }

      toastSuccess('Welcome to TrimFlow! Your barbershop is ready.')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toastError('Failed to complete setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to TrimFlow!</h2>
              <p className="text-muted-foreground">
                We're excited to help you manage your barbershop. Let's get you set up in just a few minutes.
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Professional appointment scheduling</p>
              <p>✓ Customer management</p>
              <p>✓ Staff coordination</p>
              <p>✓ Revenue tracking</p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="barbershopName">Barbershop Name *</Label>
              <Input
                id="barbershopName"
                value={formData.barbershopName}
                onChange={(e) => {
                  handleInputChange('barbershopName', e.target.value)
                  handleInputChange('barbershopSlug', generateSlug(e.target.value))
                }}
                placeholder="e.g., Modern Cuts Barbershop"
                required
              />
            </div>
            <div>
              <Label htmlFor="barbershopDescription">Description</Label>
              <Textarea
                id="barbershopDescription"
                value={formData.barbershopDescription}
                onChange={(e) => handleInputChange('barbershopDescription', e.target.value)}
                placeholder="Tell customers about your barbershop..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="barbershopSlug">Booking URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">trimflow.vercel.app/s/</span>
                <Input
                  id="barbershopSlug"
                  value={formData.barbershopSlug}
                  onChange={(e) => handleInputChange('barbershopSlug', e.target.value)}
                  placeholder="modern-cuts"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
      <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Services & Pricing</h3>
              <Button type="button" variant="outline" onClick={addService}>
                Add Service
              </Button>
            </div>
            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Service Name *</Label>
                        <Input
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          placeholder="e.g., Haircut"
                          required
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes) *</Label>
                        <Input
                          type="number"
                          value={service.duration}
                          onChange={(e) => handleServiceChange(index, 'duration', parseInt(e.target.value))}
                          min="15"
                          step="15"
                          required
                        />
                      </div>
                      <div>
                        <Label>Price (cents) *</Label>
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, 'price', parseInt(e.target.value))}
                          min="0"
                          step="100"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeService(index)}
                          disabled={formData.services.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        placeholder="Describe this service..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Working Hours</h3>
            <div className="space-y-4">
              {Object.entries(formData.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hours.isWorking}
                      onChange={(e) => handleNestedInputChange('workingHours', day, {
                        ...hours,
                        isWorking: e.target.checked
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  {hours.isWorking && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleNestedInputChange('workingHours', day, {
                          ...hours,
                          start: e.target.value
                        })}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleNestedInputChange('workingHours', day, {
                          ...hours,
                          end: e.target.value
                        })}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                type="url"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">Notify when appointments are confirmed</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.bookingConfirmation}
                  onChange={(e) => handleNestedInputChange('notifications', 'bookingConfirmation', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Booking Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send reminders before appointments</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.bookingReminder}
                  onChange={(e) => handleNestedInputChange('notifications', 'bookingReminder', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Bookings</Label>
                  <p className="text-sm text-muted-foreground">Notify when new appointments are made</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.newBooking}
                  onChange={(e) => handleNestedInputChange('notifications', 'newBooking', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Choose Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'FREE', name: 'Free', price: '$0', features: ['50 appointments/month', 'Basic features'] },
                { id: 'PRO', name: 'Pro', price: '$19', features: ['Unlimited appointments', 'Advanced features'] },
                { id: 'PREMIUM', name: 'Premium', price: '$49', features: ['Everything in Pro', 'Priority support'] },
              ].map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer ${formData.selectedPlan === plan.id ? 'border-primary' : ''}`}
                  onClick={() => handleInputChange('selectedPlan', plan.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold">{plan.price}/month</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold">TrimFlow</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                {(() => { const Icon = steps[currentStep].icon; return <Icon className="w-5 h-5 text-primary" /> })()}
              </div>
              <div>
                <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
            
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? 'Setting up...' : 'Complete Setup'}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext} type="button">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
