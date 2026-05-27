# Email Verification Setup Guide

## Issue Fixed
Email confirmation links were redirecting to `localhost` instead of your production domain, preventing users from confirming their accounts on hosted sites.

## What's Changed

### 1. **Supabase Configuration Enhancement** (`src/lib/supabase.js`)
- Added `detectSessionInUrl: true` to automatically detect and process email confirmation tokens
- Enabled `autoRefreshToken` for automatic session management
- Enabled `persistSession` to maintain user sessions across page reloads

### 2. **Login Page Enhancement** (`src/pages/Login.jsx`)
- Added email verification detection using `useEffect`
- When users click the confirmation link, they're automatically logged in
- Shows "Email verified successfully" message
- Auto-redirects to dashboard (admin) or home page

## Setup Instructions

### For Development (Localhost)

1. **Supabase Dashboard Setup:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Navigate to **Settings** → **Authentication**
   - Click **URL Configuration**

2. **Configure Redirect URLs:**
   - Site URL: `http://localhost:5173`
   - Add Redirect URLs:
     ```
     http://localhost:5173
     http://localhost:5174
     ```

3. **Test Locally:**
   ```bash
   npm run dev
   # Sign up at http://localhost:5173/register
   # Check email for confirmation link
   # Click link - should auto-verify and redirect
   ```

### For Production

1. **Update Environment Variables** (`.env.production`):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anonkey
   ```

2. **Supabase Dashboard Configuration:**
   - Navigate to **Authentication** → **URL Configuration**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs:
     ```
     https://yourdomain.com
     https://yourdomain.com/
     https://www.yourdomain.com
     http://localhost:5173
     http://localhost:5174
     ```

3. **Important: Wait for Propagation**
   - After updating Supabase settings, wait 5-10 minutes
   - Supabase needs time to update email templates
   - Test with a new signup account

4. **Test on Production:**
   - Deploy your app to your hosting domain
   - Sign up with a test email
   - Verify email arrives
   - Click confirmation link
   - Should redirect to your domain and auto-login

## How Email Verification Works

### User Signup Flow
```
1. User fills signup form at /register
2. Clicks "Register" button
3. Supabase sends confirmation email with unique token
4. Email contains link: https://your-project.supabase.co/auth/v1/verify?token=...&redirect_to=...
5. Supabase redirects to: https://yourdomain.com/login (via redirect_to)
6. App detects session from token and auto-verifies user
7. Shows "Email verified successfully!" message
8. Auto-redirects to home or dashboard
```

### Technical Details
- **Token**: Unique verification token sent in email
- **Redirect URL**: Configured in Supabase dashboard
- **Session Detection**: `detectSessionInUrl: true` processes the token
- **Auto-Login**: User session is created automatically
- **Message**: Custom success message shown to user

## Verification Response Codes

| Status | Meaning | Action |
|--------|---------|--------|
| ✓ Verified | Email confirmed | Auto-login & redirect |
| ✗ Invalid Token | Token expired or invalid | Show error on login page |
| ✗ Already Verified | User already confirmed | Show message & redirect |
| ✗ Invalid Email | Email not found | Show error message |

## Troubleshooting

### Email Not Received
- **Check spam folder** - Emails may be marked as spam
- **Verify email address** - Typo in entered email?
- **Check Supabase logs** - Dashboard → Logs → Auth
- **Wait 5 minutes** - Sometimes delayed
- **Try different email provider** - Gmail, Outlook, etc.

### Link Redirects to Localhost
**Solution:** Update Supabase URL Configuration
- Ensure production domain is added to Redirect URLs
- Clear browser cache: `Ctrl+Shift+Del`
- Logout and try new signup
- Wait 5-10 minutes for settings to propagate

### "Invalid Token" Error
- **Expired Token** - Links expire after 24 hours
- **Already Used** - Token can only be used once
- **Different Tab** - Token linked to specific browser session
- **Solution**: Resend email or create new account

### User Not Auto-Logging In
- **Check browser console** - Are there JavaScript errors?
- **Verify session** - Open DevTools → Application → Cookies
- **Check auth store** - Is `setUser()` being called?
- **Inspect URL** - Should have `access_token` in URL after redirect

### Production Domain Shows Localhost
- **Check Supabase settings** - URL Configuration updated?
- **Check environment variables** - Are they correctly set?
- **Check deployment** - Is production build using right env vars?
- **Check browser** - Clear cache and local storage

## Configuration Files

### Supabase URL Configuration
```
Project → Settings → Authentication → URL Configuration
```

Required Settings:
- ✓ Site URL: Your production domain
- ✓ Redirect URLs: All allowed redirect domains
- ✓ Email confirmation: Enabled

### Environment Variables
```env
# Development
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Production (same, different env file)
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

## Testing Checklist

- [ ] Supabase credentials configured in `.env.local`
- [ ] URL Configuration updated in Supabase dashboard
- [ ] Redirect URLs include all your domains
- [ ] Email sending is enabled in Supabase
- [ ] Test signup on localhost - email received?
- [ ] Click confirmation link - redirects correctly?
- [ ] User is auto-logged in after verification?
- [ ] Test on production domain - same flow works?
- [ ] Different email providers work (Gmail, Outlook, etc.)?
- [ ] Expired tokens show proper error message?

## API Reference

### Email Verification Flow
```javascript
// Automatic - handled by Supabase
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
// Supabase automatically sends confirmation email

// Verify on redirect - handled by app
useEffect(() => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    // User verified! Auto-login
    setUser(session.user)
  }
}, [])
```

### Resend Email
```javascript
// If user doesn't receive email
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: 'user@example.com'
})
```

## Email Template Customization

To customize email templates in Supabase:
1. **Dashboard** → **Authentication** → **Email Templates**
2. Edit template for "Confirm signup"
3. Customize subject and body
4. Use variables: `{{ .ConfirmationURL }}`, `{{ .Email }}`

## Support & Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/custom-emails)
- [URL Configuration](https://supabase.com/docs/guides/auth#configure-redirect-urls)
- [Supabase Dashboard](https://app.supabase.com)

---

**Last Updated:** May 27, 2026
**Status:** Email verification fixed and enhanced for production
