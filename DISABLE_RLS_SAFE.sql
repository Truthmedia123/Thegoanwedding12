-- Disable Row Level Security for Admin Operations (Safe Version)
-- This only disables RLS on tables that exist
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tugciyungdydnwsqzwok/sql

-- Disable RLS on tables that exist (wrapped in DO block to handle missing tables)
DO $$ 
BEGIN
    -- Vendors table (required)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vendors') THEN
        EXECUTE 'ALTER TABLE vendors DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for vendors';
    ELSE
        RAISE NOTICE '⚠️  vendors table does not exist';
    END IF;

    -- Categories table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        EXECUTE 'ALTER TABLE categories DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for categories';
    ELSE
        RAISE NOTICE '⚠️  categories table does not exist';
    END IF;

    -- Reviews table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        EXECUTE 'ALTER TABLE reviews DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for reviews';
    ELSE
        RAISE NOTICE '⚠️  reviews table does not exist';
    END IF;

    -- Profiles table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        EXECUTE 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for profiles';
    ELSE
        RAISE NOTICE '⚠️  profiles table does not exist';
    END IF;

    -- Blogs/Blog Posts table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blogs') THEN
        EXECUTE 'ALTER TABLE blogs DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for blogs';
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blog_posts') THEN
        EXECUTE 'ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for blog_posts';
    END IF;

    -- Vendor Analytics table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'vendor_analytics') THEN
        EXECUTE 'ALTER TABLE vendor_analytics DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for vendor_analytics';
    END IF;

    -- Site Settings table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        EXECUTE 'ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for site_settings';
    END IF;

    -- Business Submissions table
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_submissions') THEN
        EXECUTE 'ALTER TABLE business_submissions DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for business_submissions';
    END IF;

    -- Invitations table (optional - for RSVP feature)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invitations') THEN
        EXECUTE 'ALTER TABLE invitations DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE '✅ RLS disabled for invitations';
    END IF;

    RAISE NOTICE '🎉 RLS configuration complete!';
END $$;

-- Verify which tables have RLS disabled
SELECT 
    tablename, 
    CASE WHEN rowsecurity THEN '🔒 Enabled' ELSE '✅ Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Success message
SELECT '✅ RLS Disabled - Admin dashboard can now manage data' as status;
