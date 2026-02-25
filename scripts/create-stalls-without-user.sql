-- Create stalls without requiring a user (temporary solution)
-- This will work by temporarily modifying the constraint or using a workaround

-- Option 1: Try to create a user in auth.users first (this might not work in SQL editor)
-- Option 2: Temporarily disable the foreign key constraint

-- First, let's see what's in the users table
SELECT 'Current users:' as info, COUNT(*) as user_count FROM public.users;

-- Let's try to create a user directly in auth.users (this might fail in SQL editor)
-- If this fails, we'll use a different approach
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '00000000-0000-0000-0000-000000000000',
    'test-owner@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Now create the user in public.users
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'test-owner@example.com',
    'Test Stall Owner',
    'stall_owner',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the user was created
SELECT 'User created:' as status, id, email, role FROM public.users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Now create stalls
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
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Taco Paradise',
    'Authentic Mexican street tacos with fresh ingredients',
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

-- Verify the results
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
