'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Clock, 
  Users, 
  BarChart3, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = email ? `/auth/signin?signup=1&email=${encodeURIComponent(email)}` : '/auth/signin?signup=1'
    router.push(target)
  }

  const features = [
    {
      icon: Calendar,
      title: 'Online Booking',
      description: 'Book your appointment 24/7 with our easy online scheduling system.',
    },
    {
      icon: Users,
      title: 'Expert Barbers',
      description: 'Professional barbers with years of experience in traditional and modern cuts.',
    },
    {
      icon: BarChart3,
      title: 'Premium Services',
      description: 'Haircuts, beard trims, hot towel shaves, and luxury grooming treatments.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Book from anywhere with our mobile-optimized booking system.',
    },
    {
      icon: Globe,
      title: 'Mecidiyeköy Location',
      description: 'Conveniently located in Mecidiyeköy, Şişli with easy access and parking.',
    },
    {
      icon: Shield,
      title: 'Hygiene First',
      description: 'Strict hygiene protocols and sanitized equipment for your safety.',
    },
  ]

  const services = [
    {
      name: 'Model Saç Kesimi',
      price: '₺200',
      period: '',
      description: 'Professional model haircut',
      features: [
        'Professional model haircut',
        'Modern styling techniques',
        'Hair wash & conditioning',
        'Professional styling',
        'Consultation included',
      ],
      cta: 'Book Now',
      popular: false,
    },
    {
      name: 'Komple Bakım',
      price: '₺350',
      period: '',
      description: 'Our most popular service',
      features: [
        'Complete hair & beard service',
        'Professional facial care',
        'Hot towel treatment',
        'Hair wash & conditioning',
        'Professional styling',
        'Face massage',
        'Premium products',
      ],
      cta: 'Book Now',
      popular: true,
    },
    {
      name: 'Saç Boyama',
      price: '₺250',
      period: '',
      description: 'Professional hair coloring',
      features: [
        'Professional hair coloring',
        'Color consultation',
        'Hair treatment',
        'Styling included',
        'Premium color products',
        'Aftercare instructions',
      ],
      cta: 'Book Now',
      popular: false,
    },
  ]

  const testimonials = [
    {
      name: 'Mehmet Yılmaz',
      role: 'Regular Customer',
      content: 'Salon Ahmet Barbers has been my go-to place for years. The quality is exceptional and the online booking makes it so convenient!',
      rating: 5,
    },
    {
      name: 'Ali Demir',
      role: 'Business Owner',
      content: 'The best barbershop in Mecidiyeköy. Professional service, clean environment, and the hot towel treatment is amazing.',
      rating: 5,
    },
    {
      name: 'Can Özkan',
      role: 'Local Resident',
      content: 'I love how easy it is to book online. Ahmet Usta and his team are skilled and the atmosphere is always welcoming.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-primary">Salon Ahmet Barbers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience premium grooming services in Mecidiyeköy, Istanbul. 
            Book your appointment online and discover why we have a 4.9-star rating from 608+ satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <form onSubmit={handleGetStarted} className="flex w-full gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Get Started'}
              </Button>
            </form>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Free forever plan • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Salon Ahmet Barbers?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of traditional Turkish barbering and modern convenience in Mecidiyeköy, Istanbul.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Premium Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From classic cuts to luxury grooming experiences, we offer services for every need and budget.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className={`relative ${service.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{service.price}</span>
                    <span className="text-muted-foreground">{service.period}</span>
                  </div>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={service.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/s/salon-ahmet-barbers">{service.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued customers have to say about Ahmet Salon.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 px-4">
        <div className="container mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Book Your Appointment Today
           </h2>
           <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
             Experience the finest grooming services in Mecidiyeköy, Istanbul. 
             Book online now and discover why Salon Ahmet Barbers has a 4.9-star rating from 608+ customers.
           </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <form onSubmit={handleGetStarted} className="flex w-full gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
               <Button type="submit" disabled={isLoading} size="lg">
                 {isLoading ? 'Sending...' : 'Book Appointment'}
                 <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </form>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Easy online booking • Same-day appointments available • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                   <span className="text-primary-foreground font-bold text-lg">A</span>
                 </div>
                 <span className="text-xl font-bold">Salon Ahmet Barbers</span>
               </div>
               <p className="text-muted-foreground">
                 Mecidiyeköy's premier barbershop for traditional and modern grooming services. 4.9-star rating from 608+ customers.
               </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#services" className="hover:text-foreground">Our Services</Link></li>
                <li><Link href="#features" className="hover:text-foreground">Why Choose Us</Link></li>
                <li><Link href="/s/salon-ahmet-barbers" className="hover:text-foreground">Book Now</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="tel:+905418833120" className="hover:text-foreground">+90 541 883 31 20</Link></li>
                <li><Link href="mailto:info@salonahmetbarbers.com" className="hover:text-foreground">info@salonahmetbarbers.com</Link></li>
                <li><Link href="https://www.instagram.com/salonahmetbarbers/" className="hover:text-foreground" target="_blank">Instagram</Link></li>
                <li><Link href="#" className="hover:text-foreground">Mecidiyeköy, Şişli, Istanbul</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hours</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Every Day: 9:00-23:45</li>
                <li>Open 7 days a week</li>
                <li>Extended hours for your convenience</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Salon Ahmet Barbers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
