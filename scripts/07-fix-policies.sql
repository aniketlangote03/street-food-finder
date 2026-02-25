-- Fix infinite recursion in RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Disable RLS temporarily to fix policies
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with simpler policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Simple policies for users table
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Simple policies for stalls table
CREATE POLICY "Approved stalls are viewable by everyone" ON public.stalls FOR SELECT USING (is_approved = true);
CREATE POLICY "Owners can view their own stalls" ON public.stalls FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can create stalls" ON public.stalls FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their own stalls" ON public.stalls FOR UPDATE USING (auth.uid() = owner_id);

-- Simple policies for menu_items table
CREATE POLICY "Menu items are viewable for approved stalls" ON public.menu_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.is_approved = true)
);
CREATE POLICY "Owners can manage their menu items" ON public.menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.owner_id = auth.uid())
);

-- Simple policies for reviews table
CREATE POLICY "Reviews are viewable for approved stalls" ON public.reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = reviews.stall_id AND stalls.is_approved = true)
);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
