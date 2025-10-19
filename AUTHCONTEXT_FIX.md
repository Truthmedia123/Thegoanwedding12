# AuthContext Infinite Loop Fix

## Problem
The AuthContext was stuck in an infinite loop, repeatedly checking the token and logging:
```
AuthContext checking token: admin-2025-goa
AuthContext: Token auth successful
```

This was happening hundreds of times per second, causing performance issues.

## Root Causes

### 1. Infinite Re-render Loop
**Location:** Line 123 in `AuthContext.tsx`

**Issue:**
```typescript
useEffect(() => {
  checkAuth();
  // ... other code
}, [user]); // ❌ BAD: user as dependency
```

**Problem:**
- `checkAuth()` calls `setUser()`
- Setting `user` triggers the `useEffect` again (because `user` is in dependencies)
- This creates an infinite loop

**Fix:**
```typescript
useEffect(() => {
  checkAuth();
  // ... other code
}, []); // ✅ GOOD: Empty dependency array - only run once
```

### 2. Unnecessary Polling Interval
**Location:** Lines 92-98 (removed)

**Issue:**
```typescript
const interval = setInterval(() => {
  const currentToken = sessionStorage.getItem('adminToken');
  if (currentToken && !user) {
    console.log('Token detected, rechecking auth...');
    checkAuth();
  }
}, 1000); // ❌ Checking every second
```

**Problem:**
- Polling every 1 second is unnecessary
- The `storage` event listener already handles token changes
- This was causing additional unnecessary checks

**Fix:**
- Removed the interval completely
- Rely on `storage` event listener for cross-tab changes
- Auth state change listener handles Supabase auth

### 3. Excessive Console Logging
**Issue:**
- Every auth check logged 2 messages
- With infinite loop, this spammed the console

**Fix:**
- Reduced logging to single concise message
- Added emoji indicators for clarity
- Removed redundant logs

## Changes Made

### Before:
```typescript
useEffect(() => {
  checkAuth();
  
  const handleStorageChange = () => {
    console.log('Storage changed, rechecking auth...');
    checkAuth();
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Polling every second
  const interval = setInterval(() => {
    const currentToken = sessionStorage.getItem('adminToken');
    if (currentToken && !user) {
      console.log('Token detected, rechecking auth...');
      checkAuth();
    }
  }, 1000);
  
  // ... auth state change listener
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(interval);
    subscription.unsubscribe();
  };
}, [user]); // ❌ Causes infinite loop
```

### After:
```typescript
useEffect(() => {
  checkAuth();
  
  const handleStorageChange = () => {
    checkAuth();
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // ... auth state change listener
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    subscription.unsubscribe();
  };
}, []); // ✅ Only runs once on mount
```

## How It Works Now

### 1. Initial Load
- `useEffect` runs once on component mount
- `checkAuth()` checks for token or Supabase session
- Sets user/profile state
- Does not re-trigger the effect

### 2. Token Changes (Cross-Tab)
- `storage` event listener detects changes in other tabs
- Calls `checkAuth()` to update state
- Does not create a loop

### 3. Supabase Auth Changes
- `onAuthStateChange` listener handles Supabase events
- Only processes if no custom token exists
- Updates state accordingly

### 4. Sign Out
- Clears sessionStorage token
- Signs out from Supabase
- Clears all state

## Console Output

### Before (Infinite Loop):
```
AuthContext checking token: admin-2025-goa
AuthContext: Token auth successful
AuthContext checking token: admin-2025-goa
AuthContext: Token auth successful
AuthContext checking token: admin-2025-goa
AuthContext: Token auth successful
... (repeats forever)
```

### After (Fixed):
```
✅ AuthContext: Token authentication successful
```

That's it! Just one log message on initial load.

## Testing

### Verify the Fix:
1. Open browser console
2. Navigate to any page
3. Should see only ONE auth message
4. No repeated messages
5. No performance issues

### Test Token Auth:
1. Log in to admin dashboard
2. Check console - should see single success message
3. Navigate between pages - no repeated checks
4. Refresh page - single check on mount

### Test Sign Out:
1. Click sign out
2. Token should be cleared
3. User state should be null
4. No errors in console

## Performance Impact

### Before:
- Infinite loop running continuously
- Hundreds of checks per second
- Console flooded with messages
- Browser performance degraded

### After:
- Single check on mount
- Event-driven updates only when needed
- Clean console output
- Normal browser performance

## Related Files
- `client/src/contexts/AuthContext.tsx` - Fixed file
- `check-auth.js` - Auth diagnostic tool
- `VENDOR_DEBUG_REPORT.md` - Related debugging info

## Prevention

To avoid similar issues in the future:

### ✅ DO:
- Use empty dependency array `[]` for mount-only effects
- Use event listeners for external changes
- Keep console logging minimal and meaningful
- Test for infinite loops during development

### ❌ DON'T:
- Add state variables to `useEffect` dependencies if they're set inside the effect
- Use `setInterval` for polling when event listeners can be used
- Log on every render without throttling
- Ignore repeated console messages during development
