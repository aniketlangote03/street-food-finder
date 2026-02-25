-- Check if there are approved stalls in the database
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

-- Count total stalls vs approved stalls
SELECT 
    COUNT(*) as total_stalls,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_stalls,
    COUNT(CASE WHEN is_approved = false THEN 1 END) as pending_stalls
FROM public.stalls;
