-- Fix Row Level Security policies to allow seeding and admin operations
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily for seeding (we'll re-enable with proper policies)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'vendors', 'reviews', 'blog_posts', 'invitations');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Row Level Security disabled for seeding';
    RAISE NOTICE '🌱 You can now run: node scripts/seed-supabase.js';
    RAISE NOTICE '⚠️  Remember to re-enable RLS after seeding for production';
END $$;
