-- Fix Profile RLS to allow login to work properly
-- This enables RLS on profiles with policies that allow authenticated users to read their own profile

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;

-- Create policy: Allow users to read their own profile (needed for login check)
CREATE POLICY "Users can read own profile" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create policy: Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Verify the user profile exists and has admin role
SELECT id, email, role FROM profiles WHERE email = 'admin@thegoanwedding.com';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Profile RLS policies updated';
    RAISE NOTICE '🔐 Users can now read their own profile during login';
    RAISE NOTICE '🌐 Try logging in again at https://thegoanwedding12.pages.dev/login';
END $$;
