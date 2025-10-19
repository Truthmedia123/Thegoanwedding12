-- ============================================
-- QUICK FIX: Vendor Add/Delete Issues
-- ============================================
-- This script fixes common issues preventing vendor
-- operations in the admin dashboard.
--
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current state
DO $$
BEGIN
    RAISE NOTICE '🔍 Checking current vendor table state...';
END $$;

SELECT 
    COUNT(*) as total_vendors,
    COUNT(CASE WHEN created_at::date = CURRENT_DATE THEN 1 END) as today_vendors
FROM vendors;

-- Step 2: Check if RLS is enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vendors';

-- Step 3: Check existing policies
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'vendors';

-- Step 4: Drop all existing vendor policies
DO $$
BEGIN
    RAISE NOTICE '🗑️  Dropping existing policies...';
END $$;

DROP POLICY IF EXISTS "Public can read vendors" ON vendors;
DROP POLICY IF EXISTS "Admins can manage vendors" ON vendors;
DROP POLICY IF EXISTS "Authenticated users can read vendors" ON vendors;
DROP POLICY IF EXISTS "Authenticated users can insert vendors" ON vendors;
DROP POLICY IF EXISTS "Authenticated users can update vendors" ON vendors;
DROP POLICY IF EXISTS "Authenticated users can delete vendors" ON vendors;
DROP POLICY IF EXISTS "Enable read access for all users" ON vendors;
DROP POLICY IF EXISTS "Enable all access for admins on vendors" ON vendors;
DROP POLICY IF EXISTS "Public read access" ON vendors;
DROP POLICY IF EXISTS "Admin full access" ON vendors;

-- Step 5: Create simple, permissive policies
DO $$
BEGIN
    RAISE NOTICE '✅ Creating new permissive policies...';
END $$;

-- Allow everyone to read vendors (public access)
CREATE POLICY "vendors_select_public" 
ON vendors FOR SELECT 
USING (true);

-- Allow authenticated users to insert vendors
CREATE POLICY "vendors_insert_authenticated" 
ON vendors FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update vendors
CREATE POLICY "vendors_update_authenticated" 
ON vendors FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete vendors
CREATE POLICY "vendors_delete_authenticated" 
ON vendors FOR DELETE 
TO authenticated
USING (true);

-- Step 6: Ensure RLS is enabled
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Step 7: Verify the fix
DO $$
BEGIN
    RAISE NOTICE '🧪 Verifying policies...';
END $$;

SELECT 
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE tablename = 'vendors'
ORDER BY cmd;

-- Step 8: Test vendor access
DO $$
DECLARE
    vendor_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO vendor_count FROM vendors;
    RAISE NOTICE '📊 Total vendors accessible: %', vendor_count;
END $$;

-- Step 9: Create admin profile if needed
-- Replace 'your-user-id' and 'your-email' with actual values
-- You can get your user ID from: SELECT auth.uid();
/*
INSERT INTO profiles (id, email, role, created_at, updated_at)
VALUES (
    'your-user-id',  -- Replace with auth.uid()
    'your-email',    -- Replace with your email
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', updated_at = NOW();
*/

-- Step 10: Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ============================================';
    RAISE NOTICE '✅ VENDOR POLICIES FIXED!';
    RAISE NOTICE '✅ ============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 What was done:';
    RAISE NOTICE '   1. Removed all old restrictive policies';
    RAISE NOTICE '   2. Created new permissive policies';
    RAISE NOTICE '   3. Public can read vendors';
    RAISE NOTICE '   4. Authenticated users can add/edit/delete';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Next steps:';
    RAISE NOTICE '   1. Make sure you are logged in';
    RAISE NOTICE '   2. Refresh the admin vendors page';
    RAISE NOTICE '   3. Try adding a test vendor';
    RAISE NOTICE '   4. Try deleting a vendor';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 To test in browser console:';
    RAISE NOTICE '   Copy test-vendor-console.js into console';
    RAISE NOTICE '';
    RAISE NOTICE '📄 For more info: VENDOR_DEBUG_REPORT.md';
    RAISE NOTICE '';
END $$;
