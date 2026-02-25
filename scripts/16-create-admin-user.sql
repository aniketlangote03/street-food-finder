-- Create Admin User
-- This script creates an admin user for the street food finder application

-- First, let's create the auth user (this will be handled by Supabase Auth)
-- The auth user will be created with email/password authentication

-- Insert admin user into the users table
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'System Administrator',
  'admin@streetfood.com',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Note: You'll need to create the auth user separately through Supabase Auth
-- or use the signup form with these credentials:
-- Email: admin@streetfood.com
-- Password: Admin123!@#

-- Verify the admin user was created
SELECT id, name, email, role, created_at FROM public.users WHERE role = 'admin';
