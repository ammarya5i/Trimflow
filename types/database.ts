export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          onboarding_completed: boolean
          subscription_status: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          subscription_plan: 'FREE' | 'PRO' | 'PREMIUM' | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_current_period_end: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          subscription_plan?: 'FREE' | 'PRO' | 'PREMIUM' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          subscription_plan?: 'FREE' | 'PRO' | 'PREMIUM' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
        }
      }
      barbershops: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          cover_image_url: string | null
          timezone: string
          currency: string
          language: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          timezone?: string
          currency?: string
          language?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          timezone?: string
          currency?: string
          language?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          barbershop_id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          role: 'admin' | 'barber' | 'reception'
          avatar_url: string | null
          bio: string | null
          specialties: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          role?: 'admin' | 'barber' | 'reception'
          avatar_url?: string | null
          bio?: string | null
          specialties?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          role?: 'admin' | 'barber' | 'reception'
          avatar_url?: string | null
          bio?: string | null
          specialties?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          barbershop_id: string
          name: string
          description: string | null
          duration: number
          price: number
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          name: string
          description?: string | null
          duration: number
          price: number
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      working_hours: {
        Row: {
          id: string
          barbershop_id: string
          staff_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_working: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          staff_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_working?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          staff_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_working?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          barbershop_id: string
          name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          name: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          barbershop_id: string
          customer_id: string
          staff_id: string
          service_id: string
          start_time: string
          end_time: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          total_price: number
          payment_status: 'pending' | 'paid' | 'refunded'
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          customer_id: string
          staff_id: string
          service_id: string
          start_time: string
          end_time: string
          duration: number
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          total_price: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          customer_id?: string
          staff_id?: string
          service_id?: string
          start_time?: string
          end_time?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          total_price?: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff_services: {
        Row: {
          id: string
          staff_id: string
          service_id: string
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          service_id: string
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          service_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
