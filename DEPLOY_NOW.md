# 🚀 DEPLOY NOW - 5 MINUTE SETUP

**Your app is ready. Let's deploy.**

---

## Step 1: Supabase (2 minutes)

### 1. Run SQL
Go to: https://supabase.com → Your Project → SQL Editor

Copy & paste this, then click **Run**:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);
```

### 2. Disable Email Confirmation
- Go to **Authentication** → **Providers** → **Email**
- **Uncheck** "Confirm email"
- **Save**

---

## Step 2: Vercel (1 minute)

1. Go to: https://vercel.com/dashboard
2. Find your SELLIZI project
3. Click **Redeploy**
4. Wait ~2 minutes

---

## Step 3: Test (1 minute)

Your URL should be: `https://sellizi-[yourname].vercel.app`

**Test:**
1. Visit URL
2. Click "Start Selling" 
3. Sign up (use any email)
4. Should see dashboard
5. Click Menu → Sign Out
6. Click "Sign In"
7. Sign in with same email
8. Should see dashboard again

✅ **DONE!**

---

## If Something Goes Wrong

**Browser won't load page:**
```
1. Press Ctrl+Shift+Delete
2. Clear "Cached images & files"
3. Refresh page
```

**Signup/signin not working:**
```
1. Make sure you ran the SQL above
2. Make sure you disabled email confirmation
3. Check browser console (F12)
4. Try different email
```

**Still broken:**
```
Email: honestansah@gmail.com
Include: Screenshot of error
```

---

## You're Live! 🎉

Your app is now deployed and ready for users.

**Share your URL:** `https://sellizi-[yourname].vercel.app`

**Next:** Customize, add features, scale!

---

**Questions?** Read `START_HERE.md`

**Need help?** Read `TROUBLESHOOTING.md`
