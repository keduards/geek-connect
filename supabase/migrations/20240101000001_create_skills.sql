-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view skills
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert skills (for admin purposes)
CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create index for name lookups
CREATE INDEX IF NOT EXISTS skills_name_idx ON skills(name);
CREATE INDEX IF NOT EXISTS skills_category_idx ON skills(category);

