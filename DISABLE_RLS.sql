-- Disable Row Level Security for Admin Operations
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tugciyungdydnwsqzwok/sql

-- Disable RLS on all tables to allow admin operations
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- If blogs table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blogs') THEN
        EXECUTE 'ALTER TABLE blogs DISABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blog_posts') THEN
        EXECUTE 'ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_submissions') THEN
        EXECUTE 'ALTER TABLE business_submissions DISABLE ROW LEVEL SECURITY';
    END IF;
END $$;

-- Verify RLS is disabled
SELECT 
    tablename, 
    CASE WHEN rowsecurity THEN '🔒 Enabled' ELSE '✅ Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'vendors', 'reviews', 'invitations', 'vendor_analytics', 'site_settings', 'profiles', 'blogs', 'blog_posts')
ORDER BY tablename;

-- Success message
SELECT '✅ RLS Disabled - Admin dashboard can now manage data' as status;
