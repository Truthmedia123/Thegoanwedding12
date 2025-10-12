import { supabase } from './supabase'
import type { 
  Vendor, 
  Category, 
  Review, 
  BlogPost, 
  BusinessSubmission, 
  Contact, 
  Wedding, 
  WeddingEvent, 
  Invitation,
  VendorSearchResult,
  CategorySearchResult,
  VendorFilters,
  SearchFilters,
  PaginatedResponse,
  ApiResponse
} from '@shared/schema'

// Vendor operations
export const vendorService = {
  async getAll(filters?: VendorFilters): Promise<ApiResponse<Vendor[]>> {
    try {
      let query = supabase.from('vendors').select('*')
      
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.location) {
        query = query.eq('location', filters.location)
      }
      if (filters?.price_range) {
        query = query.eq('price_range', filters.price_range)
      }
      if (filters?.rating_min) {
        query = query.gte('rating', filters.rating_min)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.verified !== undefined) {
        query = query.eq('verified', filters.verified)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getById(id: number): Promise<ApiResponse<Vendor>> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async search(query: string, filters?: VendorFilters): Promise<ApiResponse<VendorSearchResult[]>> {
    try {
      let searchQuery = supabase.from('vendors').select('*')
      
      // Full-text search using PostgreSQL's text search capabilities
      if (query) {
        searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,services.cs.{${query}}`)
      }
      
      // Apply filters
      if (filters?.category) {
        searchQuery = searchQuery.eq('category', filters.category)
      }
      if (filters?.location) {
        searchQuery = searchQuery.eq('location', filters.location)
      }
      if (filters?.price_range) {
        searchQuery = searchQuery.eq('price_range', filters.price_range)
      }
      if (filters?.rating_min) {
        searchQuery = searchQuery.gte('rating', filters.rating_min)
      }
      if (filters?.featured !== undefined) {
        searchQuery = searchQuery.eq('featured', filters.featured)
      }
      if (filters?.verified !== undefined) {
        searchQuery = searchQuery.eq('verified', filters.verified)
      }

      const { data, error } = await searchQuery.order('rating', { ascending: false })
      
      if (error) throw error
      return { data: data as VendorSearchResult[], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getFeatured(): Promise<ApiResponse<Vendor[]>> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(10)
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getByCategory(category: string): Promise<ApiResponse<Vendor[]>> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('category', category)
        .order('rating', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Category operations
export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async search(query: string): Promise<ApiResponse<CategorySearchResult[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name')
      
      if (error) throw error
      return { data: data as CategorySearchResult[], error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Review operations
export const reviewService = {
  async getByVendorId(vendorId: number): Promise<ApiResponse<Review[]>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async create(review: Omit<Review, 'id' | 'verified' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Review>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Blog operations
export const blogService = {
  async getAll(published = true): Promise<ApiResponse<BlogPost[]>> {
    try {
      let query = supabase.from('blog_posts').select('*')
      
      if (published) {
        query = query.eq('published', true)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Wedding operations
export const weddingService = {
  async getBySlug(slug: string): Promise<ApiResponse<Wedding>> {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async getEventsByWeddingId(weddingId: number): Promise<ApiResponse<WeddingEvent[]>> {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('date')
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Invitation operations
export const invitationService = {
  async getByWeddingId(weddingId: string): Promise<ApiResponse<Invitation[]>> {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at')
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  },

  async updateRsvp(id: number, rsvpStatus: string, rsvpDate: string): Promise<ApiResponse<Invitation>> {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .update({ rsvp_status: rsvpStatus, rsvp_date: rsvpDate })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Contact operations
export const contactService = {
  async create(contact: Omit<Contact, 'id' | 'created_at'>): Promise<ApiResponse<Contact>> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}

// Business submission operations
export const businessSubmissionService = {
  async create(submission: Omit<BusinessSubmission, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ApiResponse<BusinessSubmission>> {
    try {
      const { data, error } = await supabase
        .from('business_submissions')
        .insert(submission)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error: error.message }
    }
  }
}
