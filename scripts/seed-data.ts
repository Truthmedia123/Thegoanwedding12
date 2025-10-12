#!/usr/bin/env tsx

/**
 * Sample Data Seeder for TheGoanWedding
 * 
 * This script creates sample vendors, invitation templates, and blog posts
 * for development and testing purposes.
 */

import { createDirectus, rest, staticToken, createItem, createItems, authentication } from '@directus/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.development' });

// Define interfaces for Directus collections
interface Vendor {
  id?: number;
  name: string;
  category: number;
  description: string;
  price_range: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  images?: any[];
  featured_image?: any;
  rating: number;
  reviews_count: number;
  availability_calendar?: any;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id?: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface InvitationTemplate {
  id?: number;
  name: string;
  description: string;
  preview_image?: any;
  template_file?: any;
  category: string;
  tags: string[];
  featured: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: any;
  author: string;
  published_date: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Define the schema interface
interface DirectusSchema {
  vendors: Vendor[];
  categories: Category[];
  invitation_templates: InvitationTemplate[];
  blog_posts: BlogPost[];
}

// Initialize Directus client
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'dev-token';

const directus = createDirectus<DirectusSchema>(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

// Sample Goan wedding vendors
const VENDORS: Vendor[] = [
  // Photographers
  {
    name: "Goa Photography Studio",
    category: 1, // Will be updated after categories are created
    description: "Professional wedding photography capturing Goa's natural beauty with artistic flair. Specializing in candid moments and stunning beach weddings.",
    price_range: "₹50,000 - ₹1,50,000",
    location: "Calangute, North Goa",
    phone: "+91 98765 43210",
    email: "info@goaphotostudio.com",
    website: "https://goaphotostudio.com",
    social_media: {
      instagram: "@goaphotostudio",
      facebook: "GoaPhotographyStudio"
    },
    rating: 4.8,
    reviews_count: 42,
    status: "active"
  },
  {
    name: "Sunset Candid Shots",
    category: 1,
    description: "Award-winning photographers specializing in destination weddings. Known for capturing the golden hour magic of Goan beaches.",
    price_range: "₹75,000 - ₹2,00,000",
    location: "Baga, North Goa",
    phone: "+91 98765 43211",
    email: "hello@sunsetcandid.com",
    website: "https://sunsetcandid.com",
    social_media: {
      instagram: "@sunsetcandid",
      facebook: "SunsetCandidShots"
    },
    rating: 4.9,
    reviews_count: 38,
    status: "active"
  },
  {
    name: "Beach Frame Photography",
    category: 1,
    description: "Specializing in beach weddings and outdoor photography with a team of creative professionals.",
    price_range: "₹40,000 - ₹1,20,000",
    location: "Anjuna, North Goa",
    phone: "+91 98765 43214",
    email: "hello@beachframe.com",
    website: "https://beachframe.com",
    social_media: {
      instagram: "@beachframegoa",
      facebook: "BeachFrameGoa"
    },
    rating: 4.7,
    reviews_count: 35,
    status: "active"
  },
  {
    name: "Traditional Lens",
    category: 1,
    description: "Capturing traditional Goan weddings with cultural authenticity and artistic excellence.",
    price_range: "₹60,000 - ₹1,80,000",
    location: "Old Goa, South Goa",
    phone: "+91 98765 43215",
    email: "info@traditionallens.com",
    website: "https://traditionallens.com",
    social_media: {
      instagram: "@traditionallens",
      facebook: "TraditionalLensGoa"
    },
    rating: 4.8,
    reviews_count: 41,
    status: "active"
  },
  // Venues
  {
    name: "Grand Hyatt Goa",
    category: 2,
    description: "Luxury beachfront venue with stunning views and world-class amenities. Perfect for grand celebrations with capacity for 500+ guests.",
    price_range: "₹15,00,000 - ₹30,00,000",
    location: "Baga, North Goa",
    phone: "+91 832 123 4567",
    email: "weddings@grandhyattgoa.com",
    website: "https://goa.grand.hyatt.com",
    social_media: {
      instagram: "@grandhyattgoa",
      facebook: "GrandHyattGoa"
    },
    rating: 4.9,
    reviews_count: 128,
    status: "active"
  },
  {
    name: "Taj Exotica Resort",
    category: 2,
    description: "Elegant resort with private beach access and multiple indoor/outdoor venues. Offers complete wedding planning services.",
    price_range: "₹12,00,000 - ₹25,00,000",
    location: "Benaulim, South Goa",
    phone: "+91 832 123 4568",
    email: "events@tajexotica.com",
    website: "https://www.tajhotels.com",
    social_media: {
      instagram: "@tajexoticagoa",
      facebook: "TajExoticaGoa"
    },
    rating: 4.8,
    reviews_count: 96,
    status: "active"
  },
  {
    name: "Casa Vagator Beach Resort",
    category: 2,
    description: "Charming beachfront resort with bohemian vibes, perfect for intimate beach weddings.",
    price_range: "₹8,00,000 - ₹18,00,000",
    location: "Vagator, North Goa",
    phone: "+91 832 123 4569",
    email: "weddings@casavagator.com",
    website: "https://casavagator.com",
    social_media: {
      instagram: "@casavagator",
      facebook: "CasaVagatorGoa"
    },
    rating: 4.7,
    reviews_count: 87,
    status: "active"
  },
  {
    name: "Chapel of Souls",
    category: 2,
    description: "Historic chapel venue with traditional Goan architecture and beautiful gardens.",
    price_range: "₹5,00,000 - ₹12,00,000",
    location: "Old Goa, South Goa",
    phone: "+91 832 123 4570",
    email: "events@chapelofsouls.com",
    website: "https://chapelofsouls.com",
    social_media: {
      instagram: "@chapelofsouls",
      facebook: "ChapelOfSoulsGoa"
    },
    rating: 4.9,
    reviews_count: 76,
    status: "active"
  },
  // Caterers
  {
    name: "Goan Flavours Catering",
    category: 3,
    description: "Authentic Goan cuisine with a modern twist. Specializes in traditional wedding feasts with vegetarian and non-vegetarian options.",
    price_range: "₹800 - ₹1,500 per plate",
    location: "Panjim, Goa",
    phone: "+91 98765 43212",
    email: "info@goanflavours.com",
    website: "https://goanflavours.com",
    social_media: {
      instagram: "@goanflavourscatering",
      facebook: "GoanFlavoursCatering"
    },
    rating: 4.7,
    reviews_count: 65,
    status: "active"
  },
  {
    name: "Spice Route Caterers",
    category: 3,
    description: "Multi-cuisine caterers with expertise in Goan, Indian, and international dishes. Offers customizable menus for all budgets.",
    price_range: "₹600 - ₹2,000 per plate",
    location: "Margao, South Goa",
    phone: "+91 98765 43213",
    email: "bookings@spiceroutecaterers.com",
    website: "https://spiceroutecaterers.com",
    social_media: {
      instagram: "@spiceroutecaterers",
      facebook: "SpiceRouteCaterers"
    },
    rating: 4.6,
    reviews_count: 54,
    status: "active"
  },
  {
    name: "Coastal Cuisine",
    category: 3,
    description: "Specializing in seafood delicacies and coastal Goan dishes with a modern presentation.",
    price_range: "₹1,000 - ₹2,500 per plate",
    location: "Candolim, North Goa",
    phone: "+91 98765 43216",
    email: "info@coastalcuisine.com",
    website: "https://coastalcuisine.com",
    social_media: {
      instagram: "@coastalcuisinegoa",
      facebook: "CoastalCuisineGoa"
    },
    rating: 4.8,
    reviews_count: 58,
    status: "active"
  },
  {
    name: "Traditional Thali",
    category: 3,
    description: "Authentic Goan thali service with traditional vegetarian and non-vegetarian options.",
    price_range: "₹700 - ₹1,200 per plate",
    location: "Mapusa, North Goa",
    phone: "+91 98765 43217",
    email: "bookings@traditionalthali.com",
    website: "https://traditionalthali.com",
    social_media: {
      instagram: "@traditionalthali",
      facebook: "TraditionalThaliGoa"
    },
    rating: 4.5,
    reviews_count: 49,
    status: "active"
  },
  // Decorators
  {
    name: "Goan Paradise Decor",
    category: 4,
    description: "Creating magical wedding decor with traditional Goan elements and tropical flowers.",
    price_range: "₹2,00,000 - ₹8,00,000",
    location: "Porvorim, North Goa",
    phone: "+91 98765 43218",
    email: "info@goanparadisedecor.com",
    website: "https://goanparadisedecor.com",
    social_media: {
      instagram: "@goanparadisedecor",
      facebook: "GoanParadiseDecor"
    },
    rating: 4.9,
    reviews_count: 67,
    status: "active"
  },
  {
    name: "Beachside Blooms",
    category: 4,
    description: "Specializing in beach wedding decorations with locally sourced flowers and natural elements.",
    price_range: "₹1,50,000 - ₹6,00,000",
    location: "Palolem, South Goa",
    phone: "+91 98765 43219",
    email: "hello@beachsideblooms.com",
    website: "https://beachsideblooms.com",
    social_media: {
      instagram: "@beachsideblooms",
      facebook: "BeachsideBloomsGoa"
    },
    rating: 4.7,
    reviews_count: 53,
    status: "active"
  },
  // Makeup Artists
  {
    name: "Bridal Glow Goa",
    category: 5,
    description: "Professional bridal makeup artists specializing in both traditional and contemporary looks.",
    price_range: "₹15,000 - ₹35,000",
    location: "Miramar, North Goa",
    phone: "+91 98765 43220",
    email: "info@bridalglowgoa.com",
    website: "https://bridalglowgoa.com",
    social_media: {
      instagram: "@bridalglowgoa",
      facebook: "BridalGlowGoa"
    },
    rating: 4.8,
    reviews_count: 42,
    status: "active"
  },
  {
    name: "Traditional Beauty",
    category: 5,
    description: "Specializing in traditional Goan bridal makeup and hairstyling.",
    price_range: "₹12,000 - ₹28,000",
    location: "Velha Goa, South Goa",
    phone: "+91 98765 43221",
    email: "bookings@traditionalbeauty.com",
    website: "https://traditionalbeauty.com",
    social_media: {
      instagram: "@traditionalbeautygoa",
      facebook: "TraditionalBeautyGoa"
    },
    rating: 4.6,
    reviews_count: 38,
    status: "active"
  }
];

// Vendor categories
const CATEGORIES: Category[] = [
  {
    name: "Photographers",
    slug: "photographers",
    description: "Capture your special moments with professional photographers",
    icon: "fas fa-camera",
    color: "#ec4899",
    sort: 1,
    status: "published"
  },
  {
    name: "Venues",
    slug: "venues",
    description: "Beautiful locations for your dream wedding",
    icon: "fas fa-umbrella-beach",
    color: "#8b5cf6",
    sort: 2,
    status: "published"
  },
  {
    name: "Caterers",
    slug: "caterers",
    description: "Delicious cuisine for your wedding celebration",
    icon: "fas fa-utensils",
    color: "#10b981",
    sort: 3,
    status: "published"
  },
  {
    name: "Decorators",
    slug: "decorators",
    description: "Transform your venue with beautiful decorations",
    icon: "fas fa-star",
    color: "#f59e0b",
    sort: 4,
    status: "published"
  },
  {
    name: "Makeup Artists",
    slug: "makeup-artists",
    description: "Professional makeup and hairstyling services",
    icon: "fas fa-paint-brush",
    color: "#ef4444",
    sort: 5,
    status: "published"
  }
];

// Invitation templates
const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    name: "Beach Wedding Elegance",
    description: "Elegant beach-themed invitation with seashells and sunset colors",
    category: "beach",
    tags: ["beach", "elegant", "sunset"],
    featured: true,
    status: "published"
  },
  {
    name: "Traditional Goan Ceremony",
    description: "Traditional invitation design featuring Goan cultural elements",
    category: "traditional",
    tags: ["traditional", "goan", "cultural"],
    featured: true,
    status: "published"
  },
  {
    name: "Modern Minimalist",
    description: "Clean and modern design with minimalist typography",
    category: "modern",
    tags: ["modern", "minimalist", "clean"],
    featured: false,
    status: "published"
  },
  {
    name: "Tropical Paradise",
    description: "Vibrant tropical design with palm leaves and exotic flowers",
    category: "tropical",
    tags: ["tropical", "vibrant", "flowers"],
    featured: true,
    status: "published"
  },
  {
    name: "Vintage Romance",
    description: "Romantic vintage design with elegant script fonts and floral accents",
    category: "vintage",
    tags: ["vintage", "romantic", "elegant"],
    featured: true,
    status: "published"
  },
  {
    name: "Bohemian Rhapsody",
    description: "Bohemian style with earthy tones and artistic elements",
    category: "bohemian",
    tags: ["bohemian", "earthy", "artistic"],
    featured: false,
    status: "published"
  },
  {
    name: "Royal Affair",
    description: "Luxurious design with gold accents and regal typography",
    category: "luxury",
    tags: ["luxury", "gold", "regal"],
    featured: true,
    status: "published"
  },
  {
    name: "Simple Elegance",
    description: "Clean and simple design with sophisticated color palette",
    category: "simple",
    tags: ["simple", "elegant", "clean"],
    featured: false,
    status: "published"
  }
];

// Blog posts about Goan wedding traditions
const BLOG_POSTS: BlogPost[] = [
  {
    title: "Top 10 Wedding Venues in Goa",
    slug: "top-10-wedding-venues-in-goa",
    excerpt: "Discover the most beautiful and popular wedding venues across Goa",
    content: `Goa offers some of the most stunning wedding venues in India, with its pristine beaches, historic churches, and lush greenery providing the perfect backdrop for your special day.

## Beach Venues
Goa's coastline features some of the most sought-after beach wedding venues. From the bustling Baga Beach to the serene Agonda Beach, each location offers its unique charm.

## Historic Churches
For couples seeking a traditional Goan wedding experience, the state's centuries-old churches provide an authentic setting. The Se Cathedral and Church of St. Francis of Assisi are popular choices.

## Luxury Resorts
Many luxury resorts in Goa offer complete wedding packages with stunning venues, accommodation, and catering services.`,
    author: "Wedding Planning Team",
    published_date: new Date().toISOString(),
    seo_title: "Top 10 Wedding Venues in Goa | TheGoanWedding",
    seo_description: "Discover the best wedding venues in Goa including beach locations, historic churches, and luxury resorts for your perfect wedding celebration.",
    tags: ["Goa", "wedding venues", "beach weddings", "church weddings"],
    status: "published"
  },
  {
    title: "Goan Wedding Traditions You Should Know",
    slug: "goan-wedding-traditions",
    excerpt: "Explore the rich cultural traditions of Goan weddings",
    content: `Goan weddings are a beautiful blend of Portuguese and Indian traditions, creating a unique celebration that reflects the state's multicultural heritage.

## The Roce Ceremony
The Roce ceremony is a pre-wedding ritual where a paste of turmeric, sandalwood, and rose water is applied to the bride and groom. This ritual is believed to bring good luck and purify the couple.

## The Dekhri Ritual
In this ritual, the groom's sister-in-law (saal) welcomes the bride to her new home by performing an aarti and applying a red sindoor dot on her forehead.

## Traditional Attire
Brides typically wear a saree in traditional Goan colors like red, green, or purple, while grooms wear a white shirt with a dhoti and a stole.

## Feast and Festivities
Goan weddings are known for their elaborate feasts featuring traditional dishes like sanna, dodol, and various seafood preparations.`,
    author: "Cultural Experts",
    published_date: new Date().toISOString(),
    seo_title: "Goan Wedding Traditions | Cultural Guide | TheGoanWedding",
    seo_description: "Learn about traditional Goan wedding ceremonies, rituals, and cultural practices that make these celebrations unique and memorable.",
    tags: ["Goan culture", "wedding traditions", "Portuguese influence", "wedding rituals"],
    status: "published"
  },
  {
    title: "Planning Your Dream Beach Wedding in Goa",
    slug: "planning-beach-wedding-goa",
    excerpt: "Everything you need to know to plan the perfect beach wedding in Goa",
    content: `Planning a beach wedding in Goa is a dream for many couples. The state's stunning coastline, year-round sunshine, and vibrant culture make it an ideal destination for your special day.

## Best Time to Get Married
The best time for a Goa wedding is between November and March when the weather is pleasant and dry. Avoid the monsoon season from June to September.

## Legal Requirements
Foreign nationals need to obtain a No Objection Certificate (NOC) from their respective consulate in India. Indian citizens need to provide standard documentation.

## Choosing the Right Beach
Each beach in Goa has its own character. Baga and Calangute are popular for their amenities, while Palolem and Agonda offer more privacy and serenity.

## Vendor Selection
Work with local vendors who understand the unique challenges of beach weddings, such as wind, sand, and tides.`
,
    author: "Destination Wedding Experts",
    published_date: new Date().toISOString(),
    seo_title: "Planning Your Dream Beach Wedding in Goa | TheGoanWedding",
    seo_description: "Complete guide to planning a beach wedding in Goa including best beaches, legal requirements, and vendor selection tips.",
    tags: ["beach wedding", "destination wedding", "Goa", "wedding planning"],
    status: "published"
  },
  {
    title: "Goan Wedding Cuisine: A Culinary Journey",
    slug: "goan-wedding-cuisine",
    excerpt: "Discover the delicious flavors of traditional Goan wedding food",
    content: `Goan wedding cuisine is a delightful fusion of Portuguese and Indian flavors, creating a unique culinary experience that reflects the state's rich heritage.

## Traditional Dishes
Sanna (sweet rice bread), dodol (sweet coconut fudge), and sorpotel (spicy pork curry) are staples at Goan weddings.

## Seafood Specialties
Being a coastal state, Goa offers an abundance of fresh seafood. Grilled fish, prawn balchão, and crab xec xec are popular choices.

## Vegetarian Options
For vegetarian guests, dishes like vegetable cafreal, paneer xec xec, and various lentil preparations are served.

## Desserts
End your wedding feast with traditional sweets like bebinca (layered coconut pudding) and patoleo (sweet coconut dumplings).`
,
    author: "Culinary Experts",
    published_date: new Date().toISOString(),
    seo_title: "Goan Wedding Cuisine: Traditional Dishes & Flavors | TheGoanWedding",
    seo_description: "Explore traditional Goan wedding cuisine including seafood specialties, vegetarian options, and authentic desserts.",
    tags: ["Goan food", "wedding cuisine", "traditional dishes", "seafood"],
    status: "published"
  }
];

/**
 * Seed categories
 */
async function seedCategories(): Promise<number[]> {
  console.log('🌱 Seeding categories...');
  const categoryIds: number[] = [];
  
  try {
    for (const category of CATEGORIES) {
      const result = await directus.request(createItem('categories', category));
      if (result.id) {
        categoryIds.push(result.id);
      }
      console.log(`✅ Created category: ${result.name}`);
    }
    return categoryIds;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

/**
 * Seed vendors
 */
async function seedVendors(categoryIds: number[]) {
  console.log('\n🌱 Seeding vendors...');
  
  try {
    // Update vendor categories with actual IDs
    const vendorsWithCategories = VENDORS.map((vendor, index) => ({
      ...vendor,
      category: categoryIds[index % categoryIds.length]
    }));
    
    const results = await directus.request(createItems('vendors', vendorsWithCategories));
    console.log(`✅ Created ${results.length} vendors`);
    return results;
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    throw error;
  }
}

/**
 * Seed invitation templates
 */
async function seedInvitationTemplates() {
  console.log('\n🌱 Seeding invitation templates...');
  
  try {
    const results = await directus.request(createItems('invitation_templates', INVITATION_TEMPLATES));
    console.log(`✅ Created ${results.length} invitation templates`);
    return results;
  } catch (error) {
    console.error('❌ Error seeding invitation templates:', error);
    throw error;
  }
}

/**
 * Seed blog posts
 */
async function seedBlogPosts() {
  console.log('\n🌱 Seeding blog posts...');
  
  try {
    const results = await directus.request(createItems('blog_posts', BLOG_POSTS));
    console.log(`✅ Created ${results.length} blog posts`);
    return results;
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
    throw error;
  }
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🎉 TheGoanWedding Sample Data Seeder');
  console.log('=====================================\n');
  
  try {
    // Login to Directus
    console.log('🔐 Logging into Directus...');
    await directus.login({ email: 'admin@thegoanwedding.com', password: 'SecurePassword123!' });
    console.log('✅ Successfully logged into Directus!');
    
    // Seed categories first (vendors reference categories)
    const categoryIds = await seedCategories();
    
    // Seed vendors
    await seedVendors(categoryIds);
    
    // Seed invitation templates
    await seedInvitationTemplates();
    
    // Seed blog posts
    await seedBlogPosts();
    
    console.log('\n✅ All sample data has been successfully seeded!');
    console.log('\n📊 Summary:');
    console.log(`   - ${CATEGORIES.length} categories`);
    console.log(`   - ${VENDORS.length} vendors`);
    console.log(`   - ${INVITATION_TEMPLATES.length} invitation templates`);
    console.log(`   - ${BLOG_POSTS.length} blog posts`);
    
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:8055/admin to view the data');
    console.log('   2. Access your application at http://localhost:8787');
    console.log('   3. Test the invitation generator and search functionality');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeder
main();