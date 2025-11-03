-- SUPABASE SQL EDITOR'DA ÇALIŞTIRIN
-- Rating constraint'ini güncelle - cevaplarda rating olmayabilir

-- Eski constraint'i kaldır
ALTER TABLE public.comments 
DROP CONSTRAINT IF EXISTS comments_rating_check;

-- Yeni constraint ekle - rating NULL veya 1-5 arası olabilir
ALTER TABLE public.comments 
ADD CONSTRAINT comments_rating_check 
CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

-- Başarıyla güncellendi!
SELECT 'Rating constraint güncellendi!' as status;
