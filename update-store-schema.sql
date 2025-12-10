-- Add price column to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT 0.00;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_oid text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  application_id uuid REFERENCES applications(id) NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending', -- pending, success, failed
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to update orders (for callback)
-- (Service role bypasses RLS, so no specific policy needed for it, but we need to ensure the API uses service role)
