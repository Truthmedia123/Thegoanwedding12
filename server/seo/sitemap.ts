import { Hono } from 'hono';

const app = new Hono();

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Generate XML sitemap
const generateSitemap = (entries: SitemapEntry[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => {
    const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '';
    const changefreq = entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : '';
    const priority = entry.priority ? `<priority>${entry.priority}</priority>` : '';

    return `
  <url>
    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}
  </url>`;
  }).join('');

  return `${xmlHeader}
${urlsetOpen}${urls}
${urlsetClose}`;
};

    // Static pages
const staticPages: SitemapEntry[] = [
    {
    url: 'https://thegoanwedding.com/',
      changefreq: 'daily',
    priority: 1.0,
    },
    {
    url: 'https://thegoanwedding.com/about',
      changefreq: 'monthly',
    priority: 0.8,
    },
    {
    url: 'https://thegoanwedding.com/contact',
      changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: 'https://thegoanwedding.com/couples',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    url: 'https://thegoanwedding.com/blog',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    url: 'https://thegoanwedding.com/list-business',
    changefreq: 'monthly',
    priority: 0.6,
  },
];

// Vendor categories
const vendorCategories = [
  'photographers',
  'videographers',
  'venues',
  'caterers',
  'decorators',
  'makeup-artists',
  'bridal-wear',
  'groom-wear',
  'jewelry',
  'music-dj',
  'transportation',
  'wedding-planners',
];

const categoryPages: SitemapEntry[] = vendorCategories.map(category => ({
  url: `https://thegoanwedding.com/vendors/${category}`,
      changefreq: 'weekly',
  priority: 0.8,
}));

// Blog posts (this would be dynamic in a real app)
const blogPosts: SitemapEntry[] = [
  {
    url: 'https://thegoanwedding.com/blog/goa-wedding-venues',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: 'https://thegoanwedding.com/blog/wedding-photography-tips',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: 'https://thegoanwedding.com/blog/seasonal-wedding-planning',
    changefreq: 'monthly',
    priority: 0.7,
  },
];

// Sitemap route
app.get('/sitemap.xml', async (c) => {
  try {
    // In a real app, you would fetch vendors and blog posts from the database
    // For now, we'll use static data
    
    const allEntries = [
      ...staticPages,
      ...categoryPages,
      ...blogPosts,
    ];

    const sitemap = generateSitemap(allEntries);

    return c.text(sitemap, 200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return c.text('Error generating sitemap', 500);
  }
});

// Robots.txt route
app.get('/robots.txt', async (c) => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://thegoanwedding.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /vendors/
Allow: /blog/
Allow: /about
Allow: /contact`;

  return c.text(robotsTxt, 200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
  });
});

// Dynamic vendor sitemap (for individual vendor pages)
app.get('/sitemap-vendors.xml', async (c) => {
  try {
    // In a real app, fetch vendors from database
    // For now, we'll generate some example vendor URLs
    const vendorEntries: SitemapEntry[] = [];
    
    // Example: Generate URLs for vendors (this would be dynamic)
    for (let i = 1; i <= 100; i++) {
      vendorEntries.push({
        url: `https://thegoanwedding.com/vendors/vendor-${i}`,
        changefreq: 'weekly',
        priority: 0.6,
      });
    }

    const sitemap = generateSitemap(vendorEntries);

    return c.text(sitemap, 200, {
          'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
      });
    } catch (error) {
    console.error('Error generating vendor sitemap:', error);
    return c.text('Error generating vendor sitemap', 500);
  }
});

// Dynamic blog sitemap
app.get('/sitemap-blog.xml', async (c) => {
  try {
    // In a real app, fetch blog posts from database
    const blogSitemap = generateSitemap(blogPosts);

    return c.text(blogSitemap, 200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
      });
    } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return c.text('Error generating blog sitemap', 500);
  }
});

// Sitemap index
app.get('/sitemap-index.xml', async (c) => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://thegoanwedding.com/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://thegoanwedding.com/sitemap-vendors.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://thegoanwedding.com/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return c.text(sitemapIndex, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600',
  });
});

export default app;