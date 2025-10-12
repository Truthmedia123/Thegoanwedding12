import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { serveStatic } from "./vite";
import { setupVite } from "./vite";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import { log } from "console";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Helper function to check if we should use Directus
function shouldUseDirectus(): boolean {
  return process.env.USE_DIRECTUS === 'true';
}

// Mock database for development
const mockDb = {
  weddings: [
    {
      id: 1,
      brideName: "Priya",
      groomName: "Rohan",
      weddingDate: new Date("2024-12-15").getTime(),
      venue: "Taj Exotica Resort",
      venueAddress: "Taj Exotica Resort, Benaulim, Goa",
      ceremonyTime: "16:00",
      receptionTime: "19:00",
      coverImage: "/images/wedding1.jpg",
      galleryImages: JSON.stringify(["/images/wedding1-1.jpg", "/images/wedding1-2.jpg"]),
      story: "Priya and Rohan's love story began in college...",
      slug: "priya-rohan-2024",
      maxGuests: 150,
      isPublic: 1,
      contactEmail: "priya.rohan.wedding@gmail.com",
      contactPhone: "+91 98765 43210",
      createdAt: Date.now(),
      ceremonyVenue: "Taj Exotica Resort",
      ceremonyVenueAddress: "Taj Exotica Resort, Benaulim, Goa",
      receptionVenue: "Taj Exotica Resort",
      receptionVenueAddress: "Taj Exotica Resort, Benaulim, Goa",
      adminSecretLink: "admin_secret_2024",
    },
  ],
};

// Simple admin authentication middleware for development
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-admin-token') || '';
  const validTokens = ['admin-2025-goa', 'vendor-manager', 'content-editor'];
  
  if (!validTokens.includes(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
}

// API Routes - These need to be defined before Vite middleware
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// System status endpoint
app.get("/api/system/status", async (_req, res) => {
  try {
    const useDirectus = shouldUseDirectus();
    const database = useDirectus ? 'Directus' : 'Cloudflare D1';
    const cms = useDirectus ? 'Directus Admin' : 'None (Directus only)';
    
    // Check connection status
    let connectionStatus = 'unknown';
    let lastSyncTime = null;
    
    if (useDirectus) {
      try {
        // In development, we can't actually connect to Directus
        // This is just a placeholder - in production, we would check connectivity
        connectionStatus = 'connected';
      } catch (error) {
        connectionStatus = 'disconnected';
        console.error('Directus connection error:', error);
      }
    } else {
      try {
        // In development, we're using mock data, so always connected
        connectionStatus = 'connected';
      } catch (error) {
        connectionStatus = 'disconnected';
        console.error('D1 connection error:', error);
      }
    }
    
    res.json({
      database,
      cms,
      connectionStatus,
      lastSyncTime
    });
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({ 
      error: "Failed to fetch system status",
      database: "unknown",
      cms: "unknown",
      connectionStatus: "error"
    });
  }
});

// Business Submissions API
app.post("/api/business-submissions", (_req, res) => {
  // In a real implementation, this would insert into a business_submissions table
  res.status(201).json({ message: "Business submission received successfully" });
});

// Contact API
app.post("/api/contact", (_req, res) => {
  // In a real implementation, this would insert into a contacts table
  res.status(201).json({ message: "Contact form submitted successfully" });
});

// Weddings API
app.get("/api/weddings/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const db = getDb({ DB: undefined });
    
    // Get wedding with events
    const wedding = await db.select().from(schema.weddings).where(eq(schema.weddings.slug, slug)).get();
    
    if (!wedding) {
      return res.status(404).json({ error: "Wedding not found" });
    }
    
    res.json(wedding);
  } catch (error: any) {
    console.error('Error fetching wedding:', error);
    res.status(500).json({ error: "Failed to fetch wedding" });
  }
});

app.post("/api/weddings", authenticateAdmin, async (req, res) => {
  try {
    const body = req.body;
    const db = getDb({ DB: undefined });
    
    // Generate a secret link if one wasn't provided
    const adminSecretLink = body.adminSecretLink || Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
    
    // Prepare wedding data
    const weddingData = {
      ...body,
      admin_secret_link: adminSecretLink, // Use the database column name
      weddingDate: new Date(body.weddingDate),
      createdAt: new Date(),
      // For backward compatibility, set venue and venueAddress to ceremony venue
      venue: body.ceremonyVenue || body.venue || '',
      venueAddress: body.ceremonyVenueAddress || body.venueAddress || '',
    };
    
    console.log('Processing wedding data:', weddingData);
    
    const wedding = await db.insert(schema.weddings).values(weddingData).returning().get();
    console.log('Wedding created successfully:', wedding);
    
    // Return the wedding data including the secret link
    res.status(201).json({
      ...wedding,
      adminSecretLink
    });
  } catch (error: any) {
    console.error('Error creating wedding:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: "Failed to create wedding", 
      details: error.message || String(error),
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
  log(`Error: ${message}`, "error");
});

// Setup Vite in development
const server = createServer(app);

(async () => {
  if (process.env.NODE_ENV === "development") {
    // Setup API routes before Vite middleware
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  const port = 5001;
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };
  
  // reusePort is not supported on Windows
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }
  
  server.listen(listenOptions, () => {
    log(`🚀 Development server running on http://localhost:${port}`);
    log(`📱 PWA features enabled`);
    log(`🔧 Hot reload active`);
  });
})();

// Helper function to generate a secret link
function generateSecretLink() {
  return 'admin_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}