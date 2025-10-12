# Supabase Migrations Guide

This guide explains how to set up and manage the Supabase database for TheGoanWedding platform.

## Overview

TheGoanWedding platform uses Supabase PostgreSQL database with the following main tables:
- `vendors` - Wedding vendor listings
- `categories` - Vendor categories
- `reviews` - Customer reviews and ratings
- `invitations` - Wedding invitations and RSVP management
- `blog_posts` - Blog content
- `business_submissions` - Business listing submissions
- `contacts` - Contact form submissions
- `weddings` - Wedding event details
- `wedding_events` - Individual wedding events

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `thegoanwedding`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### 2. Get Project Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon public key (starts with `eyJ...`)

### 3. Set Environment Variables

Create a `.env.local` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=your-clarity-project-id
```

## Database Schema

### Run Initial Migration

1. Go to the SQL Editor in Supabase Dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script

This will create:
- All required tables with proper relationships
- Indexes for performance optimization
- Triggers for automatic timestamp updates
- Sample category data

### Schema Features

#### Full-Text Search
- Uses PostgreSQL's built-in text search with trigram indexes
- Searchable fields: vendor names, descriptions, services
- Supports partial matches and ranking

#### Automatic Triggers
- `updated_at` timestamps updated automatically
- Vendor rating and review count calculated automatically
- Category vendor counts updated automatically

#### Data Types
- Arrays for images, services, tags
- JSON fields for flexible data storage
- Proper foreign key relationships

## CLI Commands

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

### Link Project

```bash
supabase link --project-ref your-project-ref
```

### Generate Types

```bash
supabase gen types typescript --project-id your-project-id > client/src/lib/supabase-types.ts
```

### Run Migrations

```bash
supabase db push
```

### Reset Database

```bash
supabase db reset
```

## Development Workflow

### 1. Local Development

1. Start Supabase locally:
```bash
supabase start
```

2. Update your `.env.local` to use local URLs:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

### 2. Schema Changes

1. Make changes to `supabase-schema.sql`
2. Create a new migration:
```bash
supabase migration new your_migration_name
```

3. Apply the migration:
```bash
supabase db push
```

### 3. Data Seeding

Create seed data using the Supabase dashboard or programmatically:

```typescript
import { supabase } from './lib/supabase'

// Insert sample vendors
const { data, error } = await supabase
  .from('vendors')
  .insert([
    {
      name: 'Sample Photographer',
      category: 'Photographers',
      description: 'Professional wedding photography',
      location: 'Panaji',
      rating: 4.5
    }
  ])
```

## Production Deployment

### 1. Environment Variables

Set the following in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_TRACKING_ID`
- `VITE_CLARITY_PROJECT_ID`

### 2. Database Backup

Enable automatic backups in Supabase dashboard:
1. Go to Settings > Database
2. Enable "Point in time recovery"
3. Set backup retention period

### 3. Performance Optimization

- Monitor query performance in Supabase dashboard
- Add indexes for frequently queried fields
- Use database functions for complex operations
- Implement connection pooling for high traffic

## Security

### Row Level Security (RLS)

Enable RLS policies for data protection:

```sql
-- Enable RLS on vendors table
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON vendors
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated insert" ON vendors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### API Keys

- Use the anon key for public operations
- Create service role key for admin operations
- Never expose service role key in client-side code

## Monitoring

### Database Metrics

Monitor in Supabase dashboard:
- Query performance
- Connection usage
- Storage usage
- API requests

### Error Handling

```typescript
const { data, error } = await supabase
  .from('vendors')
  .select('*')

if (error) {
  console.error('Database error:', error)
  // Handle error appropriately
}
```

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check environment variables
   - Verify project URL and keys
   - Check network connectivity

2. **Permission Errors**
   - Verify RLS policies
   - Check user authentication
   - Ensure proper API key usage

3. **Performance Issues**
   - Add database indexes
   - Optimize queries
   - Use connection pooling

### Getting Help

- Supabase Documentation: https://supabase.com/docs
- Community Forum: https://github.com/supabase/supabase/discussions
- Discord: https://discord.supabase.com
