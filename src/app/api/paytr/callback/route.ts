import { NextResponse } from "next/server";
import crypto from "crypto";

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

    if (status === "success") {
      // Ödeme Başarılı
      // Burada veritabanınızı güncelleyip siparişi onaylayabilirsiniz.
      console.log(`Payment successful for order: ${merchant_oid}`);
    } else {
      // Ödeme Başarısız
      console.log(`Payment failed for order: ${merchant_oid}`);
    }

    return new NextResponse("OK");
  } catch (error) {
    console.error("Callback Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
