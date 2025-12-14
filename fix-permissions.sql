-- 1. Orders tablosuna eksik kolonları ekle (Eğer yoksa)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id),
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;

-- 2. Plans tablosu için yetkileri güncelle (Sizin ID'niz ile)
DROP POLICY IF EXISTS "Admins can insert plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can update plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can delete plans" ON public.plans;

CREATE POLICY "Admins can insert plans"
  ON public.plans FOR INSERT
  WITH CHECK (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');

CREATE POLICY "Admins can update plans"
  ON public.plans FOR UPDATE
  USING (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');

CREATE POLICY "Admins can delete plans"
  ON public.plans FOR DELETE
  USING (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');

-- 3. Products tablosu için yetkileri güncelle
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911');
