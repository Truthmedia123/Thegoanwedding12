-- This script sets up the new database schema for the RSVP tool.

-- 1. Wedding Guests Table
-- Manages the master guest list for a wedding.
CREATE TABLE IF NOT EXISTS wedding_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    plus_ones_allowed INTEGER DEFAULT 0,
    rsvp_code VARCHAR(10) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., Pending, Responded
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Guest Event Invites Table
-- Tracks which events each guest is invited to.
CREATE TABLE IF NOT EXISTS guest_event_invites (
    guest_id UUID NOT NULL REFERENCES wedding_guests(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES wedding_events(id) ON DELETE CASCADE,
    PRIMARY KEY (guest_id, event_id)
);

-- 3. Guest RSVPs Table
-- Stores the RSVP responses from guests.
CREATE TABLE IF NOT EXISTS guest_rsvps (
    id SERIAL PRIMARY KEY,
    guest_id UUID NOT NULL REFERENCES wedding_guests(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES wedding_events(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- e.g., 'Attending', 'Not Attending'
    plus_ones_attending INTEGER DEFAULT 0,
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (guest_id, event_id)
);

-- 4. RSVP Custom Questions Table
-- Allows admins to add custom questions to the RSVP form.
CREATE TABLE IF NOT EXISTS rsvp_questions (
    id SERIAL PRIMARY KEY,
    wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'text', -- e.g., 'text', 'multiple_choice'
    options TEXT[], -- For multiple choice questions
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- 5. RSVP Custom Answers Table
-- Stores guest answers to the custom questions.
CREATE TABLE IF NOT EXISTS rsvp_answers (
    id SERIAL PRIMARY KEY,
    rsvp_id INTEGER NOT NULL REFERENCES guest_rsvps(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES rsvp_questions(id) ON DELETE CASCADE,
    answer_text TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wedding_guests_wedding_id ON wedding_guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_wedding_guests_rsvp_code ON wedding_guests(rsvp_code);
CREATE INDEX IF NOT EXISTS idx_guest_rsvps_guest_id ON guest_rsvps(guest_id);

-- Success message
SELECT 'New RSVP schema created successfully.';