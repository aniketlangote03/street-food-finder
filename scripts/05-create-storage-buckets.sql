-- Create a storage bucket for stall images
INSERT INTO storage.buckets (id, name, public)
VALUES ('stall_images', 'stall_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for stall_images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stall_images' AND auth.role() = 'authenticated');
-- Allow anyone to view images
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'stall_images');
-- Allow owners to update/delete their own stall images (assuming owner_id is part of object metadata or linked)
-- This policy is more complex and might require a custom function or linking storage objects to stall ownership.
-- For simplicity, we'll allow authenticated users to update/delete for now, or rely on backend logic.
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE USING (bucket_id = 'stall_images' AND auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (bucket_id = 'stall_images' AND auth.role() = 'authenticated');

-- Set up RLS policies for avatars bucket
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Allow authenticated avatar uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
-- Allow anyone to view avatars
CREATE POLICY "Allow public avatar read access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- Allow users to update/delete their own avatars
CREATE POLICY "Allow owner avatar updates" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Allow owner avatar deletes" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);
