-- Add user_id to tables with default to current user
ALTER TABLE market_products ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_customers ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_suppliers ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_settings ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_stock_movements ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_sale_items ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);
ALTER TABLE market_purchase_items ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE market_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_purchase_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid errors or duplicates)
DROP POLICY IF EXISTS "Users can manage their own products" ON market_products;
DROP POLICY IF EXISTS "Users can manage their own customers" ON market_customers;
DROP POLICY IF EXISTS "Users can manage their own suppliers" ON market_suppliers;
DROP POLICY IF EXISTS "Users can manage their own settings" ON market_settings;
DROP POLICY IF EXISTS "Users can manage their own stock movements" ON market_stock_movements;
DROP POLICY IF EXISTS "Users can manage their own sales" ON market_sales;
DROP POLICY IF EXISTS "Users can manage their own purchases" ON market_purchases;
DROP POLICY IF EXISTS "Users can manage their own sale items" ON market_sale_items;
DROP POLICY IF EXISTS "Users can manage their own purchase items" ON market_purchase_items;

-- Create Policies
CREATE POLICY "Users can manage their own products" ON market_products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own customers" ON market_customers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own suppliers" ON market_suppliers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own settings" ON market_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own stock movements" ON market_stock_movements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sales" ON market_sales FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own purchases" ON market_purchases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sale items" ON market_sale_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own purchase items" ON market_purchase_items FOR ALL USING (auth.uid() = user_id);

-- Update Functions to respect user_id
CREATE OR REPLACE FUNCTION public.complete_market_sale(p_customer_id uuid, p_payment_method text, p_items jsonb, p_user_id uuid, p_discount_amount numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_sale_id uuid;
  v_total_amount decimal(10,2) := 0;
  v_item jsonb;
  v_product_price decimal(10,2);
  v_item_total decimal(10,2);
  v_final_amount decimal(10,2);
BEGIN
  -- Calculate total
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT sell_price INTO v_product_price FROM market_products WHERE id = (v_item->>'product_id')::uuid AND user_id = p_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found or access denied: %', (v_item->>'product_id');
    END IF;
    v_total_amount := v_total_amount + (v_product_price * (v_item->>'quantity')::decimal);
  END LOOP;

  v_final_amount := v_total_amount - p_discount_amount;

  INSERT INTO market_sales (customer_id, user_id, total_amount, discount_amount, final_amount, payment_method)
  VALUES (p_customer_id, p_user_id, v_total_amount, p_discount_amount, v_final_amount, p_payment_method)
  RETURNING id INTO v_sale_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT sell_price INTO v_product_price FROM market_products WHERE id = (v_item->>'product_id')::uuid AND user_id = p_user_id;
    v_item_total := v_product_price * (v_item->>'quantity')::decimal;

    INSERT INTO market_sale_items (sale_id, product_id, quantity, unit_price, total_price, user_id)
    VALUES (v_sale_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::decimal, v_product_price, v_item_total, p_user_id);

    UPDATE market_products
    SET stock_quantity = stock_quantity - (v_item->>'quantity')::decimal
    WHERE id = (v_item->>'product_id')::uuid AND user_id = p_user_id;

    INSERT INTO market_stock_movements (product_id, type, quantity, description, user_id)
    VALUES ((v_item->>'product_id')::uuid, 'SALE', (v_item->>'quantity')::decimal, 'Satış #' || v_sale_id, p_user_id);
  END LOOP;

  IF p_payment_method = 'ON_ACCOUNT' AND p_customer_id IS NOT NULL THEN
    UPDATE market_customers
    SET balance = balance + v_final_amount
    WHERE id = p_customer_id AND user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'sale_id', v_sale_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_market_purchase(p_supplier_id uuid, p_items jsonb, p_user_id uuid, p_document_no text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_purchase_id uuid;
  v_total_amount decimal(10,2) := 0;
  v_item jsonb;
  v_item_total decimal(10,2);
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_total_amount := v_total_amount + ((v_item->>'buy_price')::decimal * (v_item->>'quantity')::decimal);
  END LOOP;

  INSERT INTO market_purchases (supplier_id, user_id, document_no, total_amount)
  VALUES (p_supplier_id, p_user_id, p_document_no, v_total_amount)
  RETURNING id INTO v_purchase_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_total := (v_item->>'buy_price')::decimal * (v_item->>'quantity')::decimal;

    INSERT INTO market_purchase_items (purchase_id, product_id, quantity, unit_price, total_price, user_id)
    VALUES (v_purchase_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::decimal, (v_item->>'buy_price')::decimal, v_item_total, p_user_id);

    UPDATE market_products
    SET 
      stock_quantity = stock_quantity + (v_item->>'quantity')::decimal,
      buy_price = (v_item->>'buy_price')::decimal
    WHERE id = (v_item->>'product_id')::uuid AND user_id = p_user_id;

    INSERT INTO market_stock_movements (product_id, type, quantity, description, user_id)
    VALUES ((v_item->>'product_id')::uuid, 'IN', (v_item->>'quantity')::decimal, 'Satın Alma #' || v_purchase_id, p_user_id);
  END LOOP;

  UPDATE market_suppliers
  SET balance = balance + v_total_amount
  WHERE id = p_supplier_id AND user_id = p_user_id;

  RETURN jsonb_build_object('success', true, 'purchase_id', v_purchase_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$function$;
