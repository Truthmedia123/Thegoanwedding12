-- Sample RSVP Test Data
-- This script creates a sample wedding with events and guests for testing

DO $$
DECLARE
    v_wedding_id INTEGER;
    v_event1_id INTEGER;
    v_event2_id INTEGER;
    v_event3_id INTEGER;
    v_guest1_id UUID;
    v_guest2_id UUID;
    v_guest3_id UUID;
    v_guest4_id UUID;
BEGIN
    -- 1. Create a sample wedding
    INSERT INTO weddings (
        bride_name,
        groom_name,
        wedding_date,
        venue,
        venue_address,
        ceremony_time,
        reception_time,
        slug,
        contact_email,
        is_public
    ) VALUES (
        'Maria',
        'John',
        '2025-12-15 16:00:00+00',
        'Beach Resort Goa',
        'Calangute Beach, North Goa, Goa 403516',
        '16:00',
        '19:00',
        'maria-john-2025',
        'admin@thegoanwedding.com',
        true
    ) RETURNING id INTO v_wedding_id;

    RAISE NOTICE 'Created wedding with ID: %', v_wedding_id;

    -- 2. Create wedding events
    INSERT INTO wedding_events (wedding_id, name, description, date, start_time, end_time, venue, address, order_index) 
    VALUES (v_wedding_id, 'Welcome Brunch', 'Casual brunch to welcome all guests', '2025-12-14 11:00:00+00', '11:00', '14:00', 'Beach Resort Goa - Garden', 'Calangute Beach, North Goa', 0)
    RETURNING id INTO v_event1_id;

    INSERT INTO wedding_events (wedding_id, name, description, date, start_time, end_time, venue, address, order_index) 
    VALUES (v_wedding_id, 'Wedding Ceremony', 'Join us for our wedding ceremony by the beach', '2025-12-15 16:00:00+00', '16:00', '17:30', 'Beach Resort Goa', 'Calangute Beach, North Goa', 1)
    RETURNING id INTO v_event2_id;

    INSERT INTO wedding_events (wedding_id, name, description, date, start_time, end_time, venue, address, order_index) 
    VALUES (v_wedding_id, 'Reception Dinner', 'Celebrate with us at the reception dinner', '2025-12-15 19:00:00+00', '19:00', '23:00', 'Beach Resort Goa - Banquet Hall', 'Calangute Beach, North Goa', 2)
    RETURNING id INTO v_event3_id;

    RAISE NOTICE 'Created 3 events';

    -- 3. Create sample guests with RSVP codes
    INSERT INTO wedding_guests (wedding_id, name, email, phone, plus_ones_allowed, rsvp_code, status) 
    VALUES (v_wedding_id, 'Sarah Johnson', 'sarah@example.com', '+91 98765 43210', 2, 'SARAH123', 'Pending')
    RETURNING id INTO v_guest1_id;

    INSERT INTO wedding_guests (wedding_id, name, email, phone, plus_ones_allowed, rsvp_code, status) 
    VALUES (v_wedding_id, 'Michael Smith', 'michael@example.com', '+91 98765 43211', 1, 'MIKE456', 'Pending')
    RETURNING id INTO v_guest2_id;

    INSERT INTO wedding_guests (wedding_id, name, email, phone, plus_ones_allowed, rsvp_code, status) 
    VALUES (v_wedding_id, 'Emily Davis', 'emily@example.com', '+91 98765 43212', 0, 'EMILY789', 'Pending')
    RETURNING id INTO v_guest3_id;

    INSERT INTO wedding_guests (wedding_id, name, email, phone, plus_ones_allowed, rsvp_code, status) 
    VALUES (v_wedding_id, 'David Wilson', 'david@example.com', '+91 98765 43213', 3, 'DAVID999', 'Pending')
    RETURNING id INTO v_guest4_id;

    RAISE NOTICE 'Created 4 guests';

    -- 4. Invite all guests to all events
    INSERT INTO guest_event_invites (guest_id, event_id) VALUES
    (v_guest1_id, v_event1_id), (v_guest1_id, v_event2_id), (v_guest1_id, v_event3_id),
    (v_guest2_id, v_event1_id), (v_guest2_id, v_event2_id), (v_guest2_id, v_event3_id),
    (v_guest3_id, v_event2_id), (v_guest3_id, v_event3_id),
    (v_guest4_id, v_event1_id), (v_guest4_id, v_event2_id), (v_guest4_id, v_event3_id);

    RAISE NOTICE 'Created event invitations';
    RAISE NOTICE '✅ Test data created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Use these RSVP codes to test:';
    RAISE NOTICE '   - SARAH123 (Sarah Johnson - 2 plus ones, all events)';
    RAISE NOTICE '   - MIKE456 (Michael Smith - 1 plus one, all events)';
    RAISE NOTICE '   - EMILY789 (Emily Davis - no plus ones, ceremony & reception only)';
    RAISE NOTICE '   - DAVID999 (David Wilson - 3 plus ones, all events)';
    RAISE NOTICE '';
    RAISE NOTICE '🌐 Test at: https://thegoanwedding12.pages.dev/rsvp';
END $$;

-- Display the created data
SELECT 'Test RSVP Codes:' AS info;
SELECT name, rsvp_code, email, plus_ones_allowed FROM wedding_guests ORDER BY name;