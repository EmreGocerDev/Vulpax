"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PayTRCheckout from "../components/PayTRCheckout";
import { supabase } from "@/lib/supabase";

interface Product {
  name: string;
  price: number;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(!!productId);
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [basket, setBasket] = useState([
    { name: "Vulpax Yazılım Hizmeti", price: 100.00, quantity: 1 }
  ]);

  const [totalAmount, setTotalAmount] = useState(100.00);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name, price')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const product = data as unknown as Product;
        setBasket([
          { name: product.name, price: product.price, quantity: 1 }
        ]);
        setTotalAmount(product.price);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          GÜVENLİ <span className="text-red-500">ÖDEME</span>
        </h1>

        {step === 1 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>
            <div className="bg-black/50 p-4 rounded mb-8 border border-zinc-800">
              {basket.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2 last:mb-0">
                  <span className="text-zinc-300">{item.name}</span>
                  <span className="text-white font-bold">{item.price.toLocaleString('tr-TR')} TL</span>
                </div>
              ))}
              <div className="border-t border-zinc-700 mt-4 pt-4 flex justify-between items-center">
                <span className="text-white font-bold">TOPLAM</span>
                <span className="text-red-500 font-bold text-xl">{totalAmount.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded focus:border-red-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">E-posta</label>
                  <input 
                    type="email" 
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded focus:border-red-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Telefon</label>
                  <input 
                    type="text" 
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Adres</label>
                <textarea 
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded focus:border-red-500 outline-none h-24"
                  required
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={() => {
                    if (!userInfo.name || !userInfo.email || !userInfo.phone || !userInfo.address) {
                      alert("Lütfen tüm alanları doldurunuz.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="primary-button w-full"
                >
                  ÖDEMEYE GEÇ ({totalAmount.toLocaleString('tr-TR')} TL)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={() => setStep(1)}
              className="text-zinc-400 hover:text-white flex items-center gap-2"
            >
              ← Bilgileri Düzenle
            </button>
            
            <PayTRCheckout 
              userBasket={basket}
              userInfo={userInfo}
              totalAmount={totalAmount}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Yükleniyor...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
