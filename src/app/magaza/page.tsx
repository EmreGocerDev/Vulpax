"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../hooks/useAuth";
import PayTRCheckout from "../components/PayTRCheckout";
import Portal from "../components/Portal";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  image_url: string | null;
  is_active: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  is_active: boolean;
}

export default function StorePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Purchase Modal State
  const [selectedItem, setSelectedItem] = useState<{ type: 'product' | 'plan', item: Product | Plan, merchant_oid: string } | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const [productsRes, plansRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true).order('price'),
        supabase.from('plans').select('*').eq('is_active', true).order('price')
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (plansRes.data) setPlans(plansRes.data);
    } catch (error) {
      console.error('Error fetching store items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (type: 'product' | 'plan', item: Product | Plan) => {
    if (!user) {
      alert('Satın almak için giriş yapmalısınız.');
      return;
    }

    // Generate merchant_oid
    const merchant_oid = "SP" + Math.floor(Math.random() * 9999999) + Date.now();

    try {
      // Create order in DB
      const { error } = await supabase.from('orders').insert({
        merchant_oid,
        user_id: user.id,
        product_id: type === 'product' ? item.id : null,
        plan_id: type === 'plan' ? item.id : null,
        amount: item.price,
        status: 'pending'
      });

      if (error) throw error;

      setSelectedItem({ type, item, merchant_oid });
      setIsPurchaseModalOpen(true);
    } catch (error) {
      console.error('Sipariş oluşturulamadı:', error);
      alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">MAĞAZA</h1>
          <p className="text-zinc-400 text-lg">
            Yazılım ürünleri ve abonelik planları
          </p>
        </div>

        {/* Products Section */}
        {products.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4">Ürünler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 group">
                  <div className="aspect-square relative bg-zinc-800">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold border border-zinc-700">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    {product.features && product.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-zinc-300">
                            <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => handleBuyClick('product', product)}
                      className="w-full bg-white text-black font-bold py-3 rounded hover:bg-zinc-200 transition-colors"
                    >
                      SATIN AL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Plans Section */}
        {plans.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-purple-600 pl-4">Planlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-32 h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-6">
                    {plan.price.toLocaleString('tr-TR')} ₺
                    <span className="text-sm text-zinc-500 font-normal ml-1">/ adet</span>
                  </div>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {plan.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-sm text-zinc-300">
                        <svg className="w-5 h-5 text-purple-500 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleBuyClick('plan', plan)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors"
                  >
                    PLAN SEÇ
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && plans.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Henüz mağazada ürün bulunmuyor.
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {isPurchaseModalOpen && selectedItem && user && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative rounded-xl shadow-2xl">
              <button 
                onClick={() => setIsPurchaseModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Satın Al: {selectedItem.item.name}
                </h2>
                
                <PayTRCheckout 
                  userBasket={[
                    {
                      name: selectedItem.item.name,
                      price: selectedItem.item.price,
                      quantity: 1
                    }
                  ]}
                  userInfo={{
                    email: user.email || '',
                    name: user.user_metadata?.full_name || user.user_metadata?.name || 'Kullanıcı',
                    address: user.user_metadata?.address || 'Teslimat adresi',
                    phone: user.user_metadata?.phone || '05555555555'
                  }}
                  totalAmount={selectedItem.item.price}
                  merchantOid={selectedItem.merchant_oid}
                />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
