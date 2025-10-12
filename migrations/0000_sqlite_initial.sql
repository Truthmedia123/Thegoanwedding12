-- Create vendors table
CREATE TABLE "vendors" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"location" text NOT NULL,
	"address" text,
	"website" text,
	"instagram" text,
	"facebook" text,
	"profile_image" text,
	"cover_image" text,
	"gallery" text,
	"services" text,
	"price_range" text,
	"featured" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT (unixepoch())
);

-- Create reviews table
CREATE TABLE "reviews" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"vendor_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"images" text,
	"created_at" timestamp DEFAULT (unixepoch()),
	FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id")
);

-- Create categories table
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL UNIQUE,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"vendor_count" integer DEFAULT 0
);

-- Create blog_posts table
CREATE TABLE "blog_posts" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"featured_image" text,
	"category" text NOT NULL,
	"tags" text,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT (unixepoch())
);

-- Create business_submissions table
CREATE TABLE "business_submissions" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"location" text NOT NULL,
	"address" text,
	"website" text,
	"instagram" text,
	"facebook" text,
	"services" text,
	"price_range" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT (unixepoch())
);

-- Create contacts table
CREATE TABLE "contacts" (
	"id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT (unixepoch())
);
