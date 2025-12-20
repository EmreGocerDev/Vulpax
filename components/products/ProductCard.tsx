'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  images: any;
  stock_quantity: number;
  short_description: string | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock_quantity === 0) {
      toast.error('Ürün stokta yok');
      return;
    }

    const images = Array.isArray(product.images) ? product.images : [];
    const firstImage = images[0] || null;

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: firstImage,
      stock: product.stock_quantity,
    });

    toast.success('Ürün sepete eklendi');
  };

  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = images[0] || null;
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="neon-card h-full flex flex-col overflow-hidden">
        {/* Shine Effects */}
        <span className="shine shine-top"></span>
        <span className="shine shine-bottom"></span>
        
        {/* Glow Effects */}
        <span className="glow glow-top"></span>
        <span className="glow glow-bottom"></span>
        <span className="glow glow-bright glow-top"></span>
        <span className="glow glow-bright glow-bottom"></span>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-[15px]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--hue1)_50%_20%_/_0.4)] to-[hsl(var(--hue2)_50%_20%_/_0.4)] flex items-center justify-center">
              <span className="text-6xl font-bold text-[hsl(var(--hue1)_70%_60%_/_0.5)]">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="neon-badge bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-blue-500/30">
                {discount}% İNDİRİM
              </span>
            )}
            {product.stock_quantity === 0 && (
              <span className="neon-badge bg-gray-900/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-700">
                TÜKENDİ
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast('Favorilere eklendi', { icon: '❤️' });
              }}
              className="nav-icon-btn !p-2"
            >
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220deg_25%_4.8%)] via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Content */}
        <div className="inner p-4 flex flex-col flex-grow">
          {product.categories && (
            <span className="text-xs font-semibold mb-2 bg-gradient-to-r from-[hsl(var(--hue1)_70%_65%)] to-[hsl(var(--hue2)_70%_65%)] bg-clip-text text-transparent">
              {product.categories.name}
            </span>
          )}

          <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[hsl(var(--hue1)_70%_70%)] group-hover:to-[hsl(var(--hue2)_70%_70%)] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {product.name}
          </h3>

          {product.short_description && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="neon-button w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock_quantity === 0 ? 'Stokta Yok' : 'Sepete Ekle'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
