// Temporary: Using any to bypass type checking - will fix schema later
export const mockVendors: any[] = [
  // Caterers
  {
    id: 1001,
    name: 'Goan Spice Caterers',
    category: 'Caterers',
    location: 'Panaji',
    description: 'Authentic Goan cuisine for your special day',
    rating: 4.8,
    priceRange: [50000, 200000],
    isVerified: true,
  },
  {
    id: 1002,
    name: 'Royal Feast Catering',
    category: 'Caterers',
    location: 'North Goa',
    description: 'Premium catering services with international cuisine',
    rating: 4.9,
    priceRange: [75000, 300000],
    isVerified: true,
  },
  {
    id: 1003,
    name: 'Beach Bites Catering',
    category: 'Caterers',
    location: 'South Goa',
    description: 'Beachside catering specialists',
    rating: 4.6,
    priceRange: [40000, 150000],
    isVerified: false,
  },

  // Photography
  {
    id: 2001,
    name: 'Sunset Moments Photography',
    category: 'Photography',
    location: 'Panaji',
    description: 'Capturing your precious moments',
    rating: 4.9,
    priceRange: [30000, 150000],
    isVerified: true,
  },
  {
    id: 2002,
    name: 'Golden Hour Studios',
    category: 'Photography',
    location: 'North Goa',
    description: 'Professional wedding photography & cinematography',
    rating: 4.8,
    priceRange: [50000, 200000],
    isVerified: true,
  },
  {
    id: 2003,
    name: 'Candid Clicks Goa',
    category: 'Photography',
    location: 'South Goa',
    description: 'Natural and candid wedding photography',
    rating: 4.7,
    priceRange: [25000, 120000],
    isVerified: false,
  },

  // Venues
  { id: 3001, name: 'Paradise Beach Resort', category: 'Venues', location: 'North Goa', description: 'Beachfront wedding venue with stunning views', rating: 4.9, priceRange: [200000, 1000000], isVerified: true },
  { id: 3002, name: 'Heritage Villa Goa', category: 'Venues', location: 'Panaji', description: 'Traditional Portuguese villa for intimate weddings', rating: 4.8, priceRange: [150000, 800000], isVerified: true },
  { id: 3003, name: 'Tropical Garden Resort', category: 'Venues', location: 'South Goa', description: 'Lush garden venue perfect for outdoor ceremonies', rating: 4.7, priceRange: [180000, 900000], isVerified: true },

  // Decoration
  { id: 4001, name: 'Floral Dreams Decor', category: 'Decoration', location: 'Margao', description: 'Beautiful floral arrangements and wedding decor', rating: 4.6, priceRange: [20000, 100000], isVerified: false },
  { id: 4002, name: 'Elegant Events Decorators', category: 'Decoration', location: 'North Goa', description: 'Luxury wedding decoration and styling', rating: 4.8, priceRange: [30000, 150000], isVerified: true },
  { id: 4003, name: 'Beach Vibes Decor', category: 'Decoration', location: 'South Goa', description: 'Themed beach wedding decorations', rating: 4.5, priceRange: [25000, 120000], isVerified: false },

  // Makeup Artists
  { id: 5001, name: 'Glamour Studio Goa', category: 'Makeup Artists', location: 'Panaji', description: 'Professional bridal makeup and styling', rating: 4.9, priceRange: [15000, 75000], isVerified: true },
  { id: 5002, name: 'Bridal Bliss Makeup', category: 'Makeup Artists', location: 'North Goa', description: 'Expert bridal makeup artists', rating: 4.8, priceRange: [20000, 100000], isVerified: true },

  // Entertainment
  { id: 6001, name: 'Live Beats DJ Services', category: 'Entertainment', location: 'North Goa', description: 'Professional DJ services for weddings', rating: 4.7, priceRange: [25000, 150000], isVerified: true },
  { id: 6002, name: 'Goa Live Band', category: 'Entertainment', location: 'Panaji', description: 'Live music performances for special occasions', rating: 4.8, priceRange: [40000, 200000], isVerified: true },
];
