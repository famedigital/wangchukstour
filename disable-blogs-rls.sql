-- Disable RLS for blogs table to allow inserts
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Or alternatively, if you want to keep RLS enabled, add these policies:
-- CREATE POLICY "Allow all access to blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);
