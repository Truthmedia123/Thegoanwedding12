const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '../.db/dev.db');
console.log('📂 Database path:', dbPath);

const db = new Database(dbPath);

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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Pre-wedding', 'Wedding Day', 'Post-wedding', 'Engagement']),
    price_range: '$$$',
    featured: 1,
    verified: 1,
    rating: 4.8,
    review_count: 25,
    created_at: Date.now()
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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Beach Venue', 'Garden Venue', 'Indoor Venue', 'Catering']),
    price_range: '$$$$',
    featured: 1,
    verified: 1,
    rating: 4.9,
    review_count: 18,
    created_at: Date.now()
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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Goan Cuisine', 'International Cuisine', 'Vegetarian', 'Non-Vegetarian']),
    price_range: '$$',
    featured: 0,
    verified: 1,
    rating: 4.6,
    review_count: 32,
    created_at: Date.now()
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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Bridal Makeup', 'Hair Styling', 'Pre-wedding Makeup', 'Engagement Makeup']),
    price_range: '$$',
    featured: 1,
    verified: 1,
    rating: 4.7,
    review_count: 45,
    created_at: Date.now()
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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Floral Decoration', 'Stage Setup', 'Lighting', 'Theme Decoration']),
    price_range: '$$$',
    featured: 0,
    verified: 1,
    rating: 4.5,
    review_count: 28,
    created_at: Date.now()
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
    profile_image: '/vendors/default/profile.jpg',
    cover_image: '/vendors/default/cover.jpg',
    gallery: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    services: JSON.stringify(['Wedding DJ', 'Sound System', 'Lighting', 'MC Services']),
    price_range: '$$',
    featured: 1,
    verified: 1,
    rating: 4.8,
    review_count: 38,
    created_at: Date.now()
  }
];

// Sample wedding data
const weddings = [
  {
    bride_name: 'Priya',
    groom_name: 'Rohan',
    wedding_date: new Date('2024-12-15').getTime(),
    venue: 'Taj Exotica Resort',
    venue_address: 'Taj Exotica Resort, Benaulim, South Goa',
    ceremony_time: '16:00',
    reception_time: '19:00',
    cover_image: '/assets/hero.jpg',
    gallery_images: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    story: 'Priya and Rohan met in college and have been together for 5 years. They are excited to celebrate their love with family and friends in beautiful Goa.',
    slug: 'priya-rohan-2024',
    max_guests: 150,
    is_public: 1,
    contact_email: 'priya.rohan.wedding@gmail.com',
    contact_phone: '+91 9876543210',
    created_at: Date.now()
  },
  {
    bride_name: 'Anjali',
    groom_name: 'Vikram',
    wedding_date: new Date('2025-01-20').getTime(),
    venue: 'Grand Hyatt Goa',
    venue_address: 'Grand Hyatt Goa, Bambolim, North Goa',
    ceremony_time: '17:00',
    reception_time: '20:00',
    cover_image: '/assets/hero.jpg',
    gallery_images: JSON.stringify(['/assets/hero.jpg', '/assets/hero.jpg']),
    story: 'Anjali and Vikram are childhood friends who fell in love. Their wedding will be a grand celebration of their journey together.',
    slug: 'anjali-vikram-2025',
    max_guests: 200,
    is_public: 1,
    contact_email: 'anjali.vikram.wedding@gmail.com',
    contact_phone: '+91 9876543211',
    created_at: Date.now()
  }
];

try {
  console.log('🌱 Starting database seeding...\n');

  // Check if vendors already exist
  const existingVendors = db.prepare('SELECT COUNT(*) as count FROM vendors').get();
  
  if (existingVendors.count > 0) {
    console.log(`ℹ️  Database already has ${existingVendors.count} vendors`);
    console.log('🔄 Clearing existing data...');
    db.prepare('DELETE FROM vendors').run();
    db.prepare('DELETE FROM weddings').run();
  }

  // Insert vendors
  const insertVendor = db.prepare(`
    INSERT INTO vendors (
      name, category, description, phone, email, whatsapp, location, address,
      website, instagram, facebook, profile_image, cover_image, gallery,
      services, price_range, featured, verified, rating, review_count, created_at
    ) VALUES (
      @name, @category, @description, @phone, @email, @whatsapp, @location, @address,
      @website, @instagram, @facebook, @profile_image, @cover_image, @gallery,
      @services, @price_range, @featured, @verified, @rating, @review_count, @created_at
    )
  `);

  const insertMany = db.transaction((vendors) => {
    for (const vendor of vendors) {
      insertVendor.run(vendor);
    }
  });

  insertMany(vendors);
  console.log(`✅ Inserted ${vendors.length} vendors`);

  // Insert weddings
  const insertWedding = db.prepare(`
    INSERT INTO weddings (
      bride_name, groom_name, wedding_date, venue, venue_address,
      ceremony_time, reception_time, cover_image, gallery_images,
      story, slug, max_guests, is_public, contact_email, contact_phone, created_at
    ) VALUES (
      @bride_name, @groom_name, @wedding_date, @venue, @venue_address,
      @ceremony_time, @reception_time, @cover_image, @gallery_images,
      @story, @slug, @max_guests, @is_public, @contact_email, @contact_phone, @created_at
    )
  `);

  const insertManyWeddings = db.transaction((weddings) => {
    for (const wedding of weddings) {
      insertWedding.run(wedding);
    }
  });

  insertManyWeddings(weddings);
  console.log(`✅ Inserted ${weddings.length} weddings`);

  // Verify the data
  const vendorCount = db.prepare('SELECT COUNT(*) as count FROM vendors').get();
  const weddingCount = db.prepare('SELECT COUNT(*) as count FROM weddings').get();

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- ${vendorCount.count} vendors in database`);
  console.log(`- ${weddingCount.count} weddings in database`);
  
  console.log('\n📊 Vendor Categories:');
  const categories = db.prepare('SELECT category, COUNT(*) as count FROM vendors GROUP BY category').all();
  categories.forEach(cat => {
    console.log(`  - ${cat.category}: ${cat.count}`);
  });

} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  db.close();
}
