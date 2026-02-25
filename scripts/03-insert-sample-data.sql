-- Insert sample users
INSERT INTO public.users (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@streetfood.com', 'Admin User', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'owner1@example.com', 'Maria Garcia', 'stall_owner'),
  ('550e8400-e29b-41d4-a716-446655440003', 'owner2@example.com', 'John Chen', 'stall_owner'),
  ('550e8400-e29b-41d4-a716-446655440004', 'owner3@example.com', 'Ahmed Hassan', 'stall_owner');

-- Insert sample stalls
INSERT INTO public.stalls (id, name, description, cuisine, location_lat, location_lng, address, operating_hours_open, operating_hours_close, status, approval_status, owner_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'Taco Paradise', 'Authentic Mexican street tacos with fresh ingredients', ARRAY['Mexican', 'Tacos'], 34.0522, -118.2437, '123 Main St, Los Angeles, CA', '10:00', '22:00', 'Open', 'Approved', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440102', 'Noodle Express', 'Quick and delicious Asian noodle dishes', ARRAY['Asian', 'Noodles'], 34.0523, -118.2438, '456 Food Ave, Los Angeles, CA', '11:00', '21:00', 'Open', 'Approved', '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440103', 'Burger Bliss', 'Gourmet burgers made with premium ingredients', ARRAY['American', 'Burgers'], 34.0524, -118.2439, '789 Grill St, Los Angeles, CA', '12:00', '23:00', 'Closed', 'Approved', '550e8400-e29b-41d4-a716-446655440004'),
  ('550e8400-e29b-41d4-a716-446655440104', 'Falafel Corner', 'Middle Eastern specialties and fresh falafel', ARRAY['Middle Eastern', 'Vegetarian'], 34.0525, -118.2440, '321 Spice Rd, Los Angeles, CA', '09:00', '20:00', 'Open', 'Pending', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample menu items
INSERT INTO public.menu_items (stall_id, name, description, price, available) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'Carnitas Taco', 'Slow-cooked pork with onions and cilantro', 3.50, true),
  ('550e8400-e29b-41d4-a716-446655440101', 'Chicken Quesadilla', 'Grilled chicken with cheese in flour tortilla', 8.00, true),
  ('550e8400-e29b-41d4-a716-446655440101', 'Veggie Burrito', 'Black beans, rice, peppers, and avocado', 9.50, true),
  ('550e8400-e29b-41d4-a716-446655440102', 'Pad Thai', 'Classic Thai stir-fried noodles', 12.00, true),
  ('550e8400-e29b-41d4-a716-446655440102', 'Ramen Bowl', 'Rich broth with noodles and toppings', 14.00, true),
  ('550e8400-e29b-41d4-a716-446655440103', 'Classic Burger', 'Beef patty with lettuce, tomato, cheese', 11.00, true),
  ('550e8400-e29b-41d4-a716-446655440103', 'BBQ Bacon Burger', 'Beef patty with BBQ sauce and bacon', 13.50, true),
  ('550e8400-e29b-41d4-a716-446655440104', 'Falafel Wrap', 'Crispy falafel with tahini and vegetables', 9.00, true),
  ('550e8400-e29b-41d4-a716-446655440104', 'Hummus Bowl', 'Fresh hummus with pita and vegetables', 7.50, true);

-- Insert sample reviews
INSERT INTO public.reviews (stall_id, user_id, rating, comment) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 5, 'Amazing tacos! The carnitas are perfectly seasoned.'),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 4, 'Great noodles, fast service. Will definitely come back.'),
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440003', 5, 'Best Mexican food truck in the city!');

-- Insert sample submissions
INSERT INTO public.submissions (stall_id, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440104', 'Pending');
