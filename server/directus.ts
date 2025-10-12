import { createDirectus, rest, staticToken, readItems, readSingleton, createItem } from '@directus/sdk';

// Define interfaces for Directus collections
export interface Vendor {
  id: string;
  name: string;
  category: number;
  description: string;
  price_range: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  social_media: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  profile_image_url: string;
  cover_image_url: string;
  gallery_image_urls: string[];
  rating: number;
  reviews_count: number;
  availability_calendar: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  vendor: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  review: string;
  approved: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: any;
  author: string;
  published_date: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InvitationTemplate {
  id: number;
  name: string;
  description: string;
  preview_image: any;
  template_file: any;
  category: string;
  tags: string[];
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  logo: any;
  favicon: any;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  google_ads_id: string;
  updated_at: string;
}

// Define the schema interface
interface DirectusSchema {
  vendors: Vendor[];
  categories: Category[];
  reviews: Review[];
  blog_posts: BlogPost[];
  invitation_templates: InvitationTemplate[];
  site_settings: SiteSettings;
}

// Initialize Directus client
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

// Function to get all vendors with category details
export async function getVendors(limit: number = 20, offset: number = 0): Promise<Vendor[]> {
  try {
    const response = await directus.request(
      readItems('vendors', {
        limit,
        offset,
        fields: ['*'],
        filter: {
          status: {
            _eq: 'active'
          }
        },
        sort: ['-created_at']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw new Error('Failed to fetch vendors');
  }
}

// Function to get a single vendor by ID with related data
export async function getVendor(id: string): Promise<Vendor> {
  try {
    const response = await directus.request(
      readItems('vendors', {
        filter: {
          id: {
            _eq: id
          }
        },
        fields: ['*']
      })
    );
    
    if (response.length === 0) {
      throw new Error('Vendor not found');
    }
    
    return response[0];
  } catch (error) {
    console.error('Error fetching vendor:', error);
    throw new Error('Failed to fetch vendor');
  }
}

// Function to search vendors
export async function searchVendors(query: string, filters: any = {}): Promise<Vendor[]> {
  try {
    const searchFilters: any = {
      _or: [
        { name: { _contains: query } },
        { description: { _contains: query } }
      ],
      status: { _eq: 'active' }
    };
    
    // Add additional filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        searchFilters[key] = { _eq: filters[key] };
      }
    });
    
    const response = await directus.request(
      readItems('vendors', {
        filter: searchFilters,
        fields: ['*'],
        sort: ['-rating']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error searching vendors:', error);
    throw new Error('Failed to search vendors');
  }
}

// Function to get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await directus.request(
      readItems('categories', {
        fields: ['*'],
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['sort']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Function to get vendors by category
export async function getVendorsByCategory(categorySlug: string): Promise<Vendor[]> {
  try {
    // First get the category ID by slug
    const categories = await directus.request(
      readItems('categories', {
        filter: {
          slug: {
            _eq: categorySlug
          }
        },
        fields: ['id']
      })
    );
    
    if (categories.length === 0) {
      return [];
    }
    
    const categoryId = categories[0].id;
    
    // Then get vendors by category ID
    const response = await directus.request(
      readItems('vendors', {
        filter: {
          category: {
            _eq: categoryId
          },
          status: {
            _eq: 'active'
          }
        },
        fields: ['*'],
        sort: ['-rating']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    throw new Error('Failed to fetch vendors by category');
  }
}

// Function to get featured vendors
export async function getFeaturedVendors(limit: number = 6): Promise<Vendor[]> {
  try {
    const response = await directus.request(
      readItems('vendors', {
        filter: {
          status: {
            _eq: 'active'
          }
        },
        fields: ['*'],
        sort: ['-rating'],
        limit
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching featured vendors:', error);
    throw new Error('Failed to fetch featured vendors');
  }
}

// Function to get recent blog posts
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const response = await directus.request(
      readItems('blog_posts', {
        fields: ['*'],
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-published_date'],
        limit
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

// Function to get site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = await directus.request(
      readSingleton('site_settings', {
        fields: ['*']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw new Error('Failed to fetch site settings');
  }
}

// Function to submit a review
export async function submitReview(reviewData: Partial<Review>): Promise<Review> {
  try {
    const response = await directus.request(
      createItem('reviews', {
        ...reviewData,
        status: 'pending' // Reviews need approval
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw new Error('Failed to submit review');
  }
}

// Function to get invitation templates
export async function getInvitationTemplates(category?: string): Promise<InvitationTemplate[]> {
  try {
    const filters: any = {
      status: {
        _eq: 'published'
      }
    };
    
    if (category) {
      filters.category = {
        _eq: category
      };
    }
    
    const response = await directus.request(
      readItems('invitation_templates', {
        fields: ['*'],
        filter: filters,
        sort: ['-id']
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching invitation templates:', error);
    throw new Error('Failed to fetch invitation templates');
  }
}

// Function to submit a business listing
export async function submitBusinessListing(vendorData: Partial<Vendor>): Promise<Vendor> {
  try {
    const response = await directus.request(
      createItem('vendors', {
        ...vendorData,
        status: 'draft' // Needs admin approval
      })
    );
    
    return response;
  } catch (error) {
    console.error('Error submitting business listing:', error);
    throw new Error('Failed to submit business listing');
  }
}

export { directus };