-- Test if the admin user can access vendors
-- Run this while logged in as admin@thegoanwedding.com

-- 1. Check if you're authenticated
SELECT auth.uid() as current_user_id, auth.email() as current_email;

-- 2. Check your profile and role
SELECT id, email, role FROM profiles WHERE id = auth.uid();

-- 3. Try to select vendors (this is what the app does)
SELECT id, name, category, location FROM vendors LIMIT 5;

-- 4. Check RLS policies on vendors table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vendors';

-- 5. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('vendors', 'profiles', 'categories');
