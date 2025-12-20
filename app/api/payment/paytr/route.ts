import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderNumber,
      amount,
      userEmail,
      userName,
      userPhone,
      userAddress,
    } = body;

    const merchant_id = process.env.NEXT_PUBLIC_PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('PayTR credentials missing:', { merchant_id, merchant_key: !!merchant_key, merchant_salt: !!merchant_salt });
      return NextResponse.json({
        status: 'error',
        reason: 'PayTR yapılandırması eksik',
      }, { status: 500 });
    }

    // Tutarı kuruşa çevir (PayTR kuruş cinsinden çalışır)
    const payment_amount = Math.round(amount * 100);

    // Sepet bilgilerini oluştur
    const user_basket = JSON.stringify([
      [orderNumber, payment_amount, 1]
    ]);

    // Başarılı ve başarısız ödeme URL'leri
    const merchant_ok_url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`;
    const merchant_fail_url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/failed`;

    // User IP
    const user_ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Hash oluştur (PayTR dökümanına göre doğru sıralama)
    const hash_str = merchant_id + 
                    user_ip + 
                    orderNumber + 
                    userEmail + 
                    payment_amount + 
                    user_basket + 
                    '0' + // no_installment
                    '999' + // max_installment
                    'TRY' + // currency
                    '0' + // test_mode
                    merchant_salt;

    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hash_str)
      .digest('base64');

    // PayTR'ye istek gönder
    const formData = new URLSearchParams({
      merchant_id: merchant_id,
      user_ip: user_ip,
      merchant_oid: orderNumber,
      email: userEmail,
      payment_amount: payment_amount.toString(),
      paytr_token: paytr_token,
      user_basket: user_basket,
      debug_on: '0',
      test_mode: '0',
      no_installment: '0',
      max_installment: '999',
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone.replace(/\s/g, ''),
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      timeout_limit: '30',
      currency: 'TRY',
      lang: 'tr',
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    console.log('PayTR Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('PayTR JSON Parse Error:', e);
      return NextResponse.json({
        status: 'error',
        reason: 'PayTR yanıtı işlenemedi: ' + responseText.substring(0, 100),
      }, { status: 500 });
    }

    if (data.status === 'success') {
      return NextResponse.json({
        status: 'success',
        token: data.token,
      });
    } else {
      return NextResponse.json({
        status: 'error',
        reason: data.reason || 'PayTR token alınamadı',
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('PayTR API Error:', error);
    return NextResponse.json({
      status: 'error',
      reason: error.message || 'Bir hata oluştu',
    }, { status: 500 });
  }
}
