import React from 'react';
import { SEOHead } from './SEOHead';

interface MobileVendorDiscoverySEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const MobileVendorDiscoverySEO: React.FC<MobileVendorDiscoverySEOProps> = ({
  title = "TheGoanWedding - Mobile Vendor Discovery",
  description = "Swipe to discover perfect Goan wedding vendors. Find photographers, venues, caterers and more with our mobile-first vendor discovery experience.",
  keywords = "Goa wedding vendors, mobile wedding app, swipe vendors, voice search wedding, Goan wedding planning, wedding vendors near me",
}) => {
  // Schema markup for mobile app
  const mobileAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    'name': 'TheGoanWedding Mobile Discovery',
    'operatingSystem': 'All',
    'applicationCategory': 'Lifestyle',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    },
    'description': 'Discover Goa\'s best wedding vendors with swipe-based browsing and voice search.',
    'screenshot': [
      'https://thegoanwedding.com/screenshots/mobile-swipe.png',
      'https://thegoanwedding.com/screenshots/voice-search.png'
    ]
  };

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      structuredData={mobileAppSchema}
    >
      {/* Mobile-specific meta tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Goan Wedding" />
      
      {/* Add to Home Screen prompt */}
      <meta name="application-name" content="TheGoanWedding" />
      <meta name="theme-color" content="#34d399" />
      
      {/* Mobile viewport for responsive design */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      
      {/* Preload critical mobile assets */}
      <link rel="preload" href="/screenshots/mobile-swipe.png" as="image" />
      <link rel="preload" href="/screenshots/voice-search.png" as="image" />
    </SEOHead>
  );
};