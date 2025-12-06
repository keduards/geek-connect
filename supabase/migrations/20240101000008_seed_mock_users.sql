-- Seed mock users for demo/testing purposes
-- These are placeholder user_ids that won't match real auth users
-- Replace with actual user_ids from auth.users when ready

INSERT INTO profiles (user_id, display_name, role, skills, bio) VALUES
  ('u1', 'Alex', 'developer', ARRAY['react', 'typescript', 'aws'], 'Full-stack developer passionate about building scalable web applications.'),
  ('u2', 'Maya', 'founder', ARRAY['healthcare', 'product', 'research'], 'Healthcare entrepreneur building the future of patient care.'),
  ('u3', 'Ravi', 'developer', ARRAY['python', 'fastapi', 'ml'], 'ML engineer specializing in backend systems and AI applications.'),
  ('u4', 'Lina', 'product_designer', ARRAY['figma', 'ux', 'product'], 'Product designer focused on creating intuitive user experiences.')
ON CONFLICT (user_id) DO NOTHING;

