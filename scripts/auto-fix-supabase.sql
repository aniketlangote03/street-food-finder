-- Auto-fix script for Supabase schema and RLS issues
-- Run this in Supabase SQL Editor once

-- 1. Add missing 'available' column to menu_items (fixes PGRST204)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'available' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.menu_items ADD COLUMN available BOOLEAN NOT NULL DEFAULT true;
        RAISE NOTICE 'Added available column to menu_items table';
    ELSE
        RAISE NOTICE 'available column already exists in menu_items table';
    END IF;
END $$;

-- 2. Ensure required columns exist on stalls
DO $$
BEGIN
    -- is_approved column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'is_approved' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN is_approved BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_approved column to stalls table';
    END IF;

    -- status column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE 'Added status column to stalls table';
    END IF;

    -- average_rating column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'average_rating' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
        RAISE NOTICE 'Added average_rating column to stalls table';
    END IF;

    -- review_count column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'review_count' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN review_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added review_count column to stalls table';
    END IF;

    -- cuisine_type column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'cuisine_type' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN cuisine_type TEXT;
        RAISE NOTICE 'Added cuisine_type column to stalls table';
    END IF;

    -- queue_time column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'queue_time' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN queue_time INTEGER DEFAULT 0;
        RAISE NOTICE 'Added queue_time column to stalls table';
    END IF;
END $$;

-- 3. Fix RLS policies - disable, drop all, then recreate simple policies
-- Disable RLS temporarily
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. Create simple, non-recursive policies

-- Users table policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
        CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Stalls table policies
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

-- Menu items table policies
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

-- Reviews table policies
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

-- 5. Ensure existing stalls are approved
UPDATE public.stalls 
SET is_approved = true 
WHERE is_approved IS NULL OR is_approved = false;

-- 6. Show final status (using DO block for notices)
DO $$
BEGIN
    RAISE NOTICE '=== Auto-fix completed ===';
    RAISE NOTICE 'menu_items.available column: %', 
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='available') 
             THEN 'EXISTS' ELSE 'MISSING' END;
    RAISE NOTICE 'stalls.is_approved column: %', 
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='is_approved') 
             THEN 'EXISTS' ELSE 'MISSING' END;
    RAISE NOTICE 'RLS policies created for: users, stalls, menu_items, reviews';
END $$;
