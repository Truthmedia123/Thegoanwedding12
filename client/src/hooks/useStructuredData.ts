import { useMemo } from 'react';

interface VendorData {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating?: {
    average: number;
    count: number;
    reviews?: Array<{
      author: string;
      rating: number;
      text: string;
      date: string;
    }>;
  };
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  images?: string[];
  services?: string[];
  openingHours?: Array<{
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface UseStructuredDataOptions {
  includeReviews?: boolean;
  includeOffers?: boolean;
  includeOpeningHours?: boolean;
}

export function useStructuredData(
  vendor: VendorData,
  options: UseStructuredDataOptions = {}
) {
  const {
    includeReviews = true,
    includeOffers = true,
    includeOpeningHours = true
  } = options;

  const structuredData = useMemo(() => {
    if (!vendor) return null;

    // Base LocalBusiness schema
    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://thegoanwedding.com/vendor/${vendor.id}`,
      name: vendor.name,
      description: vendor.description,
      url: `https://thegoanwedding.com/vendor/${vendor.id}`,
      additionalType: getBusinessType(vendor.category),
      address: {
        '@type': 'PostalAddress',
        streetAddress: vendor.location.address,
        addressLocality: vendor.location.city,
        addressRegion: vendor.location.state,
        addressCountry: vendor.location.country,
        postalCode: vendor.location.postalCode
      },
      geo: vendor.location.latitude && vendor.location.longitude ? {
        '@type': 'GeoCoordinates',
        latitude: vendor.location.latitude,
        longitude: vendor.location.longitude
      } : undefined,
      telephone: vendor.contact.phone,
      email: vendor.contact.email,
      sameAs: getSameAsUrls(vendor),
      image: vendor.images?.map(img => `https://thegoanwedding.com${img}`) || [],
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: vendor.location.latitude || 15.2993,
          longitude: vendor.location.longitude || 74.1240
        },
        geoRadius: '50000' // 50km radius
      }
    };

    // Add opening hours if available
    if (includeOpeningHours && vendor.openingHours) {
      localBusiness.openingHoursSpecification = vendor.openingHours.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${hours.dayOfWeek}`,
        opens: hours.opens,
        closes: hours.closes
      }));
    }

    // Add aggregate rating if available
    if (vendor.rating && vendor.rating.count > 0) {
      localBusiness.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: vendor.rating.average,
        reviewCount: vendor.rating.count,
        bestRating: 5,
        worstRating: 1
      };
    }

    // Add price range if available
    if (vendor.priceRange) {
      localBusiness.priceRange = getPriceRangeString(vendor.priceRange);
    }

    const schemas = [localBusiness];

    // Add Service schema for each service offered
    if (vendor.services && vendor.services.length > 0) {
      vendor.services.forEach(service => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `https://thegoanwedding.com/vendor/${vendor.id}#${service.toLowerCase().replace(/\s+/g, '-')}`,
          name: service,
          provider: {
            '@type': 'LocalBusiness',
            '@id': `https://thegoanwedding.com/vendor/${vendor.id}`
          },
          areaServed: {
            '@type': 'State',
            name: 'Goa, India'
          },
          category: vendor.category
        });
      });
    }

    // Add Offer schema if price range is available
    if (includeOffers && vendor.priceRange) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Offer',
        '@id': `https://thegoanwedding.com/vendor/${vendor.id}#offer`,
        name: `${vendor.category} Services`,
        description: `Professional ${vendor.category.toLowerCase()} services for weddings in Goa`,
        offeredBy: {
          '@type': 'LocalBusiness',
          '@id': `https://thegoanwedding.com/vendor/${vendor.id}`
        },
        priceRange: getPriceRangeString(vendor.priceRange),
        priceCurrency: vendor.priceRange.currency,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
        validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
      });
    }

    // Add Review schemas if available
    if (includeReviews && vendor.rating?.reviews && vendor.rating.reviews.length > 0) {
      vendor.rating.reviews.forEach((review, index) => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Review',
          '@id': `https://thegoanwedding.com/vendor/${vendor.id}#review-${index}`,
          itemReviewed: {
            '@type': 'LocalBusiness',
            '@id': `https://thegoanwedding.com/vendor/${vendor.id}`
          },
          author: {
            '@type': 'Person',
            name: review.author
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1
          },
          reviewBody: review.text,
          datePublished: review.date
        });
      });
    }

    // Add Wedding Event schema for wedding-specific vendors
    if (isWeddingVendor(vendor.category)) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': `https://thegoanwedding.com/vendor/${vendor.id}#wedding-event`,
        name: 'Wedding Services',
        description: `Professional wedding ${vendor.category.toLowerCase()} services in Goa`,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: vendor.location.city,
          address: {
            '@type': 'PostalAddress',
            addressLocality: vendor.location.city,
            addressRegion: vendor.location.state,
            addressCountry: vendor.location.country
          }
        },
        organizer: {
          '@type': 'LocalBusiness',
          '@id': `https://thegoanwedding.com/vendor/${vendor.id}`
        }
      });
    }

    return schemas;
  }, [vendor, includeReviews, includeOffers, includeOpeningHours]);

  // Generate JSON-LD script tag content
  const jsonLd = useMemo(() => {
    if (!structuredData) return '';
    
    if (structuredData.length === 1) {
      return JSON.stringify(structuredData[0], null, 2);
    }
    
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': structuredData
    }, null, 2);
  }, [structuredData]);

  return {
    structuredData,
    jsonLd
  };
}

// Helper functions
function getBusinessType(category: string): string {
  const businessTypes = {
    'photographers': 'https://schema.org/PhotographyBusiness',
    'venues': 'https://schema.org/EventVenue',
    'caterers': 'https://schema.org/FoodEstablishment',
    'decorators': 'https://schema.org/HomeAndConstructionBusiness',
    'makeup-artists': 'https://schema.org/BeautySalon',
    'bridal-wear': 'https://schema.org/ClothingStore',
    'groom-wear': 'https://schema.org/ClothingStore',
    'jewelry': 'https://schema.org/JewelryStore',
    'music-dj': 'https://schema.org/MusicGroup',
    'transportation': 'https://schema.org/AutoRental',
    'wedding-planners': 'https://schema.org/EventPlanner'
  };

  return businessTypes[category.toLowerCase()] || 'https://schema.org/LocalBusiness';
}

function getSameAsUrls(vendor: VendorData): string[] {
  const urls: string[] = [];
  
  if (vendor.contact.website) {
    urls.push(vendor.contact.website);
  }
  
  if (vendor.socialMedia) {
    if (vendor.socialMedia.facebook) urls.push(vendor.socialMedia.facebook);
    if (vendor.socialMedia.instagram) urls.push(vendor.socialMedia.instagram);
    if (vendor.socialMedia.twitter) urls.push(vendor.socialMedia.twitter);
  }
  
  return urls;
}

function getPriceRangeString(priceRange: VendorData['priceRange']): string {
  if (!priceRange) return '';
  
  const { min, max, currency } = priceRange;
  const symbol = currency === 'INR' ? '₹' : currency;
  
  if (min && max) {
    return `${symbol}${formatPrice(min)}-${symbol}${formatPrice(max)}`;
  } else if (min) {
    return `${symbol}${formatPrice(min)}+`;
  } else if (max) {
    return `Up to ${symbol}${formatPrice(max)}`;
  }
  
  return '';
}

function formatPrice(amount: number): string {
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
}

function isWeddingVendor(category: string): boolean {
  const weddingCategories = [
    'photographers', 'venues', 'caterers', 'decorators',
    'makeup-artists', 'bridal-wear', 'groom-wear', 'jewelry',
    'music-dj', 'transportation', 'wedding-planners'
  ];
  
  return weddingCategories.includes(category.toLowerCase());
}

// Hook for generating breadcrumb schema
export function useBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return useMemo(() => {
    if (!items || items.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://thegoanwedding.com${item.url}`
      }))
    };
  }, [items]);
}

// Hook for generating FAQ schema
export function useFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return useMemo(() => {
    if (!faqs || faqs.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }, [faqs]);
}