-- This script removes the invitations table and all related database objects.

-- Drop the trigger associated with the invitations table
DROP TRIGGER IF EXISTS update_invitations_updated_at ON invitations;

-- Drop indexes on the invitations table
DROP INDEX IF EXISTS idx_invitations_wedding_id;
DROP INDEX IF EXISTS idx_invitations_rsvp_status;

-- Drop the invitations table itself
DROP TABLE IF EXISTS invitations;

-- Success message
SELECT 'Invitations table and related objects removed successfully.';
