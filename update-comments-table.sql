-- SUPABASE SQL EDITOR'DA ÇALIŞTIRIN
-- Bu script comments tablosunu tamamen güncelleyecek

-- 1. Kullanıcı bilgileri kolonları ekle
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_avatar TEXT;

-- 2. Parent_id kolonu ekle (yorumlara cevap için)
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- 3. Index'ler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_application_id ON public.comments(application_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- Başarıyla güncellendi!
SELECT 'Comments tablosu güncellendi!' as status;
