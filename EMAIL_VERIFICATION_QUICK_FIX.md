# Email Verification Issue - Quick Fix

## Problem
✗ Users sign up from hosted site
✗ Confirmation email is sent
✗ Email link redirects to localhost instead of production domain
✗ Users cannot confirm account

## Root Cause
Supabase email templates use redirect URLs configured in the dashboard. If not set to your production domain, emails redirect to localhost.

## Solution (5 Minutes)

### Step 1: Go to Supabase Dashboard
https://app.supabase.com → Select Your Project

### Step 2: Update URL Configuration
```
Settings → Authentication → URL Configuration
```

### Step 3: Configure These Fields
**Site URL:**
```
https://yourdomain.com
```

**Redirect URLs:**
```
http://localhost:5173
http://localhost:5174
https://yourdomain.com
https://yourdomain.com/
https://www.yourdomain.com
```

### Step 4: Save & Wait
- Click Save
- Wait 5-10 minutes for propagation
- Test with new signup

## What We Fixed in Code

### 1. Supabase Config (`src/lib/supabase.js`)
```javascript
// Added session detection for email verification
detectSessionInUrl: true
```

### 2. Login Page (`src/pages/Login.jsx`)
```javascript
// Auto-verifies when user clicks email link
const { data: { session } } = await supabase.auth.getSession()
if (session?.user) {
  setUser(session.user)
  // Redirects to home or admin
}
```

### 3. Register Page
Already correctly uses `window.location.origin` for Google OAuth
(No changes needed)

## Testing

### Local (Localhost)
```
1. npm run dev
2. Visit http://localhost:5173/register
3. Sign up with test email
4. Check email inbox
5. Click confirmation link
6. Should auto-login and redirect to home
```

### Production
```
1. Visit https://yourdomain.com/register
2. Sign up with test email
3. Check email inbox
4. Click confirmation link
5. Should redirect to https://yourdomain.com
6. Should auto-login
```

## If Email Link Still Goes to Localhost

### Fix 1: Check Supabase Configuration
- [ ] Is production domain in "Site URL"?
- [ ] Is production domain in "Redirect URLs"?
- [ ] Did you wait 5-10 minutes?

### Fix 2: Clear Browser Cache
```
Ctrl+Shift+Del → Clear all
```

### Fix 3: Test with New Email
- [ ] Sign up with fresh email
- [ ] Don't reuse old test emails

### Fix 4: Check Email Link
- Right-click email link → Copy link
- Check if it contains your domain
- If not, Supabase still using old config

## Important Notes

⚠️ **Email Confirmation is Required**
- Users must confirm email to complete signup
- User account exists but is not "confirmed" until link clicked
- Confirmed users have `email_confirmed_at` timestamp

⚠️ **Tokens Expire**
- Confirmation links expire after 24 hours
- Users must click within 24 hours
- After 24 hours, user can resend verification email

⚠️ **One-Time Use**
- Token can only be used once
- After verification, token is consumed
- Prevents replay attacks

## Success Indicators

✓ Email arrives in inbox within 1-5 minutes
✓ Email link contains your production domain (not localhost)
✓ Clicking link redirects to your domain
✓ User is auto-logged in after redirect
✓ Shows "Email verified successfully!" message
✓ User appears in Supabase Auth → Users list with `email_confirmed`

## Files Changed

- `src/lib/supabase.js` - Enhanced auth config
- `src/pages/Login.jsx` - Added email verification handling
- `src/pages/Register.jsx` - No changes (already correct)
- New: `EMAIL_CONFIGURATION.md` - Detailed setup guide
- New: `SETUP_EMAIL_VERIFICATION.md` - Complete walkthrough

## Next Steps

1. **Update Supabase URL Configuration** (see Step 1-4 above)
2. **Wait 5-10 minutes** for settings to propagate
3. **Test signup flow** on your production domain
4. **Monitor Supabase logs** if issues persist
5. **Check email spam folder** if emails not arriving

## Support

If still having issues:
1. Check Supabase Dashboard → Logs → Auth
2. Look for "signup_invitation" or "confirmation" events
3. Check email headers for redirect URL
4. Verify environment variables on production
5. Contact Supabase support if email service is down

---

**Status:** ✓ Fixed and Enhanced
**Date:** May 27, 2026
