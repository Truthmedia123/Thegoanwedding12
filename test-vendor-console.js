/**
 * Vendor Operations Browser Console Test
 * 
 * Copy and paste this entire script into your browser console
 * while on the admin vendors page to test vendor operations.
 * 
 * This will help identify issues with add/delete functionality.
 */

(async function testVendorOperations() {
  console.log('%c🧪 Vendor Operations Test Suite', 'font-size: 16px; font-weight: bold; color: #4CAF50;');
  console.log('');
  
  // Get Supabase client from window (if available)
  const supabase = window.supabase || (await import('/src/lib/supabase.ts')).supabase;
  const isConfigured = window.isSupabaseConfigured || (await import('/src/lib/supabase.ts')).isSupabaseConfigured;
  
  if (!supabase) {
    console.error('❌ Supabase client not found');
    console.log('   Make sure you\'re on a page that loads Supabase');
    return;
  }
  
  console.log('1️⃣ Configuration Check');
  console.log('   Supabase configured:', isConfigured ? '✅ Yes' : '❌ No');
  
  if (!isConfigured) {
    console.log('   Using localStorage fallback mode');
    console.log('   Skipping Supabase tests\n');
    return;
  }
  
  console.log('');
  
  // Test 2: Authentication
  console.log('2️⃣ Authentication Check');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('   ❌ Session error:', sessionError.message);
    return;
  }
  
  if (!session) {
    console.error('   ❌ Not authenticated');
    console.log('   Please log in to the admin dashboard first');
    return;
  }
  
  console.log('   ✅ Authenticated');
  console.log('   User:', session.user.email);
  console.log('   User ID:', session.user.id);
  console.log('');
  
  // Test 3: Profile Check
  console.log('3️⃣ Profile & Role Check');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (profileError) {
    console.error('   ❌ Profile error:', profileError.message);
    console.log('   You may need to create a profile record');
    console.log('   Run this SQL in Supabase:');
    console.log('   INSERT INTO profiles (id, email, role)');
    console.log('   VALUES (\'' + session.user.id + '\', \'' + session.user.email + '\', \'admin\');');
  } else {
    console.log('   ✅ Profile found');
    console.log('   Role:', profile.role);
    if (profile.role !== 'admin') {
      console.warn('   ⚠️  Role is not "admin" - operations may fail');
    }
  }
  console.log('');
  
  // Test 4: Read Vendors
  console.log('4️⃣ Read Vendors Test');
  const { data: vendors, error: readError, count } = await supabase
    .from('vendors')
    .select('*', { count: 'exact' })
    .limit(3);
  
  if (readError) {
    console.error('   ❌ Read failed:', readError.message);
    console.log('   Code:', readError.code);
    console.log('   Details:', readError.details);
    console.log('   Hint:', readError.hint);
    console.log('');
    console.log('   This is likely an RLS policy issue.');
    console.log('   Run SIMPLE_FIX_VENDORS.sql in Supabase');
  } else {
    console.log('   ✅ Read successful');
    console.log('   Total vendors:', count);
    console.log('   Sample:', vendors);
  }
  console.log('');
  
  // Test 5: Create Vendor
  console.log('5️⃣ Create Vendor Test');
  const testVendor = {
    name: 'Test Vendor ' + Date.now(),
    category: 'Test',
    location: 'Test Location',
    description: 'Created by debug script',
  };
  
  const { data: newVendor, error: createError } = await supabase
    .from('vendors')
    .insert([testVendor])
    .select()
    .single();
  
  if (createError) {
    console.error('   ❌ Create failed:', createError.message);
    console.log('   Code:', createError.code);
    console.log('   Details:', createError.details);
    console.log('   Hint:', createError.hint);
    console.log('');
    console.log('   This is likely an RLS policy issue.');
    console.log('   Run SIMPLE_FIX_VENDORS.sql in Supabase');
  } else {
    console.log('   ✅ Create successful');
    console.log('   Created vendor:', newVendor);
    console.log('   ID:', newVendor.id);
    
    // Test 6: Update Vendor
    console.log('');
    console.log('6️⃣ Update Vendor Test');
    const { data: updatedVendor, error: updateError } = await supabase
      .from('vendors')
      .update({ description: 'Updated by debug script' })
      .eq('id', newVendor.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('   ❌ Update failed:', updateError.message);
      console.log('   Code:', updateError.code);
    } else {
      console.log('   ✅ Update successful');
    }
    
    // Test 7: Delete Vendor
    console.log('');
    console.log('7️⃣ Delete Vendor Test');
    const { data: deletedVendor, error: deleteError } = await supabase
      .from('vendors')
      .delete()
      .eq('id', newVendor.id)
      .select();
    
    if (deleteError) {
      console.error('   ❌ Delete failed:', deleteError.message);
      console.log('   Code:', deleteError.code);
      console.log('   Details:', deleteError.details);
      console.log('');
      console.log('   This is likely an RLS policy issue.');
      console.log('   Run SIMPLE_FIX_VENDORS.sql in Supabase');
    } else {
      console.log('   ✅ Delete successful');
      console.log('   Deleted:', deletedVendor);
    }
  }
  
  console.log('');
  console.log('%c✨ Test Complete', 'font-size: 14px; font-weight: bold; color: #2196F3;');
  console.log('');
  console.log('📄 For detailed analysis, see: VENDOR_DEBUG_REPORT.md');
  console.log('');
})();
