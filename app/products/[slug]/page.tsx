'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Check, Package, Truck, Shield } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock_quantity: number
  images: string[]
  features: string[]
  category_id: string
  is_active: boolean
  categories?: {
    name: string
    slug: string
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProduct() {
      const { data: productData, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !productData) {
        setLoading(false);
        return;
      }

      const typedProduct = productData as unknown as Product;
      setProduct(typedProduct);

      // Fetch related products
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', typedProduct.category_id)
        .eq('is_active', true)
        .neq('id', typedProduct.id)
        .limit(4);

      if (related) setRelatedProducts(related);
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock_quantity === 0) {
      toast.error('Ürün stokta yok');
      return;
    }

    const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: firstImage,
      stock: product.stock_quantity,
    });

    toast.success('Ürün sepete eklendi!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const typedProduct = product;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-white/50 hover:text-white">
            Ana Sayfa
          </Link>
          <span className="text-white/30 mx-2">/</span>
          <Link href="/products" className="text-white/50 hover:text-white">
            Ürünler
          </Link>
          {typedProduct.categories && (
            <>
              <span className="text-white/30 mx-2">/</span>
              <Link
                href={`/products?category=${typedProduct.category_id}`}
                className="text-white/50 hover:text-white"
              >
                {typedProduct.categories.name}
              </Link>
            </>
          )}
          <span className="text-white/30 mx-2">/</span>
          <span className="text-white">{typedProduct.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="neon-glass-island p-4">
              {typedProduct.images && typedProduct.images.length > 0 ? (
                <img
                  src={typedProduct.images[0]}
                  alt={typedProduct.name}
                  className="w-full h-[500px] object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-[500px] bg-white/5 rounded-lg flex items-center justify-center">
                  <Package className="w-24 h-24 text-white/20" />
                </div>
              )}
            </div>
            
            {typedProduct.images && typedProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {typedProduct.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="neon-glass-island p-2">
                    <img
                      src={img}
                      alt={`${typedProduct.name} ${i + 2}`}
                      className="w-full h-24 object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {typedProduct.name}
              </h1>
              {typedProduct.categories && (
                <Link
                  href={`/products?category=${typedProduct.category_id}`}
                  className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
                >
                  {typedProduct.categories.name}
                </Link>
              )}
            </div>

            <div className="neon-glass-island p-6">
              <div className="text-4xl font-bold text-white mb-2">
                ₺{typedProduct.price.toFixed(2)}
              </div>
              <div className="text-white/70">KDV Dahil</div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {typedProduct.stock_quantity > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    Stokta ({typedProduct.stock_quantity} adet)
                  </span>
                </>
              ) : (
                <span className="text-red-400">Stokta Yok</span>
              )}
            </div>

            {/* Add to Cart Button */}
            {typedProduct.stock_quantity > 0 && (
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
            )}

            {/* Features */}
            <div className="neon-glass-island p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Özellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">Güvenli E-Teslimat</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">1 Yıl Garanti</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">Anında Teslimat</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-red-400" />
                  <span className="text-white/70">Güvenli Alışveriş</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 neon-glass-island p-8">
            <h2 className="text-xl font-bold text-white mb-4">Ürün Açıklaması</h2>
            <div className="text-white/70 whitespace-pre-wrap leading-relaxed">
              {typedProduct.description || 'Açıklama bulunmamaktadır.'}
            </div>
          </div>

          {typedProduct.features && typedProduct.features.length > 0 && (
            <div className="neon-glass-island p-8">
              <h2 className="text-xl font-bold text-white mb-4">Teknik Özellikler</h2>
              <ul className="space-y-3">
                {typedProduct.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70">
                    <Check className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="neon-glass-island p-4 group hover:scale-105 transition-transform"
                >
                  {relatedProduct.images && relatedProduct.images.length > 0 ? (
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-contain rounded mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-white/5 rounded mb-4 flex items-center justify-center">
                      <Package className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <h3 className="text-white font-semibold mb-2 group-hover:text-red-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-red-400 font-bold">
                    ₺{relatedProduct.price.toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
