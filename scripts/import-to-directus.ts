import { createDirectus, rest, staticToken, createItem, readItems } from '@directus/sdk';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Define interfaces for Directus collections
interface Vendor {
  id: number;
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
  images: any[];
  featured_image: any;
  rating: number;
  reviews_count: number;
  availability_calendar: any;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Category {
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

interface Review {
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

interface BlogPost {
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

interface InvitationTemplate {
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

interface SiteSettings {
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
  google_analytics_id: string;
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

async function importDataToDirectus() {
  try {
    console.log("Starting Directus data import...");
    
    // Import categories first (vendors reference categories)
    console.log("Importing categories...");
    const categoriesData = JSON.parse(
      await readFile(join(process.cwd(), "data-export", "categories.json"), "utf-8")
    );
    
    const importedCategories = [];
    for (const category of categoriesData) {
      try {
        // Map the category data to Directus format
        const directusCategory = {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          color: category.color,
          sort: category.sort || 0,
          status: 'published',
        };
        
        const result = await directus.request(createItem('categories', directusCategory));
        importedCategories.push(result);
        console.log(`Imported category: ${category.name}`);
      } catch (error) {
        console.error(`Error importing category ${category.name}:`, error);
      }
    }
    console.log(`Imported ${importedCategories.length} categories`);
    
    // Import vendors
    console.log("Importing vendors...");
    const vendorsData = JSON.parse(
      await readFile(join(process.cwd(), "data-export", "vendors.json"), "utf-8")
    );
    
    const importedVendors = [];
    for (const vendor of vendorsData) {
      try {
        // Map the vendor data to Directus format
        const directusVendor = {
          name: vendor.name,
          category: vendor.category, // This should be updated to reference the actual category ID
          description: vendor.description,
          price_range: vendor.priceRange,
          location: vendor.location,
          phone: vendor.phone,
          email: vendor.email,
          website: vendor.website,
          social_media: {
            facebook: vendor.facebook,
            instagram: vendor.instagram,
            linkedin: vendor.linkedinUrl,
            twitter: vendor.twitterUrl,
          },
          images: vendor.gallery ? JSON.parse(vendor.gallery) : [],
          featured_image: vendor.profileImage,
          rating: vendor.rating,
          reviews_count: vendor.reviewCount,
          availability_calendar: null, // This would need to be properly mapped
          status: 'active',
        };
        
        const result = await directus.request(createItem('vendors', directusVendor));
        importedVendors.push(result);
        console.log(`Imported vendor: ${vendor.name}`);
      } catch (error) {
        console.error(`Error importing vendor ${vendor.name}:`, error);
      }
    }
    console.log(`Imported ${importedVendors.length} vendors`);
    
    // Import blog posts
    console.log("Importing blog posts...");
    const blogPostsData = JSON.parse(
      await readFile(join(process.cwd(), "data-export", "blog_posts.json"), "utf-8")
    );
    
    const importedBlogPosts = [];
    for (const post of blogPostsData) {
      try {
        // Map the blog post data to Directus format
        const directusPost = {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featured_image: post.featuredImage,
          author: 'Admin', // This would need to be properly mapped
          published_date: new Date().toISOString(),
          seo_title: post.title,
          seo_description: post.excerpt,
          tags: post.tags ? JSON.parse(post.tags) : [],
          status: 'published',
        };
        
        const result = await directus.request(createItem('blog_posts', directusPost));
        importedBlogPosts.push(result);
        console.log(`Imported blog post: ${post.title}`);
      } catch (error) {
        console.error(`Error importing blog post ${post.title}:`, error);
      }
    }
    console.log(`Imported ${importedBlogPosts.length} blog posts`);
    
    // Import reviews
    console.log("Importing reviews...");
    const reviewsData = JSON.parse(
      await readFile(join(process.cwd(), "data-export", "reviews.json"), "utf-8")
    );
    
    const importedReviews = [];
    for (const review of reviewsData) {
      try {
        // Map the review data to Directus format
        const directusReview = {
          vendor: review.vendorId, // This should be updated to reference the actual vendor ID
          customer_name: review.customerName,
          customer_email: review.customerEmail,
          rating: review.rating,
          review: review.comment,
          approved: true,
          status: 'published',
        };
        
        const result = await directus.request(createItem('reviews', directusReview));
        importedReviews.push(result);
        console.log(`Imported review for vendor ID: ${review.vendorId}`);
      } catch (error) {
        console.error(`Error importing review for vendor ID ${review.vendorId}:`, error);
      }
    }
    console.log(`Imported ${importedReviews.length} reviews`);
    
    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error during data import:", error);
    process.exit(1);
  }
}

// Run the import
importDataToDirectus();