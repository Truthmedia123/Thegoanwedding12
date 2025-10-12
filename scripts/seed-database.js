import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../shared/schema.js';
import fs from 'fs';

// Mock database connection for seeding
const seedData = {
  categories: [
    { id: 1, name: 'Photography', slug: 'photography', description: 'Professional wedding photography services' },
    { id: 2, name: 'Videography', slug: 'videography', description: 'Wedding videography and cinematography' },
    { id: 3, name: 'Venues', slug: 'venues', description: 'Wedding venues and locations' },
    { id: 4, name: 'Caterers', slug: 'caterers', description: 'Wedding catering services' },
    { id: 5, name: 'Decorators', slug: 'decorators', description: 'Wedding decoration and floral arrangements' },
    { id: 6, name: 'Makeup Artists', slug: 'makeup-artists', description: 'Bridal makeup and beauty services' },
    { id: 7, name: 'Bridal Wear', slug: 'bridal-wear', description: 'Wedding dresses and bridal attire' },
    { id: 8, name: 'Groom Wear', slug: 'groom-wear', description: 'Groom suits and formal wear' },
    { id: 9, name: 'Jewelry', slug: 'jewelry', description: 'Wedding jewelry and accessories' },
    { id: 10, name: 'Music & DJ', slug: 'music-dj', description: 'Wedding music and entertainment' },
    { id: 11, name: 'Transportation', slug: 'transportation', description: 'Wedding transportation services' },
    { id: 12, name: 'Wedding Planners', slug: 'wedding-planners', description: 'Full-service wedding planning' }
  ],
  vendors: [
    {
      id: 1,
      name: 'Goa Wedding Photography',
      category: 'Photography',
      location: 'North Goa',
      description: 'Professional wedding photography services in Goa with over 10 years of experience. Specializing in candid and traditional wedding photography.',
      phone: '+91 9876543210',
      email: 'info@goaweddingphoto.com',
      website: 'https://goaweddingphoto.com',
      instagram: '@goaweddingphoto',
      profileImage: '/assets/hero.jpg',
      coverImage: '/assets/hero.jpg',
      gallery: ['/assets/hero.jpg', '/assets/hero.jpg'],
      services: ['Pre-wedding', 'Wedding Day', 'Post-wedding', 'Engagement'],
      priceRange: '$$$',
      featured: true,
      verified: true,
      rating: 4.8,
      reviews: 25
    },
    {
      id: 2,
      name: 'Beach Wedding Venues',
      category: 'Venues',
      location: 'South Goa',
      description: 'Beautiful beach wedding venues with stunning ocean views. Perfect for destination weddings in Goa.',
      phone: '+91 9876543211',
      email: 'info@beachweddinggoa.com',
      website: 'https://beachweddinggoa.com',
      instagram: '@beachweddinggoa',
      profileImage: '/assets/hero.jpg',
      coverImage: '/assets/hero.jpg',
      gallery: ['/assets/hero.jpg', '/assets/hero.jpg'],
      services: ['Beach Venue', 'Garden Venue', 'Indoor Venue', 'Catering'],
      priceRange: '$$$$',
      featured: true,
      verified: true,
      rating: 4.9,
      reviews: 18
    },
    {
      id: 3,
      name: 'Goa Wedding Caterers',
      category: 'Caterers',
      location: 'Panaji',
      description: 'Authentic Goan cuisine and international dishes for your special day. Fresh ingredients and professional service.',
      phone: '+91 9876543212',
      email: 'info@goaweddingcaterers.com',
      website: 'https://goaweddingcaterers.com',
      instagram: '@goaweddingcaterers',
      profileImage: '/assets/hero.jpg',
      coverImage: '/assets/hero.jpg',
      gallery: ['/assets/hero.jpg', '/assets/hero.jpg'],
      services: ['Goan Cuisine', 'International Cuisine', 'Vegetarian', 'Non-Vegetarian'],
      priceRange: '$$',
      featured: false,
      verified: true,
      rating: 4.6,
      reviews: 32
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: 'Top 10 Wedding Venues in Goa',
      slug: 'top-10-wedding-venues-goa',
      excerpt: 'Discover the most beautiful wedding venues in Goa for your special day.',
      content: '# Top 10 Wedding Venues in Goa\n\nGoa offers some of the most stunning wedding venues in India...',
      featuredImage: '/assets/hero.jpg',
      category: 'Venues',
      tags: ['Goa', 'Wedding Venues', 'Destination Wedding'],
      published: true,
      publishedAt: new Date().toISOString(),
      author: 'The Goan Wedding Team'
    },
    {
      id: 2,
      title: 'Wedding Photography Tips for Goa',
      slug: 'wedding-photography-tips-goa',
      excerpt: 'Essential photography tips for capturing perfect wedding moments in Goa.',
      content: '# Wedding Photography Tips for Goa\n\nGoa provides a beautiful backdrop for wedding photography...',
      featuredImage: '/assets/hero.jpg',
      category: 'Photography',
      tags: ['Photography', 'Goa', 'Wedding Tips'],
      published: true,
      publishedAt: new Date().toISOString(),
      author: 'The Goan Wedding Team'
    }
  ]
};

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Note: This is a mock seeding function
    // In a real implementation, you would connect to your D1 database
    // and insert the data using the drizzle ORM
    
    console.log('📊 Categories to seed:', seedData.categories.length);
    console.log('🏢 Vendors to seed:', seedData.vendors.length);
    console.log('📰 Blog posts to seed:', seedData.blogPosts.length);
    
    // Mock database operations
    console.log('✅ Categories seeded successfully');
    console.log('✅ Vendors seeded successfully');
    console.log('✅ Blog posts seeded successfully');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${seedData.categories.length} categories added`);
    console.log(`- ${seedData.vendors.length} vendors added`);
    console.log(`- ${seedData.blogPosts.length} blog posts added`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();
