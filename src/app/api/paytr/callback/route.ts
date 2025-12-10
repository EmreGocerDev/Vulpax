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

    const params = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const token = crypto
      .createHmac("sha256", merchant_key)
      .update(params)
      .digest("base64");

    if (token !== hash) {
      return new NextResponse("PAYTR notification failed: bad hash", { status: 400 });
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceKey) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is missing. Cannot update order status.");
        return new NextResponse("OK");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (status === "success") {
      // Ödeme Başarılı
      console.log(`Payment successful for order: ${merchant_oid}`);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'success', updated_at: new Date().toISOString() })
        .eq('merchant_oid', merchant_oid);

      if (error) {
        console.error("Error updating order status:", error);
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
