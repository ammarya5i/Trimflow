// Simple in-memory store for appointments and customers
// In production, this would be replaced with a real database

interface Appointment {
  id: string
  barbershopId: string
  customerId: string
  staffId: string
  serviceId: string
  startTime: string
  endTime: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  totalPrice: number
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: string
}

interface Customer {
  id: string
  barbershopId: string
  name: string
  email: string
  phone: string
  createdAt: string
}

interface Staff {
  id: string
  barbershopId: string
  name: string
  email?: string
  phone?: string
  role: string
  isActive: boolean
  createdAt: string
}

interface Service {
  id: string
  barbershopId: string
  name: string
  description?: string
  price: number
  duration: number
  isActive: boolean
  createdAt: string
}

// In-memory storage
let appointments: Appointment[] = []
let customers: Customer[] = []
let staff: Staff[] = []
let services: Service[] = []

// Initialize with Salon Ahmet Barbers data
const initializeSalonAhmetData = () => {
  if (services.length === 0) {
    // Add services
    const salonServices: Service[] = [
      { id: 'service-1', barbershopId: 'salon-ahmet-id', name: 'Model Saç Kesimi', description: 'Professional model haircut with modern styling techniques', price: 20000, duration: 45, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-2', barbershopId: 'salon-ahmet-id', name: 'Sakal Kesimi & Şekillendirme', description: 'Beard cutting and professional styling with hot towel treatment', price: 15000, duration: 30, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-3', barbershopId: 'salon-ahmet-id', name: 'Komple Bakım', description: 'Complete grooming package - hair + beard + facial care', price: 35000, duration: 60, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-4', barbershopId: 'salon-ahmet-id', name: 'Tıraş & Yüz Bakımı', description: 'Traditional shave with facial care and hot towel treatment', price: 18000, duration: 40, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-5', barbershopId: 'salon-ahmet-id', name: 'Saç Boyama', description: 'Professional hair coloring service with premium products', price: 25000, duration: 90, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-6', barbershopId: 'salon-ahmet-id', name: 'Doğal Kalıcı Saç Düzleştirici', description: 'Natural permanent hair straightening with Krystal & Botox treatment', price: 40000, duration: 120, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-7', barbershopId: 'salon-ahmet-id', name: 'Profesyonel Yüz Bakımları', description: 'Professional facial care and skincare treatments', price: 30000, duration: 60, isActive: true, createdAt: new Date().toISOString() },
      { id: 'service-8', barbershopId: 'salon-ahmet-id', name: 'Kaş Boyama', description: 'Eyebrow tinting and shaping service', price: 8000, duration: 30, isActive: true, createdAt: new Date().toISOString() },
    ]
    services.push(...salonServices)
  }

  if (staff.length === 0) {
    // Add staff
    const salonStaff: Staff[] = [
      { id: 'staff-1', barbershopId: 'salon-ahmet-id', name: 'Ahmet Usta', email: 'ahmet@salonahmetbarbers.com', phone: '+90 541 883 31 20', role: 'owner', isActive: true, createdAt: new Date().toISOString() },
      { id: 'staff-2', barbershopId: 'salon-ahmet-id', name: 'Mehmet Usta', role: 'barber', isActive: true, createdAt: new Date().toISOString() },
      { id: 'staff-3', barbershopId: 'salon-ahmet-id', name: 'Can Usta', role: 'barber', isActive: true, createdAt: new Date().toISOString() },
    ]
    staff.push(...salonStaff)
  }
}

// Initialize data
initializeSalonAhmetData()

export const memoryStore = {
  // Appointments
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const appointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    appointments.push(appointment)
    return appointment
  },

  getAppointments: (barbershopId: string): Appointment[] => {
    return appointments.filter(apt => apt.barbershopId === barbershopId)
  },

  updateAppointment: (id: string, updates: Partial<Appointment>): Appointment | null => {
    const index = appointments.findIndex(apt => apt.id === id)
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates }
      return appointments[index]
    }
    return null
  },

  // Customers
  createCustomer: (data: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const customer: Customer = {
      ...data,
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    customers.push(customer)
    return customer
  },

  findCustomerByEmail: (barbershopId: string, email: string): Customer | null => {
    return customers.find(cust => cust.barbershopId === barbershopId && cust.email === email) || null
  },

  findCustomerById: (customerId: string): Customer | null => {
    return customers.find(cust => cust.id === customerId) || null
  },

  getCustomers: (barbershopId: string): Customer[] => {
    return customers.filter(cust => cust.barbershopId === barbershopId)
  },

  // Staff
  getStaff: (barbershopId: string): Staff[] => {
    return staff.filter(s => s.barbershopId === barbershopId && s.isActive)
  },

  // Services
  getServices: (barbershopId: string): Service[] => {
    return services.filter(s => s.barbershopId === barbershopId && s.isActive)
  },

  getService: (barbershopId: string, serviceId: string): Service | null => {
    return services.find(s => s.barbershopId === barbershopId && s.id === serviceId) || null
  },

  // Stats
  getStats: (barbershopId: string) => {
    const barbershopAppointments = appointments.filter(apt => apt.barbershopId === barbershopId)
    const barbershopCustomers = customers.filter(cust => cust.barbershopId === barbershopId)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const totalAppointments = barbershopAppointments.length
    const totalRevenue = barbershopAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.totalPrice, 0)
    const totalCustomers = barbershopCustomers.length
    
    const todayAppointments = barbershopAppointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      return aptDate >= today && aptDate < tomorrow
    }).length
    
    const upcomingAppointments = barbershopAppointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      return aptDate >= tomorrow && apt.status === 'scheduled'
    }).length
    
    const completedAppointments = barbershopAppointments.filter(apt => apt.status === 'completed').length
    const cancelledAppointments = barbershopAppointments.filter(apt => apt.status === 'cancelled').length
    const noShowAppointments = barbershopAppointments.filter(apt => apt.status === 'no_show').length

    return {
      totalAppointments,
      totalRevenue,
      totalCustomers,
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
    }
  },

  getRecentAppointments: (barbershopId: string, limit: number = 10) => {
    return appointments
      .filter(apt => apt.barbershopId === barbershopId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(apt => {
        const customer = customers.find(cust => cust.id === apt.customerId)
        const staffMember = staff.find(s => s.id === apt.staffId)
        const service = services.find(s => s.id === apt.serviceId)
        
        return {
          id: apt.id,
          startTime: apt.startTime,
          endTime: apt.endTime,
          status: apt.status,
          totalPrice: apt.totalPrice,
          notes: apt.notes,
          customer: customer ? { name: customer.name, email: customer.email, phone: customer.phone } : null,
          staff: staffMember ? { name: staffMember.name } : null,
          service: service ? { name: service.name, price: service.price } : null,
        }
      })
  },
}
