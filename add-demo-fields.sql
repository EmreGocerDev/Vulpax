-- Add missing columns to applications table for demo apps functionality

-- Add name column (same as title for compatibility)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add category column (text version for quick access)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add demo_url column
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS demo_url TEXT;

-- Update existing records to have name = title
UPDATE public.applications 
SET name = title 
WHERE name IS NULL;

-- Update existing records to have category from categories table
UPDATE public.applications a
SET category = c.name
FROM public.categories c
WHERE a.category_id = c.id AND a.category IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_applications_is_active ON public.applications(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_category ON public.applications(category);
