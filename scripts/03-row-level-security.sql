-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

DROP POLICY IF EXISTS "Anyone can view approved stalls" ON public.stalls;
DROP POLICY IF EXISTS "Stall owners can view their own stalls" ON public.stalls;
DROP POLICY IF EXISTS "Stall owners can create stalls" ON public.stalls;
DROP POLICY IF EXISTS "Stall owners can update their own stalls" ON public.stalls;
DROP POLICY IF EXISTS "Stall owners can delete their own stalls" ON public.stalls;
DROP POLICY IF EXISTS "Admins can manage all stalls" ON public.stalls;

DROP POLICY IF EXISTS "Anyone can view menu items for approved stalls" ON public.menu_items;
DROP POLICY IF EXISTS "Stall owners can manage their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins can view all menu items" ON public.menu_items;

DROP POLICY IF EXISTS "Stall owners can view their submissions" ON public.submissions_status;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions_status;

DROP POLICY IF EXISTS "Anyone can view reviews for approved stalls" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Stalls policies
CREATE POLICY "Anyone can view approved stalls" ON public.stalls
  FOR SELECT USING (approval_status = 'approved');

CREATE POLICY "Stall owners can view their own stalls" ON public.stalls
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Stall owners can create stalls" ON public.stalls
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Stall owners can update their own stalls" ON public.stalls
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Stall owners can delete their own stalls" ON public.stalls
  FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all stalls" ON public.stalls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Menu items policies
CREATE POLICY "Anyone can view menu items for approved stalls" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND approval_status = 'approved'
    )
  );

CREATE POLICY "Stall owners can manage their menu items" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all menu items" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Submissions status policies
CREATE POLICY "Stall owners can view their submissions" ON public.submissions_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all submissions" ON public.submissions_status
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews for approved stalls" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND approval_status = 'approved'
    )
  );

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Additional RLS policies if needed, or to re-apply them.
-- The main RLS policies are already in 01-create-database-schema.sql
-- Keeping this file for consistency with previous context, but it might be empty or contain specific overrides.

-- Example: Admin can see all stalls regardless of approval status
-- This would typically be handled by a function or a more complex policy if needed.
-- For now, the policies in 01-create-database-schema.sql are sufficient.
