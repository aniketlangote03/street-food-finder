-- Clean fix for RLS policies without conflicts
-- First, disable RLS to clean up
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.submissions_status DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on users table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.users';
    END LOOP;
    
    -- Drop all policies on stalls table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stalls' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.stalls';
    END LOOP;
    
    -- Drop all policies on menu_items table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'menu_items' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.menu_items';
    END LOOP;
    
    -- Drop all policies on reviews table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.reviews';
    END LOOP;
    
    -- Drop all policies on submissions_status table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'submissions_status' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.submissions_status';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions_status ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies

-- Users table policies
CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Stalls table policies
CREATE POLICY "stalls_select_approved" ON public.stalls FOR SELECT USING (is_approved = true);
CREATE POLICY "stalls_select_own" ON public.stalls FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "stalls_insert_policy" ON public.stalls FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "stalls_update_own" ON public.stalls FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "stalls_delete_own" ON public.stalls FOR DELETE USING (auth.uid() = owner_id);

-- Menu items table policies
CREATE POLICY "menu_items_select_policy" ON public.menu_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.is_approved = true)
);
CREATE POLICY "menu_items_owner_policy" ON public.menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.owner_id = auth.uid())
);

-- Reviews table policies
CREATE POLICY "reviews_select_policy" ON public.reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = reviews.stall_id AND stalls.is_approved = true)
);
CREATE POLICY "reviews_insert_policy" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Submissions status table policies
CREATE POLICY "submissions_select_own" ON public.submissions_status FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = submissions_status.stall_id AND stalls.owner_id = auth.uid())
);
CREATE POLICY "submissions_insert_policy" ON public.submissions_status FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = submissions_status.stall_id AND stalls.owner_id = auth.uid())
);
