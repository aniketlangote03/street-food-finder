-- Create test admin and owner users for login testing
-- Note: This creates users directly in auth.users and public.users tables

-- First, create admin user in auth.users
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
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@streetfood.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile in public.users
INSERT INTO public.users (id, name, email, role, created_at, updated_at)
SELECT 
  id,
  'System Administrator',
  'admin@streetfood.com',
  'admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@streetfood.com'
ON CONFLICT (id) DO NOTHING;

-- Create owner user in auth.users
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
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'owner@streetfood.com',
  crypt('Owner123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create owner profile in public.users
INSERT INTO public.users (id, name, email, role, created_at, updated_at)
SELECT 
  id,
  'Test Stall Owner',
  'owner@streetfood.com',
  'owner',
  now(),
  now()
FROM auth.users 
WHERE email = 'owner@streetfood.com'
ON CONFLICT (id) DO NOTHING;
