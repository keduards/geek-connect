# Quick Start Guide

## Installation

```bash
pnpm install
```

## Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**How to get these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

### 1. Enable GitHub OAuth
1. Go to **Authentication → Providers** in Supabase
2. Enable **GitHub** provider
3. Add your GitHub OAuth App credentials
4. In **Authentication → URL Configuration**, add redirect URL:
   - `http://localhost:3000/auth/callback`

### 2. Run Database SQL

Copy and paste this SQL into Supabase **SQL Editor**:

```sql
-- Minimal schema for MVP
-- users table (basic)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE, -- supabase auth id
  display_name TEXT,
  role TEXT,
  skills TEXT[], -- array of tags
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- collaboration posts
CREATE TABLE IF NOT EXISTS collab_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT REFERENCES profiles(user_id),
  title TEXT,
  description TEXT,
  role_needed TEXT,
  skills_required TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages (simple intro requests)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id TEXT,
  to_id TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
-- Profiles: everyone can view, users can update their own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Collab posts: everyone can view, authenticated users can create
CREATE POLICY "Collab posts are viewable by everyone"
  ON collab_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create collab posts"
  ON collab_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own collab posts"
  ON collab_posts FOR UPDATE
  USING (auth.uid()::text = author_id);

-- Messages: users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid()::text = from_id OR auth.uid()::text = to_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid()::text = from_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS collab_posts_author_id_idx ON collab_posts(author_id);
CREATE INDEX IF NOT EXISTS messages_from_id_idx ON messages(from_id);
CREATE INDEX IF NOT EXISTS messages_to_id_idx ON messages(to_id);
```

### 3. (Optional) Seed Mock Data

For testing, you can add mock users:

```sql
INSERT INTO profiles (user_id, display_name, role, skills, bio) VALUES
  ('u1', 'Alex', 'developer', ARRAY['react', 'typescript', 'aws'], 'Full-stack developer'),
  ('u2', 'Maya', 'founder', ARRAY['healthcare', 'product', 'research'], 'Healthcare entrepreneur'),
  ('u3', 'Ravi', 'developer', ARRAY['python', 'fastapi', 'ml'], 'ML engineer'),
  ('u4', 'Lina', 'product_designer', ARRAY['figma', 'ux', 'product'], 'Product designer')
ON CONFLICT (user_id) DO NOTHING;
```

## Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Quick Test Flow

1. **Sign in** → Click "Sign in with GitHub" on login page
2. **Onboarding** → Set your role and skills
3. **Matches** → View other profiles and request intros
4. **Collab** → Create posts and apply to opportunities
5. **Profile** → View and edit your profile

## Troubleshooting

- **OAuth not working**: Verify redirect URL in Supabase matches `http://localhost:3000/auth/callback`
- **No data showing**: Run the seed SQL to add mock users
- **Profile not creating**: Check browser console for errors, verify RLS policies are set

