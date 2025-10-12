import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";
import { createDirectus, rest, staticToken, readItems } from '@directus/sdk';

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

// Define the schema interface
interface DirectusSchema {
  vendors: Vendor[];
  categories: Category[];
  reviews: Review[];
  blog_posts: BlogPost[];
}

// Initialize Directus client
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

async function verifyMigration() {
  try {
    console.log("Starting migration verification...");
    
    // Connect to the SQLite database
    const sqlite = new Database(".db/dev.db");
    const db = drizzle(sqlite, { schema });
    
    // Get counts from D1
    console.log("Getting counts from D1...");
    const d1VendorsCount = (await db.select().from(schema.vendors).all()).length;
    const d1CategoriesCount = (await db.select().from(schema.categories).all()).length;
    const d1BlogPostsCount = (await db.select().from(schema.blogPosts).all()).length;
    const d1ReviewsCount = (await db.select().from(schema.reviews).all()).length;
    
    console.log(`D1 Counts:
      Vendors: ${d1VendorsCount}
      Categories: ${d1CategoriesCount}
      Blog Posts: ${d1BlogPostsCount}
      Reviews: ${d1ReviewsCount}`);
    
    // Get counts from Directus
    console.log("Getting counts from Directus...");
    const directusVendors = await directus.request(readItems('vendors'));
    const directusCategories = await directus.request(readItems('categories'));
    const directusBlogPosts = await directus.request(readItems('blog_posts'));
    const directusReviews = await directus.request(readItems('reviews'));
    
    console.log(`Directus Counts:
      Vendors: ${directusVendors.length}
      Categories: ${directusCategories.length}
      Blog Posts: ${directusBlogPosts.length}
      Reviews: ${directusReviews.length}`);
    
    // Compare counts
    console.log("\nComparison Results:");
    console.log(`Vendors: ${d1VendorsCount} (D1) vs ${directusVendors.length} (Directus) - ${d1VendorsCount === directusVendors.length ? '✅ MATCH' : '❌ MISMATCH'}`);
    console.log(`Categories: ${d1CategoriesCount} (D1) vs ${directusCategories.length} (Directus) - ${d1CategoriesCount === directusCategories.length ? '✅ MATCH' : '❌ MISMATCH'}`);
    console.log(`Blog Posts: ${d1BlogPostsCount} (D1) vs ${directusBlogPosts.length} (Directus) - ${d1BlogPostsCount === directusBlogPosts.length ? '✅ MATCH' : '❌ MISMATCH'}`);
    console.log(`Reviews: ${d1ReviewsCount} (D1) vs ${directusReviews.length} (Directus) - ${d1ReviewsCount === directusReviews.length ? '✅ MATCH' : '❌ MISMATCH'}`);
    
    // Check a few sample records for data integrity
    console.log("\nChecking sample records for data integrity...");
    
    if (d1VendorsCount > 0 && directusVendors.length > 0) {
      const d1Vendor = (await db.select().from(schema.vendors).limit(1).all())[0];
      const directusVendor = directusVendors[0];
      
      console.log(`Sample Vendor Check:
        D1: ${d1Vendor.name}
        Directus: ${directusVendor.name}
        Match: ${d1Vendor.name === directusVendor.name ? '✅' : '❌'}`);
    }
    
    if (d1CategoriesCount > 0 && directusCategories.length > 0) {
      const d1Category = (await db.select().from(schema.categories).limit(1).all())[0];
      const directusCategory = directusCategories[0];
      
      console.log(`Sample Category Check:
        D1: ${d1Category.name}
        Directus: ${directusCategory.name}
        Match: ${d1Category.name === directusCategory.name ? '✅' : '❌'}`);
    }
    
    // Generate migration report
    console.log("\n=== MIGRATION VERIFICATION REPORT ===");
    console.log("Overall Status:", 
      (d1VendorsCount === directusVendors.length &&
       d1CategoriesCount === directusCategories.length &&
       d1BlogPostsCount === directusBlogPosts.length &&
       d1ReviewsCount === directusReviews.length) ? '✅ SUCCESS' : '⚠️  PARTIAL SUCCESS');
    
    console.log("\nRecommendations:");
    console.log("- Review any mismatches in record counts");
    console.log("- Verify data integrity for critical fields");
    console.log("- Test all application functionality with Directus");
    console.log("- Update any hardcoded references to D1");
    
    sqlite.close();
  } catch (error) {
    console.error("Error during migration verification:", error);
    process.exit(1);
  }
}

// Run the verification
verifyMigration();