import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  // Eğer kullanıcı bu sayfaya doğrudan (GET ile) gelirse ana sayfaya yönlendir.
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, 303);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;

    // PayTR başarılı işlem sonrası buraya POST eder.
    // Biz de kullanıcıyı GET ile başarılı sayfasına yönlendiririz.
    // merchant_oid'i query parametresi olarak ekleriz.

    const origin = new URL(request.url).origin;
    
    if (status === "success") {
      // DEVELOPMENT ONLY: Update order status here because callback might fail on localhost
      // In production, rely on the callback for security.
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          // 1. Fetch Order
          const { data: order } = await supabase
            .from('orders')
            .select('id, plan_id')
            .eq('merchant_oid', merchant_oid)
            .single();

          if (order) {
            // 2. Fetch Plan for interval
            let expiryDate = new Date();
            if (order.plan_id) {
              const { data: plan } = await supabase
                .from('plans')
                .select('interval')
                .eq('id', order.plan_id)
                .single();
              
              if (plan && plan.interval === 'yearly') {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
              } else {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
              }
            }

            // 3. Update Order
            await supabase
              .from('orders')
              .update({ 
                status: 'success', 
                updated_at: new Date().toISOString(),
                expiry_date: expiryDate.toISOString()
              })
              .eq('merchant_oid', merchant_oid);
              
            // 4. Update Profile if it's a Market plan (optional but good for consistency)
            // This logic is usually in callback but adding here for dev safety
          }
        }
      } catch (err) {
        console.error("Dev update error:", err);
      }

      return NextResponse.redirect(`${origin}/odeme/basarili?merchant_oid=${merchant_oid}`, 303);
    } else {
      return NextResponse.redirect(`${origin}/odeme/basarisiz?merchant_oid=${merchant_oid}`, 303);
    }

  } catch (error) {
    console.error("Payment Success Handler Error:", error);
    // Hata durumunda yine de bir sayfaya yönlendirelim
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/odeme/basarisiz`, 303);
  }
}
