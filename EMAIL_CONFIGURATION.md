# Email Confirmation Configuration for Production

## Problem
When users sign up from a hosted site, the email confirmation link redirects to `localhost` instead of the actual production domain, preventing email verification.

## Root Cause
Supabase uses default email templates with redirect URLs that need to be configured for your production domain.

## Solution: Configure Supabase Email Redirect URLs

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your Growing Players project
3. Navigate to **Authentication** → **URL Configuration**

### Step 2: Add Your Production URLs
In the **Site URL** section, configure:

```
Production Domain: https://yourdomain.com
(Replace with your actual domain)
```

### Step 3: Configure Redirect URLs
Add both URLs in the **Redirect URLs** field:

```
http://localhost:5173
http://localhost:5174
https://yourdomain.com
https://yourdomain.com/
https://www.yourdomain.com
```

### Step 4: Update Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. For each template (Confirm signup, Password reset, Magic Link):
   - Check if `[CONFIRMATION_URL]` or similar variables are used
   - These should automatically use the configured redirect URLs
   - If hardcoded URLs exist, contact Supabase support or edit the template

### Step 5: Test Email Verification Flow

#### Local Testing:
```bash
npm run dev
# Visit http://localhost:5174/register
# Sign up with a test email
# Check email, click confirmation link
# Should redirect to localhost and verify
```

#### Production Testing:
```
1. Ensure your hosted domain is added to Supabase
2. Sign up from your production site
3. Check email for confirmation link
4. Link should redirect to your production domain
5. Email verification should complete successfully
```

## Configuration Details

### Environment Variables (.env.local)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://yourdomain.com  # Add this for production
```

### Update Register.jsx (Optional - for custom redirect)
If you want to customize the Google OAuth redirect, the Register page already uses:
```javascript
redirectTo: `${window.location.origin}/`
```
This automatically detects the current domain (localhost or production).

## Email Verification Flow

1. **User Signs Up** (`Register.jsx`)
   - Submits email and password to Supabase Auth
   - Supabase sends confirmation email with verification link

2. **Email Confirmation Link**
   - Points to: `https://[your-project].supabase.co/auth/v1/verify`
   - Includes token in URL parameters
   - Redirects to your configured Site URL or Redirect URL

3. **User Clicks Link**
   - Browser navigates to the redirect URL
   - Should land on your app at the configured domain
   - Supabase automatically verifies the email in the background
   - User session is created

## Troubleshooting

### Issue: Email link goes to localhost
**Solution:** Update Supabase URL Configuration as per Step 2-3 above

### Issue: "Invalid token" error
**Solution:** 
- Ensure the email link is not broken in transit
- Check that redirect URL is exactly as configured in Supabase
- Wait a few seconds after clicking (may be processing)

### Issue: Email not received
**Solution:**
- Check Supabase Email Logs in Dashboard
- Verify email address is correct
- Check spam folder
- Ensure Supabase email service is not rate-limited

### Issue: User redirected to wrong URL
**Solution:**
- Verify Site URL and Redirect URLs in Supabase dashboard
- Clear browser cache and cookies
- Test from incognito window

## Supabase Email Configuration Checklist

- [ ] Navigate to Project Settings → Authentication → URL Configuration
- [ ] Set Site URL to your production domain
- [ ] Add all redirect URLs (localhost for dev, production domain)
- [ ] Wait 5-10 minutes for settings to propagate
- [ ] Test signup flow on production domain
- [ ] Verify email arrives and links work
- [ ] Test on different email providers (Gmail, Outlook, etc.)
- [ ] Monitor Supabase Auth logs for any errors

## Documentation Links

- [Supabase Auth URL Configuration](https://supabase.com/docs/guides/auth#configure-redirect-urls)
- [Email Templates Documentation](https://supabase.com/docs/guides/auth/custom-emails)
- [Supabase Auth Flow](https://supabase.com/docs/guides/auth)

## For Development Team

If users report email verification issues:

1. Ask them their domain name
2. Verify it's added to Supabase URL Configuration
3. Check Supabase Auth logs for verification attempts
4. Test with a test account on production domain
5. Check email headers in email provider to verify the link is correct

---

**Last Updated:** May 27, 2026
**Status:** Active
