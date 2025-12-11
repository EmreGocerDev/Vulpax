-- Create market_settings table
CREATE TABLE IF NOT EXISTS market_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name text,
  currency text DEFAULT 'TRY',
  tax_rate decimal(5,2) DEFAULT 18.00,
  receipt_header text,
  receipt_footer text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_products table
CREATE TABLE IF NOT EXISTS market_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  barcode text,
  sku text,
  buy_price decimal(10,2) DEFAULT 0.00,
  sell_price decimal(10,2) DEFAULT 0.00,
  stock_quantity decimal(10,2) DEFAULT 0.00,
  critical_stock_level decimal(10,2) DEFAULT 10.00,
  image_url text,
  category_id uuid, -- Can reference a categories table if added later
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_stock_movements table
CREATE TABLE IF NOT EXISTS market_stock_movements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES market_products(id) ON DELETE CASCADE,
  type text NOT NULL, -- IN, OUT, WASTE, COUNT_SURPLUS, SALE, RETURN
  quantity decimal(10,2) NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_customers table
CREATE TABLE IF NOT EXISTS market_customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  address text,
  balance decimal(10,2) DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_suppliers table
CREATE TABLE IF NOT EXISTS market_suppliers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  address text,
  balance decimal(10,2) DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_sales table
CREATE TABLE IF NOT EXISTS market_sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES market_customers(id),
  user_id uuid REFERENCES auth.users(id),
  total_amount decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0.00,
  final_amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL, -- CASH, CREDIT_CARD, ON_ACCOUNT
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_sale_items table
CREATE TABLE IF NOT EXISTS market_sale_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid REFERENCES market_sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES market_products(id),
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Create market_purchases table
CREATE TABLE IF NOT EXISTS market_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id uuid REFERENCES market_suppliers(id),
  user_id uuid REFERENCES auth.users(id),
  document_no text,
  total_amount decimal(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create market_purchase_items table
CREATE TABLE IF NOT EXISTS market_purchase_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id uuid REFERENCES market_purchases(id) ON DELETE CASCADE,
  product_id uuid REFERENCES market_products(id),
  quantity decimal(10,2) NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE market_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_purchase_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable all access for authenticated users" ON market_purchases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON market_purchase_items FOR ALL USING (auth.role() = 'authenticated');

-- Create complete_market_purchase function
CREATE OR REPLACE FUNCTION complete_market_purchase(
  p_supplier_id uuid,
  p_items jsonb, -- Array of {product_id, quantity, buy_price}
  p_user_id uuid,
  p_document_no text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_purchase_id uuid;
  v_total_amount decimal(10,2) := 0;
  v_item jsonb;
  v_item_total decimal(10,2);
BEGIN
  -- Calculate total amount
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_total_amount := v_total_amount + ((v_item->>'buy_price')::decimal * (v_item->>'quantity')::decimal);
  END LOOP;

  -- Create purchase record
  INSERT INTO market_purchases (supplier_id, user_id, document_no, total_amount)
  VALUES (p_supplier_id, p_user_id, p_document_no, v_total_amount)
  RETURNING id INTO v_purchase_id;

  -- Process items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_total := (v_item->>'buy_price')::decimal * (v_item->>'quantity')::decimal;

    -- Insert purchase item
    INSERT INTO market_purchase_items (purchase_id, product_id, quantity, unit_price, total_price)
    VALUES (v_purchase_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::decimal, (v_item->>'buy_price')::decimal, v_item_total);

    -- Update stock and buy price
    UPDATE market_products
    SET 
      stock_quantity = stock_quantity + (v_item->>'quantity')::decimal,
      buy_price = (v_item->>'buy_price')::decimal
    WHERE id = (v_item->>'product_id')::uuid;

    -- Record stock movement
    INSERT INTO market_stock_movements (product_id, type, quantity, description)
    VALUES ((v_item->>'product_id')::uuid, 'IN', (v_item->>'quantity')::decimal, 'Satın Alma #' || v_purchase_id);
  END LOOP;

  -- Update supplier balance (assuming credit purchase increases debt to supplier)
  -- Note: Logic depends on accounting. Usually purchase increases debt (Alacak).
  -- Here we just add to balance for simplicity as per previous logic.
  UPDATE market_suppliers
  SET balance = balance + v_total_amount
  WHERE id = p_supplier_id;

  RETURN jsonb_build_object('success', true, 'purchase_id', v_purchase_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;


-- Create complete_market_sale function
CREATE OR REPLACE FUNCTION complete_market_sale(
  p_customer_id uuid,
  p_payment_method text,
  p_items jsonb, -- Array of {product_id, quantity}
  p_user_id uuid,
  p_discount_amount decimal
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sale_id uuid;
  v_total_amount decimal(10,2) := 0;
  v_item jsonb;
  v_product_price decimal(10,2);
  v_item_total decimal(10,2);
  v_final_amount decimal(10,2);
BEGIN
  -- Calculate total amount
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT sell_price INTO v_product_price FROM market_products WHERE id = (v_item->>'product_id')::uuid;
    v_total_amount := v_total_amount + (v_product_price * (v_item->>'quantity')::decimal);
  END LOOP;

  v_final_amount := v_total_amount - p_discount_amount;

  -- Create sale record
  INSERT INTO market_sales (customer_id, user_id, total_amount, discount_amount, final_amount, payment_method)
  VALUES (p_customer_id, p_user_id, v_total_amount, p_discount_amount, v_final_amount, p_payment_method)
  RETURNING id INTO v_sale_id;

  -- Process items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT sell_price INTO v_product_price FROM market_products WHERE id = (v_item->>'product_id')::uuid;
    v_item_total := v_product_price * (v_item->>'quantity')::decimal;

    -- Insert sale item
    INSERT INTO market_sale_items (sale_id, product_id, quantity, unit_price, total_price)
    VALUES (v_sale_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::decimal, v_product_price, v_item_total);

    -- Update stock
    UPDATE market_products
    SET stock_quantity = stock_quantity - (v_item->>'quantity')::decimal
    WHERE id = (v_item->>'product_id')::uuid;

    -- Record stock movement
    INSERT INTO market_stock_movements (product_id, type, quantity, description)
    VALUES ((v_item->>'product_id')::uuid, 'SALE', (v_item->>'quantity')::decimal, 'Satış #' || v_sale_id);
  END LOOP;

  -- Update customer balance if ON_ACCOUNT
  IF p_payment_method = 'ON_ACCOUNT' AND p_customer_id IS NOT NULL THEN
    UPDATE market_customers
    SET balance = balance + v_final_amount
    WHERE id = p_customer_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'sale_id', v_sale_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

