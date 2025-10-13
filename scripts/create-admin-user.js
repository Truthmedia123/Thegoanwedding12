import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('🔐 Creating admin user in Supabase...\n');

  const email = 'admin@thegoanwedding.com';
  const password = 'admin123';

  try {
    // Sign up the admin user
    console.log('📝 Signing up admin user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('ℹ️  User already exists. Attempting to sign in...');
        
        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (signInError) {
          console.error('❌ Sign in error:', signInError.message);
          console.log('\n💡 If you forgot the password, you need to:');
          console.log('1. Go to Supabase Dashboard → Authentication → Users');
          console.log('2. Find the user and delete it');
          console.log('3. Run this script again');
          process.exit(1);
        }

        console.log('✅ Admin user signed in successfully!');
        console.log('User ID:', signInData.user?.id);
        
        // Update profile to ensure admin role
        if (signInData.user) {
          await updateUserProfile(signInData.user.id);
        }
        
      } else {
        console.error('❌ Sign up error:', signUpError.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('User ID:', signUpData.user?.id);
      
      if (signUpData.user) {
        await updateUserProfile(signUpData.user.id);
      }
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🌐 Login URLs:');
    console.log('   Production: https://thegoanwedding12.pages.dev/login');
    console.log('   Local: http://localhost:5001/login');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

async function updateUserProfile(userId) {
  try {
    console.log('👤 Creating/updating user profile...');
    
    // Insert or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: 'admin@thegoanwedding.com',
        full_name: 'Admin User',
        role: 'admin'
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.warn('⚠️  Profile update warning:', profileError.message);
      console.log('   This is OK if the profiles table doesn\'t exist yet');
    } else {
      console.log('✅ Profile updated with admin role');
    }
  } catch (error) {
    console.warn('⚠️  Could not update profile:', error.message);
  }
}

// Run the function
createAdminUser();
