# Final Setup Checklist

Use this checklist to verify your CursorCafe networking app is ready to run.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] pnpm (or npm) installed
- [ ] Supabase account created
- [ ] Supabase project created

## Environment Configuration

- [ ] `.env.local` file created in root directory
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set to your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set to your Supabase anon key
- [ ] Environment variables match values from Supabase Settings → API

## Supabase Setup

### Authentication
- [ ] GitHub OAuth provider enabled in Supabase
- [ ] GitHub OAuth credentials (Client ID & Secret) configured
- [ ] Redirect URL added: `http://localhost:3000/auth/callback`

### Database
- [ ] Minimal schema SQL executed (Step 6 - `20240101000007_minimal_schema.sql`)
- [ ] Tables created: `profiles`, `collab_posts`, `messages`
- [ ] Row Level Security (RLS) policies enabled
- [ ] Indexes created

### Seed Data (Optional but Recommended)
- [ ] Seed mock users SQL executed (Step 15 - `20240101000008_seed_mock_users.sql`)
- [ ] 4 mock profiles inserted: Alex, Maya, Ravi, Lina

## Application Setup

- [ ] Dependencies installed: `pnpm install` (or `npm install`)
- [ ] No installation errors
- [ ] Dev server starts: `pnpm dev` (or `npm run dev`)
- [ ] Server accessible at http://localhost:3000

## Testing Flow

### Authentication
- [ ] Navigate to http://localhost:3000
- [ ] Redirected to `/login` page
- [ ] "Sign in with GitHub" button visible
- [ ] Click button → GitHub OAuth flow works
- [ ] Redirected back to `/auth/callback`
- [ ] Profile auto-created in database
- [ ] Redirected to `/onboarding`

### Onboarding
- [ ] Onboarding page loads
- [ ] Role dropdown shows all options
- [ ] Skills input field works
- [ ] Can enter skills (comma-separated)
- [ ] "Save & Continue" button works
- [ ] Profile updated in database
- [ ] Redirected to `/matches`

### Matches Page
- [ ] Matches page loads
- [ ] Other profiles displayed (if seed data exists)
- [ ] Match scores shown as percentages
- [ ] Match explanations visible ("Shared skills: ...")
- [ ] "Request Intro" button works
- [ ] Message created in database when clicked
- [ ] Success alert shown

### Collaboration Board
- [ ] Navigate to `/collab`
- [ ] Create post form visible
- [ ] Can enter title, description, role needed
- [ ] "Create Post" button works
- [ ] Post appears in list
- [ ] "Apply / Request Intro" button works on posts
- [ ] Message created when clicked

### Profile Page
- [ ] Navigate to `/profile`
- [ ] Profile information displayed
- [ ] "Edit Profile" button works
- [ ] Can update display name, role, skills, bio
- [ ] "Save Changes" updates database
- [ ] Changes persist after refresh

### Navigation
- [ ] Navigation bar visible on all pages
- [ ] All links work: Onboarding, Matches, Collab, Profile
- [ ] Active page highlighted
- [ ] "Sign Out" button works (if logged in)
- [ ] "Login" link shows when not authenticated

## Verification

- [ ] No console errors in browser
- [ ] No errors in terminal/server logs
- [ ] All pages load without errors
- [ ] Database queries work (check Supabase dashboard)
- [ ] RLS policies allow expected operations
- [ ] OAuth flow completes successfully

## Ready to Demo! ✅

Once all items are checked, your app is ready for demos and testing.

---

**Quick Commands:**
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Check environment variables
cat .env.local
```

