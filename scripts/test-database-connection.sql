-- Test database connection and check what columns exist
-- This script will help identify the actual database schema

-- First, let's see what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check stalls table columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'stalls' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Try to select from stalls table with minimal columns
SELECT 
    id,
    name,
    description
FROM public.stalls 
LIMIT 1;

-- Check if we can select is_approved
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'stalls' 
            AND column_name = 'is_approved'
            AND table_schema = 'public'
        ) THEN 'SUCCESS: is_approved column exists'
        ELSE 'ERROR: is_approved column does not exist'
    END as is_approved_check;
