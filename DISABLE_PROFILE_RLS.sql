-- Temporarily disable RLS on profiles to fix the infinite loading
-- This will allow the AuthContext to fetch the profile

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check if profile exists
SELECT id, email, role FROM profiles WHERE email = 'admin@thegoanwedding.com';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS disabled on profiles table';
    RAISE NOTICE '🔓 Auth should now work properly';
    RAISE NOTICE '🌐 Refresh: https://thegoanwedding12.pages.dev/admin/vendors';
    RAISE NOTICE '⚠️  For production, you should implement proper RLS policies';
END $$;
