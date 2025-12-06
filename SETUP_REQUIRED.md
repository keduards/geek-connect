# ⚠️ Setup Required Before Testing

The dev server is starting, but you need to complete these steps:

## 1. Configure Supabase Credentials

Edit `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-actual-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

**Where to get these:**
1. Go to https://app.supabase.com
2. Select your project (or create one)
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Set Up GitHub OAuth in Supabase

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable **GitHub** provider
3. Add your GitHub OAuth App credentials:
   - Create OAuth app at: https://github.com/settings/developers
   - Use callback URL: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. In **Authentication → URL Configuration**, add:
   - `http://localhost:3000/auth/callback`

## 3. Run Database SQL

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the SQL from `supabase/migrations/20240101000007_minimal_schema.sql`
3. Paste and run it
4. (Optional) Run seed data: `supabase/migrations/20240101000008_seed_mock_users.sql`

## 4. Restart Dev Server

After updating `.env.local`, restart the server:
- Stop current server (Ctrl+C)
- Run: `pnpm dev`

## 5. Test the App

Once configured:
1. Open http://localhost:3000
2. You should see the login page
3. Click "Sign in with GitHub"
4. Complete OAuth flow
5. You'll be redirected to onboarding

---

**Quick Reference:**
- Dev server: http://localhost:3000
- Environment file: `.env.local` (needs your Supabase credentials)
- Database SQL: `supabase/migrations/20240101000007_minimal_schema.sql`
- Full checklist: See `CHECKLIST.md`

