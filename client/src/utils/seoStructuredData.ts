export interface Vendor {
  id: number;
  name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  website?: string;
  location: string;
  address?: string;
  profileImage?: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  // Add other vendor properties as needed
}

export function vendorJSONLD(vendor: Vendor) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": vendor.name,
    "image": vendor.profileImage,
    "telephone": vendor.phone,
    "email": vendor.email,
    "url": vendor.website,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": vendor.address,
      "addressLocality": vendor.location,
      "addressCountry": "IN"
    },
    "description": vendor.description,
    "priceRange": vendor.priceRange,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": vendor.rating.toString(),
      "reviewCount": vendor.reviewCount.toString()
    },
    "category": vendor.category
  };
}

export function weddingJSONLD(wedding: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": wedding.brideName + " & " + wedding.groomName + "'s Wedding",
    "startDate": new Date(wedding.weddingDate).toISOString(),
    "location": {
      "@type": "Place",
      "name": wedding.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": wedding.venueAddress
      }
    },
    "description": wedding.story
  };
}

export function articleJSONLD(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": {
      "@type": "Person",
      "name": "TheGoanWedding Team"
    },
    "datePublished": article.createdDate,
    "dateModified": article.lastUpdated,
    "description": article.description,
    "image": article.featuredImage
  };
}