-- Simple fix for infinite recursion in policies
-- This script removes problematic policies and creates basic ones

-- Disable RLS temporarily to avoid recursion during policy changes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE stall_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to prevent conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Re-enable RLS with simple policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE stall_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "public_read" ON users FOR SELECT USING (true);
CREATE POLICY "public_read" ON stalls FOR SELECT USING (true);
CREATE POLICY "public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "public_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "public_read" ON live_orders FOR SELECT USING (true);
CREATE POLICY "public_read" ON notifications FOR SELECT USING (true);
CREATE POLICY "public_read" ON reports FOR SELECT USING (true);
CREATE POLICY "public_read" ON stall_analytics FOR SELECT USING (true);
CREATE POLICY "public_read" ON submissions FOR SELECT USING (true);
