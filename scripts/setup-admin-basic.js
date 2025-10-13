#!/usr/bin/env node

/**
 * Basic setup script for admin control panel
 * This script sets up the basic database structure
 */

import { createClient } from '@supabase/supabase-js';

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
    // Simple connection test
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
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
      },
      {
        key: 'logo_url',
        value: '',
        description: 'Site logo URL'
      },
      {
        key: 'favicon_url',
        value: '',
        description: 'Favicon URL'
      },
      {
        key: 'ga_tracking_id',
        value: 'G-YBTQGR4T4Y',
        description: 'Google Analytics tracking ID'
      },
      {
        key: 'clarity_project_id',
        value: 'tnghvs6g11',
        description: 'Microsoft Clarity project ID'
      }
    ];
    
    for (const setting of defaultSettings) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(setting, { onConflict: 'key' });
      
      if (error) {
        console.log(`ℹ️  Setting ${setting.key}: ${error.message}`);
      } else {
        console.log(`✅ Setting ${setting.key} configured`);
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
  console.log('🚀 Setting up admin control panel (Basic Mode)...\n');
  
  const steps = [
    { name: 'Database Connection', fn: checkConnection },
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
    console.log('   3. Create an admin account through the Supabase dashboard:');
    console.log('      - Go to https://tugciyungdydnwsqzwok.supabase.co');
    console.log('      - Navigate to Authentication > Users');
    console.log('      - Create a new user with email/password');
    console.log('      - Update the user role to "admin" in the profiles table');
    console.log('   4. Access the admin dashboard at /admin/dashboard');
    console.log('\n📚 See ADMIN_GUIDE.md for detailed usage instructions');
    console.log('\n⚠️  Note: You need to manually create the database tables through the Supabase SQL editor');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above and try again.');
    process.exit(1);
  }
}

main().catch(console.error);
