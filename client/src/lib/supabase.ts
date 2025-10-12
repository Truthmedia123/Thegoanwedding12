import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript support
export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: number
          name: string
          description: string | null
          category: string | null
          location: string | null
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          rating: number | null
          featured_image: string | null
          images: string[] | null
          services: string[] | null
          price_range: string | null
          availability: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          category?: string | null
          location?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          rating?: number | null
          featured_image?: string | null
          images?: string[] | null
          services?: string[] | null
          price_range?: string | null
          availability?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          category?: string | null
          location?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          rating?: number | null
          featured_image?: string | null
          images?: string[] | null
          services?: string[] | null
          price_range?: string | null
          availability?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          vendor_id: number
          customer_name: string
          customer_email: string | null
          rating: number
          title: string | null
          comment: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          customer_name: string
          customer_email?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          customer_name?: string
          customer_email?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invitations: {
        Row: {
          id: number
          wedding_id: string
          guest_name: string
          guest_email: string | null
          guest_phone: string | null
          plus_ones: number
          dietary_requirements: string | null
          rsvp_status: string | null
          rsvp_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          wedding_id: string
          guest_name: string
          guest_email?: string | null
          guest_phone?: string | null
          plus_ones?: number
          dietary_requirements?: string | null
          rsvp_status?: string | null
          rsvp_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          wedding_id?: string
          guest_name?: string
          guest_email?: string | null
          guest_phone?: string | null
          plus_ones?: number
          dietary_requirements?: string | null
          rsvp_status?: string | null
          rsvp_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      blogs: {
        Row: {
          id: number
          title: string
          slug: string
          content: string
          excerpt: string | null
          author_id: string | null
          published: boolean
          featured_image: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content: string
          excerpt?: string | null
          author_id?: string | null
          published?: boolean
          featured_image?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          author_id?: string | null
          published?: boolean
          featured_image?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      vendor_analytics: {
        Row: {
          id: number
          vendor_id: number
          event_type: string
          user_id: string | null
          session_id: string | null
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          event_type: string
          user_id?: string | null
          session_id?: string | null
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          event_type?: string
          user_id?: string | null
          session_id?: string | null
          metadata?: any | null
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: number
          key: string
          value: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: any
          description?: string | null
          created_at?: string
          updated_at?: string
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
