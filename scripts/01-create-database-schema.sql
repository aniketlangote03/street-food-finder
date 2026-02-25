-- Create 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    display_name text,
    full_name text, -- Added full_name for consistency
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Create 'stalls' table
CREATE TABLE IF NOT EXISTS public.stalls (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    owner_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    location_description text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    opening_time text NOT NULL,
    closing_time text NOT NULL,
    cuisine_type text NOT NULL,
    image_url text,
    status public.stall_status DEFAULT 'closed'::public.stall_status NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    average_rating numeric(2,1),
    review_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    current_queue_length integer DEFAULT 0 -- Added for realtime features
);

-- Create 'menu_items' table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    stall_id uuid REFERENCES public.stalls ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Create 'reviews' table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    stall_id uuid REFERENCES public.stalls ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Create 'realtime_data' table for testing purposes
CREATE TABLE IF NOT EXISTS public.realtime_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    value integer NOT NULL,
    timestamp timestamp with time zone DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_data ENABLE ROW LEVEL SECURITY;

-- Policies for 'users' table
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users;
CREATE POLICY "Public users are viewable by everyone." ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for 'stalls' table
DROP POLICY IF EXISTS "Approved stalls are viewable by everyone." ON public.stalls;
CREATE POLICY "Approved stalls are viewable by everyone." ON public.stalls FOR SELECT USING (is_approved = true);
DROP POLICY IF EXISTS "Owners can view their own stalls (even unapproved)." ON public.stalls;
CREATE POLICY "Owners can view their own stalls (even unapproved)." ON public.stalls FOR SELECT USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can create stalls." ON public.stalls;
CREATE POLICY "Owners can create stalls." ON public.stalls FOR INSERT WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can update their own stalls." ON public.stalls;
CREATE POLICY "Owners can update their own stalls." ON public.stalls FOR UPDATE USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners can delete their own stalls." ON public.stalls;
CREATE POLICY "Owners can delete their own stalls." ON public.stalls FOR DELETE USING (auth.uid() = owner_id);
-- Admin policy for stalls (can view/update/delete all stalls) - will be handled by a function later

-- Policies for 'menu_items' table
DROP POLICY IF EXISTS "Menu items are viewable by everyone for approved stalls." ON public.menu_items;
CREATE POLICY "Menu items are viewable by everyone for approved stalls." ON public.menu_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.is_approved = true));
DROP POLICY IF EXISTS "Owners can manage their own menu items." ON public.menu_items;
CREATE POLICY "Owners can manage their own menu items." ON public.menu_items FOR ALL USING (EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = menu_items.stall_id AND stalls.owner_id = auth.uid()));

-- Policies for 'reviews' table
DROP POLICY IF EXISTS "Reviews are viewable by everyone for approved stalls." ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone for approved stalls." ON public.reviews FOR SELECT USING (EXISTS (SELECT 1 FROM public.stalls WHERE stalls.id = reviews.stall_id AND stalls.is_approved = true));
DROP POLICY IF EXISTS "Users can create their own reviews." ON public.reviews;
CREATE POLICY "Users can create their own reviews." ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own reviews." ON public.reviews;
CREATE POLICY "Users can update their own reviews." ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own reviews." ON public.reviews;
CREATE POLICY "Users can delete their own reviews." ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Policies for 'realtime_data' table (for testing/demo)
DROP POLICY IF EXISTS "Realtime data is viewable by everyone." ON public.realtime_data;
CREATE POLICY "Realtime data is viewable by everyone." ON public.realtime_data FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert realtime data." ON public.realtime_data;
CREATE POLICY "Authenticated users can insert realtime data." ON public.realtime_data FOR INSERT WITH CHECK (auth.role() = 'authenticated');
