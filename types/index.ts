import { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Barbershop = Tables<'barbershops'>
export type Staff = Tables<'staff'>
export type Service = Tables<'services'>
export type WorkingHours = Tables<'working_hours'>
export type Customer = Tables<'customers'>
export type Appointment = Tables<'appointments'>
export type StaffService = Tables<'staff_services'>

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type StaffRole = 'admin' | 'barber' | 'reception'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid'
export type PlanType = 'FREE' | 'PRO' | 'PREMIUM'

export interface AppointmentWithDetails extends Appointment {
  customer: Customer
  staff: Staff
  service: Service
  barbershop: Barbershop
}

export interface BarbershopWithDetails extends Barbershop {
  staff: Staff[]
  services: Service[]
  workingHours: WorkingHours[]
  working_hours?: WorkingHours[] // For backward compatibility
}

export interface StaffWithDetails extends Staff {
  services: Service[]
  working_hours: WorkingHours[]
}

export interface CustomerWithAppointments extends Customer {
  appointments: Appointment[]
}

export interface DashboardStats {
  totalAppointments: number
  totalRevenue: number
  totalCustomers: number
  totalStaff: number
  todayAppointments: number
  upcomingAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  noShowAppointments: number
  monthlyRevenue: number
  averageAppointmentValue: number
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: AppointmentStatus
  customer: Customer
  staff: Staff
  service: Service
  color?: string
}

export interface TimeSlot {
  time: string
  available: boolean
  staffId?: string
  staffName?: string
}

export interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: string
  staffId: string
  date: string
  time: string
  notes?: string
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  component: React.ComponentType<any>
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  bookingConfirmation: boolean
  bookingReminder: boolean
  bookingCancellation: boolean
  newBooking: boolean
  dailyDigest: boolean
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  logoUrl?: string
  faviconUrl?: string
  customCss?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface SearchFilters {
  query?: string
  status?: AppointmentStatus
  staffId?: string
  serviceId?: string
  dateFrom?: string
  dateTo?: string
  customerId?: string
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  dateFrom?: string
  dateTo?: string
  includeDetails?: boolean
  groupBy?: 'day' | 'week' | 'month' | 'staff' | 'service'
}
