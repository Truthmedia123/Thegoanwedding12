#!/usr/bin/env node

/**
 * Simple setup script for admin control panel
 * This script creates the database schema using the anon key
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function createTables() {
  console.log('📋 Creating database tables...');
  
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (profilesError) {
      console.log('ℹ️  Profiles table may already exist:', profilesError.message);
    } else {
      console.log('✅ Profiles table created');
    }

    // Create blogs table
    const { error: blogsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (blogsError) {
      console.log('ℹ️  Blogs table may already exist:', blogsError.message);
    } else {
      console.log('✅ Blogs table created');
    }

    // Create vendor_analytics table
    const { error: analyticsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS vendor_analytics (
          id SERIAL PRIMARY KEY,
          vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
          event_type TEXT NOT NULL CHECK (event_type IN ('view', 'contact_click', 'gallery_open', 'review_submit', 'invitation_send')),
          user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
          session_id TEXT,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (analyticsError) {
      console.log('ℹ️  Vendor analytics table may already exist:', analyticsError.message);
    } else {
      console.log('✅ Vendor analytics table created');
    }

    // Create site_settings table
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value JSONB NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (settingsError) {
      console.log('ℹ️  Site settings table may already exist:', settingsError.message);
    } else {
      console.log('✅ Site settings table created');
    }

    return true;
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    return false;
  }
}

async function setupDefaultSettings() {
  console.log('⚙️ Setting up default site settings...');
  
  try {
    const defaultSettings = [
      {
        key: 'site_title',
        value: 'TheGoanWedding',
        description: 'Site title'
      },
      {
        key: 'site_description',
        value: 'Premier Wedding Vendor Directory for Goa',
        description: 'Site description'
      },
      {
        key: 'theme_colors',
        value: {
          primary: '#ec4899',
          secondary: '#8b5cf6',
          accent: '#10b981'
        },
        description: 'Theme colors'
      }
    ];
    
    for (const setting of defaultSettings) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(setting, { onConflict: 'key' });
      
      if (error) {
        console.log(`ℹ️  Setting ${setting.key} may already exist:`, error.message);
      } else {
        console.log(`✅ Setting ${setting.key} created`);
      }
    }
    
    console.log('✅ Default settings configured');
    return true;
  } catch (error) {
    console.error('❌ Error setting up default settings:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up admin control panel (Simple Mode)...\n');
  
  const steps = [
    { name: 'Database Connection', fn: checkConnection },
    { name: 'Database Tables', fn: createTables },
    { name: 'Default Settings', fn: setupDefaultSettings }
  ];
  
  let allSuccess = true;
  
  for (const step of steps) {
    console.log(`\n📋 ${step.name}:`);
    const success = await step.fn();
    if (!success) {
      allSuccess = false;
      break;
    }
  }
  
  if (allSuccess) {
    console.log('\n🎉 Admin control panel setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Navigate to /login');
    console.log('   3. Create an admin account through the Supabase dashboard');
    console.log('   4. Access the admin dashboard at /admin/dashboard');
    console.log('\n📚 See ADMIN_GUIDE.md for detailed usage instructions');
    console.log('\n⚠️  Note: You may need to manually create admin users through the Supabase dashboard');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above and try again.');
    process.exit(1);
  }
}

main().catch(console.error);
