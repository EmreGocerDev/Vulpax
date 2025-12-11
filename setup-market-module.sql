-- Create Schema
CREATE SCHEMA IF NOT EXISTS vulpax_market;

-- Add access control to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_market_access BOOLEAN DEFAULT FALSE;

-- Create Units Table
CREATE TABLE IF NOT EXISTS vulpax_market.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS vulpax_market.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Suppliers Table
CREATE TABLE IF NOT EXISTS vulpax_market.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    balance NUMERIC(12, 2) DEFAULT 0, -- Positive: We owe them, Negative: They owe us (usually positive for suppliers)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Customers Table (For Veresiye)
CREATE TABLE IF NOT EXISTS vulpax_market.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    balance NUMERIC(12, 2) DEFAULT 0, -- Positive: They owe us
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS vulpax_market.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    sku TEXT UNIQUE,
    description TEXT,
    category_id UUID REFERENCES vulpax_market.categories(id),
    unit_id UUID REFERENCES vulpax_market.units(id),
    buy_price NUMERIC(10, 2) DEFAULT 0,
    sell_price NUMERIC(10, 2) DEFAULT 0,
    tax_rate NUMERIC(5, 2) DEFAULT 18, -- Percentage
    stock_quantity NUMERIC(10, 2) DEFAULT 0,
    critical_stock_level NUMERIC(10, 2) DEFAULT 10,
    shelf_location TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Stock Movements Table
CREATE TABLE IF NOT EXISTS vulpax_market.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES vulpax_market.products(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'WASTE', 'COUNT_SURPLUS', 'SALE', 'RETURN')),
    quantity NUMERIC(10, 2) NOT NULL,
    description TEXT,
    related_document_id UUID, -- Can be Sale ID or Invoice ID
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Sales Table
CREATE TABLE IF NOT EXISTS vulpax_market.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES vulpax_market.customers(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    final_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'MIXED', 'ON_ACCOUNT')),
    status TEXT DEFAULT 'COMPLETED',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Sale Items Table
CREATE TABLE IF NOT EXISTS vulpax_market.sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES vulpax_market.sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES vulpax_market.products(id),
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Data
INSERT INTO vulpax_market.units (name, short_code) VALUES 
('Adet', 'Adet'),
('Kilogram', 'kg'),
('Koli', 'Koli')
ON CONFLICT DO NOTHING;

INSERT INTO vulpax_market.categories (name, description) VALUES 
('Genel', 'Genel Kategori'),
('Gıda', 'Gıda Ürünleri'),
('Temizlik', 'Temizlik Ürünleri')
ON CONFLICT DO NOTHING;
