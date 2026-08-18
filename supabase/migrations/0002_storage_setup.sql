-- Create buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('digital-products', 'digital-products', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for public-assets
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public-assets');

CREATE POLICY "Admin Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'public-assets' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS for digital-products (Private)
-- Admins have full access
CREATE POLICY "Admin Access to Private Bucket" 
ON storage.objects FOR ALL 
USING (bucket_id = 'digital-products' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users can only download via Signed URLs. We don't strictly need a SELECT policy for Signed URLs
-- but if we want users to read them directly, we could add one based on `user_products`.
-- Supabase Signed URLs bypass RLS for reading if the URL is valid, so we don't need a public SELECT policy.
