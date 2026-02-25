-- Ensure there are approved stalls for testing
-- First, let's make sure all existing stalls are approved
UPDATE public.stalls 
SET is_approved = true 
WHERE is_approved = false;

-- Insert additional sample stalls if the table is empty or has very few stalls
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
    (SELECT id FROM public.users WHERE role = 'stall_owner' LIMIT 1),
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
    (SELECT id FROM public.users WHERE role = 'stall_owner' LIMIT 1),
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
    (SELECT id FROM public.users WHERE role = 'stall_owner' LIMIT 1),
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
