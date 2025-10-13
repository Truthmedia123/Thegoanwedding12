# Supabase Database Setup Instructions

## Current Status
✅ Supabase credentials are configured in `.env.local`
- URL: https://tugciyungdydnwsqzwok.supabase.co
- Anon Key: Configured

❌ Database tables need to be created

## Setup Steps

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Select your project: `tugciyungdydnwsqzwok`

### Step 2: Create Database Tables
1. In the Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** to execute the SQL

Alternatively, you can run this command if you have Supabase CLI installed:
```bash
supabase db push
```

### Step 3: Verify Tables Created
In the SQL Editor, run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- categories
- vendors
- reviews
- blog_posts
- business_submissions
- invitations
- profiles
- vendor_analytics
- site_settings

### Step 4: Seed the Database
Once tables are created, run the seed script:
```bash
node scripts/seed-supabase.js
```

This will populate your database with:
- 8 sample vendors across different categories
- 8 vendor categories
- Sample data for testing

### Step 5: Verify Data
Check if vendors were inserted:
```sql
SELECT name, category, location FROM vendors;
```

## Quick SQL Setup (Copy & Paste)

If you want to quickly set up everything, copy and paste this into Supabase SQL Editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    color VARCHAR(7),
    vendor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    location VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    whatsapp VARCHAR(20),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    facebook VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    embed_code TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    featured_image VARCHAR(255),
    images TEXT[],
    services TEXT[],
    price_range VARCHAR(50),
    availability TEXT,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON vendors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON reviews FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(location);
CREATE INDEX IF NOT EXISTS idx_vendors_featured ON vendors(featured);
CREATE INDEX IF NOT EXISTS idx_vendors_verified ON vendors(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON reviews(vendor_id);
```

## Troubleshooting

### Issue: "Could not find the table 'public.vendors'"
**Solution:** Tables haven't been created yet. Follow Step 2 above.

### Issue: "Permission denied"
**Solution:** Make sure you're using the correct Supabase credentials and the anon key has proper permissions.

### Issue: "Connection refused"
**Solution:** Check if your Supabase project is active and the URL is correct.

## Next Steps After Setup

1. ✅ Tables created
2. ✅ Data seeded
3. 🚀 Restart the development server: `npm run dev`
4. 🌐 Access the application: http://localhost:5001
5. 📊 View vendors in the app

## Admin Setup

To set up an admin user, run:
```bash
node scripts/setup-admin.js
```

This will create an admin account with:
- Email: admin@thegoanwedding.com
- Password: (you'll set this during setup)

## Additional Resources

- Supabase Documentation: https://supabase.com/docs
- SQL Schema File: `supabase-schema.sql`
- Seed Script: `scripts/seed-supabase.js`
