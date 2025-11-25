import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      user_basket, 
      email, 
      user_name, 
      user_address, 
      user_phone, 
      payment_amount, 
      merchant_oid 
    } = body;

    // PayTR Credentials
    const merchant_id = "642054";
    const merchant_key = "Ynk2qURAUxH5bC5G";
    const merchant_salt = "98CNTjAkbSTX7PWq";

    // User IP (Gerçek ortamda header'dan alınmalı)
    const user_ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // URLs
    const origin = new URL(request.url).origin;
    const merchant_ok_url = `${origin}/odeme/basarili`;
    const merchant_fail_url = `${origin}/odeme/basarisiz`;
    
    // Other params
    const timeout_limit = "30";
    const debug_on = "1";
    const test_mode = "0"; // 0: Live, 1: Test
    const no_installment = "0";
    const max_installment = "0";
    const currency = "TL";

    // Generate Hash
    // Concatenate: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    
    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    // Request to PayTR
    const params = new URLSearchParams();
    params.append("merchant_id", merchant_id);
    params.append("user_ip", user_ip);
    params.append("merchant_oid", merchant_oid);
    params.append("email", email);
    params.append("payment_amount", payment_amount.toString());
    params.append("paytr_token", paytr_token);
    params.append("user_basket", user_basket);
    params.append("debug_on", debug_on);
    params.append("no_installment", no_installment);
    params.append("max_installment", max_installment);
    params.append("user_name", user_name);
    params.append("user_address", user_address);
    params.append("user_phone", user_phone);
    params.append("merchant_ok_url", merchant_ok_url);
    params.append("merchant_fail_url", merchant_fail_url);
    params.append("timeout_limit", timeout_limit);
    params.append("currency", currency);
    params.append("test_mode", test_mode);

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      body: params,
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({ token: data.token });
    } else {
      console.error("PayTR Error:", data.reason);
      return NextResponse.json({ error: data.reason }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
