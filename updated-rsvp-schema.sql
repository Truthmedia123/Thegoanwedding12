-- Updated RSVP Schema for Self-Service Wedding RSVP System
-- This schema supports couples creating weddings and guests self-registering

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean update)
DROP TABLE IF EXISTS guest_rsvps CASCADE;
DROP TABLE IF EXISTS guest_event_invites CASCADE;
DROP TABLE IF EXISTS wedding_guests CASCADE;
DROP TABLE IF EXISTS rsvp_answers CASCADE;
DROP TABLE IF EXISTS rsvp_questions CASCADE;
DROP TABLE IF EXISTS wedding_events CASCADE;

-- 1. Weddings Table (updated with admin_secret_key)
-- Note: We're keeping the existing weddings table structure but ensuring admin_secret_link exists
ALTER TABLE weddings 
ADD COLUMN IF NOT EXISTS admin_secret_key VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS theme_color VARCHAR(7) DEFAULT '#FF6B9D',
ADD COLUMN IF NOT EXISTS custom_message TEXT,
ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMPTZ;

-- Update existing weddings to have admin secret keys if they don't
UPDATE weddings 
SET admin_secret_key = md5(random()::text || clock_timestamp()::text)
WHERE admin_secret_key IS NULL;

-- 2. Wedding Events Table (recreate)
CREATE TABLE IF NOT EXISTS wedding_events (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10),
    venue VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    dress_code VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Guest RSVPs Table (simplified - guests self-register)
CREATE TABLE IF NOT EXISTS guest_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    total_guests INTEGER DEFAULT 1,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Guest Event Responses (which events they're attending)
CREATE TABLE IF NOT EXISTS guest_event_responses (
    id SERIAL PRIMARY KEY,
    rsvp_id UUID NOT NULL REFERENCES guest_rsvps(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES wedding_events(id) ON DELETE CASCADE,
    attending BOOLEAN DEFAULT true,
    dietary_restrictions TEXT,
    UNIQUE (rsvp_id, event_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_admin_secret_key ON weddings(admin_secret_key);
CREATE INDEX IF NOT EXISTS idx_wedding_events_wedding_id ON wedding_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_wedding_id ON guest_rsvps(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guest_event_responses_rsvp_id ON guest_event_responses(rsvp_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_weddings_updated_at ON weddings;
CREATE TRIGGER update_weddings_updated_at 
    BEFORE UPDATE ON weddings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wedding_events_updated_at ON wedding_events;
CREATE TRIGGER update_wedding_events_updated_at 
    BEFORE UPDATE ON wedding_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guest_rsvps_updated_at ON guest_rsvps;
CREATE TRIGGER update_guest_rsvps_updated_at 
    BEFORE UPDATE ON guest_rsvps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT '✅ Updated RSVP schema created successfully!' AS message;
SELECT 'New tables: wedding_events, guest_rsvps, guest_event_responses' AS info;