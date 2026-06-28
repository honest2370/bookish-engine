# SELLIZI Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Authentication Issues

#### ❌ Problem: Login button loads but nothing happens

**Causes:**
1. Supabase database not set up
2. Email confirmation enabled (default)
3. RLS policies blocking operations
4. Environment variables not loaded

**Solutions:**

**Step 1: Check Supabase Setup**
```bash
# Open Supabase dashboard
# Go to SQL Editor
# Run the schema.sql file
```

**Step 2: Disable Email Confirmation**
1. Go to **Authentication** → **Providers** → **Email**
2. **Uncheck** "Confirm email"
3. Save changes

**Step 3: Fix RLS Policies**
Run this in SQL Editor:
```sql
-- Drop and recreate profile policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

**Step 4: Check Browser Console**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share them if you need help

---

#### ❌ Problem: "Profile not found" error

**Solution:**
The app now auto-creates profiles! If you see this:
1. Clear browser cache and localStorage
2. Try signing up again with a new email
3. Or run this SQL to manually create profile:

```sql
INSERT INTO profiles (id, email, full_name, username, phone, country, role)
VALUES (
  'USER_ID_FROM_AUTH_USERS', 
  'email@example.com',
  'Full Name',
  'username123',
  '+1234567890',
  'CM',
  'seller'
);
```

---

#### ❌ Problem: Stuck on loading screen

**Solutions:**
1. **Clear Cache:**
   - Chrome: Ctrl+Shift+Delete
   - Clear "Cached images and files"
   - Clear "Cookies and site data"

2. **Check Network:**
   - Open DevTools → Network tab
   - Refresh page
   - Look for failed requests (red)
   - Check if Supabase URL is correct

3. **Verify Environment Variables:**
   ```bash
   # In Vercel dashboard
   # Settings → Environment Variables
   # Make sure all 3 are set:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_SUPABASE_SERVICE_ROLE_KEY
   ```

---

#### ❌ Problem: Can't access admin panel

**Solution:**
```sql
-- Set your account to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

Then sign out and sign in again.

---

### Database Issues

#### ❌ Problem: Tables don't exist

**Solution:**
1. Go to Supabase Dashboard
2. SQL Editor
3. Copy entire `supabase/schema.sql`
4. Paste and Run
5. Verify no errors

**Check tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

#### ❌ Problem: Permission denied on table

**Solution:**
Enable RLS and create policies:

```sql
-- For profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- For products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage own products" ON products
  FOR ALL USING (auth.uid() = seller_id);
```

---

### Deployment Issues

#### ❌ Problem: Vercel build fails

**Check:**
1. All environment variables set in Vercel
2. Node version compatible (18+)
3. Build command: `npm run build`
4. Output directory: `dist`

**Logs location:**
- Vercel Dashboard → Deployments → Click deployment → View logs

---

#### ❌ Problem: Site loads but can't connect to Supabase

**Solutions:**

1. **Check CORS in Supabase:**
   - Supabase Dashboard → Settings → API
   - Add your domain to allowed origins

2. **Verify Environment Variables:**
   ```bash
   # In Vercel, check these are set:
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

3. **Redeploy after adding env vars:**
   - Vercel requires redeploy after env changes
   - Click "Redeploy" in Vercel dashboard

---

### Payment Issues

#### ❌ Problem: Payment fails

**Check:**
1. **Ashtechpay API key configured:**
   ```sql
   SELECT * FROM admin_settings 
   WHERE key = 'ashtechpay_api_key';
   ```

2. **Edge functions deployed:**
   ```bash
   supabase functions list
   ```

3. **Correct country and operator:**
   - Use exactly as shown in Ashtechpay docs
   - Example: "MTN Mobile Money" not "MTN"

---

#### ❌ Problem: Webhooks not working

**Solutions:**
1. Check webhook URL in Ashtechpay dashboard
2. Should be: `https://YOUR_PROJECT.supabase.co/functions/v1/ashtechpay-webhook`
3. Test webhook endpoint manually
4. Check Edge Function logs in Supabase

---

### UI/UX Issues

#### ❌ Problem: White screen / blank page

**Solutions:**
1. **Check Browser Console:**
   - F12 → Console
   - Look for JavaScript errors

2. **Clear Service Worker:**
   ```javascript
   // In DevTools Console
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) {
       registration.unregister();
     }
   });
   ```

3. **Hard Refresh:**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

---

#### ❌ Problem: Styles not loading

**Solutions:**
1. Clear browser cache
2. Check network tab for CSS errors
3. Verify Tailwind is building correctly
4. Run `npm run build` locally to test

---

### Performance Issues

#### ❌ Problem: Slow loading

**Solutions:**
1. **Check Image Sizes:**
   - Compress images before upload
   - Use WebP format
   - Max 500KB per image

2. **Check Network:**
   - Open DevTools → Network
   - Sort by Size
   - Look for large files

3. **Enable Caching:**
   - Service worker should handle this
   - Check if sw.js is registered

---

## 🔍 Debugging Steps

### 1. Check Application State

Open browser console and run:
```javascript
// Check if user is logged in
localStorage.getItem('sellizi-auth')

// Check Supabase connection
supabase.from('profiles').select('count')
```

### 2. Check Database Connection

In Supabase SQL Editor:
```sql
-- Test basic query
SELECT COUNT(*) FROM profiles;

-- Check your user
SELECT * FROM auth.users LIMIT 5;

-- Check profiles
SELECT * FROM profiles LIMIT 5;
```

### 3. Check Edge Functions

Test endpoints directly:
```bash
curl https://YOUR_PROJECT.supabase.co/functions/v1/ashtechpay-countries \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 4. Check Logs

**Vercel Logs:**
- Dashboard → Project → Deployments → Logs

**Supabase Logs:**
- Dashboard → Logs
- Filter by: Edge Functions, Auth, Database

**Browser Logs:**
- F12 → Console
- F12 → Network
- F12 → Application → Storage

---

## 🆘 Still Having Issues?

### Step-by-Step Reset

If nothing works, try this complete reset:

**1. Clear Everything:**
```bash
# Clear browser
- Clear all cookies for your domain
- Clear localStorage
- Clear cache
- Close all tabs
```

**2. Reset Database:**
```sql
-- DANGER: This deletes all data!
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS external_buyers CASCADE;

-- Then run schema.sql again
```

**3. Redeploy:**
```bash
# In Vercel
- Click "Redeploy"
- Select "Use existing Build Cache" = NO
```

**4. Test Fresh:**
- Open incognito window
- Sign up with NEW email
- Should work now

---

## 📧 Get Help

If you're still stuck:

**1. Gather Information:**
- Browser console errors (screenshot)
- Network tab errors (screenshot)
- Supabase logs
- Exact steps to reproduce

**2. Contact Support:**
- Email: honestansah@gmail.com
- Include: screenshots, error messages, steps to reproduce

**3. Useful Info to Include:**
- Browser & version
- Operating system
- Deployment URL
- What you were trying to do
- What actually happened
- Any error messages

---

## ✅ Verification Checklist

After fixing, verify these work:

**Authentication:**
- [ ] Can sign up
- [ ] Can sign in
- [ ] Can reset password
- [ ] Profile is created
- [ ] Redirects to correct dashboard

**Buyer:**
- [ ] Can access dashboard
- [ ] Can view products
- [ ] Can see purchases

**Seller:**
- [ ] Can access dashboard
- [ ] Can upload products
- [ ] Can view orders
- [ ] Can see analytics

**Admin:**
- [ ] Can access admin panel
- [ ] Can manage users
- [ ] Can view transactions
- [ ] Can update settings

**Payment:**
- [ ] Can initiate payment
- [ ] Countries load correctly
- [ ] Operators show up
- [ ] Webhook receives updates

---

## 🔒 Security Notes

**Never share:**
- Service Role Key (keep in Vercel only)
- Ashtechpay API Key
- Database password
- VAPID Private Key

**Always use:**
- HTTPS in production
- Environment variables for secrets
- RLS policies on all tables
- Strong passwords

---

**Last Updated:** 2024
**Version:** 1.0.0
**Support:** honestansah@gmail.com
