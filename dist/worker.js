var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/directus.ts
var directus_exports = {};
__export(directus_exports, {
  directus: () => directus,
  getCategories: () => getCategories,
  getFeaturedVendors: () => getFeaturedVendors,
  getInvitationTemplates: () => getInvitationTemplates,
  getRecentBlogPosts: () => getRecentBlogPosts,
  getSiteSettings: () => getSiteSettings,
  getVendor: () => getVendor,
  getVendors: () => getVendors,
  getVendorsByCategory: () => getVendorsByCategory,
  searchVendors: () => searchVendors,
  submitBusinessListing: () => submitBusinessListing,
  submitReview: () => submitReview
});
import { createDirectus, rest, staticToken, readItems, readSingleton, createItem } from "@directus/sdk";
async function getVendors(limit = 20, offset = 0) {
  try {
    const response = await directus.request(
      readItems("vendors", {
        limit,
        offset,
        fields: ["*"],
        filter: {
          status: {
            _eq: "active"
          }
        },
        sort: ["-created_at"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error("Failed to fetch vendors");
  }
}
async function getVendor(id) {
  try {
    const response = await directus.request(
      readItems("vendors", {
        filter: {
          id: {
            _eq: id
          }
        },
        fields: ["*"]
      })
    );
    if (response.length === 0) {
      throw new Error("Vendor not found");
    }
    return response[0];
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw new Error("Failed to fetch vendor");
  }
}
async function searchVendors(query, filters = {}) {
  try {
    const searchFilters = {
      _or: [
        { name: { _contains: query } },
        { description: { _contains: query } }
      ],
      status: { _eq: "active" }
    };
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        searchFilters[key] = { _eq: filters[key] };
      }
    });
    const response = await directus.request(
      readItems("vendors", {
        filter: searchFilters,
        fields: ["*"],
        sort: ["-rating"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error searching vendors:", error);
    throw new Error("Failed to search vendors");
  }
}
async function getCategories() {
  try {
    const response = await directus.request(
      readItems("categories", {
        fields: ["*"],
        filter: {
          status: {
            _eq: "published"
          }
        },
        sort: ["sort"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
async function getVendorsByCategory(categorySlug) {
  try {
    const categories2 = await directus.request(
      readItems("categories", {
        filter: {
          slug: {
            _eq: categorySlug
          }
        },
        fields: ["id"]
      })
    );
    if (categories2.length === 0) {
      return [];
    }
    const categoryId = categories2[0].id;
    const response = await directus.request(
      readItems("vendors", {
        filter: {
          category: {
            _eq: categoryId
          },
          status: {
            _eq: "active"
          }
        },
        fields: ["*"],
        sort: ["-rating"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching vendors by category:", error);
    throw new Error("Failed to fetch vendors by category");
  }
}
async function getFeaturedVendors(limit = 6) {
  try {
    const response = await directus.request(
      readItems("vendors", {
        filter: {
          status: {
            _eq: "active"
          }
        },
        fields: ["*"],
        sort: ["-rating"],
        limit
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching featured vendors:", error);
    throw new Error("Failed to fetch featured vendors");
  }
}
async function getRecentBlogPosts(limit = 5) {
  try {
    const response = await directus.request(
      readItems("blog_posts", {
        fields: ["*"],
        filter: {
          status: {
            _eq: "published"
          }
        },
        sort: ["-published_date"],
        limit
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error("Failed to fetch blog posts");
  }
}
async function getSiteSettings() {
  try {
    const response = await directus.request(
      readSingleton("site_settings", {
        fields: ["*"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    throw new Error("Failed to fetch site settings");
  }
}
async function submitReview(reviewData) {
  try {
    const response = await directus.request(
      createItem("reviews", {
        ...reviewData,
        status: "pending"
        // Reviews need approval
      })
    );
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw new Error("Failed to submit review");
  }
}
async function getInvitationTemplates(category) {
  try {
    const filters = {
      status: {
        _eq: "published"
      }
    };
    if (category) {
      filters.category = {
        _eq: category
      };
    }
    const response = await directus.request(
      readItems("invitation_templates", {
        fields: ["*"],
        filter: filters,
        sort: ["-id"]
      })
    );
    return response;
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    throw new Error("Failed to fetch invitation templates");
  }
}
async function submitBusinessListing(vendorData) {
  try {
    const response = await directus.request(
      createItem("vendors", {
        ...vendorData,
        status: "draft"
        // Needs admin approval
      })
    );
    return response;
  } catch (error) {
    console.error("Error submitting business listing:", error);
    throw new Error("Failed to submit business listing");
  }
}
var DIRECTUS_URL, DIRECTUS_TOKEN, directus;
var init_directus = __esm({
  "server/directus.ts"() {
    "use strict";
    DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
    DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "";
    directus = createDirectus(DIRECTUS_URL).with(staticToken(DIRECTUS_TOKEN)).with(rest());
  }
});

// server/worker.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

// server/db.ts
import { drizzle } from "drizzle-orm/d1";
import { drizzle as drizzleBetterSQLite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  businessSubmissions: () => businessSubmissions,
  categories: () => categories,
  contacts: () => contacts,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertBusinessSubmissionSchema: () => insertBusinessSubmissionSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertContactSchema: () => insertContactSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertVendorSchema: () => insertVendorSchema,
  insertWeddingEventSchema: () => insertWeddingEventSchema,
  insertWeddingSchema: () => insertWeddingSchema,
  reviews: () => reviews,
  vendors: () => vendors,
  weddingEvents: () => weddingEvents,
  weddings: () => weddings
});
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
var vendors = sqliteTable("vendors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  website: text("website"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  facebook: text("facebook"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  gallery: text("gallery"),
  // SQLite doesn't support arrays, will store as JSON string
  services: text("services"),
  // SQLite doesn't support arrays, will store as JSON string
  priceRange: text("price_range"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  verified: integer("verified", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
  // Social media fields
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  // Embed code field for social media embeds
  embedCode: text("embed_code")
});
var reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  images: text("images"),
  // SQLite doesn't support arrays, will store as JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
});
var categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  vendorCount: integer("vendor_count").default(0)
});
var blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags"),
  // SQLite doesn't support arrays, will store as JSON string
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
});
var businessSubmissions = sqliteTable("business_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  services: text("services"),
  // SQLite doesn't support arrays, will store as JSON string
  priceRange: text("price_range"),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
});
var contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
});
var weddings = sqliteTable("weddings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brideName: text("bride_name").notNull(),
  groomName: text("groom_name").notNull(),
  weddingDate: integer("wedding_date", { mode: "timestamp" }).notNull(),
  venue: text("venue").notNull(),
  venueAddress: text("venue_address").notNull(),
  ceremonyTime: text("ceremony_time").notNull(),
  receptionTime: text("reception_time"),
  coverImage: text("cover_image"),
  galleryImages: text("gallery_images"),
  // SQLite doesn't support arrays, will store as JSON string
  story: text("story"),
  slug: text("slug").notNull(),
  maxGuests: integer("max_guests").default(100),
  isPublic: integer("is_public", { mode: "boolean" }).default(true),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  createdAt: integer("created_at", { mode: "timestamp" }),
  // Added separate ceremony and reception venues
  ceremonyVenue: text("ceremony_venue"),
  ceremonyVenueAddress: text("ceremony_venue_address"),
  receptionVenue: text("reception_venue"),
  receptionVenueAddress: text("reception_venue_address"),
  // Secret link for admin dashboard access
  adminSecretLink: text("admin_secret_link").unique()
});
var weddingEvents = sqliteTable("wedding_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").notNull().references(() => weddings.id),
  name: text("name").notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  dressCode: text("dress_code"),
  isPrivate: integer("is_private", { mode: "boolean" }).default(false),
  maxGuests: integer("max_guests"),
  order: integer("order").default(0)
});
var insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  vendorCount: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true
});
var insertBusinessSubmissionSchema = createInsertSchema(businessSubmissions).omit({
  id: true,
  status: true,
  createdAt: true
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var insertWeddingSchema = createInsertSchema(weddings).omit({
  id: true,
  createdAt: true
});
var insertWeddingEventSchema = createInsertSchema(weddingEvents).omit({
  id: true
});

// server/db.ts
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";
var devDb = null;
function getDevDatabase() {
  console.log("Initializing dev database...");
  if (!devDb) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const dbDir = join(__dirname, "../.db");
      console.log("Database directory:", dbDir);
      mkdirSync(dbDir, { recursive: true });
      const dbPath = join(dbDir, "dev.db");
      console.log("Database path:", dbPath);
      const sqlite = new Database(dbPath);
      devDb = drizzleBetterSQLite(sqlite, { schema: schema_exports });
      console.log("Creating tables if they do not exist...");
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS vendors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          location TEXT NOT NULL,
          address TEXT,
          website TEXT,
          instagram TEXT,
          youtube TEXT,
          facebook TEXT,
          profile_image TEXT,
          cover_image TEXT,
          gallery TEXT,
          services TEXT,
          price_range TEXT,
          featured INTEGER DEFAULT 0,
          verified INTEGER DEFAULT 0,
          rating REAL DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          created_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS weddings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bride_name TEXT NOT NULL,
          groom_name TEXT NOT NULL,
          wedding_date INTEGER NOT NULL,
          venue TEXT NOT NULL,
          venue_address TEXT NOT NULL,
          ceremony_time TEXT NOT NULL,
          reception_time TEXT,
          cover_image TEXT,
          gallery_images TEXT,
          story TEXT,
          slug TEXT NOT NULL,
          max_guests INTEGER DEFAULT 100,
          is_public INTEGER DEFAULT 1,
          contact_email TEXT NOT NULL,
          contact_phone TEXT,
          created_at INTEGER
        );
        
        CREATE TABLE IF NOT EXISTS wedding_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wedding_id INTEGER NOT NULL REFERENCES weddings(id),
          name TEXT NOT NULL,
          description TEXT,
          date INTEGER NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT,
          venue TEXT NOT NULL,
          address TEXT NOT NULL,
          dress_code TEXT,
          is_private INTEGER DEFAULT 0,
          max_guests INTEGER,
          "order" INTEGER DEFAULT 0
        );
      `);
      console.log("Tables created. Checking for schema migration...");
      try {
        const checkColumnQuery = `PRAGMA table_info(weddings)`;
        const columns = sqlite.prepare(checkColumnQuery).all();
        const columnNames = columns.map((col) => col.name);
        console.log("Current database columns:", columnNames);
        if (!columnNames.includes("ceremony_venue")) {
          console.log("Migrating database schema: Adding new venue columns to weddings table");
          sqlite.exec(`ALTER TABLE weddings ADD COLUMN ceremony_venue TEXT;`);
          console.log("Added ceremony_venue column");
          sqlite.exec(`ALTER TABLE weddings ADD COLUMN ceremony_venue_address TEXT;`);
          console.log("Added ceremony_venue_address column");
          sqlite.exec(`ALTER TABLE weddings ADD COLUMN reception_venue TEXT;`);
          console.log("Added reception_venue column");
          sqlite.exec(`ALTER TABLE weddings ADD COLUMN reception_venue_address TEXT;`);
          console.log("Added reception_venue_address column");
          console.log("\u2705 Database schema migration completed");
        } else {
          console.log("\u2705 Database schema is up to date");
        }
        const updatedColumns = sqlite.prepare(checkColumnQuery).all();
        const updatedColumnNames = updatedColumns.map((col) => col.name);
        console.log("Updated database columns:", updatedColumnNames);
      } catch (migrationError) {
        console.error("Error during database schema migration:", migrationError.message);
        console.error("Error stack:", migrationError.stack);
      }
      console.log("\u2705 Local SQLite database initialized");
    } catch (error) {
      console.error("Failed to initialize local database:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }
  console.log("Returning dev database instance");
  return devDb;
}
function getDb(env) {
  if (env.DB) {
    return drizzle(env.DB, { schema: schema_exports });
  }
  if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
    return getDevDatabase();
  }
  throw new Error("D1 database not available and no fallback configured");
}

// server/routes.ts
import { eq } from "drizzle-orm";

// server/auth.ts
var ADMIN_TOKENS = {
  "admin-2025-goa": "full-access",
  "vendor-manager": "vendor-only",
  "content-editor": "blog-only"
};
function authenticateAdmin(action) {
  return async (c, next) => {
    const token = c.req.header("x-admin-token") || "";
    const permissions = ADMIN_TOKENS[token];
    if (!permissions) {
      return c.text("Unauthorized", 401);
    }
    if (permissions === "full-access" || permissions === "vendor-only" && (action === "vendors" || action === "business" || action === "contacts" || action === "weddings") || permissions === "blog-only" && action === "blog" || permissions === "full-access" && (action === "templates" || action === "analytics")) {
      await next();
    } else {
      return c.text("Forbidden", 403);
    }
  };
}

// server/middleware/rateLimit.ts
var defaultOptions = {
  maxRequests: 100,
  windowMs: 6e4,
  // 1 minute
  keyGenerator: (c) => {
    return c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
  }
};
var rateLimitStore = /* @__PURE__ */ new Map();
var apiRateLimit = (options = {}) => {
  const config = { ...defaultOptions, ...options };
  return async (c, next) => {
    const key = `${config.keyGenerator?.(c)}:${c.req.path}`;
    const now = Date.now();
    const rateLimitInfo = rateLimitStore.get(key);
    if (rateLimitInfo) {
      if (now > rateLimitInfo.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
      } else {
        if (rateLimitInfo.count >= config.maxRequests) {
          c.header("X-RateLimit-Limit", config.maxRequests.toString());
          c.header("X-RateLimit-Remaining", "0");
          c.header("X-RateLimit-Reset", new Date(rateLimitInfo.resetTime).toISOString());
          return c.json({
            error: "Rate limit exceeded",
            message: `Too many requests, please try again later.`
          }, 429);
        }
        rateLimitStore.set(key, { count: rateLimitInfo.count + 1, resetTime: rateLimitInfo.resetTime });
      }
    } else {
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    }
    const info = rateLimitStore.get(key);
    if (info) {
      c.header("X-RateLimit-Limit", config.maxRequests.toString());
      c.header("X-RateLimit-Remaining", (config.maxRequests - info.count).toString());
      c.header("X-RateLimit-Reset", new Date(info.resetTime).toISOString());
    }
    await next();
  };
};

// server/middleware/cache.ts
var cache = (ttl = 3e5) => {
  return async (c, next) => {
    const cache2 = await caches.open("wedding-platform-cache");
    const cachedResponse = await cache2.match(c.req.url);
    if (cachedResponse) {
      return new Response(cachedResponse.body, cachedResponse);
    }
    await next();
    if (c.res.status === 200) {
      const responseClone = c.res.clone();
      const cacheableResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: new Headers(responseClone.headers)
      });
      cacheableResponse.headers.set("Cache-Control", `public, max-age=${ttl / 1e3}`);
      await cache2.put(c.req.url, cacheableResponse);
    }
  };
};

// server/routes.ts
import { MeiliSearch } from "meilisearch";
function shouldUseDirectus(env) {
  return env.USE_DIRECTUS === "true" || process.env.USE_DIRECTUS === "true";
}
function registerRoutes(app2) {
  app2.get("/api/health", (c) => {
    return c.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/system/status", async (c) => {
    try {
      const useDirectus = shouldUseDirectus(c.env);
      const database = useDirectus ? "Directus" : "Cloudflare D1";
      const cms = useDirectus ? "Directus Admin" : "Netlify CMS";
      let connectionStatus = "unknown";
      let lastSyncTime = null;
      if (useDirectus) {
        try {
          const { directus: directus2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
          await directus2.request({ path: "/server/ping", method: "get" });
          connectionStatus = "connected";
        } catch (error) {
          connectionStatus = "disconnected";
          console.error("Directus connection error:", error);
        }
      } else {
        try {
          const db = getDb(c.env);
          await db.select().from(vendors).limit(1).all();
          connectionStatus = "connected";
        } catch (error) {
          connectionStatus = "disconnected";
          console.error("D1 connection error:", error);
        }
      }
      return c.json({
        database,
        cms,
        connectionStatus,
        lastSyncTime
      });
    } catch (error) {
      console.error("Error fetching system status:", error);
      return c.json({
        error: "Failed to fetch system status",
        database: "unknown",
        cms: "unknown",
        connectionStatus: "error"
      }, 500);
    }
  });
  const client = new MeiliSearch({
    host: process.env.MEILI_HOST || "http://localhost:7700",
    apiKey: process.env.MEILI_KEY || "masterKey"
  });
  app2.get("/api/search/vendors", async (c) => {
    try {
      const q = c.req.query("q");
      if (!q) {
        return c.json({ hits: [] });
      }
      const index = client.index("vendors");
      const search = await index.search(q, { limit: 10 });
      return c.json(search.hits);
    } catch (error) {
      console.error("Error searching vendors:", error);
      return c.json({ error: "Failed to search vendors" }, 500);
    }
  });
  app2.get("/api/vendors", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        const { getVendors: getVendors2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const allVendors = await getVendors2();
        return c.json(allVendors);
      } else {
        const db = getDb(c.env);
        const allVendors = await db.select().from(vendors).all();
        return c.json(allVendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return c.json({ error: "Failed to fetch vendors" }, 500);
    }
  });
  app2.get("/api/vendors/:id", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const id = c.req.param("id");
      if (shouldUseDirectus(c.env)) {
        const { getVendor: getVendor2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const vendor = await getVendor2(id);
        if (!vendor) {
          return c.json({ error: "Vendor not found" }, 404);
        }
        return c.json(vendor);
      } else {
        const db = getDb(c.env);
        const vendor = await db.select().from(vendors).where(eq(vendors.id, parseInt(id))).get();
        if (!vendor) {
          return c.json({ error: "Vendor not found" }, 404);
        }
        return c.json(vendor);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
      return c.json({ error: "Failed to fetch vendor" }, 500);
    }
  });
  app2.get("/api/vendors/category/:category", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const category = c.req.param("category");
      if (shouldUseDirectus(c.env)) {
        const { getVendorsByCategory: getVendorsByCategory2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const vendorsInCategory = await getVendorsByCategory2(category);
        return c.json(vendorsInCategory);
      } else {
        const db = getDb(c.env);
        const vendorsInCategory = await db.select().from(vendors).where(eq(vendors.category, category)).all();
        return c.json(vendorsInCategory);
      }
    } catch (error) {
      console.error("Error fetching vendors by category:", error);
      return c.json({ error: "Failed to fetch vendors by category" }, 500);
    }
  });
  app2.post("/api/vendors", authenticateAdmin("vendors"), async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        const { directus: directus2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        return c.json({ error: "Directus vendor creation not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const vendor = await db.insert(vendors).values(body).returning().get();
        return c.json(vendor, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to create vendor", error: error.message }, 500);
    }
  });
  app2.post("/api/vendors/bulk", authenticateAdmin("vendors"), async (c) => {
    try {
      const { vendors: vendorsData } = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus bulk vendor import not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const importedVendors = [];
        for (const vendorData of vendorsData) {
          let priceRange = vendorData.priceRange;
          if (typeof priceRange === "string" && priceRange.startsWith("[") && priceRange.endsWith("]")) {
            try {
              priceRange = JSON.parse(priceRange);
            } catch (e) {
            }
          }
          let isVerified = vendorData.isVerified;
          if (typeof isVerified === "string") {
            isVerified = isVerified.toLowerCase() === "true";
          }
          const processedVendor = {
            ...vendorData,
            priceRange: typeof priceRange === "string" ? priceRange : JSON.stringify(priceRange),
            isVerified
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
    } catch (error) {
      console.error("Error importing vendors:", error);
      return c.json({ message: "Failed to import vendors", error: error.message }, 500);
    }
  });
  app2.put("/api/vendors/:id", authenticateAdmin("vendors"), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus vendor update not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const vendor = await db.update(vendors).set(body).where(eq(vendors.id, parseInt(id))).returning().get();
        if (!vendor) {
          return c.json({ message: "Vendor not found" }, 404);
        }
        return c.json(vendor);
      }
    } catch (error) {
      return c.json({ message: "Failed to update vendor", error: error.message }, 500);
    }
  });
  app2.delete("/api/vendors/:id", authenticateAdmin("vendors"), async (c) => {
    try {
      const id = c.req.param("id");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus vendor deletion not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const result = await db.delete(vendors).where(eq(vendors.id, parseInt(id))).returning().get();
        if (!result) {
          return c.json({ message: "Vendor not found" }, 404);
        }
        return c.json({ message: "Vendor deleted successfully" });
      }
    } catch (error) {
      return c.json({ message: "Failed to delete vendor", error: error.message }, 500);
    }
  });
  app2.get("/api/reviews/vendor/:vendorId", async (c) => {
    try {
      const vendorId = c.req.param("vendorId");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus reviews not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const vendorReviews = await db.select().from(reviews).where(eq(reviews.vendorId, parseInt(vendorId))).all();
        return c.json(vendorReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return c.json({ error: "Failed to fetch reviews" }, 500);
    }
  });
  app2.post("/api/reviews", async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        const { submitReview: submitReview2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const review = await submitReview2(body);
        return c.json(review, 201);
      } else {
        const db = getDb(c.env);
        const review = await db.insert(reviews).values(body).returning().get();
        return c.json(review, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to create review", error: error.message }, 500);
    }
  });
  app2.get("/api/categories", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        const { getCategories: getCategories2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const allCategories = await getCategories2();
        return c.json(allCategories);
      } else {
        const db = getDb(c.env);
        const allCategories = await db.select().from(categories).all();
        return c.json(allCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      return c.json({ error: "Failed to fetch categories" }, 500);
    }
  });
  app2.get("/api/blog", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        const { getRecentBlogPosts: getRecentBlogPosts2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const allPosts = await getRecentBlogPosts2(100);
        return c.json(allPosts);
      } else {
        const db = getDb(c.env);
        const allPosts = await db.select().from(blogPosts).all();
        return c.json(allPosts);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return c.json({ error: "Failed to fetch blog posts" }, 500);
    }
  });
  app2.get("/api/blog/:slug", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const slug = c.req.param("slug");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus blog post by slug not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).get();
        if (!post) {
          return c.json({ error: "Blog post not found" }, 404);
        }
        return c.json(post);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return c.json({ error: "Failed to fetch blog post" }, 500);
    }
  });
  app2.post("/api/blog", authenticateAdmin("blog"), async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus blog post creation not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const post = await db.insert(blogPosts).values(body).returning().get();
        return c.json(post, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to create blog post", error: error.message }, 500);
    }
  });
  app2.put("/api/blog/:id", authenticateAdmin("blog"), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus blog post update not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const post = await db.update(blogPosts).set(body).where(eq(blogPosts.id, parseInt(id))).returning().get();
        if (!post) {
          return c.json({ message: "Blog post not found" }, 404);
        }
        return c.json(post);
      }
    } catch (error) {
      return c.json({ message: "Failed to update blog post", error: error.message }, 500);
    }
  });
  app2.delete("/api/blog/:id", authenticateAdmin("blog"), async (c) => {
    try {
      const id = c.req.param("id");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus blog post deletion not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const result = await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id))).returning().get();
        if (!result) {
          return c.json({ message: "Blog post not found" }, 404);
        }
        return c.json({ message: "Blog post deleted successfully" });
      }
    } catch (error) {
      return c.json({ message: "Failed to delete blog post", error: error.message }, 500);
    }
  });
  app2.post("/api/business-submissions", async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        const { submitBusinessListing: submitBusinessListing2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
        const submission = await submitBusinessListing2(body);
        return c.json(submission, 201);
      } else {
        const db = getDb(c.env);
        const submission = await db.insert(businessSubmissions).values(body).returning().get();
        return c.json(submission, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to submit business", error: error.message }, 500);
    }
  });
  app2.get("/api/business-submissions", authenticateAdmin("business"), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus business submissions not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const submissions = await db.select().from(businessSubmissions).all();
        return c.json(submissions);
      }
    } catch (error) {
      console.error("Error fetching business submissions:", error);
      return c.json({ error: "Failed to fetch business submissions" }, 500);
    }
  });
  app2.post("/api/contact", async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus contact submission not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const contact = await db.insert(contacts).values(body).returning().get();
        return c.json(contact, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to submit contact", error: error.message }, 500);
    }
  });
  app2.get("/api/contacts", authenticateAdmin("contacts"), async (c) => {
    try {
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus contacts not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const contactsList = await db.select().from(contacts).all();
        return c.json(contactsList);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return c.json({ error: "Failed to fetch contacts" }, 500);
    }
  });
  app2.get("/api/weddings/:slug", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const slug = c.req.param("slug");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus weddings not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const wedding = await db.select().from(weddings).where(eq(weddings.slug, slug)).get();
        if (!wedding) {
          return c.json({ error: "Wedding not found" }, 404);
        }
        return c.json(wedding);
      }
    } catch (error) {
      console.error("Error fetching wedding:", error);
      return c.json({ error: "Failed to fetch wedding" }, 500);
    }
  });
  app2.post("/api/weddings", authenticateAdmin("weddings"), async (c) => {
    try {
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding creation not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const wedding = await db.insert(weddings).values(body).returning().get();
        return c.json(wedding, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to create wedding", error: error.message }, 500);
    }
  });
  app2.put("/api/weddings/:id", authenticateAdmin("weddings"), async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding update not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const wedding = await db.update(weddings).set(body).where(eq(weddings.id, parseInt(id))).returning().get();
        if (!wedding) {
          return c.json({ message: "Wedding not found" }, 404);
        }
        return c.json(wedding);
      }
    } catch (error) {
      return c.json({ message: "Failed to update wedding", error: error.message }, 500);
    }
  });
  app2.delete("/api/weddings/:id", authenticateAdmin("weddings"), async (c) => {
    try {
      const id = c.req.param("id");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding deletion not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const result = await db.delete(weddings).where(eq(weddings.id, parseInt(id))).returning().get();
        if (!result) {
          return c.json({ message: "Wedding not found" }, 404);
        }
        return c.json({ message: "Wedding deleted successfully" });
      }
    } catch (error) {
      return c.json({ message: "Failed to delete wedding", error: error.message }, 500);
    }
  });
  app2.get("/api/weddings/:id/events", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const weddingId = c.req.param("id");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding events not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const events = await db.select().from(weddingEvents).where(eq(weddingEvents.weddingId, parseInt(weddingId))).all();
        return c.json(events);
      }
    } catch (error) {
      console.error("Error fetching wedding events:", error);
      return c.json({ error: "Failed to fetch wedding events" }, 500);
    }
  });
  app2.post("/api/weddings/:id/events", authenticateAdmin("templates"), async (c) => {
    try {
      const weddingId = c.req.param("id");
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding event creation not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const eventData = {
          ...body,
          weddingId: parseInt(weddingId),
          date: new Date(body.date)
        };
        const event = await db.insert(weddingEvents).values(eventData).returning().get();
        return c.json(event, 201);
      }
    } catch (error) {
      return c.json({ message: "Failed to create wedding event", error: error.message }, 500);
    }
  });
  app2.put("/api/weddings/:id/events/:eventId", authenticateAdmin("templates"), async (c) => {
    try {
      const eventId = c.req.param("eventId");
      const body = await c.req.json();
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding event update not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const eventData = {
          ...body,
          date: body.date ? new Date(body.date) : void 0
        };
        const event = await db.update(weddingEvents).set(eventData).where(eq(weddingEvents.id, parseInt(eventId))).returning().get();
        if (!event) {
          return c.json({ message: "Wedding event not found" }, 404);
        }
        return c.json(event);
      }
    } catch (error) {
      return c.json({ message: "Failed to update wedding event", error: error.message }, 500);
    }
  });
  app2.delete("/api/weddings/:id/events/:eventId", authenticateAdmin("templates"), async (c) => {
    try {
      const eventId = c.req.param("eventId");
      if (shouldUseDirectus(c.env)) {
        return c.json({ error: "Directus wedding event deletion not implemented" }, 501);
      } else {
        const db = getDb(c.env);
        const result = await db.delete(weddingEvents).where(eq(weddingEvents.id, parseInt(eventId))).returning().get();
        if (!result) {
          return c.json({ message: "Wedding event not found" }, 404);
        }
        return c.json({ message: "Wedding event deleted successfully" });
      }
    } catch (error) {
      return c.json({ message: "Failed to delete wedding event", error: error.message }, 500);
    }
  });
  app2.get("/api/directus/vendors", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getVendors: getVendors2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const vendors2 = await getVendors2();
      return c.json(vendors2);
    } catch (error) {
      console.error("Error fetching vendors from Directus:", error);
      return c.json({ error: "Failed to fetch vendors from Directus" }, 500);
    }
  });
  app2.get("/api/directus/vendors/:id", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const id = c.req.param("id");
      const { getVendor: getVendor2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const vendor = await getVendor2(id);
      return c.json(vendor);
    } catch (error) {
      console.error("Error fetching vendor from Directus:", error);
      return c.json({ error: "Failed to fetch vendor from Directus" }, 500);
    }
  });
  app2.get("/api/directus/vendors/search", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const query = c.req.query("q") || "";
      const { searchVendors: searchVendors2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const vendors2 = await searchVendors2(query);
      return c.json(vendors2);
    } catch (error) {
      console.error("Error searching vendors in Directus:", error);
      return c.json({ error: "Failed to search vendors in Directus" }, 500);
    }
  });
  app2.get("/api/directus/categories", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getCategories: getCategories2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const categories2 = await getCategories2();
      return c.json(categories2);
    } catch (error) {
      console.error("Error fetching categories from Directus:", error);
      return c.json({ error: "Failed to fetch categories from Directus" }, 500);
    }
  });
  app2.get("/api/directus/vendors/category/:categorySlug", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const categorySlug = c.req.param("categorySlug");
      const { getVendorsByCategory: getVendorsByCategory2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const vendors2 = await getVendorsByCategory2(categorySlug);
      return c.json(vendors2);
    } catch (error) {
      console.error("Error fetching vendors by category from Directus:", error);
      return c.json({ error: "Failed to fetch vendors by category from Directus" }, 500);
    }
  });
  app2.get("/api/directus/vendors/featured", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getFeaturedVendors: getFeaturedVendors2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const vendors2 = await getFeaturedVendors2();
      return c.json(vendors2);
    } catch (error) {
      console.error("Error fetching featured vendors from Directus:", error);
      return c.json({ error: "Failed to fetch featured vendors from Directus" }, 500);
    }
  });
  app2.get("/api/directus/blog-posts", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getRecentBlogPosts: getRecentBlogPosts2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const posts = await getRecentBlogPosts2();
      return c.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts from Directus:", error);
      return c.json({ error: "Failed to fetch blog posts from Directus" }, 500);
    }
  });
  app2.get("/api/directus/site-settings", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const { getSiteSettings: getSiteSettings2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const settings = await getSiteSettings2();
      return c.json(settings);
    } catch (error) {
      console.error("Error fetching site settings from Directus:", error);
      return c.json({ error: "Failed to fetch site settings from Directus" }, 500);
    }
  });
  app2.post("/api/directus/reviews", apiRateLimit({ maxRequests: 50 }), async (c) => {
    try {
      const body = await c.req.json();
      const { submitReview: submitReview2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const review = await submitReview2(body);
      return c.json(review, 201);
    } catch (error) {
      console.error("Error submitting review to Directus:", error);
      return c.json({ error: "Failed to submit review to Directus" }, 500);
    }
  });
  app2.get("/api/directus/invitation-templates", cache(9e5), apiRateLimit({ maxRequests: 100 }), async (c) => {
    try {
      const category = c.req.query("category");
      const { getInvitationTemplates: getInvitationTemplates2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const templates = await getInvitationTemplates2(category);
      return c.json(templates);
    } catch (error) {
      console.error("Error fetching invitation templates from Directus:", error);
      return c.json({ error: "Failed to fetch invitation templates from Directus" }, 500);
    }
  });
  app2.post("/api/directus/business-listings", apiRateLimit({ maxRequests: 50 }), async (c) => {
    try {
      const body = await c.req.json();
      const { submitBusinessListing: submitBusinessListing2 } = await Promise.resolve().then(() => (init_directus(), directus_exports));
      const listing = await submitBusinessListing2(body);
      return c.json(listing, 201);
    } catch (error) {
      console.error("Error submitting business listing to Directus:", error);
      return c.json({ error: "Failed to submit business listing to Directus" }, 500);
    }
  });
}

// server/worker.ts
var app = new Hono();
app.use("*", async (c, next) => {
  c.header("X-Frame-Options", "DENY");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;");
  await next();
});
app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors({
  origin: ["*"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));
app.get("/health", (c) => c.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
registerRoutes(app);
app.notFound((c) => {
  return c.text("Not Found - This should be handled by Cloudflare Pages", 404);
});
var worker_default = app;
export {
  worker_default as default
};
