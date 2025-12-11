-- Update complete_sale to return sale_id
CREATE OR REPLACE FUNCTION vulpax_market.complete_sale(
    p_customer_id uuid,
    p_payment_method text,
    p_items jsonb,
    p_user_id uuid,
    p_discount_amount decimal DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sale_id uuid;
    v_total_amount decimal := 0;
    v_item jsonb;
    v_product_price decimal;
    v_product_name text;
    v_current_stock int;
BEGIN
    -- Calculate total amount first
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT sell_price, name, stock_quantity INTO v_product_price, v_product_name, v_current_stock
        FROM vulpax_market.products 
        WHERE id = (v_item->>'product_id')::uuid;
        
        IF NOT FOUND THEN
            RETURN json_build_object('success', false, 'error', 'Product not found: ' || (v_item->>'product_id'));
        END IF;

        -- Check stock (optional, maybe allow negative stock for now or strict?)
        -- Let's allow negative stock but warn? No, let's just proceed.
        
        v_total_amount := v_total_amount + (v_product_price * (v_item->>'quantity')::int);
    END LOOP;

    v_total_amount := v_total_amount - p_discount_amount;

    -- Create Sale Record
    INSERT INTO vulpax_market.sales (
        customer_id,
        user_id,
        total_amount,
        payment_method,
        discount_amount
    ) VALUES (
        p_customer_id,
        p_user_id,
        v_total_amount,
        p_payment_method,
        p_discount_amount
    ) RETURNING id INTO v_sale_id;

    -- Process Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT sell_price, name INTO v_product_price, v_product_name
        FROM vulpax_market.products 
        WHERE id = (v_item->>'product_id')::uuid;

        -- Insert Sale Item
        INSERT INTO vulpax_market.sale_items (
            sale_id,
            product_id,
            quantity,
            unit_price,
            total_price
        ) VALUES (
            v_sale_id,
            (v_item->>'product_id')::uuid,
            (v_item->>'quantity')::int,
            v_product_price,
            v_product_price * (v_item->>'quantity')::int
        );

        -- Update Stock
        UPDATE vulpax_market.products
        SET stock_quantity = stock_quantity - (v_item->>'quantity')::int
        WHERE id = (v_item->>'product_id')::uuid;

        -- Log Movement
        INSERT INTO vulpax_market.stock_movements (
            product_id,
            type,
            quantity,
            description
        ) VALUES (
            (v_item->>'product_id')::uuid,
            'SALE',
            (v_item->>'quantity')::int,
            'Satış #' || substring(v_sale_id::text, 1, 8)
        );
    END LOOP;

    -- Handle Veresiye (On Account)
    IF p_payment_method = 'ON_ACCOUNT' THEN
        IF p_customer_id IS NULL THEN
             RETURN json_build_object('success', false, 'error', 'Customer required for account payment');
        END IF;

        -- Update Customer Balance (Increase debt)
        UPDATE vulpax_market.customers
        SET balance = balance + v_total_amount
        WHERE id = p_customer_id;

        -- Log Transaction
        INSERT INTO vulpax_market.customer_transactions (
            customer_id,
            type,
            amount,
            description,
            reference_id
        ) VALUES (
            p_customer_id,
            'DEBIT', -- Borçlandırma
            v_total_amount,
            'Veresiye Satış #' || substring(v_sale_id::text, 1, 8),
            v_sale_id
        );
    END IF;

    RETURN json_build_object('success', true, 'sale_id', v_sale_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;