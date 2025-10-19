/**
 * Vendor Operations Test Script
 * 
 * This script tests the vendor add/update/delete operations
 * to identify any issues with the admin dashboard functionality.
 * 
 * Usage:
 * 1. Make sure you're logged in as an admin user
 * 2. Open browser console on the admin vendors page
 * 3. Copy and paste this script into the console
 * 4. Review the output for any errors
 */

import { supabase, isSupabaseConfigured } from './client/src/lib/supabase';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  error?: any;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('🧪 Starting Vendor Operations Test Suite...\n');
  
  // Test 1: Configuration Check
  console.log('📋 Test 1: Configuration Check');
  if (!isSupabaseConfigured) {
    results.push({
      test: 'Configuration',
      status: 'skip',
      message: 'Supabase not configured. Using localStorage fallback.',
    });
    console.warn('⚠️  Supabase not configured');
    console.log('   Using localStorage fallback mode\n');
  } else {
    results.push({
      test: 'Configuration',
      status: 'pass',
      message: 'Supabase is configured',
    });
    console.log('✅ Supabase is configured\n');
  }
  
  if (!isSupabaseConfigured) {
    console.log('⏭️  Skipping Supabase tests (not configured)\n');
    printResults();
    return;
  }
  
  // Test 2: Authentication Check
  console.log('📋 Test 2: Authentication Check');
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw sessionError;
    }
    
    if (!session) {
      results.push({
        test: 'Authentication',
        status: 'fail',
        message: 'No active session. Please log in.',
      });
      console.error('❌ Not authenticated');
      console.log('   Please log in to continue\n');
      printResults();
      return;
    }
    
    results.push({
      test: 'Authentication',
      status: 'pass',
      message: `Authenticated as ${session.user.email}`,
    });
    console.log('✅ Authenticated');
    console.log(`   User: ${session.user.email}`);
    console.log(`   User ID: ${session.user.id}\n`);
    
    // Test 3: Profile Check
    console.log('📋 Test 3: Profile & Role Check');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      results.push({
        test: 'Profile',
        status: 'fail',
        message: `Profile not found: ${profileError.message}`,
        error: profileError,
      });
      console.error('❌ Profile not found');
      console.error('   Error:', profileError.message);
      console.log('   You may need to create a profile record\n');
    } else {
      results.push({
        test: 'Profile',
        status: 'pass',
        message: `Profile found with role: ${profile.role}`,
      });
      console.log('✅ Profile found');
      console.log(`   Role: ${profile.role}`);
      console.log(`   Email: ${profile.email}\n`);
      
      if (profile.role !== 'admin') {
        console.warn('⚠️  User role is not "admin"');
        console.log('   Some operations may be restricted\n');
      }
    }
  } catch (error: any) {
    results.push({
      test: 'Authentication',
      status: 'fail',
      message: error.message,
      error,
    });
    console.error('❌ Authentication error:', error.message, '\n');
    printResults();
    return;
  }
  
  // Test 4: Read Vendors
  console.log('📋 Test 4: Read Vendors');
  try {
    const { data: vendors, error: readError, count } = await supabase
      .from('vendors')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (readError) {
      throw readError;
    }
    
    results.push({
      test: 'Read Vendors',
      status: 'pass',
      message: `Successfully fetched ${count} vendors`,
    });
    console.log('✅ Read vendors successful');
    console.log(`   Total vendors: ${count}`);
    console.log(`   Sample (first 5):`, vendors);
    console.log('');
  } catch (error: any) {
    results.push({
      test: 'Read Vendors',
      status: 'fail',
      message: error.message,
      error,
    });
    console.error('❌ Read vendors failed');
    console.error('   Error:', error.message);
    console.error('   Details:', error);
    console.log('   This might be an RLS policy issue\n');
  }
  
  // Test 5: Create Vendor
  console.log('📋 Test 5: Create Vendor');
  let createdVendorId: number | null = null;
  
  try {
    const testVendor = {
      name: `Test Vendor ${Date.now()}`,
      category: 'Test Category',
      location: 'Test Location',
      description: 'This is a test vendor created by the debug script',
      phone: '1234567890',
      email: 'test@example.com',
    };
    
    const { data: newVendor, error: createError } = await supabase
      .from('vendors')
      .insert([testVendor])
      .select()
      .single();
    
    if (createError) {
      throw createError;
    }
    
    createdVendorId = newVendor.id;
    
    results.push({
      test: 'Create Vendor',
      status: 'pass',
      message: `Successfully created vendor with ID: ${newVendor.id}`,
    });
    console.log('✅ Create vendor successful');
    console.log(`   Created vendor ID: ${newVendor.id}`);
    console.log(`   Name: ${newVendor.name}`);
    console.log('');
  } catch (error: any) {
    results.push({
      test: 'Create Vendor',
      status: 'fail',
      message: error.message,
      error,
    });
    console.error('❌ Create vendor failed');
    console.error('   Error:', error.message);
    console.error('   Details:', error);
    console.log('   Check RLS policies for INSERT permission\n');
  }
  
  // Test 6: Update Vendor
  if (createdVendorId) {
    console.log('📋 Test 6: Update Vendor');
    try {
      const updates = {
        description: 'Updated description - ' + new Date().toISOString(),
        location: 'Updated Location',
      };
      
      const { data: updatedVendor, error: updateError } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', createdVendorId)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      results.push({
        test: 'Update Vendor',
        status: 'pass',
        message: `Successfully updated vendor ID: ${createdVendorId}`,
      });
      console.log('✅ Update vendor successful');
      console.log(`   Updated vendor ID: ${createdVendorId}`);
      console.log(`   New location: ${updatedVendor.location}`);
      console.log('');
    } catch (error: any) {
      results.push({
        test: 'Update Vendor',
        status: 'fail',
        message: error.message,
        error,
      });
      console.error('❌ Update vendor failed');
      console.error('   Error:', error.message);
      console.error('   Details:', error);
      console.log('   Check RLS policies for UPDATE permission\n');
    }
  } else {
    console.log('⏭️  Skipping update test (no vendor created)\n');
  }
  
  // Test 7: Delete Vendor
  if (createdVendorId) {
    console.log('📋 Test 7: Delete Vendor');
    try {
      const { data: deletedVendor, error: deleteError } = await supabase
        .from('vendors')
        .delete()
        .eq('id', createdVendorId)
        .select();
      
      if (deleteError) {
        throw deleteError;
      }
      
      if (!deletedVendor || deletedVendor.length === 0) {
        throw new Error('No vendor was deleted (vendor not found)');
      }
      
      results.push({
        test: 'Delete Vendor',
        status: 'pass',
        message: `Successfully deleted vendor ID: ${createdVendorId}`,
      });
      console.log('✅ Delete vendor successful');
      console.log(`   Deleted vendor ID: ${createdVendorId}`);
      console.log('');
    } catch (error: any) {
      results.push({
        test: 'Delete Vendor',
        status: 'fail',
        message: error.message,
        error,
      });
      console.error('❌ Delete vendor failed');
      console.error('   Error:', error.message);
      console.error('   Details:', error);
      console.log('   Check RLS policies for DELETE permission\n');
    }
  } else {
    console.log('⏭️  Skipping delete test (no vendor created)\n');
  }
  
  // Test 8: Check RLS Policies
  console.log('📋 Test 8: Check RLS Policies');
  try {
    const { data: policies, error: policyError } = await supabase
      .rpc('get_vendor_policies');
    
    if (policyError) {
      // This RPC might not exist, that's okay
      console.log('ℹ️  Cannot check RLS policies (RPC not available)');
      console.log('   You can check manually in Supabase dashboard\n');
    } else {
      console.log('✅ RLS Policies:', policies);
      console.log('');
    }
  } catch (error) {
    // Ignore this error
    console.log('ℹ️  Cannot check RLS policies programmatically\n');
  }
  
  // Print final results
  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⏭️';
    console.log(`${icon} ${result.test}: ${result.message}`);
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
  console.log('-'.repeat(60) + '\n');
  
  if (failed > 0) {
    console.log('🔧 RECOMMENDED ACTIONS:\n');
    
    const failedTests = results.filter(r => r.status === 'fail');
    
    if (failedTests.some(t => t.test === 'Authentication')) {
      console.log('1. Log in to the admin dashboard');
      console.log('   Navigate to /admin and sign in\n');
    }
    
    if (failedTests.some(t => t.test === 'Profile')) {
      console.log('2. Create admin profile in Supabase');
      console.log('   Run this SQL in Supabase SQL Editor:');
      console.log('   ```sql');
      console.log('   INSERT INTO profiles (id, email, role)');
      console.log('   VALUES (auth.uid(), auth.email(), \'admin\');');
      console.log('   ```\n');
    }
    
    if (failedTests.some(t => ['Read Vendors', 'Create Vendor', 'Update Vendor', 'Delete Vendor'].includes(t.test))) {
      console.log('3. Fix RLS policies in Supabase');
      console.log('   Run the SIMPLE_FIX_VENDORS.sql file');
      console.log('   Or run this SQL:');
      console.log('   ```sql');
      console.log('   DROP POLICY IF EXISTS "Admins can manage vendors" ON vendors;');
      console.log('   ');
      console.log('   CREATE POLICY "Authenticated users can read vendors"');
      console.log('   ON vendors FOR SELECT TO authenticated USING (true);');
      console.log('   ');
      console.log('   CREATE POLICY "Authenticated users can insert vendors"');
      console.log('   ON vendors FOR INSERT TO authenticated WITH CHECK (true);');
      console.log('   ');
      console.log('   CREATE POLICY "Authenticated users can update vendors"');
      console.log('   ON vendors FOR UPDATE TO authenticated USING (true);');
      console.log('   ');
      console.log('   CREATE POLICY "Authenticated users can delete vendors"');
      console.log('   ON vendors FOR DELETE TO authenticated USING (true);');
      console.log('   ```\n');
    }
  } else if (passed === results.length) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('   Your vendor operations should work correctly.\n');
  }
  
  console.log('For more details, see: VENDOR_DEBUG_REPORT.md\n');
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test suite crashed:', error);
});

// Export for use in other scripts
export { runTests };
