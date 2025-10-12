import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../shared/schema";
import { writeFile } from "fs/promises";
import { join } from "path";

async function exportD1Data() {
  try {
    console.log("Starting D1 data export...");
    
    // Connect to the SQLite database
    const sqlite = new Database(".db/dev.db");
    const db = drizzle(sqlite, { schema });
    
    // Export vendors
    console.log("Exporting vendors...");
    const vendors = await db.select().from(schema.vendors).all();
    await writeFile(
      join(process.cwd(), "data-export", "vendors.json"),
      JSON.stringify(vendors, null, 2)
    );
    console.log(`Exported ${vendors.length} vendors`);
    
    // Export categories
    console.log("Exporting categories...");
    const categories = await db.select().from(schema.categories).all();
    await writeFile(
      join(process.cwd(), "data-export", "categories.json"),
      JSON.stringify(categories, null, 2)
    );
    console.log(`Exported ${categories.length} categories`);
    
    // Export blog posts
    console.log("Exporting blog posts...");
    const blogPosts = await db.select().from(schema.blogPosts).all();
    await writeFile(
      join(process.cwd(), "data-export", "blog_posts.json"),
      JSON.stringify(blogPosts, null, 2)
    );
    console.log(`Exported ${blogPosts.length} blog posts`);
    
    // Export reviews
    console.log("Exporting reviews...");
    const reviews = await db.select().from(schema.reviews).all();
    await writeFile(
      join(process.cwd(), "data-export", "reviews.json"),
      JSON.stringify(reviews, null, 2)
    );
    console.log(`Exported ${reviews.length} reviews`);
    
    // Export business submissions
    console.log("Exporting business submissions...");
    const businessSubmissions = await db.select().from(schema.businessSubmissions).all();
    await writeFile(
      join(process.cwd(), "data-export", "business_submissions.json"),
      JSON.stringify(businessSubmissions, null, 2)
    );
    console.log(`Exported ${businessSubmissions.length} business submissions`);
    
    // Export contacts
    console.log("Exporting contacts...");
    const contacts = await db.select().from(schema.contacts).all();
    await writeFile(
      join(process.cwd(), "data-export", "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    console.log(`Exported ${contacts.length} contacts`);
    
    // Export weddings
    console.log("Exporting weddings...");
    const weddings = await db.select().from(schema.weddings).all();
    await writeFile(
      join(process.cwd(), "data-export", "weddings.json"),
      JSON.stringify(weddings, null, 2)
    );
    console.log(`Exported ${weddings.length} weddings`);
    
    // Export wedding events
    console.log("Exporting wedding events...");
    const weddingEvents = await db.select().from(schema.weddingEvents).all();
    await writeFile(
      join(process.cwd(), "data-export", "wedding_events.json"),
      JSON.stringify(weddingEvents, null, 2)
    );
    console.log(`Exported ${weddingEvents.length} wedding events`);
    
    console.log("Data export completed successfully!");
    sqlite.close();
  } catch (error) {
    console.error("Error during data export:", error);
    process.exit(1);
  }
}

// Run the export
exportD1Data();