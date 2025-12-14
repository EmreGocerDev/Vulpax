-- 1. Orders tablosuna eksik kolonları ekle
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id),
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE;

-- 2. Plans tablosu için yetkileri güncelle (Admin ID: d628cec7-7ebe-4dd7-9d0a-0a76fb091911)
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

-- 4. PayTR Log tablosunu oluştur
CREATE TABLE IF NOT EXISTS paytr_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_oid text,
  status text,
  error_message text,
  payload jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE paytr_logs ENABLE ROW LEVEL SECURITY;

-- 5. Kullanıcıların kendi siparişlerini güncelleyebilmesi için izin (Success sayfası için)
CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);
