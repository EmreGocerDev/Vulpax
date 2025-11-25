"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface PayTRCheckoutProps {
  userBasket: any[];
  userInfo: {
    email: string;
    name: string;
    address: string;
    phone: string;
  };
  totalAmount: number; // TL cinsinden (örn: 100.50)
}

export default function PayTRCheckout({ userBasket, userInfo, totalAmount }: PayTRCheckoutProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        
        // Sepeti PayTR formatına çevir
        // Örnek: [["Örnek Ürün 1", "50.00", 1], ["Örnek Ürün 2", "50.00", 1]]
        const basketStr = JSON.stringify(
          userBasket.map(item => [item.name, item.price.toString(), item.quantity])
        );

        // Benzersiz sipariş numarası oluştur
        const merchant_oid = "SP" + Math.floor(Math.random() * 9999999) + Date.now();

        // Tutar 100 ile çarpılmalı (kuruş cinsinden)
        const payment_amount = Math.round(totalAmount * 100);

        const response = await fetch("/api/paytr/get-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_basket: basketStr,
            merchant_oid,
            payment_amount,
            email: userInfo.email,
            user_name: userInfo.name,
            user_address: userInfo.address,
            user_phone: userInfo.phone,
          }),
        });

        const data = await response.json();

        if (data.token) {
          setToken(data.token);
        } else {
          setError(data.error || "Token alınamadı");
        }
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [userBasket, userInfo, totalAmount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <span className="ml-4 text-white">Ödeme formu yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded">
        Hata: {error}
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" />
      <iframe
        src={`https://www.paytr.com/odeme/guvenli/${token}`}
        id="paytriframe"
        style={{ width: "100%", minHeight: "600px" }}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
