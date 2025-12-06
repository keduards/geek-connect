-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  matched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view matches they're involved in
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Users can create matches (system will handle this)
CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Users can update matches they're involved in
CREATE POLICY "Users can update own matches"
  ON matches FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS matches_user1_id_idx ON matches(user1_id);
CREATE INDEX IF NOT EXISTS matches_user2_id_idx ON matches(user2_id);
CREATE INDEX IF NOT EXISTS matches_status_idx ON matches(status);

