-- Complete RSVP Schema Setup
-- This script creates all necessary tables for the RSVP system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Weddings Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS weddings (
    id SERIAL PRIMARY KEY,
    bride_name VARCHAR(255) NOT NULL,
    groom_name VARCHAR(255) NOT NULL,
    wedding_date TIMESTAMPTZ NOT NULL,
    venue VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    ceremony_time VARCHAR(10) NOT NULL,
    reception_time VARCHAR(10),
    cover_image VARCHAR(255),
    gallery_images TEXT[],
    story TEXT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    max_guests INTEGER DEFAULT 100,
    is_public BOOLEAN DEFAULT TRUE,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    ceremony_venue VARCHAR(255),
    ceremony_venue_address TEXT,
    reception_venue VARCHAR(255),
    reception_venue_address TEXT,
    admin_secret_link VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wedding Events Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS wedding_events (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10),
    venue VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    dress_code VARCHAR(255),
    is_private BOOLEAN DEFAULT FALSE,
    max_guests INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wedding Guests Table
CREATE TABLE IF NOT EXISTS wedding_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    plus_ones_allowed INTEGER DEFAULT 0,
    rsvp_code VARCHAR(10) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Guest Event Invites Table
CREATE TABLE IF NOT EXISTS guest_event_invites (
    guest_id UUID NOT NULL REFERENCES wedding_guests(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES wedding_events(id) ON DELETE CASCADE,
    PRIMARY KEY (guest_id, event_id)
);

-- 5. Guest RSVPs Table
CREATE TABLE IF NOT EXISTS guest_rsvps (
    id SERIAL PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES wedding_guests(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES wedding_events(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    plus_ones_attending INTEGER DEFAULT 0,
    dietary_restrictions TEXT,
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (guest_id, event_id)
);

-- 6. RSVP Custom Questions Table
CREATE TABLE IF NOT EXISTS rsvp_questions (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'text',
    options TEXT[],
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RSVP Custom Answers Table
CREATE TABLE IF NOT EXISTS rsvp_answers (
    id SERIAL PRIMARY KEY,
    rsvp_id INTEGER NOT NULL REFERENCES guest_rsvps(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES rsvp_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_wedding_events_wedding_id ON wedding_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wedding_guests_wedding_id ON wedding_guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wedding_guests_rsvp_code ON wedding_guests(rsvp_code);
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_guest_id ON guest_rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_event_id ON guest_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_questions_wedding_id ON rsvp_questions(wedding_id);

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

DROP TRIGGER IF EXISTS update_wedding_guests_updated_at ON wedding_guests;
CREATE TRIGGER update_wedding_guests_updated_at 
    BEFORE UPDATE ON wedding_guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Complete RSVP schema created successfully!' AS message;
