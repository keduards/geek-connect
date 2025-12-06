-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- Enable Row Level Security
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view user skills
CREATE POLICY "User skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

-- Policy: Users can manage their own skills
CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS user_skills_user_id_idx ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS user_skills_skill_id_idx ON user_skills(skill_id);

