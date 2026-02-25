-- Fix infinite recursion in database policies
-- Drop all existing policies that might cause recursion

-- Drop policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON users;

-- Drop policies on stalls table that might reference users
DROP POLICY IF EXISTS "Stalls are viewable by everyone" ON stalls;
DROP POLICY IF EXISTS "Enable read access for all users" ON stalls;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON stalls;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON stalls;

-- Create simple, non-recursive policies

-- Users table policies (simple and safe)
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Stalls table policies (simple and safe)
CREATE POLICY "Enable read access for all users" ON stalls
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON stalls
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Stall owners can update own stalls" ON stalls
    FOR UPDATE USING (auth.uid() = owner_id);

-- Reviews table policies
CREATE POLICY "Enable read access for all users" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Menu items table policies
CREATE POLICY "Enable read access for all users" ON menu_items
    FOR SELECT USING (true);

CREATE POLICY "Stall owners can manage menu items" ON menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stalls 
            WHERE stalls.id = menu_items.stall_id 
            AND stalls.owner_id = auth.uid()
        )
    );

-- Live orders table policies
CREATE POLICY "Enable read access for all users" ON live_orders
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON live_orders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications table policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reports table policies
CREATE POLICY "Enable read access for all users" ON reports
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Stall analytics table policies
CREATE POLICY "Enable read access for all users" ON stall_analytics
    FOR SELECT USING (true);

CREATE POLICY "Stall owners can update analytics" ON stall_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stalls 
            WHERE stalls.id = stall_analytics.stall_id 
            AND stalls.owner_id = auth.uid()
        )
    );

-- Submissions table policies
CREATE POLICY "Enable read access for all users" ON submissions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
