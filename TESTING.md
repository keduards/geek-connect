# End-to-End Testing Guide

## Prerequisites

1. **Supabase Setup**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Enable GitHub OAuth in Authentication → Providers
   - Add redirect URL: `http://localhost:3000/auth/callback`
   - Get your project URL and anon key from Settings → API

2. **Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Database Migrations**:
   - Run the minimal schema migration: `20240101000007_minimal_schema.sql`
   - (Optional) Run seed data: `20240101000008_seed_mock_users.sql`

## Testing Flow

### Step 1: Start Dev Server
```bash
npm run dev
```
Server should start on http://localhost:3000

### Step 2: Sign In via GitHub
1. Navigate to http://localhost:3000
2. You should be redirected to `/login`
3. Click "Sign in with GitHub"
4. Complete GitHub OAuth flow
5. You'll be redirected back to `/auth/callback`
6. Profile should be auto-created (check console/logs)
7. Redirected to `/onboarding`

### Step 3: Complete Onboarding
1. On `/onboarding` page:
   - Select a role (e.g., "Developer")
   - Enter skills (e.g., "React, TypeScript, Node.js")
   - Click "Save & Continue"
2. Should redirect to `/matches`

### Step 4: View Matches
1. On `/matches` page:
   - Should see seeded profiles (Alex, Maya, Ravi, Lina) if seed migration was run
   - Each profile shows:
     - Display name
     - Role
     - Skills
     - Match score (percentage)
   - Click "Request Intro" on any profile
   - Should see "Intro requested" alert
   - Check Supabase `messages` table to verify message was created

### Step 5: Collaboration Board
1. Navigate to `/collab`
2. Create a new post:
   - Enter title (e.g., "Looking for React Developer")
   - Select role needed (e.g., "Developer")
   - Enter description
   - Click "Create Post"
3. View existing posts:
   - Should see your newly created post
   - Should see other posts if they exist
4. Apply to a post:
   - Click "Apply / Request Intro" on any post
   - Should see "Sent interest" alert
   - Check Supabase `messages` table to verify message was created

### Step 6: Profile Page
1. Navigate to `/profile`
2. View your profile:
   - Should see your display name, role, skills, bio
3. Edit profile:
   - Click "Edit Profile"
   - Update any fields
   - Click "Save Changes"
   - Should see updated information

## Verification Checklist

- [ ] Dev server starts without errors
- [ ] GitHub OAuth redirects correctly
- [ ] Profile auto-created on first sign-in
- [ ] Onboarding form saves role and skills
- [ ] Matches page shows other profiles
- [ ] Match scores are calculated and displayed
- [ ] "Request Intro" creates message in database
- [ ] Collaboration board displays posts
- [ ] Can create new collaboration post
- [ ] "Apply" button creates message
- [ ] Profile page displays and edits correctly
- [ ] Navigation works between all pages

## Troubleshooting

- **OAuth not working**: Check redirect URL in Supabase matches `http://localhost:3000/auth/callback`
- **No profiles showing**: Run seed migration or create profiles manually
- **Profile not auto-creating**: Check browser console for errors, verify RLS policies
- **Messages not creating**: Check RLS policies on `messages` table allow INSERT

