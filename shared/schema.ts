// Supabase Postgres Schema
// This schema is designed to work with Supabase PostgreSQL database

export interface Vendor {
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
  profile_image_url: string | null
  cover_image_url: string | null
  images: string[] | null
  manual_videos: string[] | null
  services: string[] | null
  price_range: string | null
  availability: string | null
  created_at: string
  updated_at: string
  // Additional fields for social media
  whatsapp?: string | null
  instagram?: string | null
  youtube?: string | null
  facebook?: string | null
  facebook_url?: string | null
  instagram_url?: string | null
  linkedin_url?: string | null
  twitter_url?: string | null
  embed_code?: string | null
  featured?: boolean
  featured_until?: string | null
  featured_priority?: number | null
  verified?: boolean
  review_count?: number
  reviewCount?: number
  // Social media sync settings
  google_maps_place_id?: string | null
  auto_update_main_image?: boolean
  main_image_selection?: 'first' | 'random' | 'highest_quality'
  last_synced_at?: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  color?: string | null
  vendor_count?: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  vendor_id: number
  customer_name: string
  customer_email: string | null
  rating: number
  title: string | null
  comment: string | null
  images: string[] | null
  verified: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface BusinessSubmission {
  id: number
  name: string
  category: string
  description: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  location: string | null
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  services: string[] | null
  price_range: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  created_at: string
}

export interface Wedding {
  id: number
  bride_name: string
  groom_name: string
  wedding_date: string
  venue: string
  venue_address: string
  ceremony_time: string
  reception_time: string | null
  cover_image: string | null
  gallery_images: string[] | null
  story: string | null
  slug: string
  max_guests: number
  is_public: boolean
  contact_email: string
  contact_phone: string | null
  ceremony_venue: string | null
  ceremony_venue_address: string | null
  reception_venue: string | null
  reception_venue_address: string | null
  admin_secret_link: string | null
  created_at: string
  updated_at: string
}

export interface WeddingEvent {
  id: number
  wedding_id: number
  name: string
  description: string | null
  date: string
  start_time: string
  end_time: string | null
  venue: string
  address: string
  dress_code: string | null
  is_private: boolean
  max_guests: number | null
  order: number
  created_at: string
  updated_at: string
}

export interface Invitation {
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

// Insert types (for creating new records)
export interface InsertVendor extends Omit<Vendor, 'id' | 'rating' | 'review_count' | 'created_at' | 'updated_at'> {
  rating?: number
  review_count?: number
}

export interface InsertCategory extends Omit<Category, 'id' | 'vendor_count' | 'created_at' | 'updated_at'> {
  vendor_count?: number
}

export interface InsertReview extends Omit<Review, 'id' | 'verified' | 'created_at' | 'updated_at'> {
  verified?: boolean
}

export interface InsertBlogPost extends Omit<BlogPost, 'id' | 'published' | 'created_at' | 'updated_at'> {
  published?: boolean
}

export interface InsertBusinessSubmission extends Omit<BusinessSubmission, 'id' | 'status' | 'created_at' | 'updated_at'> {
  status?: string
}

export interface InsertContact extends Omit<Contact, 'id' | 'created_at'> {}

export interface InsertWedding extends Omit<Wedding, 'id' | 'created_at' | 'updated_at'> {}

export interface InsertWeddingEvent extends Omit<WeddingEvent, 'id' | 'created_at' | 'updated_at'> {}

export interface InsertInvitation extends Omit<Invitation, 'id' | 'created_at' | 'updated_at'> {}

// Search interfaces for full-text search
export interface VendorSearchResult extends Vendor {
  search_rank?: number
  matched_fields?: string[]
}

export interface CategorySearchResult extends Category {
  search_rank?: number
  matched_fields?: string[]
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  error: string | null
  count: number
  page: number
  limit: number
  total_pages: number
}

// Filter types for search
export interface VendorFilters {
  category?: string
  location?: string
  price_range?: string
  rating_min?: number
  featured?: boolean
  verified?: boolean
}

export interface SearchFilters extends VendorFilters {
  query?: string
  sort_by?: 'name' | 'rating' | 'created_at' | 'review_count'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}