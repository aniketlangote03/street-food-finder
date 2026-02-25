-- Check the actual database schema for stalls table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'stalls' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if is_approved column exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'stalls' 
            AND column_name = 'is_approved'
            AND table_schema = 'public'
        ) THEN 'is_approved column EXISTS'
        ELSE 'is_approved column DOES NOT EXIST'
    END as is_approved_status;

-- Check if status column exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'stalls' 
            AND column_name = 'status'
            AND table_schema = 'public'
        ) THEN 'status column EXISTS'
        ELSE 'status column DOES NOT EXIST'
    END as status_column_status;
