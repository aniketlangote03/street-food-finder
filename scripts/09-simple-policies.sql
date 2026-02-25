-- Simple fix for RLS policies - only create essential tables and policies
-- First, disable RLS to clean up
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on existing tables
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Re-enable RLS only for tables that exist
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies only for existing tables

-- Users table policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
        CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Stalls table policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stalls') THEN
        CREATE POLICY "stalls_select_approved" ON public.stalls FOR SELECT USING (is_approved = true);
        CREATE POLICY "stalls_select_own" ON public.stalls FOR SELECT USING (auth.uid() = owner_id);
        CREATE POLICY "stalls_insert_policy" ON public.stalls FOR INSERT WITH CHECK (auth.uid() = owner_id);
        CREATE POLICY "stalls_update_own" ON public.stalls FOR UPDATE USING (auth.uid() = owner_id);
        CREATE POLICY "stalls_delete_own" ON public.stalls FOR DELETE USING (auth.uid() = owner_id);
    END IF;
END $$;

-- Menu items table policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'menu_items') THEN
        CREATE POLICY "menu_items_select_policy" ON public.menu_items FOR SELECT USING (
          EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.is_approved = true)
        );
        CREATE POLICY "menu_items_owner_policy" ON public.menu_items FOR ALL USING (
          EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.owner_id = auth.uid())
        );
    END IF;
END $$;

-- Reviews table policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
        CREATE POLICY "reviews_select_policy" ON public.reviews FOR SELECT USING (
          EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = reviews.stall_id AND stalls.is_approved = true)
        );
        CREATE POLICY "reviews_insert_policy" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
