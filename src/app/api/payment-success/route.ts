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

    const origin = new URL(request.url).origin;
    
    // ALWAYS update order status when PayTR redirects back
    // This ensures order is updated even if callback fails
    if (status === "success") {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (supabaseServiceKey && merchant_oid) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          // 1. Fetch Order
          const { data: order } = await supabase
            .from('orders')
            .select('id, plan_id, user_id, status')
            .eq('merchant_oid', merchant_oid)
            .single();

          // Only update if still pending (avoid overwriting callback update)
          if (order && order.status === 'pending') {
            // 2. Fetch Plan for interval
            let expiryDate = new Date();
            if (order.plan_id) {
              const { data: plan } = await supabase
                .from('plans')
                .select('interval, name')
                .eq('id', order.plan_id)
                .single();
              
              if (plan) {
                if (plan.interval === 'yearly') {
                  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                } else {
                  expiryDate.setMonth(expiryDate.getMonth() + 1);
                }
                
                // Update Market Access if needed
                if (plan.name.includes('Market')) {
                  await supabase.from('profiles').update({ has_market_access: true }).eq('user_id', order.user_id);
                }
              }
            }

            // 3. Update Order
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                status: 'success', 
                updated_at: new Date().toISOString(),
                expiry_date: expiryDate.toISOString()
              })
              .eq('merchant_oid', merchant_oid)
              .eq('status', 'pending'); // Only update if still pending

            if (updateError) {
              console.error("Payment-success update error:", updateError);
            } else {
              console.log(`Order ${merchant_oid} updated via payment-success route`);
            }
          }
        }
      } catch (err) {
        console.error("Payment-success handler error:", err);
      }

      return NextResponse.redirect(`${origin}/odeme/basarili?merchant_oid=${merchant_oid}`, 303);
    } else {
      return NextResponse.redirect(`${origin}/odeme/basarisiz?merchant_oid=${merchant_oid}`, 303);
    }

  } catch (error) {
    console.error("Payment Success Handler Error:", error);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/odeme/basarisiz`, 303);
  }
}
