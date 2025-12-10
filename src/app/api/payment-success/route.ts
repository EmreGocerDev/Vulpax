import { NextResponse } from "next/server";

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
