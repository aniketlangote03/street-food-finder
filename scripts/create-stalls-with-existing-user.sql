-- Create stalls using any existing user as the owner
-- This will work even if you don't have a specific 'stall_owner' role user

-- First, let's see what users exist
SELECT id, email, role FROM public.users LIMIT 5;

-- Create stalls using the first available user as owner
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
SELECT 
    (SELECT id FROM public.users LIMIT 1), -- Use first available user
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
WHERE NOT EXISTS (
    SELECT 1 FROM public.stalls WHERE name = 'Taco Paradise'
);

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
SELECT 
    (SELECT id FROM public.users LIMIT 1), -- Use first available user
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
WHERE NOT EXISTS (
    SELECT 1 FROM public.stalls WHERE name = 'Burger Bliss'
);

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
SELECT 
    (SELECT id FROM public.users LIMIT 1), -- Use first available user
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
WHERE NOT EXISTS (
    SELECT 1 FROM public.stalls WHERE name = 'Noodle Nook'
);

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
