-- Add interval to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS "interval" text DEFAULT 'monthly'; -- 'monthly' or 'yearly'

-- Add expiry_date to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expiry_date timestamp with time zone;

-- Update existing plans to have a default interval (optional, but good for consistency)
UPDATE plans SET "interval" = 'monthly' WHERE "interval" IS NULL;
