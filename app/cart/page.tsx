'use client';

import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-dark-400 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Sepetiniz Boş</h1>
            <p className="text-dark-600 mb-8">
              Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimize göz atın.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Sepetim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="neon-glass-island p-4 flex gap-4"
              >
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-dark-400">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-grow">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-white font-semibold hover:text-primary-400 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-dark-600 text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-900 transition"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="px-4 text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="ml-auto text-right">
                      <p className="text-white font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="neon-glass-island p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Toplam</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center"
              >
                Ödemeye Geç
              </Link>

              <Link
                href="/products"
                className="block text-center text-primary-400 hover:text-primary-300 mt-4 transition"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
