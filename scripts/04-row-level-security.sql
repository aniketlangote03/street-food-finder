-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

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
  FOR SELECT USING (approval_status = 'Approved');

CREATE POLICY "Stall owners can view their own stalls" ON public.stalls
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Stall owners can insert their own stalls" ON public.stalls
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Stall owners can update their own stalls" ON public.stalls
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all stalls" ON public.stalls
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Menu items policies
CREATE POLICY "Anyone can view menu items for approved stalls" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE stalls.id = menu_items.stall_id 
      AND stalls.approval_status = 'Approved'
    )
  );

CREATE POLICY "Stall owners can manage their menu items" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE stalls.id = menu_items.stall_id 
      AND stalls.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all menu items" ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews for approved stalls" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE stalls.id = reviews.stall_id 
      AND stalls.approval_status = 'Approved'
    )
  );

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Submissions policies
CREATE POLICY "Stall owners can view their own submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE stalls.id = submissions.stall_id 
      AND stalls.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all submissions" ON public.submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Reports policies
CREATE POLICY "Authenticated users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
