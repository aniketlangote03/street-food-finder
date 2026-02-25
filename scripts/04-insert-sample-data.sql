-- Insert sample users (ensure these IDs match existing auth.users if you're using Supabase Auth)
INSERT INTO public.users (id, email, display_name, full_name, role)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user@example.com', 'Regular User', 'Regular User Full Name', 'user'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'owner@example.com', 'Stall Owner John', 'John Doe', 'stall_owner'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin@example.com', 'Admin Jane', 'Jane Smith', 'admin')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- Insert sample stalls
INSERT INTO public.stalls (owner_id, name, description, location_description, latitude, longitude, opening_time, closing_time, cuisine_type, image_url, status, is_approved, average_rating, review_count, current_queue_length)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Taco Truck Fiesta', 'Authentic Mexican tacos and burritos.', 'Corner of Main St and Oak Ave', 34.052235, -118.243683, '10:00', '20:00', 'Mexican', 'https://blob.v0.dev/taco-truck.jpg', 'open', true, 4.5, 10, 3),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Burger Bliss', 'Gourmet burgers and crispy fries.', 'Near Central Park, by the fountain', 34.055000, -118.250000, '11:00', '21:00', 'American', 'https://blob.v0.dev/burger-bliss.jpg', 'open', true, 4.2, 8, 5),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Sweet Treats Cart', 'Delicious desserts and pastries.', 'Outside City Library', 34.048000, -118.240000, '12:00', '18:00', 'Dessert', 'https://blob.v0.dev/sweet-treats.jpg', 'closed', true, 4.8, 15, 0),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Noodle Nook', 'Traditional Asian noodle dishes.', 'Financial District, 1st St', 34.050000, -118.255000, '09:00', '19:00', 'Asian', 'https://blob.v0.dev/noodle-nook.jpg', 'open', false, NULL, 0, 2) -- Unapproved stall
ON CONFLICT (id) DO UPDATE SET
    owner_id = EXCLUDED.owner_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    location_description = EXCLUDED.location_description,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    opening_time = EXCLUDED.opening_time,
    closing_time = EXCLUDED.closing_time,
    cuisine_type = EXCLUDED.cuisine_type,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    is_approved = EXCLUDED.is_approved,
    average_rating = EXCLUDED.average_rating,
    review_count = EXCLUDED.review_count,
    current_queue_length = EXCLUDED.current_queue_length;

-- Insert sample menu items
INSERT INTO public.menu_items (stall_id, name, description, price, image_url)
VALUES
    ((SELECT id FROM public.stalls WHERE name = 'Taco Truck Fiesta'), 'Carne Asada Taco', 'Grilled steak taco with cilantro and onion.', 3.50, 'https://blob.v0.dev/carne-asada-taco.jpg'),
    ((SELECT id FROM public.stalls WHERE name = 'Taco Truck Fiesta'), 'Al Pastor Burrito', 'Marinated pork burrito with pineapple.', 9.00, 'https://blob.v0.dev/al-pastor-burrito.jpg'),
    ((SELECT id FROM public.stalls WHERE name = 'Burger Bliss'), 'Classic Cheeseburger', 'Beef patty, cheddar, lettuce, tomato, onion.', 8.50, 'https://blob.v0.dev/cheeseburger.jpg'),
    ((SELECT id FROM public.stalls WHERE name = 'Burger Bliss'), 'Sweet Potato Fries', 'Crispy sweet potato fries with dipping sauce.', 4.00, 'https://blob.v0.dev/sweet-potato-fries.jpg'),
    ((SELECT id FROM public.stalls WHERE name = 'Sweet Treats Cart'), 'Chocolate Croissant', 'Flaky croissant with rich chocolate filling.', 4.25, 'https://blob.v0.dev/chocolate-croissant.jpg')
ON CONFLICT (id) DO NOTHING; -- Use DO NOTHING for menu items if IDs are auto-generated and not stable

-- Insert sample reviews
INSERT INTO public.reviews (stall_id, user_id, rating, comment)
VALUES
    ((SELECT id FROM public.stalls WHERE name = 'Taco Truck Fiesta'), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, 'Best tacos in town! Always fresh and delicious.'),
    ((SELECT id FROM public.stalls WHERE name = 'Taco Truck Fiesta'), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 4, 'Great food, but sometimes the line is long.'),
    ((SELECT id FROM public.stalls WHERE name = 'Burger Bliss'), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, 'Juicy burgers, a bit pricey but worth it.'),
    ((SELECT id FROM public.stalls WHERE name = 'Sweet Treats Cart'), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, 'Amazing pastries, a must-try!'),
    ((SELECT id FROM public.stalls WHERE name = 'Sweet Treats Cart'), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 5, 'My favorite place for a quick dessert.')
ON CONFLICT (id) DO NOTHING; -- Use DO NOTHING for reviews if IDs are auto-generated and not stable
