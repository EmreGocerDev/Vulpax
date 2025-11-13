-- SUPABASE SQL EDITOR'DA ÇALIŞTIRIN
-- Bu script music_library tablosu ve RLS policy'lerini düzeltir

-- 1. Music library tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.music_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  cover_image TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RLS'yi aktif et
ALTER TABLE public.music_library ENABLE ROW LEVEL SECURITY;

-- 3. Mevcut policy'leri temizle
DROP POLICY IF EXISTS "Public can view public music" ON public.music_library;
DROP POLICY IF EXISTS "Authenticated users can insert music" ON public.music_library;
DROP POLICY IF EXISTS "Authenticated users can update music" ON public.music_library;
DROP POLICY IF EXISTS "Authenticated users can delete music" ON public.music_library;

-- 4. Herkese okuma izni (public müzikler için)
CREATE POLICY "Public can view public music"
ON public.music_library FOR SELECT
USING (is_public = true);

-- 5. Authenticated kullanıcılar ekleme yapabilir (users tablosuna erişim OLMADAN)
CREATE POLICY "Authenticated users can insert music"
ON public.music_library FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 6. Authenticated kullanıcılar güncelleme yapabilir
CREATE POLICY "Authenticated users can update music"
ON public.music_library FOR UPDATE
USING (auth.role() = 'authenticated');

-- 7. Authenticated kullanıcılar silme yapabilir
CREATE POLICY "Authenticated users can delete music"
ON public.music_library FOR DELETE
USING (auth.role() = 'authenticated');

-- 8. Music storage bucket'ı oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'music',
  'music',
  true,
  104857600, -- 100MB
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 9. Music bucket için storage policy'leri
DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;
CREATE POLICY "Public can read music files"
ON storage.objects FOR SELECT
USING (bucket_id = 'music');

DROP POLICY IF EXISTS "Authenticated users can upload music" ON storage.objects;
CREATE POLICY "Authenticated users can upload music"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'music' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated users can delete music files" ON storage.objects;
CREATE POLICY "Authenticated users can delete music files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'music' 
  AND auth.role() = 'authenticated'
);

-- 10. İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_music_library_is_public ON public.music_library(is_public);
CREATE INDEX IF NOT EXISTS idx_music_library_created_at ON public.music_library(created_at DESC);

-- Başarıyla oluşturuldu!
SELECT 'Music library tablosu ve policy''ler oluşturuldu!' as status;
