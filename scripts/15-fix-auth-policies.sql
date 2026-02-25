-- Create simple, non-recursive policies to fix infinite recursion
-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- Disable RLS temporarily to avoid conflicts
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simple policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure stalls policies are also simple
DROP POLICY IF EXISTS "Stalls are viewable by everyone" ON stalls;
DROP POLICY IF EXISTS "Stall owners can manage their stalls" ON stalls;

CREATE POLICY "Enable read access for all users" ON stalls
    FOR SELECT USING (true);

CREATE POLICY "Stall owners can manage their stalls" ON stalls
    FOR ALL USING (auth.uid() = owner_id);
