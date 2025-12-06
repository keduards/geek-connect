-- Minimal schema for MVP
-- This is a simplified version of the schema

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

