-- Migration script to fix existing database structure

-- First, let's safely update the existing data structure
DO $$ 
BEGIN
    -- Update users table structure
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
        -- Copy full_name to name if name doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name') THEN
            ALTER TABLE public.users ADD COLUMN name TEXT;
        END IF;
        
        UPDATE public.users SET name = full_name WHERE name IS NULL;
        ALTER TABLE public.users DROP COLUMN full_name;
    END IF;
    
    -- Remove phone column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE public.users DROP COLUMN phone;
    END IF;
    
    -- Update stalls table structure
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'cuisine') THEN
        -- Add cuisine_tags column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'cuisine_tags') THEN
            ALTER TABLE public.stalls ADD COLUMN cuisine_tags TEXT[] DEFAULT '{}';
        END IF;
        
        -- Migrate cuisine data to cuisine_tags
        UPDATE public.stalls SET cuisine_tags = cuisine WHERE cuisine_tags = '{}';
        ALTER TABLE public.stalls DROP COLUMN cuisine;
    END IF;
    
    -- Remove operating hours columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'operating_hours_open') THEN
        ALTER TABLE public.stalls DROP COLUMN operating_hours_open;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'operating_hours_close') THEN
        ALTER TABLE public.stalls DROP COLUMN operating_hours_close;
    END IF;
    
    -- Add is_open column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'is_open') THEN
        ALTER TABLE public.stalls ADD COLUMN is_open BOOLEAN DEFAULT false;
    END IF;
    
    -- Update status to is_open
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stalls' AND column_name = 'status') THEN
        UPDATE public.stalls SET is_open = (status = 'Open');
        ALTER TABLE public.stalls DROP COLUMN status;
    END IF;
    
    -- Update menu_items table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'available') THEN
        -- Add is_available column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_available') THEN
            ALTER TABLE public.menu_items ADD COLUMN is_available BOOLEAN DEFAULT true;
        END IF;
        
        UPDATE public.menu_items SET is_available = available;
        ALTER TABLE public.menu_items DROP COLUMN available;
    END IF;
    
END $$;

-- Update any existing data to match new schema
UPDATE public.users SET name = email WHERE name IS NULL OR name = '';

-- This script is typically used for one-off fixes or migrations.
-- If there were specific issues that needed a quick fix outside of the main schema, they would go here.
-- For now, it's empty as the schema and data scripts are being provided in full.
