-- ============================================
-- SUPABASE STORAGE SETUP FOR VENDOR MEDIA
-- ============================================
-- Run this in Supabase SQL Editor

-- 1. Create storage bucket for vendor images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-images',
  'vendor-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage bucket for vendor videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-videos',
  'vendor-videos',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up storage policies for vendor-images bucket
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-images');

-- Allow authenticated uploads (admin only)
CREATE POLICY "Authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-images');

-- Allow authenticated updates (admin only)
CREATE POLICY "Authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-images');

-- Allow authenticated deletes (admin only)
CREATE POLICY "Authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-images');

-- 4. Set up storage policies for vendor-videos bucket
-- Allow public read access
CREATE POLICY "Public Access Videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-videos');

-- Allow authenticated uploads (admin only)
CREATE POLICY "Authenticated video uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-videos');

-- Allow authenticated updates (admin only)
CREATE POLICY "Authenticated video updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-videos');

-- Allow authenticated deletes (admin only)
CREATE POLICY "Authenticated video deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-videos');

-- ============================================
-- VERIFY SETUP
-- ============================================
-- Check if buckets were created
SELECT * FROM storage.buckets WHERE id IN ('vendor-images', 'vendor-videos');

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
