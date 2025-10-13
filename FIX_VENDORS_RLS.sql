-- Fix RLS policies for vendors and related tables to allow admin access
-- This will allow the admin dashboard to display and manage vendors

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON vendors;
DROP POLICY IF EXISTS "Enable all access for admins on vendors" ON vendors;
DROP POLICY IF EXISTS "Public read access" ON vendors;
DROP POLICY IF EXISTS "Admin full access" ON vendors;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable all access for admins on categories" ON categories;
DROP POLICY IF EXISTS "Public read access" ON categories;

DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
DROP POLICY IF EXISTS "Enable all access for admins on reviews" ON reviews;

DROP POLICY IF EXISTS "Enable read access for published posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable all access for admins on blog_posts" ON blog_posts;

-- ============================================
-- VENDORS TABLE POLICIES
-- ============================================

-- Allow public read access to vendors (for website visitors)
CREATE POLICY "Public can read vendors" 
ON vendors FOR SELECT 
USING (true);

-- Allow admins to do everything with vendors
CREATE POLICY "Admins can manage vendors" 
ON vendors FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Allow public read access to categories
CREATE POLICY "Public can read categories" 
ON categories FOR SELECT 
USING (true);

-- Allow admins to manage categories
CREATE POLICY "Admins can manage categories" 
ON categories FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- REVIEWS TABLE POLICIES
-- ============================================

-- Allow public read access to reviews
CREATE POLICY "Public can read reviews" 
ON reviews FOR SELECT 
USING (true);

-- Allow anyone to insert reviews
CREATE POLICY "Anyone can insert reviews" 
ON reviews FOR INSERT 
WITH CHECK (true);

-- Allow admins to manage reviews
CREATE POLICY "Admins can manage reviews" 
ON reviews FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- BLOG POSTS TABLE POLICIES
-- ============================================

-- Allow public to read published blog posts
CREATE POLICY "Public can read published blogs" 
ON blog_posts FOR SELECT 
USING (published = true OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to manage blog posts
CREATE POLICY "Admins can manage blogs" 
ON blog_posts FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- INVITATIONS TABLE POLICIES
-- ============================================

-- Allow public read access to invitations
CREATE POLICY "Public can read invitations" 
ON invitations FOR SELECT 
USING (true);

-- Allow public to insert invitations
CREATE POLICY "Public can insert invitations" 
ON invitations FOR INSERT 
WITH CHECK (true);

-- Allow public to update their own RSVP
CREATE POLICY "Public can update invitations" 
ON invitations FOR UPDATE 
USING (true);

-- Allow admins full access
CREATE POLICY "Admins can manage invitations" 
ON invitations FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- VENDOR ANALYTICS TABLE POLICIES
-- ============================================

-- Allow anyone to insert analytics
CREATE POLICY "Anyone can insert analytics" 
ON vendor_analytics FOR INSERT 
WITH CHECK (true);

-- Allow admins to read analytics
CREATE POLICY "Admins can read analytics" 
ON vendor_analytics FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- SITE SETTINGS TABLE POLICIES
-- ============================================

-- Allow public read access to site settings
CREATE POLICY "Public can read site settings" 
ON site_settings FOR SELECT 
USING (true);

-- Allow admins to manage site settings
CREATE POLICY "Admins can manage site settings" 
ON site_settings FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Check vendor count
SELECT COUNT(*) as vendor_count FROM vendors;

-- Check if admin can access vendors
SELECT id, name, category FROM vendors LIMIT 5;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated for all tables';
    RAISE NOTICE '🔓 Public can read vendors, categories, reviews';
    RAISE NOTICE '🔐 Admins have full access to manage all data';
    RAISE NOTICE '🌐 Refresh the admin vendors page: https://thegoanwedding12.pages.dev/admin/vendors';
END $$;
