# CursorCafe - Networking App

A networking app for product-development roles (developers, product managers, product designers, QA, DevOps, founders).

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase
- **Authentication**: Google OAuth

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API to get your project URL and anon key
   - Go to Authentication → Providers and enable Google OAuth
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - In Authentication → URL Configuration, add your redirect URL:
     - For development: `http://localhost:3000/auth/callback`
     - For production: `https://yourdomain.com/auth/callback`

3. **Run database migrations**:
   - Install Supabase CLI: `npm install -g supabase`
   - Link your project: `supabase link --project-ref your-project-ref`
   - Or manually run the migrations:
     - Go to your Supabase project dashboard
     - Navigate to SQL Editor
     - Run each migration file from `supabase/migrations/` in order:
       1. `20240101000000_create_profiles.sql` (or use minimal schema: `20240101000007_minimal_schema.sql`)
       2. `20240101000001_create_skills.sql` (skip if using minimal schema)
       3. `20240101000002_create_user_skills.sql` (skip if using minimal schema)
       4. `20240101000003_create_matches.sql` (skip if using minimal schema)
       5. `20240101000004_create_messages.sql` (skip if using minimal schema)
       6. `20240101000005_create_posts.sql` (skip if using minimal schema)
       7. `20240101000006_create_profile_trigger.sql` (optional)
       8. `20240101000008_seed_mock_users.sql` (optional - for demo data)

4. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Supabase credentials in `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional, for local dev scripts only
     ```
   - Get these values from your Supabase project: Settings → API
   - **Important**: Never commit `.env.local` to version control (it's in `.gitignore`)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── auth/
│   │   └── callback/     # OAuth callback handler
│   ├── login/            # Login page
│   ├── onboarding/       # Onboarding flow
│   └── ...
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase client utilities
│   └── auth.ts           # Auth helper functions
├── supabase/
│   └── migrations/       # Database migration files
└── middleware.ts          # Auth middleware
```

## Database Schema

The app uses the following tables:

- **profiles** - User profiles with role, goals, availability, and bio
- **skills** - Available skills that users can have
- **user_skills** - Junction table linking users to their skills with proficiency levels
- **matches** - Connections between users (pending, accepted, rejected)
- **messages** - Direct messages between users
- **posts** - Collaboration board posts (looking for team, looking to join, etc.)

All tables include Row Level Security (RLS) policies for data protection.

## Features

- ✅ GitHub OAuth authentication
- ✅ Protected routes with middleware
- ✅ Login page with GitHub sign-in
- ✅ Auth callback handling
- ✅ Onboarding redirect flow
- ✅ Database schema with migrations
- ✅ Row Level Security policies
- ✅ Tailwind CSS v4 for styling
- ✅ shadcn/ui components
- ✅ Matching algorithm
- ✅ Collaboration board
- ✅ Profile management
- ✅ Navigation shell

## Styling

The app uses **Tailwind CSS v4** for styling:

- ✅ Tailwind CSS v4 installed and configured
- ✅ PostCSS configured with `@tailwindcss/postcss`
- ✅ Global styles in `app/globals.css` with Tailwind imports
- ✅ shadcn/ui components for consistent UI
- ✅ Responsive design with Tailwind utility classes
- ✅ Dark mode support via CSS variables

All components use Tailwind utility classes for consistent styling. The layout is simple and clean, perfect for an MVP.

## Quick Links

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide with SQL and commands
- **[CHECKLIST.md](./CHECKLIST.md)** - Final verification checklist before demo
- **[TESTING.md](./TESTING.md)** - Detailed testing guide
