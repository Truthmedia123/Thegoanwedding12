import { Hono } from 'hono';
import { getDb } from './db';
import { eq } from 'drizzle-orm';
import { 
  vendors, 
  reviews, 
  categories, 
  blogPosts, 
  businessSubmissions, 
  contacts, 
  weddings,
  weddingEvents
} from '@shared/schema';
import { authenticateAdmin } from './auth';
import type { Env } from './db';
import { apiRateLimit } from './middleware/rateLimit';
import { cache } from './middleware/cache';
import { MeiliSearch } from 'meilisearch';

// Helper function to check if we should use Directus
function shouldUseDirectus(env: any): boolean {
  return env.USE_DIRECTUS === 'true' || process.env.USE_DIRECTUS === 'true';
}

// Helper function to get Directus client
async function getDirectusClient() {
  const { directus } = await import('./directus');
  return directus;
}

export function registerRoutes(app: Hono<{ Bindings: Env }>) {
  // Health check
  app.get("/api/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // System status endpoint
  app.get("/api/system/status", async (c) => {
    try {
      const useDirectus = shouldUseDirectus(c.env);
      const database = useDirectus ? 'Directus' : 'Cloudflare D1';
      const cms = useDirectus ? 'Directus Admin' : 'Netlify CMS';
      
      // Check connection status
      let connectionStatus = 'unknown';
      let lastSyncTime = null;
      
      if (useDirectus) {
        try {
          const { directus } = await import('./directus');
          // Simple ping to check if Directus is accessible
          await directus.request({ path: '/server/ping', method: 'get' });
          connectionStatus = 'connected';
        } catch (error) {
          connectionStatus = 'disconnected';
          console.error('Directus connection error:', error);
        }
      } else {
        try {
          const db = getDb(c.env);
          // Simple query to check if D1 is accessible
          await db.select().from(vendors).limit(1).all();
          connectionStatus = 'connected';
        } catch (error) {
          connectionStatus = 'disconnected';
          console.error('D1 connection error:', error);
        }
      }
      
      return c.json({
        database,
        cms,
        connectionStatus,
        lastSyncTime
      });
    } catch (error) {
      console.error('Error fetching system status:', error);
      return c.json({ 
        error: "Failed to fetch system status",
        database: "unknown",
        cms: "unknown",
        connectionStatus: "error"
      }, 500);
    }
  });

  // Initialize MeiliSearch client
  const client = new MeiliSearch({ 
    host: process.env.MEILI_HOST || 'http://localhost:7700', 
    apiKey: process.env.MEILI_KEY || 'masterKey'
  });

  // Search API with MeiliSearch
  app.get("/api/search/vendors", async (c) => {
    try {
      const q = c.req.query('q') as string;
      if (!q) {
        return c.json({ hits: [] });
      }
      
      const index = client.index('vendors');
      const search = await index.search(q, { limit: 10 });
      return c.json(search.hits);
    } catch (error) {
      console.error('Error searching vendors:', error);
      return c.json({ error: "Failed to search vendors" }, 500);
    }
  });

  // Vendors API with caching and rate limiting
  app.get("/api/vendors", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { getVendors } = await import('./directus');
        const allVendors = await getVendors();
        return c.json(allVendors);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const allVendors = await db.select().from(vendors).all();
        return c.json(allVendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return c.json({ error: "Failed to fetch vendors" }, 500);
    }
  });

  app.get("/api/vendors/:id", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const id = c.req.param("id");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { getVendor } = await import('./directus');
        const vendor = await getVendor(id);
        
        if (!vendor) {
          return c.json({ error: "Vendor not found" }, 404);
        }
        
        return c.json(vendor);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const vendor = await db.select().from(vendors).where(eq(vendors.id, parseInt(id))).get();
        
        if (!vendor) {
          return c.json({ error: "Vendor not found" }, 404);
        }
        
        return c.json(vendor);
      }
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return c.json({ error: "Failed to fetch vendor" }, 500);
    }
  });

  app.get("/api/vendors/category/:category", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const category = c.req.param("category");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { getVendorsByCategory } = await import('./directus');
        const vendorsInCategory = await getVendorsByCategory(category);
        return c.json(vendorsInCategory);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const vendorsInCategory = await db.select().from(vendors).where(eq(vendors.category, category)).all();
        return c.json(vendorsInCategory);
      }
    } catch (error) {
      console.error('Error fetching vendors by category:', error);
      return c.json({ error: "Failed to fetch vendors by category" }, 500);
    }
  });

  app.post("/api/vendors", authenticateAdmin('vendors'), async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { directus } = await import('./directus');
        // Assuming we have a function to create vendor in Directus
        // This would need to be implemented based on your Directus setup
        return c.json({ error: "Directus vendor creation not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const vendor = await db.insert(vendors).values(body).returning().get();
        return c.json(vendor, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to create vendor", error: error.message }, 500);
    }
  });

  // Bulk vendor import
  app.post("/api/vendors/bulk", authenticateAdmin('vendors'), async (c) => {
    try {
      const { vendors: vendorsData } = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus bulk vendor import not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        
        // Process each vendor
        const importedVendors = [];
        for (const vendorData of vendorsData) {
          // Parse priceRange if it's a string
          let priceRange = vendorData.priceRange;
          if (typeof priceRange === 'string' && priceRange.startsWith('[') && priceRange.endsWith(']')) {
            try {
              priceRange = JSON.parse(priceRange);
            } catch (e) {
              // If parsing fails, keep as is
            }
          }
          
          // Convert isVerified to boolean if it's a string
          let isVerified = vendorData.isVerified;
          if (typeof isVerified === 'string') {
            isVerified = isVerified.toLowerCase() === 'true';
          }
          
          const processedVendor = {
            ...vendorData,
            priceRange: typeof priceRange === 'string' ? priceRange : JSON.stringify(priceRange),
            isVerified: isVerified,
          };
          
          const vendor = await db.insert(vendors).values(processedVendor).returning().get();
          importedVendors.push(vendor);
        }
        
        return c.json({ 
          message: "Vendors imported successfully", 
          imported: importedVendors.length,
          vendors: importedVendors
        }, 201);
      }
    } catch (error: any) {
      console.error('Error importing vendors:', error);
      return c.json({ message: "Failed to import vendors", error: error.message }, 500);
    }
  });

  app.put("/api/vendors/:id", authenticateAdmin('vendors'), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus vendor update not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const vendor = await db.update(vendors).set(body).where(eq(vendors.id, parseInt(id))).returning().get();
        
        if (!vendor) {
          return c.json({ message: "Vendor not found" }, 404);
        }
        
        return c.json(vendor);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to update vendor", error: error.message }, 500);
    }
  });

  app.delete("/api/vendors/:id", authenticateAdmin('vendors'), async (c) => {
    try {
      const id = c.req.param("id");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus vendor deletion not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const result = await db.delete(vendors).where(eq(vendors.id, parseInt(id))).returning().get();
        
        if (!result) {
          return c.json({ message: "Vendor not found" }, 404);
        }
        
        return c.json({ message: "Vendor deleted successfully" });
      }
    } catch (error: any) {
      return c.json({ message: "Failed to delete vendor", error: error.message }, 500);
    }
  });

  // Reviews API
  app.get("/api/reviews/vendor/:vendorId", async (c) => {
    try {
      const vendorId = c.req.param("vendorId");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus reviews not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const vendorReviews = await db.select().from(reviews).where(eq(reviews.vendorId, parseInt(vendorId))).all();
        return c.json(vendorReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return c.json({ error: "Failed to fetch reviews" }, 500);
    }
  });

  app.post("/api/reviews", async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { submitReview } = await import('./directus');
        const review = await submitReview(body);
        return c.json(review, 201);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const review = await db.insert(reviews).values(body).returning().get();
        return c.json(review, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to create review", error: error.message }, 500);
    }
  });

  // Categories API with caching and rate limiting
  app.get("/api/categories", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { getCategories } = await import('./directus');
        const allCategories = await getCategories();
        return c.json(allCategories);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const allCategories = await db.select().from(categories).all();
        return c.json(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return c.json({ error: "Failed to fetch categories" }, 500);
    }
  });

  // Blog API with caching and rate limiting
  app.get("/api/blog", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { getRecentBlogPosts } = await import('./directus');
        const allPosts = await getRecentBlogPosts(100); // Get more posts from Directus
        return c.json(allPosts);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const allPosts = await db.select().from(blogPosts).all();
        return c.json(allPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return c.json({ error: "Failed to fetch blog posts" }, 500);
    }
  });

  app.get("/api/blog/:slug", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const slug = c.req.param("slug");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        // This would need to be implemented based on your Directus setup
        return c.json({ error: "Directus blog post by slug not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).get();
        
        if (!post) {
          return c.json({ error: "Blog post not found" }, 404);
        }
        
        return c.json(post);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return c.json({ error: "Failed to fetch blog post" }, 500);
    }
  });

  app.post("/api/blog", authenticateAdmin('blog'), async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus blog post creation not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const post = await db.insert(blogPosts).values(body).returning().get();
        return c.json(post, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to create blog post", error: error.message }, 500);
    }
  });

  app.put("/api/blog/:id", authenticateAdmin('blog'), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus blog post update not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const post = await db.update(blogPosts).set(body).where(eq(blogPosts.id, parseInt(id))).returning().get();
        
        if (!post) {
          return c.json({ message: "Blog post not found" }, 404);
        }
        
        return c.json(post);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to update blog post", error: error.message }, 500);
    }
  });

  app.delete("/api/blog/:id", authenticateAdmin('blog'), async (c) => {
    try {
      const id = c.req.param("id");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus blog post deletion not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const result = await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id))).returning().get();
        
        if (!result) {
          return c.json({ message: "Blog post not found" }, 404);
        }
        
        return c.json({ message: "Blog post deleted successfully" });
      }
    } catch (error: any) {
      return c.json({ message: "Failed to delete blog post", error: error.message }, 500);
    }
  });

  // Business submissions API
  app.post("/api/business-submissions", async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        const { submitBusinessListing } = await import('./directus');
        const submission = await submitBusinessListing(body);
        return c.json(submission, 201);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const submission = await db.insert(businessSubmissions).values(body).returning().get();
        return c.json(submission, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to submit business", error: error.message }, 500);
    }
  });

  app.get("/api/business-submissions", authenticateAdmin('business'), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus business submissions not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const submissions = await db.select().from(businessSubmissions).all();
        return c.json(submissions);
      }
    } catch (error) {
      console.error('Error fetching business submissions:', error);
      return c.json({ error: "Failed to fetch business submissions" }, 500);
    }
  });

  // Contact API
  app.post("/api/contact", async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus contact submission not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const contact = await db.insert(contacts).values(body).returning().get();
        return c.json(contact, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to submit contact", error: error.message }, 500);
    }
  });

  app.get("/api/contacts", authenticateAdmin('contacts'), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus contacts not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const contactsList = await db.select().from(contacts).all();
        return c.json(contactsList);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return c.json({ error: "Failed to fetch contacts" }, 500);
    }
  });

  // Wedding API with caching and rate limiting
  app.get("/api/weddings/:slug", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const slug = c.req.param("slug");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus weddings not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const wedding = await db.select().from(weddings).where(eq(weddings.slug, slug)).get();
        
        if (!wedding) {
          return c.json({ error: "Wedding not found" }, 404);
        }
        
        return c.json(wedding);
      }
    } catch (error) {
      console.error('Error fetching wedding:', error);
      return c.json({ error: "Failed to fetch wedding" }, 500);
    }
  });

  app.post("/api/weddings", authenticateAdmin('weddings'), async (c) => {
    try {
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding creation not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const wedding = await db.insert(weddings).values(body).returning().get();
        return c.json(wedding, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to create wedding", error: error.message }, 500);
    }
  });

  app.put("/api/weddings/:id", authenticateAdmin('weddings'), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding update not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const wedding = await db.update(weddings).set(body).where(eq(weddings.id, parseInt(id))).returning().get();
        
        if (!wedding) {
          return c.json({ message: "Wedding not found" }, 404);
        }
        
        return c.json(wedding);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to update wedding", error: error.message }, 500);
    }
  });

  app.delete("/api/weddings/:id", authenticateAdmin('weddings'), async (c) => {
    try {
      const id = c.req.param("id");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding deletion not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const result = await db.delete(weddings).where(eq(weddings.id, parseInt(id))).returning().get();
        
        if (!result) {
          return c.json({ message: "Wedding not found" }, 404);
        }
        
        return c.json({ message: "Wedding deleted successfully" });
      }
    } catch (error: any) {
      return c.json({ message: "Failed to delete wedding", error: error.message }, 500);
    }
  });

  // Wedding Events API with caching and rate limiting
  app.get("/api/weddings/:id/events", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const weddingId = c.req.param("id");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding events not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const events = await db.select().from(weddingEvents).where(eq(weddingEvents.weddingId, parseInt(weddingId))).all();
        return c.json(events);
      }
    } catch (error) {
      console.error('Error fetching wedding events:', error);
      return c.json({ error: "Failed to fetch wedding events" }, 500);
    }
  });

  app.post("/api/weddings/:id/events", authenticateAdmin('templates'), async (c) => {
    try {
      const weddingId = c.req.param("id");
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding event creation not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        
        const eventData = {
          ...body,
          weddingId: parseInt(weddingId),
          date: new Date(body.date),
        };
        
        const event = await db.insert(weddingEvents).values(eventData).returning().get();
        return c.json(event, 201);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to create wedding event", error: error.message }, 500);
    }
  });

  app.put("/api/weddings/:id/events/:eventId", authenticateAdmin('templates'), async (c) => {
    try {
      const eventId = c.req.param("eventId");
      const body = await c.req.json();
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding event update not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        
        const eventData = {
          ...body,
          date: body.date ? new Date(body.date) : undefined,
        };
        
        const event = await db.update(weddingEvents).set(eventData).where(eq(weddingEvents.id, parseInt(eventId))).returning().get();
        
        if (!event) {
          return c.json({ message: "Wedding event not found" }, 404);
        }
        
        return c.json(event);
      }
    } catch (error: any) {
      return c.json({ message: "Failed to update wedding event", error: error.message }, 500);
    }
  });

  app.delete("/api/weddings/:id/events/:eventId", authenticateAdmin('templates'), async (c) => {
    try {
      const eventId = c.req.param("eventId");
      
      if (shouldUseDirectus(c.env)) {
        // Use Directus API
        return c.json({ error: "Directus wedding event deletion not implemented" }, 501);
      } else {
        // Fallback to D1
        const db = getDb(c.env);
        const result = await db.delete(weddingEvents).where(eq(weddingEvents.id, parseInt(eventId))).returning().get();
        
        if (!result) {
          return c.json({ message: "Wedding event not found" }, 404);
        }
        
        return c.json({ message: "Wedding event deleted successfully" });
      }
    } catch (error: any) {
      return c.json({ message: "Failed to delete wedding event", error: error.message }, 500);
    }
  });

  // Directus Integration Routes
  // Get all vendors from Directus
  app.get("/api/directus/vendors", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getVendors } = await import('./directus');
      const vendors = await getVendors();
      return c.json(vendors);
    } catch (error: any) {
      console.error('Error fetching vendors from Directus:', error);
      return c.json({ error: "Failed to fetch vendors from Directus" }, 500);
    }
  });

  // Get a single vendor from Directus
  app.get("/api/directus/vendors/:id", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const id = c.req.param("id");
      const { getVendor } = await import('./directus');
      const vendor = await getVendor(id);
      return c.json(vendor);
    } catch (error: any) {
      console.error('Error fetching vendor from Directus:', error);
      return c.json({ error: "Failed to fetch vendor from Directus" }, 500);
    }
  });

  // Search vendors in Directus
  app.get("/api/directus/vendors/search", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const query = c.req.query('q') || '';
      const { searchVendors } = await import('./directus');
      const vendors = await searchVendors(query);
      return c.json(vendors);
    } catch (error: any) {
      console.error('Error searching vendors in Directus:', error);
      return c.json({ error: "Failed to search vendors in Directus" }, 500);
    }
  });

  // Get all categories from Directus
  app.get("/api/directus/categories", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getCategories } = await import('./directus');
      const categories = await getCategories();
      return c.json(categories);
    } catch (error: any) {
      console.error('Error fetching categories from Directus:', error);
      return c.json({ error: "Failed to fetch categories from Directus" }, 500);
    }
  });

  // Get vendors by category from Directus
  app.get("/api/directus/vendors/category/:categorySlug", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const categorySlug = c.req.param("categorySlug");
      const { getVendorsByCategory } = await import('./directus');
      const vendors = await getVendorsByCategory(categorySlug);
      return c.json(vendors);
    } catch (error: any) {
      console.error('Error fetching vendors by category from Directus:', error);
      return c.json({ error: "Failed to fetch vendors by category from Directus" }, 500);
    }
  });

  // Get featured vendors from Directus
  app.get("/api/directus/vendors/featured", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getFeaturedVendors } = await import('./directus');
      const vendors = await getFeaturedVendors();
      return c.json(vendors);
    } catch (error: any) {
      console.error('Error fetching featured vendors from Directus:', error);
      return c.json({ error: "Failed to fetch featured vendors from Directus" }, 500);
    }
  });

  // Get recent blog posts from Directus
  app.get("/api/directus/blog-posts", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getRecentBlogPosts } = await import('./directus');
      const posts = await getRecentBlogPosts();
      return c.json(posts);
    } catch (error: any) {
      console.error('Error fetching blog posts from Directus:', error);
      return c.json({ error: "Failed to fetch blog posts from Directus" }, 500);
    }
  });

  // Get site settings from Directus
  app.get("/api/directus/site-settings", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getSiteSettings } = await import('./directus');
      const settings = await getSiteSettings();
      return c.json(settings);
    } catch (error: any) {
      console.error('Error fetching site settings from Directus:', error);
      return c.json({ error: "Failed to fetch site settings from Directus" }, 500);
    }
  });

  // Submit a review to Directus
  app.post("/api/directus/reviews", apiRateLimit({ maxRequests: 50 }), async (c) => {
    try {
      const body = await c.req.json();
      const { submitReview } = await import('./directus');
      const review = await submitReview(body);
      return c.json(review, 201);
    } catch (error: any) {
      console.error('Error submitting review to Directus:', error);
      return c.json({ error: "Failed to submit review to Directus" }, 500);
    }
  });

  // Get invitation templates from Directus
  app.get("/api/directus/invitation-templates", cache(900000), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const category = c.req.query('category');
      const { getInvitationTemplates } = await import('./directus');
      const templates = await getInvitationTemplates(category);
      return c.json(templates);
    } catch (error: any) {
      console.error('Error fetching invitation templates from Directus:', error);
      return c.json({ error: "Failed to fetch invitation templates from Directus" }, 500);
    }
  });

  // Submit a business listing to Directus
  app.post("/api/directus/business-listings", apiRateLimit({ maxRequests: 50 }), async (c) => {
    try {
      const body = await c.req.json();
      const { submitBusinessListing } = await import('./directus');
      const listing = await submitBusinessListing(body);
      return c.json(listing, 201);
    } catch (error: any) {
      console.error('Error submitting business listing to Directus:', error);
      return c.json({ error: "Failed to submit business listing to Directus" }, 500);
    }
  });
}

export { registerRoutes as setupRoutes };