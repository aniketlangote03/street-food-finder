-- Simple solution: Temporarily make owner_id nullable, create stalls, then make it required again

-- Step 1: Make owner_id temporarily nullable
ALTER TABLE public.stalls ALTER COLUMN owner_id DROP NOT NULL;

-- Step 2: Create stalls without owner_id (temporarily)
INSERT INTO public.stalls (
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
),
(
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
),
(
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

-- Step 3: Verify the results
SELECT 'Stalls created:' as status, COUNT(*) as total_approved_stalls
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

-- Note: We're leaving owner_id as nullable for now since you don't have users set up
-- You can add users later and update the owner_id field
