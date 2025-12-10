"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
  const searchParams = useSearchParams();
  const merchant_oid = searchParams.get("merchant_oid");

  useEffect(() => {
    // Geliştirme ortamında callback çalışmayacağı için,
    // başarılı sayfasına gelindiğinde siparişi manuel olarak güncelle
    // NOT: Bu sadece geliştirme/test içindir. Prodüksiyonda callback kullanılmalıdır.
    const updateOrderStatus = async () => {
      if (merchant_oid) {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'success', updated_at: new Date().toISOString() })
          .eq('merchant_oid', merchant_oid)
          .eq('status', 'pending'); // Sadece pending olanları güncelle

        if (error) {
          console.error("Sipariş durumu güncellenemedi:", error);
        }
      }
    };

    updateOrderStatus();
  }, [merchant_oid]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-green-500/30 p-8 rounded-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ödeme Başarılı!</h1>
        <p className="text-zinc-400 mb-8">
          Ödemeniz başarıyla alındı. Siparişiniz işleme konulmuştur.
        </p>
        <a href="/profil" className="primary-button inline-block">
          PROFİLE GİT
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
