# Supabase Configuration Guide

## Critical Settings for SELLIZI

### 1. Disable Email Confirmation (for easier testing)

Go to **Authentication** → **Providers** → **Email**:
- ✅ Enable Email provider
- ❌ **Uncheck** "Confirm email"
- This allows users to sign in immediately without email verification

Later in production, you can enable this and configure email templates.

### 2. Configure Site URL

Go to **Authentication** → **URL Configuration**:
- **Site URL**: `https://yourapp.vercel.app` (or your domain)
- **Redirect URLs**: Add:
  - `http://localhost:5173/**`
  - `https://yourapp.vercel.app/**`
  - `https://*.vercel.app/**`

### 3. Enable Google OAuth (Optional)

Go to **Authentication** → **Providers** → **Google**:
1. Get OAuth credentials from Google Cloud Console
2. Add Client ID and Secret
3. Enable the provider

### 4. RLS Policies - Important!

Make sure Row Level Security is enabled but with proper policies.

Run this SQL to ensure profiles can be created:

\`\`\`sql
-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow everyone to view active products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT
  USING (status = 'active');

-- Allow sellers to manage their own products
DROP POLICY IF EXISTS "Sellers can manage own products" ON products;
CREATE POLICY "Sellers can manage own products" ON products
  FOR ALL
  USING (auth.uid() = seller_id);
\`\`\`

### 5. Test Database Connection

Run this simple query in SQL Editor:

\`\`\`sql
SELECT * FROM profiles LIMIT 1;
\`\`\`

If you get an error, run the schema.sql again.

### 6. Create Your First Admin

After signing up normally, run:

\`\`\`sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
\`\`\`

### 7. Configure Admin Settings

\`\`\`sql
-- Add Ashtechpay API Key
UPDATE admin_settings 
SET value = '"YOUR_ASHTECHPAY_API_KEY"'
WHERE key = 'ashtechpay_api_key';

-- Add VAPID Public Key (get from https://vapidkeys.com/)
UPDATE admin_settings 
SET value = '"YOUR_VAPID_PUBLIC_KEY"'
WHERE key = 'vapid_public_key';
\`\`\`

### 8. Verify Tables Exist

Run this to check all tables are created:

\`\`\`sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
\`\`\`

You should see:
- profiles
- products
- orders
- purchases
- support_tickets
- support_messages
- notifications
- analytics
- admin_settings
- external_buyers

---

## Common Issues & Fixes

### Issue: "Failed to create profile"
**Fix**: Check RLS policies, run the SQL above.

### Issue: "Email not confirmed"
**Fix**: Disable email confirmation in Auth settings.

### Issue: "Profile not found"
**Fix**: The app will auto-create profiles now. Just sign in again.

### Issue: "Permission denied"
**Fix**: Check RLS policies are correct.

### Issue: Can't sign in after sign up
**Fix**: Disable email confirmation, or check your email for confirmation link.

---

## Testing Checklist

After configuration:
1. ✅ Sign up creates account
2. ✅ Sign up creates profile automatically
3. ✅ Can sign in immediately
4. ✅ Profile has correct role
5. ✅ Redirects to correct dashboard
6. ✅ Can view profile data
7. ✅ Can update profile

---

## Production Checklist

Before going live:
1. ✅ Enable email confirmation
2. ✅ Configure email templates
3. ✅ Set up custom domain
4. ✅ Add Google OAuth
5. ✅ Configure rate limiting
6. ✅ Enable 2FA for admin
7. ✅ Set up database backups
8. ✅ Configure error tracking

---

**Need help?** Contact: honestansah@gmail.com
