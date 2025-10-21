-- Add social media and sync tracking fields to vendors table
-- Migration: Add Facebook, Google Maps Place ID, and sync tracking

-- Add new columns for social media platforms
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS google_maps_place_id TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS auto_update_main_image BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS main_image_selection TEXT DEFAULT 'first' CHECK (main_image_selection IN ('first', 'random', 'highest_quality'));

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendors_last_synced ON vendors(last_synced_at);

-- Create sync_logs table to track automated sync operations
CREATE TABLE IF NOT EXISTS sync_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_vendors INTEGER NOT NULL DEFAULT 0,
  successful_syncs INTEGER NOT NULL DEFAULT 0,
  total_images_added INTEGER NOT NULL DEFAULT 0,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for sync logs
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sync_logs(timestamp DESC);

-- Add comments for documentation
COMMENT ON COLUMN vendors.facebook IS 'Facebook Page ID or username for auto-syncing public photos';
COMMENT ON COLUMN vendors.google_maps_place_id IS 'Google Maps Place ID for auto-syncing location photos';
COMMENT ON COLUMN vendors.last_synced_at IS 'Timestamp of last automated social media sync';
COMMENT ON COLUMN vendors.auto_update_main_image IS 'Enable/disable automatic main image updates during sync';
COMMENT ON COLUMN vendors.main_image_selection IS 'Strategy for selecting main image: first, random, or highest_quality';
COMMENT ON TABLE sync_logs IS 'Logs of automated social media sync operations';
