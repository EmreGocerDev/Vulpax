import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const total_amount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    const merchant_key = "Ynk2qURAUxH5bC5G";
    const merchant_salt = "98CNTjAkbSTX7PWq";

    // Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceKey) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is missing. Cannot update order status.");
        return new NextResponse("OK");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log callback attempt first
    await supabase.from('paytr_logs').insert({
      merchant_oid,
      status: status || 'unknown',
      payload: { merchant_oid, status, total_amount, hash, timestamp: new Date().toISOString() }
    });

    const params = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const token = crypto
      .createHmac("sha256", merchant_key)
      .update(params)
      .digest("base64");

    if (token !== hash) {
      await supabase.from('paytr_logs').insert({
        merchant_oid,
        status: 'failed',
        error_message: 'Bad Hash',
        payload: { calculated_token: token, received_hash: hash, params }
      });
      console.error("PAYTR notification failed: bad hash", { merchant_oid, received_hash: hash });
      return new NextResponse("PAYTR notification failed: bad hash", { status: 400 });
    }

    if (status === "success") {
      // Ödeme Başarılı
      console.log(`Payment successful for order: ${merchant_oid}`);
      
      // 1. Fetch Order to get Plan ID
      const { data: order, error: orderFetchError } = await supabase
        .from('orders')
        .select('id, plan_id, user_id')
        .eq('merchant_oid', merchant_oid)
        .single();
      
      if (orderFetchError || !order) {
          console.error("Order not found for callback:", merchant_oid);
          return new NextResponse("OK");
      }

      // 2. Fetch Plan to get Interval (only if plan_id exists)
      let plan = null;
      if (order.plan_id) {
        const { data: planData, error: planFetchError } = await supabase
          .from('plans')
          .select('interval, name')
          .eq('id', order.plan_id)
          .single();
        
        if (!planFetchError) {
          plan = planData;
        }
      }

      let expiryDate = new Date();
      if (plan && plan.interval === 'yearly') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
          // Default to monthly
          expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      // 3. Update Order
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
            status: 'success', 
            updated_at: new Date().toISOString(),
            expiry_date: expiryDate.toISOString()
        })
        .eq('merchant_oid', merchant_oid);

      if (updateError) {
        console.error("Error updating order:", updateError);
      } else {
          console.log(`Order ${merchant_oid} updated. Expiry: ${expiryDate.toISOString()}`);
      }

      // 4. Legacy Market Access (Keep existing logic just in case)
      if (plan && plan.name.includes('Market')) {
         await supabase.from('profiles').update({ has_market_access: true }).eq('user_id', order.user_id);
      }

    } else {
      // Ödeme Başarısız
      console.log(`Payment failed for order: ${merchant_oid}`);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('merchant_oid', merchant_oid);

      if (error) {
        console.error("Error updating order status:", error);
      }
    }

    return new NextResponse("OK");
  } catch (error) {
    console.error("Callback Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
