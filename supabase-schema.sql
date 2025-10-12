-- Supabase Postgres Schema for TheGoanWedding Platform
-- This file contains the complete database schema for Supabase PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(7), -- Hex color code
    vendor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    location VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    whatsapp VARCHAR(20),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    facebook VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    embed_code TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    featured_image VARCHAR(255),
    images TEXT[], -- Array of image URLs
    services TEXT[], -- Array of service names
    price_range VARCHAR(50),
    availability TEXT,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[], -- Array of image URLs
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(255),
    category VARCHAR(100),
    tags TEXT[], -- Array of tag names
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business submissions table
CREATE TABLE IF NOT EXISTS business_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    location VARCHAR(255),
    address TEXT,
    website VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    services TEXT[], -- Array of service names
    price_range VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weddings table
CREATE TABLE IF NOT EXISTS weddings (
    id SERIAL PRIMARY KEY,
    bride_name VARCHAR(255) NOT NULL,
    groom_name VARCHAR(255) NOT NULL,
    wedding_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    ceremony_time VARCHAR(10) NOT NULL,
    reception_time VARCHAR(10),
    cover_image VARCHAR(255),
    gallery_images TEXT[], -- Array of image URLs
    story TEXT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    max_guests INTEGER DEFAULT 100,
    is_public BOOLEAN DEFAULT TRUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    ceremony_venue VARCHAR(255),
    ceremony_venue_address TEXT,
    reception_venue VARCHAR(255),
    reception_venue_address TEXT,
    admin_secret_link VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wedding events table
CREATE TABLE IF NOT EXISTS wedding_events (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10),
    venue VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    dress_code VARCHAR(255),
    is_private BOOLEAN DEFAULT FALSE,
    max_guests INTEGER,
    order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitations table
CREATE TABLE IF NOT EXISTS invitations (
    id SERIAL PRIMARY KEY,
    wedding_id VARCHAR(255) NOT NULL, -- String ID for wedding reference
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    plus_ones INTEGER DEFAULT 0,
    dietary_requirements TEXT,
    rsvp_status VARCHAR(50),
    rsvp_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(location);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(rating);
CREATE INDEX IF NOT EXISTS idx_vendors_featured ON vendors(featured);
CREATE INDEX IF NOT EXISTS idx_vendors_verified ON vendors(verified);
CREATE INDEX IF NOT EXISTS idx_vendors_name_trgm ON vendors USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vendors_description_trgm ON vendors USING gin(description gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm ON categories USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_title_trgm ON blog_posts USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_wedding_date ON weddings(wedding_date);
CREATE INDEX IF NOT EXISTS idx_weddings_admin_secret_link ON weddings(admin_secret_link);

CREATE INDEX IF NOT EXISTS idx_wedding_events_wedding_id ON wedding_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wedding_events_date ON wedding_events(date);

CREATE INDEX IF NOT EXISTS idx_invitations_wedding_id ON invitations(wedding_id);
CREATE INDEX IF NOT EXISTS idx_invitations_rsvp_status ON invitations(rsvp_status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_submissions_updated_at BEFORE UPDATE ON business_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at BEFORE UPDATE ON weddings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_events_updated_at BEFORE UPDATE ON wedding_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Photographers', 'photographers', 'Professional wedding photographers', 'camera', '#FF6B6B'),
('Caterers', 'caterers', 'Wedding catering services', 'utensils', '#4ECDC4'),
('Venues', 'venues', 'Wedding venues and halls', 'building', '#45B7D1'),
('Decorators', 'decorators', 'Wedding decoration services', 'palette', '#96CEB4'),
('Makeup Artists', 'makeup-artists', 'Bridal makeup and styling', 'sparkles', '#FFEAA7'),
('DJs & Music', 'djs-music', 'Wedding entertainment and music', 'music', '#DDA0DD'),
('Transportation', 'transportation', 'Wedding transportation services', 'car', '#98D8C8'),
('Jewelers', 'jewelers', 'Wedding jewelry and accessories', 'gem', '#F7DC6F')
ON CONFLICT (slug) DO NOTHING;

-- Update vendor count function
CREATE OR REPLACE FUNCTION update_vendor_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories 
        SET vendor_count = (
            SELECT COUNT(*) FROM vendors 
            WHERE category = NEW.category
        )
        WHERE name = NEW.category;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Update old category count
        UPDATE categories 
        SET vendor_count = (
            SELECT COUNT(*) FROM vendors 
            WHERE category = OLD.category
        )
        WHERE name = OLD.category;
        
        -- Update new category count
        UPDATE categories 
        SET vendor_count = (
            SELECT COUNT(*) FROM vendors 
            WHERE category = NEW.category
        )
        WHERE name = NEW.category;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories 
        SET vendor_count = (
            SELECT COUNT(*) FROM vendors 
            WHERE category = OLD.category
        )
        WHERE name = OLD.category;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for vendor count
CREATE TRIGGER update_vendor_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_vendor_count();

-- Update review count and rating function
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE vendors 
        SET review_count = (
            SELECT COUNT(*) FROM reviews 
            WHERE vendor_id = NEW.vendor_id
        ),
        rating = (
            SELECT AVG(rating) FROM reviews 
            WHERE vendor_id = NEW.vendor_id
        )
        WHERE id = NEW.vendor_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE vendors 
        SET review_count = (
            SELECT COUNT(*) FROM reviews 
            WHERE vendor_id = NEW.vendor_id
        ),
        rating = (
            SELECT AVG(rating) FROM reviews 
            WHERE vendor_id = NEW.vendor_id
        )
        WHERE id = NEW.vendor_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE vendors 
        SET review_count = (
            SELECT COUNT(*) FROM reviews 
            WHERE vendor_id = OLD.vendor_id
        ),
        rating = (
            SELECT AVG(rating) FROM reviews 
            WHERE vendor_id = OLD.vendor_id
        )
        WHERE id = OLD.vendor_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for vendor rating
CREATE TRIGGER update_vendor_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();
