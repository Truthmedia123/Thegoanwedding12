import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample vendor data
const vendors = [
  {
    name: 'Goa Wedding Photography',
    category: 'Photographers and Videographers',
    description: 'Professional wedding photography services in Goa with over 10 years of experience. Specializing in candid and traditional wedding photography.',
    phone: '+91 9876543210',
    email: 'info@goaweddingphoto.com',
    whatsapp: '+919876543210',
    location: 'North Goa',
    address: 'Calangute, North Goa, Goa 403516',
    website: 'https://goaweddingphoto.com',
    instagram: 'https://instagram.com/goaweddingphoto',
    facebook: 'https://facebook.com/goaweddingphoto',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Pre-wedding', 'Wedding Day', 'Post-wedding', 'Engagement'],
    price_range: '$$$',
    featured: true,
    verified: true,
    rating: 4.8,
    review_count: 25
  },
  {
    name: 'Beach Wedding Venues Goa',
    category: 'Venues',
    description: 'Beautiful beach wedding venues with stunning ocean views. Perfect for destination weddings in Goa.',
    phone: '+91 9876543211',
    email: 'info@beachweddinggoa.com',
    whatsapp: '+919876543211',
    location: 'South Goa',
    address: 'Colva Beach, South Goa, Goa 403708',
    website: 'https://beachweddinggoa.com',
    instagram: 'https://instagram.com/beachweddinggoa',
    facebook: 'https://facebook.com/beachweddinggoa',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Beach Venue', 'Garden Venue', 'Indoor Venue', 'Catering'],
    price_range: '$$$$',
    featured: true,
    verified: true,
    rating: 4.9,
    review_count: 18
  },
  {
    name: 'Goa Wedding Caterers',
    category: 'Caterers',
    description: 'Authentic Goan cuisine and international dishes for your special day. Fresh ingredients and professional service.',
    phone: '+91 9876543212',
    email: 'info@goaweddingcaterers.com',
    whatsapp: '+919876543212',
    location: 'Panaji',
    address: 'Panaji, Goa 403001',
    website: 'https://goaweddingcaterers.com',
    instagram: 'https://instagram.com/goaweddingcaterers',
    facebook: 'https://facebook.com/goaweddingcaterers',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Goan Cuisine', 'International Cuisine', 'Vegetarian', 'Non-Vegetarian'],
    price_range: '$$',
    featured: false,
    verified: true,
    rating: 4.6,
    review_count: 32
  },
  {
    name: 'Bridal Makeup Studio Goa',
    category: 'Makeup Artists',
    description: 'Professional bridal makeup and hairstyling services. Specializing in traditional and contemporary looks.',
    phone: '+91 9876543213',
    email: 'info@bridalmakeupgoa.com',
    whatsapp: '+919876543213',
    location: 'North Goa',
    address: 'Candolim, North Goa, Goa 403515',
    website: 'https://bridalmakeupgoa.com',
    instagram: 'https://instagram.com/bridalmakeupgoa',
    facebook: 'https://facebook.com/bridalmakeupgoa',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Bridal Makeup', 'Hair Styling', 'Pre-wedding Makeup', 'Engagement Makeup'],
    price_range: '$$',
    featured: true,
    verified: true,
    rating: 4.7,
    review_count: 45
  },
  {
    name: 'Goa Wedding Decorators',
    category: 'Decorators',
    description: 'Creative wedding decoration services with floral arrangements and themed setups for your dream wedding.',
    phone: '+91 9876543214',
    email: 'info@goaweddingdecor.com',
    whatsapp: '+919876543214',
    location: 'South Goa',
    address: 'Margao, South Goa, Goa 403601',
    website: 'https://goaweddingdecor.com',
    instagram: 'https://instagram.com/goaweddingdecor',
    facebook: 'https://facebook.com/goaweddingdecor',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Floral Decoration', 'Stage Setup', 'Lighting', 'Theme Decoration'],
    price_range: '$$$',
    featured: false,
    verified: true,
    rating: 4.5,
    review_count: 28
  },
  {
    name: 'DJ Beats Goa',
    category: 'DJs',
    description: 'Professional DJ services for weddings with a wide range of music genres. Making your celebration unforgettable.',
    phone: '+91 9876543215',
    email: 'info@djbeatsgoa.com',
    whatsapp: '+919876543215',
    location: 'North Goa',
    address: 'Baga, North Goa, Goa 403516',
    website: 'https://djbeatsgoa.com',
    instagram: 'https://instagram.com/djbeatsgoa',
    facebook: 'https://facebook.com/djbeatsgoa',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Wedding DJ', 'Sound System', 'Lighting', 'MC Services'],
    price_range: '$$',
    featured: true,
    verified: true,
    rating: 4.8,
    review_count: 38
  },
  {
    name: 'Goa Wedding Planners',
    category: 'Wedding Planners',
    description: 'Full-service wedding planning with attention to every detail. Making your dream wedding a reality.',
    phone: '+91 9876543216',
    email: 'info@goaweddingplanners.com',
    whatsapp: '+919876543216',
    location: 'Panaji',
    address: 'Panaji, Goa 403001',
    website: 'https://goaweddingplanners.com',
    instagram: 'https://instagram.com/goaweddingplanners',
    facebook: 'https://facebook.com/goaweddingplanners',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Full Planning', 'Partial Planning', 'Day Coordination', 'Destination Weddings'],
    price_range: '$$$$',
    featured: true,
    verified: true,
    rating: 4.9,
    review_count: 52
  },
  {
    name: 'Goa Bridal Boutique',
    category: 'Bridal Wear',
    description: 'Exquisite bridal wear collection with designer lehengas, sarees, and gowns. Custom tailoring available.',
    phone: '+91 9876543217',
    email: 'info@goabridalboutique.com',
    whatsapp: '+919876543217',
    location: 'North Goa',
    address: 'Mapusa, North Goa, Goa 403507',
    website: 'https://goabridalboutique.com',
    instagram: 'https://instagram.com/goabridalboutique',
    facebook: 'https://facebook.com/goabridalboutique',
    featured_image: '/assets/hero.jpg',
    images: ['/assets/hero.jpg', '/assets/hero.jpg'],
    services: ['Bridal Lehengas', 'Sarees', 'Gowns', 'Custom Tailoring'],
    price_range: '$$$',
    featured: false,
    verified: true,
    rating: 4.6,
    review_count: 34
  }
];

// Sample categories
const categories = [
  { name: 'Photographers and Videographers', slug: 'photographers-videographers', description: 'Professional wedding photography and videography services', icon: '📸' },
  { name: 'Venues', slug: 'venues', description: 'Beautiful wedding venues across Goa', icon: '🏖️' },
  { name: 'Caterers', slug: 'caterers', description: 'Delicious catering services for your wedding', icon: '🍽️' },
  { name: 'Makeup Artists', slug: 'makeup-artists', description: 'Professional bridal makeup and beauty services', icon: '💄' },
  { name: 'Decorators', slug: 'decorators', description: 'Creative wedding decoration and floral arrangements', icon: '🌸' },
  { name: 'DJs', slug: 'djs', description: 'Professional DJ and music services', icon: '🎵' },
  { name: 'Wedding Planners', slug: 'wedding-planners', description: 'Full-service wedding planning', icon: '📋' },
  { name: 'Bridal Wear', slug: 'bridal-wear', description: 'Bridal dresses and attire', icon: '👗' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting Supabase database seeding...\n');
    console.log('📡 Connecting to:', supabaseUrl);

    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('vendors')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Connection error:', testError.message);
      console.error('Please ensure:');
      console.error('1. Supabase project is running');
      console.error('2. Tables are created (run supabase-schema.sql)');
      console.error('3. Credentials in .env.local are correct');
      process.exit(1);
    }

    console.log('✅ Connected to Supabase successfully\n');

    // Check existing data
    const { count: existingVendors } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    if (existingVendors > 0) {
      console.log(`ℹ️  Database already has ${existingVendors} vendors`);
      console.log('🔄 Clearing existing vendor data...');
      const { error: deleteError } = await supabase
        .from('vendors')
        .delete()
        .neq('id', 0); // Delete all
      
      if (deleteError) {
        console.warn('⚠️  Could not clear existing data:', deleteError.message);
      }
    }

    // Insert categories
    console.log('📊 Inserting categories...');
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (categoryError) {
      console.error('❌ Error inserting categories:', categoryError.message);
    } else {
      console.log(`✅ Inserted ${categoryData?.length || 0} categories`);
    }

    // Insert vendors
    console.log('🏢 Inserting vendors...');
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert(vendors)
      .select();

    if (vendorError) {
      console.error('❌ Error inserting vendors:', vendorError.message);
      console.error('Error details:', vendorError);
    } else {
      console.log(`✅ Inserted ${vendorData?.length || 0} vendors`);
    }

    // Verify the data
    const { count: finalVendorCount } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });

    const { count: finalCategoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${finalVendorCount || 0} vendors in database`);
    console.log(`- ${finalCategoryCount || 0} categories in database`);

    // Show vendor breakdown by category
    const { data: categoryBreakdown } = await supabase
      .from('vendors')
      .select('category');

    if (categoryBreakdown) {
      const categoryCounts = categoryBreakdown.reduce((acc, v) => {
        acc[v.category] = (acc[v.category] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Vendor Categories:');
      Object.entries(categoryCounts).forEach(([cat, count]) => {
        console.log(`  - ${cat}: ${count}`);
      });
    }

    console.log('\n✨ You can now access the vendors at http://localhost:5001');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
