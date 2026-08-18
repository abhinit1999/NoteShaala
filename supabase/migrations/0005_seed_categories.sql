-- 1. Insert the 3 required categories so they appear in your dropdown
INSERT INTO public.categories (title, slug, description)
VALUES 
  ('Notes', 'handwritten-notes', 'High-quality handwritten notes'),
  ('AI Prompts', 'ai-video-prompts', 'Curated AI video and image prompts'),
  ('Bundles', 'premium-bundles', 'Discounted premium study bundles')
ON CONFLICT (slug) DO NOTHING;

-- 2. Force Supabase API to reload its cache 
-- (This fixes the "Could not find the 'protected_file_url' column in schema cache" error)
NOTIFY pgrst, 'reload schema';
