-- SUPABASE SQL EDITOR'DA ÇALIŞTIRIN
-- Bu script storage bucket ve tüm policy'leri oluşturur

-- 1. Bucket oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-images',
  'application-images',
  true,
  52428800, -- 50MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Public Read Policy
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-images');

-- 3. Authenticated Upload Policy
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Delete Own Files Policy
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'application-images' 
  AND auth.uid() = owner
);

-- Başarıyla oluşturuldu!
SELECT 'Storage bucket ve policy''ler oluşturuldu!' as status;
