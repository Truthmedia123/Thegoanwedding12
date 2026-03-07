import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "GoanWedding - Goa's Premier Wedding Vendor Directory",
  description = "Discover Goa's best wedding vendors including photographers, venues, caterers, and more. Plan your perfect Goan wedding with our comprehensive directory.",
  keywords = "Goa wedding, wedding vendors, wedding photography, wedding venues, wedding planning, Goan wedding",
  image = "/assets/hero.jpg",
  url = "https://goanwedding.com",
  type = "website",
  author = "GoanWedding",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
  children,
}) => {
  const fullTitle = title.includes("GoanWedding") ? title : `${title} | GoanWedding`;
  const fullUrl = url.startsWith('http') ? url : `https://goanwedding.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://goanwedding.com${image}`;

  // Default structured data for the website
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GoanWedding",
    "description": description,
    "url": "https://goanwedding.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://goanwedding.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoanWedding",
      "logo": {
        "@type": "ImageObject",
        "url": "https://goanwedding.com/icons/icon-512.png"
      }
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#34d399" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="GoanWedding" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@goanwedding" />
      <meta name="twitter:creator" content="@goanwedding" />

      {/* Article specific tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData, null, 2)
        }}
      />

      {/* Additional SEO meta tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Goan Wedding" />
      
      {/* Geo tags for Goa */}
      <meta name="geo.region" content="IN-GA" />
      <meta name="geo.placename" content="Goa, India" />
      <meta name="geo.position" content="15.2993;74.1240" />
      <meta name="ICBM" content="15.2993, 74.1240" />
      
      {/* Additional children meta tags */}
      {children}
    </>
  );
};

// Hook for dynamic SEO updates
export const useSEO = () => {
  const updateTitle = (title: string) => {
    document.title = title.includes("GoanWedding") ? title : `${title} | GoanWedding`;
  };

  const updateMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const updateStructuredData = (data: any) => {
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data, null, 2);
  };

  return {
    updateTitle,
    updateMeta,
    updateProperty,
    updateStructuredData,
  };
};

