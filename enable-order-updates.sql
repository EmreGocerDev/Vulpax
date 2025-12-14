-- Allow users to update their own orders (needed for client-side success page fallback)
CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a log table for PayTR callback debugging
CREATE TABLE IF NOT EXISTS paytr_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_oid text,
  status text,
  error_message text,
  payload jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on logs (optional, but good practice)
ALTER TABLE paytr_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert logs (no policy needed for service role, but good to be explicit if we add user access later)
-- For now, just keep it private.
