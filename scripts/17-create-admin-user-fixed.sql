-- Create admin user in Supabase Auth and users table
-- This script provides multiple approaches for creating an admin user

-- APPROACH 1: Direct insert (requires service role and may not work in all setups)
-- Uncomment the following if you have direct access to auth schema:

/*
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '36ed64d6-ed10-41fb-be1a-9d2742319591',
  '00000000-0000-0000-0000-000000000000',
  'admin@streetfood.com',
  crypt('Admin123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;
*/

-- APPROACH 2: Create user profile only (recommended)
-- Simplified approach that only creates the profile record
-- You'll need to sign up manually with these credentials first, then run this script

INSERT INTO public.users (
  id,
  name,
  email,
  role,
  profile_image,
  created_at,
  updated_at
) VALUES (
  '36ed64d6-ed10-41fb-be1a-9d2742319591',
  'System Administrator',
  'admin@streetfood.com',
  'admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  name = 'System Administrator',
  updated_at = NOW();

-- Added function to update existing user to admin role
-- Use this if you've already signed up with the admin email
UPDATE public.users 
SET role = 'admin', 
    name = 'System Administrator',
    updated_at = NOW()
WHERE email = 'admin@streetfood.com';

-- Verify the admin user
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.created_at
FROM public.users u
WHERE u.email = 'admin@streetfood.com';
