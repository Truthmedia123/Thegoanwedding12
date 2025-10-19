# CSV Import Troubleshooting Guide

## Common Issues After CSV Upload

### Issue: "Failed to perform bulk action"

This error occurs when trying to delete or manage vendors after a CSV import. Here's how to diagnose and fix it.

## Diagnostic Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab and look for detailed error messages with emoji indicators:

- ✅ = Success
- ❌ = Error
- ⚠️ = Warning
- 🔄 = In progress
- 📥 = Import starting
- 📤 = Import in progress
- 📊 = Import complete

### 2. Common Error Messages

#### "Failed to delete vendor: new row violates row-level security policy"
**Cause:** RLS policies are blocking the operation

**Solution:**
```sql
-- Run in Supabase SQL Editor
-- See QUICK_FIX_VENDORS.sql for complete fix
```

#### "Vendor not found or already deleted"
**Cause:** ID mismatch or vendor doesn't exist

**Solution:**
- Refresh the page to sync data
- Check if vendor exists in Supabase dashboard

#### "Not authenticated"
**Cause:** Session expired or not logged in

**Solution:**
1. Log out and log back in
2. Navigate to `/admin`
3. Sign in again
4. Return to `/admin/vendors`

#### "Profile not found"
**Cause:** User profile doesn't exist in database

**Solution:**
```sql
-- Run in Supabase SQL Editor
INSERT INTO profiles (id, email, role, created_at, updated_at)
VALUES (auth.uid(), auth.email(), 'admin', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## CSV Import Process

### What Happens During Import

1. **Parse CSV File**
   - Reads file content
   - Splits into lines
   - Maps headers to fields
   - Validates data

2. **Optional: Delete Existing Vendors** (if "Replace All" is selected)
   - Fetches all vendor IDs
   - Deletes all vendors
   - Logs deletion count

3. **Import New Vendors**
   - Loops through CSV rows
   - Calls `addVendorMutation` for each vendor
   - Tracks success/error count
   - Logs each operation

4. **Show Results**
   - Displays success count
   - Shows error count if any
   - Logs detailed errors to console

### Console Output Example

**Successful Import:**
```
📥 Starting CSV import: 10 vendors, replaceAll: false
📤 Importing 10 vendors...
✅ Imported vendor 1/10: ABC Caterers
✅ Imported vendor 2/10: XYZ Photography
...
✅ Imported vendor 10/10: Dream Decorators
📊 Import complete: 10 success, 0 failed
```

**Partial Failure:**
```
📥 Starting CSV import: 10 vendors, replaceAll: false
📤 Importing 10 vendors...
✅ Imported vendor 1/10: ABC Caterers
❌ Failed to import vendor 2/10: {...} Error: Failed to add vendor: ...
✅ Imported vendor 3/10: XYZ Photography
...
📊 Import complete: 8 success, 2 failed
❌ Import errors: [
  "Row 3: XYZ Vendor - Failed to add vendor: ...",
  "Row 7: ABC Vendor - Failed to add vendor: ..."
]
```

## Bulk Actions After Import

### How Bulk Delete Works

1. **Selection**
   - Select vendors using checkboxes
   - Choose "Delete" from bulk action dropdown
   - Click "Apply"

2. **Execution**
   - Loops through selected vendor IDs
   - Calls `deleteVendorMutation` for each
   - Tracks success/error count
   - Continues even if some fail

3. **Results**
   - Shows success count
   - Shows partial success if some failed
   - Logs detailed errors to console

### Console Output Example

**Successful Bulk Delete:**
```
🔄 Starting bulk action: delete for 5 vendors
✅ Deleted vendor 123 (1/5)
✅ Deleted vendor 124 (2/5)
✅ Deleted vendor 125 (3/5)
✅ Deleted vendor 126 (4/5)
✅ Deleted vendor 127 (5/5)
```

**Partial Failure:**
```
🔄 Starting bulk action: delete for 5 vendors
✅ Deleted vendor 123 (1/5)
❌ Failed to delete vendor 124: Error: Failed to delete vendor: ...
✅ Deleted vendor 125 (2/5)
❌ Failed to delete vendor 126: Error: Vendor not found
✅ Deleted vendor 127 (3/5)
❌ Bulk delete errors: [
  "Vendor 124: Failed to delete vendor: ...",
  "Vendor 126: Vendor not found"
]
```

## Quick Fixes

### Fix 1: Refresh Authentication
```javascript
// Run in browser console
const { supabase } = await import('/src/lib/supabase.ts');
await supabase.auth.refreshSession();
console.log('Session refreshed');
```

### Fix 2: Check Auth Status
```javascript
// Copy check-auth.js into console
// Or run this:
const { supabase } = await import('/src/lib/supabase.ts');
const { data: { session } } = await supabase.auth.getSession();
console.log('Authenticated:', !!session);
console.log('Email:', session?.user?.email);
```

### Fix 3: Verify RLS Policies
```sql
-- Run in Supabase SQL Editor
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'vendors'
ORDER BY cmd;
```

### Fix 4: Test Single Vendor Operation
```javascript
// Test adding a vendor
const { supabase } = await import('/src/lib/supabase.ts');
const { data, error } = await supabase
  .from('vendors')
  .insert([{ name: 'Test Vendor', category: 'Test' }])
  .select()
  .single();

console.log('Result:', { data, error });
```

## Best Practices

### Before Importing CSV

1. ✅ Log in to admin dashboard
2. ✅ Verify authentication (check console)
3. ✅ Check RLS policies are correct
4. ✅ Backup existing data if needed
5. ✅ Validate CSV format

### CSV Format Requirements

```csv
name,category,location,description,phone,email,website
ABC Caterers,Catering,Goa,Best catering service,1234567890,abc@example.com,https://abc.com
XYZ Photography,Photography,Goa,Professional photography,9876543210,xyz@example.com,https://xyz.com
```

**Required Fields:**
- `name` (required)

**Optional Fields:**
- `category`
- `location`
- `description`
- `phone`
- `email`
- `website`
- `address`
- `services` (comma-separated)
- `price_range`
- Any other vendor fields

### After Importing CSV

1. ✅ Check console for import results
2. ✅ Verify vendor count in table
3. ✅ Test individual vendor operations
4. ✅ Test bulk operations
5. ✅ Refresh page to confirm persistence

## Error Reference

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Failed to perform bulk action" | Generic error, check console | Look at console for specific error |
| "new row violates row-level security policy" | RLS blocking operation | Run QUICK_FIX_VENDORS.sql |
| "Not authenticated" | Session expired | Log in again |
| "Profile not found" | No profile record | Create profile in Supabase |
| "Vendor not found" | ID doesn't exist | Refresh page, check database |
| "Invalid vendor ID" | ID format issue | Check vendor ID type |
| "Failed to parse CSV file" | Invalid CSV format | Check CSV structure |

## Getting Help

If issues persist:

1. **Check console logs** - Look for detailed error messages
2. **Run check-auth.js** - Verify authentication status
3. **Run test-vendor-console.js** - Test all operations
4. **Check Supabase logs** - Dashboard → Logs
5. **Verify RLS policies** - Run TEST_VENDOR_ACCESS.sql

## Related Files

- `VENDOR_DEBUG_REPORT.md` - Comprehensive debugging guide
- `QUICK_FIX_VENDORS.sql` - Database RLS fixes
- `check-auth.js` - Authentication diagnostic
- `test-vendor-console.js` - Operation testing
- `TESTING_GUIDE.md` - Complete testing procedures
