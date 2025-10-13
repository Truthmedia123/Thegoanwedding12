-- ============================================
-- SUPABASE QUICK SETUP SQL
-- TheGoanWedding Platform Database Schema
-- ============================================
-- Copy this entire file and paste it into Supabase SQL Editor
-- Then click "Run" to create all tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- DROP EXISTING TABLES (if any)
-- ============================================
DROP TABLE IF EXISTS vendor_analytics CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS business_submissions CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(7),
    vendor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
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
    images TEXT[],
    services TEXT[],
    price_range VARCHAR(50),
    availability TEXT,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(255),
    category VARCHAR(100),
    tags TEXT[],
    published BOOLEAN DEFAULT FALSE,
    author_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business submissions table
CREATE TABLE business_submissions (
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
    services TEXT[],
    price_range VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invitations table
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    wedding_id VARCHAR(255) NOT NULL,
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

-- Profiles table (for admin users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor analytics table
CREATE TABLE vendor_analytics (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    session_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_location ON vendors(location);
CREATE INDEX idx_vendors_featured ON vendors(featured);
CREATE INDEX idx_vendors_verified ON vendors(verified);
CREATE INDEX idx_vendors_rating ON vendors(rating DESC);
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX idx_vendor_analytics_vendor_id ON vendor_analytics(vendor_id);
CREATE INDEX idx_vendor_analytics_event_type ON vendor_analytics(event_type);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_invitations_wedding_id ON invitations(wedding_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Public read access for vendors
CREATE POLICY "Enable read access for all users" ON vendors 
    FOR SELECT USING (true);

-- Public read access for categories
CREATE POLICY "Enable read access for all users" ON categories 
    FOR SELECT USING (true);

-- Public read access for reviews
CREATE POLICY "Enable read access for all users" ON reviews 
    FOR SELECT USING (true);

-- Public read access for published blog posts
CREATE POLICY "Enable read access for published posts" ON blog_posts 
    FOR SELECT USING (published = true);

-- Public insert for business submissions
CREATE POLICY "Enable insert for all users" ON business_submissions 
    FOR INSERT WITH CHECK (true);

-- Public read access for invitations (with wedding_id)
CREATE POLICY "Enable read access for invitations" ON invitations 
    FOR SELECT USING (true);

-- Public insert for invitations
CREATE POLICY "Enable insert for invitations" ON invitations 
    FOR INSERT WITH CHECK (true);

-- Public update for RSVP
CREATE POLICY "Enable update for RSVP" ON invitations 
    FOR UPDATE USING (true);

-- Public insert for vendor analytics
CREATE POLICY "Enable insert for analytics" ON vendor_analytics 
    FOR INSERT WITH CHECK (true);

-- Public read for site settings
CREATE POLICY "Enable read access for site settings" ON site_settings 
    FOR SELECT USING (true);

-- Admin policies (authenticated users with admin role)
CREATE POLICY "Enable all access for admins on vendors" ON vendors 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable all access for admins on categories" ON categories 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable all access for admins on reviews" ON reviews 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable all access for admins on blog_posts" ON blog_posts 
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'admin'
        )
    );

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert categories
INSERT INTO categories (name, slug, description, icon) VALUES
    ('Photographers and Videographers', 'photographers-videographers', 'Professional wedding photography and videography services', '📸'),
    ('Venues', 'venues', 'Beautiful wedding venues across Goa', '🏖️'),
    ('Caterers', 'caterers', 'Delicious catering services for your wedding', '🍽️'),
    ('Makeup Artists', 'makeup-artists', 'Professional bridal makeup and beauty services', '💄'),
    ('Decorators', 'decorators', 'Creative wedding decoration and floral arrangements', '🌸'),
    ('DJs', 'djs', 'Professional DJ and music services', '🎵'),
    ('Wedding Planners', 'wedding-planners', 'Full-service wedding planning', '📋'),
    ('Bridal Wear', 'bridal-wear', 'Bridal dresses and attire', '👗'),
    ('Bands', 'bands', 'Live music bands for weddings', '🎸'),
    ('Mehendi Artists', 'mehendi-artists', 'Traditional mehendi art services', '🎨');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database setup completed successfully!';
    RAISE NOTICE '📊 Created tables: vendors, categories, reviews, blog_posts, invitations, profiles, vendor_analytics, site_settings';
    RAISE NOTICE '🔒 Row Level Security enabled with public read access';
    RAISE NOTICE '📈 Performance indexes created';
    RAISE NOTICE '🎉 Initial categories inserted';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next step: Run the seed script to add sample vendors';
    RAISE NOTICE '   Command: node scripts/seed-supabase.js';
END $$;
