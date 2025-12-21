import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * PayTR Bildirim URL (2. Adım)
 * PayTR ödeme tamamlandığında bu endpoint'e POST ile bildirim gönderir
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    const failed_reason_msg = formData.get('failed_reason_msg') as string;
    const payment_type = formData.get('payment_type') as string;

    console.log('=== PayTR Callback ===', {
      merchant_oid,
      status,
      total_amount,
      payment_type,
      time: new Date().toISOString(),
    });

    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_key || !merchant_salt) {
      console.error('Credentials missing!');
      return new Response('OK', { status: 200 });
    }

    // Hash doğrula
    const hash_str = merchant_oid + merchant_salt + status + total_amount;
    const calculated_hash = crypto
      .createHmac('sha256', merchant_key)
      .update(hash_str)
      .digest('base64');

    if (hash !== calculated_hash) {
      console.error('Hash FAIL!');
      return new Response('OK', { status: 200 });
    }

    console.log('Hash OK');

    // Supabase - Service Role Key ile
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get: async (name: string) => (await cookies()).get(name)?.value,
          set: async () => {},
          remove: async () => {},
        },
      }
    );

    // Sipariş bul
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', merchant_oid)
      .single();

    if (error || !order) {
      console.error('Order NOT found:', error);
      return new Response('OK', { status: 200 });
    }

    console.log('Order found:', order.id);

    if (order.payment_status === 'paid') {
      console.log('Already paid');
      return new Response('OK', { status: 200 });
    }

    // Güncelle
    if (status === 'success') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: payment_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Update FAIL:', updateError);
      } else {
        console.log('SUCCESS - Order updated to PAID!');
      }
    }

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('ERROR:', error.message);
    return new Response('OK', { status: 200 });
  }
}
