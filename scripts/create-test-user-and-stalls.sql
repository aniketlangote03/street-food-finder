-- First, create a test user if one doesn't exist
-- Insert a test user in auth.users (this might need to be done through Supabase Auth UI)
-- For now, let's create a user in the public.users table with a known ID

-- Create a test stall owner user
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'test-owner@example.com',
    'Test Stall Owner',
    'stall_owner',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- Now insert stalls with the known owner_id
INSERT INTO public.stalls (
    owner_id,
    name,
    description,
    address,
    location_lat,
    location_lng,
    opening_time,
    closing_time,
    cuisine_type,
    image_url,
    is_approved,
    average_rating,
    review_count,
    current_queue_length
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Taco Paradise',
    'Authentic Mexican street tacos with fresh ingredients and homemade salsas',
    'Downtown Food Court, Main Street',
    34.052235,
    -118.243683,
    '10:00',
    '20:00',
    'Mexican',
    '/placeholder.svg?height=200&width=300&query=mexican+tacos',
    true,
    4.5,
    127,
    15
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.stalls (
    owner_id,
    name,
    description,
    address,
    location_lat,
    location_lng,
    opening_time,
    closing_time,
    cuisine_type,
    image_url,
    is_approved,
    average_rating,
    review_count,
    current_queue_length
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Burger Bliss',
    'Gourmet burgers made with locally sourced beef and fresh vegetables',
    'Central Park Food Truck Area',
    34.055000,
    -118.250000,
    '11:00',
    '21:00',
    'American',
    '/placeholder.svg?height=200&width=300&query=gourmet+burger',
    true,
    4.2,
    89,
    8
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.stalls (
    owner_id,
    name,
    description,
    address,
    location_lat,
    location_lng,
    opening_time,
    closing_time,
    cuisine_type,
    image_url,
    is_approved,
    average_rating,
    review_count,
    current_queue_length
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Noodle Nook',
    'Traditional Asian noodle dishes with authentic flavors',
    'Financial District, 1st Street',
    34.050000,
    -118.255000,
    '09:00',
    '19:00',
    'Asian',
    '/placeholder.svg?height=200&width=300&query=asian+noodles',
    true,
    4.7,
    156,
    12
)
ON CONFLICT (name) DO NOTHING;

-- Verify the results
SELECT 
    COUNT(*) as total_approved_stalls
FROM public.stalls 
WHERE is_approved = true;

-- Show the created stalls
SELECT 
    id,
    name,
    description,
    cuisine_type,
    is_approved,
    average_rating,
    review_count,
    current_queue_length
FROM public.stalls 
WHERE is_approved = true
ORDER BY created_at DESC;
