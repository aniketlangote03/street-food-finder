-- Fix infinite recursion in users table policies
-- This script disables RLS on users table and creates simple policies for other tables

-- Disable RLS on users table to prevent infinite recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Ensure stalls table has simple read policies
DROP POLICY IF EXISTS "Stalls are viewable by everyone" ON stalls;
CREATE POLICY "Stalls are viewable by everyone" ON stalls
    FOR SELECT USING (true);

-- Ensure reviews table has simple policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

-- Ensure menu_items table has simple policies
DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON menu_items;
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
    FOR SELECT USING (true);
