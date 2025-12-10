-- Add image_url to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  features text[], -- Array of strings for plan features
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table (handling both products and plans)
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_oid text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  product_id uuid REFERENCES products(id),
  plan_id uuid REFERENCES plans(id),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending', -- pending, success, failed
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT check_item_type CHECK (
    (product_id IS NOT NULL AND plan_id IS NULL) OR
    (product_id IS NULL AND plan_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for products (Public read, Admin write)
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'emregocer@gmail.com')); -- Replace with actual admin check or role

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'emregocer@gmail.com'));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'emregocer@gmail.com'));

-- Policies for plans (Public read, Admin write)
CREATE POLICY "Public plans are viewable by everyone"
  ON plans FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert plans"
  ON plans FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'emregocer@gmail.com'));

CREATE POLICY "Admins can update plans"
  ON plans FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'emregocer@gmail.com'));

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
