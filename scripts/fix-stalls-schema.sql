-- Fix stalls table schema to ensure it has the required columns
-- Add is_approved column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'is_approved'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN is_approved BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_approved column to stalls table';
    ELSE
        RAISE NOTICE 'is_approved column already exists in stalls table';
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN status TEXT DEFAULT 'open';
        RAISE NOTICE 'Added status column to stalls table';
    ELSE
        RAISE NOTICE 'status column already exists in stalls table';
    END IF;
END $$;

-- Add average_rating column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'average_rating'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
        RAISE NOTICE 'Added average_rating column to stalls table';
    ELSE
        RAISE NOTICE 'average_rating column already exists in stalls table';
    END IF;
END $$;

-- Add review_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'review_count'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN review_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added review_count column to stalls table';
    ELSE
        RAISE NOTICE 'review_count column already exists in stalls table';
    END IF;
END $$;

-- Add current_queue_length column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stalls' 
        AND column_name = 'current_queue_length'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.stalls ADD COLUMN current_queue_length INTEGER DEFAULT 0;
        RAISE NOTICE 'Added current_queue_length column to stalls table';
    ELSE
        RAISE NOTICE 'current_queue_length column already exists in stalls table';
    END IF;
END $$;

-- Ensure all existing stalls are approved
UPDATE public.stalls 
SET is_approved = true 
WHERE is_approved IS NULL OR is_approved = false;

-- Show final schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'stalls' 
AND table_schema = 'public'
ORDER BY ordinal_position;
