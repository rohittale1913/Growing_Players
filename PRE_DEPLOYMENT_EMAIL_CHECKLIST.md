# Pre-Deployment Checklist - Email Verification

## Must Complete Before Going Live

### Phase 1: Supabase Configuration (Required)
- [ ] **Access Supabase Dashboard** → Your Project → Settings
- [ ] **Go to** Authentication → URL Configuration
- [ ] **Set Site URL** to your production domain (e.g., `https://growingplayers.com`)
- [ ] **Add Redirect URLs:**
  ```
  http://localhost:5173
  http://localhost:5174
  https://growingplayers.com
  https://growingplayers.com/
  https://www.growingplayers.com
  ```
- [ ] **Click Save**
- [ ] **Wait 5-10 minutes** before testing
- [ ] **Verify Configuration** by taking a screenshot

### Phase 2: Environment Variables (Required)
- [ ] **Production `.env`** has correct values:
  ```env
  VITE_SUPABASE_URL=https://[project].supabase.co
  VITE_SUPABASE_ANON_KEY=[your-key]
  ```
- [ ] **Not hardcoding** localhost anywhere
- [ ] **Secrets not committed** to Git
- [ ] **Different keys for dev/prod** if needed

### Phase 3: Code Verification (Completed)
- [ ] ✓ Supabase config (`src/lib/supabase.js`) updated
- [ ] ✓ Login page (`src/pages/Login.jsx`) handles verification
- [ ] ✓ Register page (`src/pages/Register.jsx`) correct
- [ ] ✓ Google OAuth uses `window.location.origin` (dynamic domain)

### Phase 4: Build & Deploy Testing (Required)
- [ ] **Build production bundle:** `npm run build`
- [ ] **No build errors** appear
- [ ] **Environment variables** loaded correctly
- [ ] **Deploy to staging** server first
- [ ] **Test on staging domain** before production

### Phase 5: Email Flow Testing (Required)
- [ ] **Test Signup Flow:**
  1. Visit `https://yourdomain.com/register`
  2. Sign up with test email
  3. Submit form
  4. See "Check your email" message
  
- [ ] **Verify Email Arrival:**
  1. Check email inbox
  2. Email should arrive within 5 minutes
  3. From address: `no-reply@[supabase-project].supabase.co`
  
- [ ] **Verify Email Content:**
  1. Contains "Confirm your email" subject
  2. Contains clickable link
  3. Link URL contains your production domain
  4. Link should be similar to: `https://yourdomain.com/auth/confirm?...`

- [ ] **Click Confirmation Link:**
  1. Open link in browser
  2. Should redirect to login page
  3. URL should be `https://yourdomain.com` (not localhost)
  4. Should see "Email verified successfully!" message
  
- [ ] **Verify Auto-Login:**
  1. After clicking link, should be logged in
  2. Redirects to home or dashboard
  3. User appears in auth session

### Phase 6: Edge Cases Testing (Required)
- [ ] **Expired Token Scenario:**
  1. Wait 24+ hours
  2. Click old confirmation link
  3. Should show error (token expired)
  4. User can request new email
  
- [ ] **Invalid Token Scenario:**
  1. Manually edit confirmation link
  2. Change token
  3. Should show error (invalid token)
  
- [ ] **Already Confirmed Scenario:**
  1. Sign up, confirm email, close tab
  2. Click confirmation link again
  3. Should show message (already confirmed)
  
- [ ] **Different Email Providers:**
  1. Test with Gmail account
  2. Test with Outlook/Hotmail
  3. Test with corporate email
  4. All should receive and open links

### Phase 7: Database Verification (Required)
- [ ] **Supabase Dashboard** → Authentication → Users
- [ ] **Test account appears** in user list
- [ ] **Column `email_confirmed`** = true (after clicking link)
- [ ] **Column `email_confirmed_at`** has timestamp
- [ ] **Column `last_sign_in_at`** shows recent time

### Phase 8: Error Handling Testing (Required)
- [ ] **Network error:** No internet → "Please try again" message
- [ ] **Server error:** Supabase down → "Service unavailable" message
- [ ] **Bad email:** Invalid format → Validation error before sending
- [ ] **Duplicate email:** Already signed up → "Email already exists" message
- [ ] **Slow network:** 3G connection → Proper loading states

### Phase 9: Security Checks (Required)
- [ ] **No sensitive data** in URLs
- [ ] **Tokens in URL** are one-time use
- [ ] **HTTPS enforced** for all auth pages
- [ ] **Cookies have** `Secure` and `HttpOnly` flags
- [ ] **CSRF protection** in place
- [ ] **Rate limiting** on signup endpoint
- [ ] **Email validation** on frontend and backend

### Phase 10: Monitoring Setup (Recommended)
- [ ] **Monitor email delivery** in Supabase dashboard
- [ ] **Check auth logs** for failures:
  - Invalid tokens
  - Expired tokens
  - Non-existent users
- [ ] **Set up alerts** for:
  - High signup failure rate
  - Email delivery issues
  - Auth service errors
- [ ] **Create support channel** for email issues
- [ ] **Document support process** for users

### Phase 11: User Documentation (Recommended)
- [ ] **Help article:** "Confirm Your Email"
  - Instructions for finding email
  - Checking spam folder
  - Resending email if needed
  
- [ ] **Support FAQ:**
  - "I didn't receive a confirmation email"
  - "The confirmation link isn't working"
  - "The link expired"
  
- [ ] **Onboarding guide:**
  - Mention email confirmation is required
  - Estimated delivery time (1-5 minutes)
  - What to do if email doesn't arrive

### Phase 12: Post-Deployment (After Going Live)
- [ ] **Monitor signup rate**
- [ ] **Track confirmation rate**
- [ ] **Track bounce-back emails**
- [ ] **Check user support tickets**
- [ ] **Be ready to rollback** if issues
- [ ] **Keep support team informed**

## Deployment Approval Checklist

### Must Have ✓
- [ ] All Phase 1 items complete
- [ ] All Phase 2 items complete
- [ ] All Phase 4 items complete
- [ ] All Phase 5 items complete
- [ ] No error messages in Phase 6 testing
- [ ] Database shows confirmed users correctly

### Should Have ✓
- [ ] Phase 7 & 8 testing complete
- [ ] Security checks passed
- [ ] Monitoring configured
- [ ] Support team trained

### Nice to Have ✓
- [ ] User documentation ready
- [ ] Video tutorial created
- [ ] FAQ page updated
- [ ] Analytics dashboard set up

## Sign-Off

```
Project: Growing Players
Date: _______________
Version: 1.0.0

Checked By: _________________ Date: _______
Tested By: __________________ Date: _______
Approved By: ________________ Date: _______

Production Domain: https://_______________
Supabase Project: __________________________
Environment: [ ] Staging [ ] Production
```

## Rollback Plan

If email verification breaks in production:

1. **Immediate (5 minutes):**
   - Switch off email verification requirement
   - Allow users to signup without confirmation
   - Notify support team

2. **Short term (1 hour):**
   - Check Supabase logs for errors
   - Verify email service status
   - Revert recent code changes if needed

3. **Long term:**
   - Fix root cause
   - Re-test thoroughly
   - Redeploy with email verification

4. **Contact:**
   - Supabase Support: https://supabase.com/support
   - Your DevOps Team: [contact info]
   - Your Backend Team: [contact info]

## Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Email Verification Guide:** See `EMAIL_VERIFICATION_QUICK_FIX.md`
- **Setup Instructions:** See `SETUP_EMAIL_VERIFICATION.md`
- **Configuration Details:** See `EMAIL_CONFIGURATION.md`
- **Supabase Docs:** https://supabase.com/docs
- **Auth Docs:** https://supabase.com/docs/guides/auth

---

**Updated:** May 27, 2026
**Status:** Ready for Deployment
**Reviewed:** [Signature Line]
