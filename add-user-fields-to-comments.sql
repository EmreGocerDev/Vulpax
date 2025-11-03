-- Comments tablosuna kullanıcı bilgilerini ekle
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın

-- Yeni kolonları ekle
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_avatar TEXT;

-- Yorum: Bu kolonlar yeni yorumlarda doldurulacak
-- Eski yorumlar için bu alanlar NULL kalabilir
