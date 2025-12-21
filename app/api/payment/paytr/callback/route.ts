import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

/**
 * PayTR Bildirim URL (2. Adım)
 * PayTR ödeme tamamlandığında bu endpoint'e POST ile bildirim gönderir
 * Bu sayfa müşterilerin yönlendirildiği bir sayfa DEĞİLDİR, PayTR'nin arka planda kullandığı bir API endpoint'idir
 */
export async function POST(request: Request) {
  try {
    // PayTR'den gelen POST verilerini al
    const formData = await request.formData();
    
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    const failed_reason_code = formData.get('failed_reason_code') as string;
    const failed_reason_msg = formData.get('failed_reason_msg') as string;
    const test_mode = formData.get('test_mode') as string;
    const payment_type = formData.get('payment_type') as string;
    const currency = formData.get('currency') as string;
    const payment_amount = formData.get('payment_amount') as string;

    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_key || !merchant_salt) {
      console.error('PayTR credentials missing');
      return new Response('PAYTR notification failed: configuration error', { status: 500 });
    }

    // Hash doğrulaması yap (GÜVENLİK İÇİN ÇOK ÖNEMLİ!)
    // PayTR'den gelen isteğin gerçekten PayTR'den geldiğini ve değiştirilmediğini kontrol et
    const hash_str = merchant_oid + merchant_salt + status + total_amount;
    const calculated_hash = crypto
      .createHmac('sha256', merchant_key)
      .update(hash_str)
      .digest('base64');

    if (hash !== calculated_hash) {
      console.error('PayTR notification failed: bad hash', {
        received: hash,
        calculated: calculated_hash,
        merchant_oid,
      });
      return new Response('PAYTR notification failed: bad hash', { status: 400 });
    }

    // Supabase client oluştur
    const supabase = await createClient();

    // Siparişi merchant_oid (order_number) ile bul
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', merchant_oid)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', merchant_oid, orderError);
      // Yine de OK dön ki PayTR tekrar denemesin
      return new Response('OK', { status: 200 });
    }

    // Eğer sipariş zaten onaylanmış veya iptal edilmişse, tekrar işlem yapma
    // Aynı bildirim birden fazla gelebilir (ağ sorunları vb.)
    if (order.payment_status === 'paid' || order.payment_status === 'failed') {
      console.log('Order already processed:', merchant_oid, order.payment_status);
      return new Response('OK', { status: 200 });
    }

    // Ödeme başarılıysa
    if (status === 'success') {
      // Siparişi onayla - payment_status'u paid yap
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: payment_type, // 'card' veya 'eft'
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return new Response('PAYTR notification failed: database error', { status: 500 });
      }

      console.log('Order payment confirmed:', {
        order_number: merchant_oid,
        order_id: order.id,
        amount: total_amount,
        payment_type,
      });

      // Burada e-posta/SMS bildirimi gönderilebilir
      // TODO: Email notification

    } else {
      // Ödeme başarısızsa - payment_status'u failed yap
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          notes: `Ödeme Başarısız: ${failed_reason_msg || 'Bilinmeyen hata'} (Kod: ${failed_reason_code || 'N/A'})`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return new Response('PAYTR notification failed: database error', { status: 500 });
      }

      console.log('Order payment failed:', {
        order_number: merchant_oid,
        order_id: order.id,
        reason: failed_reason_msg,
        code: failed_reason_code,
      });
    }

    // PayTR'e bildirimin alındığını bildir
    // ÇOK ÖNEMLİ: Sadece "OK" yazısı dönülmeli, başka hiçbir şey eklenMEMELİ
    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('PayTR callback error:', error);
    // Hata olsa bile OK dön ki PayTR sürekli denemesin
    return new Response('OK', { status: 200 });
  }
}
