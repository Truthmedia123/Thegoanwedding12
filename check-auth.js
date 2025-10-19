/**
 * Quick Authentication Check
 * 
 * Copy and paste this into your browser console to check your auth status
 */

(async function checkAuth() {
  console.log('%c🔐 Authentication Check', 'font-size: 16px; font-weight: bold; color: #2196F3;');
  console.log('');
  
  try {
    // Get Supabase client
    const { supabase } = await import('/src/lib/supabase.ts');
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
      return;
    }
    
    if (!session) {
      console.error('❌ NOT AUTHENTICATED');
      console.log('');
      console.log('📋 To fix this:');
      console.log('   1. Navigate to /admin or /login');
      console.log('   2. Sign in with your admin credentials');
      console.log('   3. Return to /admin/vendors');
      console.log('   4. Try uploading CSV again');
      console.log('');
      return;
    }
    
    console.log('✅ AUTHENTICATED');
    console.log('   Email:', session.user.email);
    console.log('   User ID:', session.user.id);
    console.log('');
    
    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.warn('⚠️ Profile not found');
      console.log('   Error:', profileError.message);
      console.log('');
      console.log('📋 To fix this, run in Supabase SQL Editor:');
      console.log('   INSERT INTO profiles (id, email, role, created_at, updated_at)');
      console.log('   VALUES (');
      console.log('     \'' + session.user.id + '\',');
      console.log('     \'' + session.user.email + '\',');
      console.log('     \'admin\',');
      console.log('     NOW(),');
      console.log('     NOW()');
      console.log('   )');
      console.log('   ON CONFLICT (id) DO UPDATE SET role = \'admin\';');
      console.log('');
    } else {
      console.log('✅ Profile found');
      console.log('   Role:', profile.role);
      
      if (profile.role !== 'admin') {
        console.warn('⚠️ Role is not "admin"');
        console.log('');
        console.log('📋 To fix this, run in Supabase SQL Editor:');
        console.log('   UPDATE profiles SET role = \'admin\' WHERE id = \'' + session.user.id + '\';');
        console.log('');
      } else {
        console.log('');
        console.log('🎉 Everything looks good!');
        console.log('   You should be able to upload CSV files.');
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
})();
