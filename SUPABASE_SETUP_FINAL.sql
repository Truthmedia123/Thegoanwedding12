CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_analytics (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'contact_click', 'gallery_open', 'review_submit', 'invitation_send')),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

Generate proper Supabase SQL migrations for the admin control panel. 
Do not include plain English text in the SQL — only valid SQL statements with `--` comments.

Tasks:

1. Profiles Table
   - Create `profiles` table linked to `auth.users.id`.
   - Columns: id (uuid, PK, references auth.users), role (text, default 'user'), full_name, avatar_url, created_at.
   - Add trigger to auto‑insert a profile row when a new user is created.
   - Enable RLS with policies:
     - Public read access.
     - Only admins can update roles.

2. Blogs Table
   - Create `blogs` table with: id (uuid, PK), title, slug (unique), content (text), author_id (uuid references profiles), tags (text[]), status (draft/published), created_at, updated_at.
   - Enable RLS with policies:
     - Public can read only published posts.
     - Admins can insert/update/delete.

3. Vendor Analytics Table
   - Create `vendor_analytics` table with: id (uuid, PK), vendor_id (uuid references vendors), event_type (text), user_id (uuid nullable references profiles), created_at (timestamp).
   - Index on (vendor_id, event_type, created_at).
   - Enable RLS with policies:
     - Public can insert events.
     - Admins can read all.

4. Settings Table
   - Create `settings` table with: id (uuid, PK), key (text unique), value (jsonb), updated_at.
   - Enable RLS with policies:
     - Admins can read/write.
     - Public no access.

5. Audit Logs (optional but recommended)
   - Create `audit_logs` table with: id (uuid, PK), admin_user_id (uuid references profiles), action (text), table_name (text), record_id (uuid), diff_json (jsonb), created_at.
   - Enable RLS: only admins can read/write.

Output:
- A single SQL file with all `create table`, `alter table`, `create policy`, and `create trigger` statements.
- Use `--` comments for section headers.
- Ensure syntax is valid PostgreSQL.
