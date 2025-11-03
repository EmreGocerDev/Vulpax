-- 1. Uygulama resimleri için storage bucket oluştur
-- Supabase Dashboard > Storage > Create Bucket
-- Bucket name: application-images
-- Public: true

-- 2. Applications tablosunu güncelle - image_url yerine image_path
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- 3. Comments tablosuna parent_id ekle (yoruma cevap için)
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- 4. Comments tablosuna index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_application_id ON public.comments(application_id);

-- 5. Storage policy'leri (Supabase Dashboard > Storage > Policies'den manuel eklenecek)
-- Bucket: application-images
-- Policy 1: Allow public read
-- Policy 2: Allow authenticated users upload
-- Policy 3: Allow authenticated users delete own files
