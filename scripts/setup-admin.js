#!/usr/bin/env node

/**
 * Setup script for admin control panel
 * This script sets up the database schema and creates the default admin user
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase-migrations', '001_auth_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }
    
    console.log('✅ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    return false;
  }
}

async function createDefaultAdmin() {
  console.log('👤 Creating default admin user...');
  
  try {
    // Check if admin user already exists
    const { data: existingAdmin } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@thegoanwedding.com')
      .single();
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return true;
    }
    
    // Create admin user in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@thegoanwedding.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User'
      }
    });
    
    if (authError) {
      console.error('❌ Failed to create auth user:', authError);
      return false;
    }
    
    // Create profile for admin user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: 'admin@thegoanwedding.com',
        full_name: 'Admin User',
        role: 'admin'
      });
    
    if (profileError) {
      console.error('❌ Failed to create admin profile:', profileError);
      return false;
    }
    
    console.log('✅ Default admin user created successfully');
    console.log('   Email: admin@thegoanwedding.com');
    console.log('   Password: admin123');
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
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
        value: '',
        description: 'Google Analytics tracking ID'
      },
      {
        key: 'clarity_project_id',
        value: '',
        description: 'Microsoft Clarity project ID'
      }
    ];
    
    for (const setting of defaultSettings) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(setting, { onConflict: 'key' });
      
      if (error) {
        console.error(`❌ Failed to create setting ${setting.key}:`, error);
        return false;
      }
    }
    
    console.log('✅ Default settings created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error setting up default settings:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up admin control panel...\n');
  
  const steps = [
    { name: 'Database Migrations', fn: runMigrations },
    { name: 'Default Admin User', fn: createDefaultAdmin },
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
    console.log('   3. Use admin@thegoanwedding.com / admin123');
    console.log('   4. Access the admin dashboard at /admin/dashboard');
    console.log('\n📚 See ADMIN_GUIDE.md for detailed usage instructions');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above and try again.');
    process.exit(1);
  }
}

main().catch(console.error);
