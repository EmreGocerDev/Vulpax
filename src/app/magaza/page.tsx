"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            MAĞAZA
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            İhtiyacınıza uygun yazılım paketini seçin ve hemen projenize başlayalım.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-red-500/50 transition-colors group flex flex-col">
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-zinc-400 text-sm mb-6 min-h-[40px]">{product.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">₺</span>
                      <span className="text-4xl font-bold text-white">{product.price.toLocaleString('tr-TR')}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">+ KDV</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                  <Link 
                    href={`/odeme?productId=${product.id}`}
                    className="block w-full bg-white text-black hover:bg-zinc-200 font-bold text-center py-3 rounded transition-colors"
                  >
                    SATIN AL
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
