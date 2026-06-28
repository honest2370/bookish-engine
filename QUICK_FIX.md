# 🚨 QUICK FIX - Login/Signup Not Working

## The Problem
Login/signup button shows loading but nothing happens, stays on same page.

## The Solution (3 Steps - 5 Minutes)

### Step 1: Disable Email Confirmation ⚡

1. Open Supabase Dashboard: https://supabase.com
2. Go to your project
3. Click **Authentication** (left sidebar)
4. Click **Providers**
5. Click **Email**
6. **UNCHECK** "Confirm email"
7. Click **Save**

✅ This lets users sign in immediately without email verification.

---

### Step 2: Fix Database Policies 🔐

1. In Supabase Dashboard, click **SQL Editor**
2. Copy and paste this EXACT code:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create new policies
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);
```

3. Click **Run** (or press Ctrl+Enter)
4. Wait for "Success" message

---

### Step 3: Clear Browser & Test 🧹

1. **Clear Browser Cache:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cookies and other site data"
   - Select "Cached images and files"
   - Click "Clear data"

2. **Close ALL tabs** of your app

3. **Open in Incognito/Private mode**

4. **Try to sign up** with a NEW email

---

## ✅ It Should Work Now!

After these 3 steps:
- Sign up should create account instantly
- Login should work immediately
- You'll be redirected to dashboard

---

## 🔍 Still Not Working?

### Check This:

**1. Are tables created?**
```sql
-- Run in SQL Editor
SELECT COUNT(*) FROM profiles;
```
If error: Run `supabase/schema.sql` first

**2. Check browser console:**
- Press F12
- Click "Console" tab
- Look for red errors
- Share screenshot if you need help

**3. Check environment variables in Vercel:**
```
VITE_SUPABASE_URL = https://gffzzhbvqorepaycpcqz.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGci... (long key)
VITE_SUPABASE_SERVICE_ROLE_KEY = eyJhbGci... (long key)
```

After adding/changing env vars in Vercel, **REDEPLOY**!

---

## 🎯 Test Checklist

Try these in order:

1. [ ] Go to /signup
2. [ ] Fill all fields
3. [ ] Click "Create Account"
4. [ ] ✅ Should redirect to /seller/dashboard
5. [ ] ✅ Should see "SELLIZI Seller" at top
6. [ ] Sign out
7. [ ] Go to /signin
8. [ ] Enter same email/password
9. [ ] Click "Sign In"
10. [ ] ✅ Should redirect to dashboard again

---

## 💡 Pro Tips

**For Testing:**
- Use different email each time: test1@gmail.com, test2@gmail.com, etc.
- Use simple password: `password123`
- Clear cache between tests

**For Production:**
- Enable email confirmation later
- Use strong passwords
- Set up email templates

---

## 🆘 Emergency Reset

If NOTHING works, do this:

### 1. Delete All Auth Users
```sql
-- In Supabase SQL Editor
DELETE FROM auth.users;
DELETE FROM profiles;
```

### 2. Clear Browser Completely
- Settings → Clear browsing data → All time
- Check ALL boxes
- Clear

### 3. Try Again
- Fresh signup with new email
- Should work now

---

## 📞 Still Stuck?

**Contact:** honestansah@gmail.com

**Include:**
1. Screenshot of browser console (F12)
2. Screenshot of Network tab (F12 → Network)
3. What you tried
4. Error messages

**Response time:** Usually within 24 hours

---

## ✨ After It Works

Once login/signup works:

1. **Create admin account:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

2. **Test all features:**
- Upload a product
- Create a support ticket
- Check analytics
- Try payment (with test data)

3. **Deploy to production:**
- Follow DEPLOYMENT.md
- Set up custom domain
- Configure Ashtechpay

---

**This should fix 99% of login issues!** 🎉

If it doesn't, there might be a deeper issue - contact support.
