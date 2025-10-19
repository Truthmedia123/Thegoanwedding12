# Vendor Add/Delete Testing Guide

## Quick Start

### Step 1: Apply the Database Fix
Run this SQL in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of QUICK_FIX_VENDORS.sql
# Click "Run"
```

### Step 2: Verify Your Setup
Open your browser console on the admin vendors page and run:

```javascript
// Copy and paste test-vendor-console.js into the console
```

### Step 3: Test Operations
1. **Add a vendor** - Click "Add Vendor" button
2. **Edit a vendor** - Click edit icon on any vendor
3. **Delete a vendor** - Click trash icon on any vendor

---

## Detailed Testing Instructions

### Prerequisites
- [ ] Supabase project is set up
- [ ] Environment variables are configured:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] You have admin access to the dashboard
- [ ] You are logged in

### Test 1: Check Configuration

1. Open the admin vendors page: `/admin/vendors`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for these messages:
   ```
   VendorsPage mounted
   Supabase configured: true
   ✅ Authenticated as: your-email@example.com
   ✅ Admin role confirmed
   ```

**Expected Result:** All checks should pass with ✅

**If you see warnings:**
- ⚠️ Not authenticated → Log in first
- ⚠️ Profile not found → Run profile creation SQL (see below)
- ⚠️ User role is not admin → Update your role to 'admin'

### Test 2: Read Vendors

1. The vendors table should load automatically
2. Check console for: `Loading vendors from Supabase...`
3. Vendors should appear in the table

**Expected Result:** Vendors list displays without errors

**If you see errors:**
- Check console for RLS policy errors
- Run `QUICK_FIX_VENDORS.sql`

### Test 3: Add Vendor

1. Click "Add Vendor" button
2. Fill in the form:
   - **Name:** Test Vendor (required)
   - **Category:** Test Category
   - **Location:** Test Location
   - **Description:** Test description
3. Click "Create Vendor"
4. Check console for:
   ```
   ➕ Adding vendor: {...}
   ✅ Vendor added successfully: {...}
   ```
5. Verify vendor appears in table

**Expected Result:** 
- Success toast notification
- Vendor appears in table immediately
- No errors in console

**If it fails:**
- Check console for error details
- Look for RLS policy errors (code: 42501)
- Verify you're authenticated

### Test 4: Update Vendor

1. Click edit icon (pencil) on any vendor
2. Modify some fields
3. Click "Update Vendor"
4. Check console for:
   ```
   ✏️ Updating vendor: {...}
   ✅ Vendor updated successfully: {...}
   ```
5. Verify changes appear in table

**Expected Result:**
- Success toast notification
- Changes reflect immediately
- No errors in console

### Test 5: Delete Vendor

1. Click delete icon (trash) on a vendor
2. Check console for:
   ```
   🗑️ Deleting vendor: {...}
   Attempting delete with numeric ID: 123
   ✅ Vendor deleted successfully: {...}
   ```
3. Verify vendor disappears from table

**Expected Result:**
- Success toast notification
- Vendor removed from table immediately
- No errors in console

**If it fails:**
- Check console for error details
- Verify the vendor ID is valid
- Check RLS policies

---

## Common Issues & Solutions

### Issue 1: "Not authenticated" Warning

**Symptoms:**
```
⚠️ Not authenticated - vendor operations may fail
```

**Solution:**
1. Navigate to `/admin` or `/login`
2. Sign in with your admin credentials
3. Return to `/admin/vendors`

### Issue 2: "Profile not found" Warning

**Symptoms:**
```
⚠️ Profile not found: No rows found
```

**Solution:**
Run this SQL in Supabase:

```sql
-- Get your user ID first
SELECT auth.uid() as my_user_id, auth.email() as my_email;

-- Create profile (replace values with output from above)
INSERT INTO profiles (id, email, role, created_at, updated_at)
VALUES (
    'your-user-id-here',
    'your-email-here',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin', updated_at = NOW();
```

### Issue 3: RLS Policy Errors

**Symptoms:**
```
❌ Supabase insert error: {
  code: "42501",
  message: "new row violates row-level security policy"
}
```

**Solution:**
Run `QUICK_FIX_VENDORS.sql` in Supabase SQL Editor

### Issue 4: "Vendor not found" on Delete

**Symptoms:**
```
⚠️ No vendor was deleted - ID might not exist
```

**Possible Causes:**
1. Vendor was already deleted
2. ID mismatch (string vs number)
3. RLS policy blocking access

**Solution:**
1. Refresh the page to sync data
2. Check if vendor still exists in Supabase
3. Verify RLS policies are correct

### Issue 5: Operations Work but UI Doesn't Update

**Symptoms:**
- Operation succeeds in console
- Toast shows success
- But table doesn't update

**Solution:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Check React Query cache invalidation
3. Verify `refetch()` is being called

---

## Advanced Debugging

### Run Comprehensive Test Suite

Copy and paste this into browser console:

```javascript
// Load the test script
const script = document.createElement('script');
script.src = '/test-vendor-console.js';
document.head.appendChild(script);
```

Or manually copy the contents of `test-vendor-console.js` into console.

### Check RLS Policies Manually

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'vendors';

-- Check existing policies
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check
FROM pg_policies 
WHERE tablename = 'vendors'
ORDER BY cmd;

-- Test vendor access
SELECT COUNT(*) as total_vendors FROM vendors;
SELECT id, name, category FROM vendors LIMIT 5;
```

### Check Authentication State

Run this in browser console:

```javascript
// Check Supabase session
const { supabase } = await import('/src/lib/supabase.ts');
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Check profile
if (session) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  console.log('Profile:', profile);
}
```

### Monitor Network Requests

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Perform vendor operation
4. Check for:
   - Request URL
   - Request method (GET, POST, PUT, DELETE)
   - Status code (200, 201, 401, 403, 500)
   - Response body

**Common Status Codes:**
- `200/201` - Success
- `401` - Not authenticated
- `403` - Not authorized (RLS policy issue)
- `404` - Not found
- `500` - Server error

---

## Verification Checklist

After applying fixes, verify:

- [ ] Can view vendors list
- [ ] Can add new vendor
- [ ] Can edit existing vendor
- [ ] Can delete vendor
- [ ] UI updates immediately after operations
- [ ] No errors in browser console
- [ ] Success toast notifications appear
- [ ] Changes persist after page refresh

---

## Files Reference

| File | Purpose |
|------|---------|
| `VENDOR_DEBUG_REPORT.md` | Detailed analysis of issues |
| `QUICK_FIX_VENDORS.sql` | Database fix for RLS policies |
| `test-vendor-console.js` | Browser console test script |
| `test-vendor-operations.ts` | TypeScript test suite |
| `TESTING_GUIDE.md` | This file |

---

## Getting Help

If you're still experiencing issues:

1. **Check the console logs** - Look for detailed error messages with emoji indicators
2. **Review VENDOR_DEBUG_REPORT.md** - Contains in-depth analysis
3. **Run test-vendor-console.js** - Automated diagnostic script
4. **Check Supabase logs** - Go to Supabase Dashboard → Logs
5. **Verify environment variables** - Ensure Supabase credentials are correct

---

## Success Indicators

You'll know everything is working when you see:

✅ **Console Output:**
```
VendorsPage mounted
Supabase configured: true
✅ Authenticated as: admin@example.com
✅ Admin role confirmed
Loading vendors from Supabase...
Vendors loaded from Supabase: 10
```

✅ **Operations:**
```
➕ Adding vendor: {...}
✅ Vendor added successfully: {...}

✏️ Updating vendor: {...}
✅ Vendor updated successfully: {...}

🗑️ Deleting vendor: {...}
✅ Vendor deleted successfully: {...}
```

✅ **UI:**
- Vendors table loads
- Add/Edit/Delete buttons work
- Success toasts appear
- Changes reflect immediately
- No error messages

---

## Next Steps

Once vendor operations are working:

1. Test bulk operations (select multiple vendors)
2. Test CSV import functionality
3. Test vendor filtering and search
4. Verify changes persist after logout/login
5. Test on different browsers
6. Test with different user roles

Good luck! 🚀
