-- Check if columns exist before adding them
DO $$ 
BEGIN
    -- Add is_approved column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='is_approved') THEN
        ALTER TABLE stalls ADD COLUMN is_approved BOOLEAN DEFAULT true;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='status') THEN
        ALTER TABLE stalls ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    
    -- Add average_rating column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='average_rating') THEN
        ALTER TABLE stalls ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
    END IF;
    
    -- Add review_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='review_count') THEN
        ALTER TABLE stalls ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add cuisine_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='cuisine_type') THEN
        ALTER TABLE stalls ADD COLUMN cuisine_type TEXT;
    END IF;
    
    -- Add queue_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stalls' AND column_name='queue_time') THEN
        ALTER TABLE stalls ADD COLUMN queue_time INTEGER DEFAULT 0;
    END IF;
END $$;

-- Insert sample data if table is empty
INSERT INTO stalls (name, description, location, cuisine_type, average_rating, review_count, queue_time, status, is_approved)
SELECT 
    'Taco Paradise',
    'Authentic Mexican street tacos with fresh ingredients',
    'Downtown Food Court',
    'Mexican',
    4.5,
    127,
    15,
    'active',
    true
WHERE NOT EXISTS (SELECT 1 FROM stalls LIMIT 1);

INSERT INTO stalls (name, description, location, cuisine_type, average_rating, review_count, queue_time, status, is_approved)
SELECT 
    'Burger Bliss',
    'Gourmet burgers made with locally sourced beef',
    'Main Street Corner',
    'American',
    4.2,
    89,
    20,
    'active',
    true
WHERE (SELECT COUNT(*) FROM stalls) < 2;

INSERT INTO stalls (name, description, location, cuisine_type, average_rating, review_count, queue_time, status, is_approved)
SELECT 
    'Noodle House',
    'Fresh ramen and Asian noodle dishes',
    'University District',
    'Asian',
    4.7,
    203,
    10,
    'active',
    true
WHERE (SELECT COUNT(*) FROM stalls) < 3;
