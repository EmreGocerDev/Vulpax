'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-gray-950 shadow-2xl z-[9999] flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">
              Sepetim ({getTotalItems()} ürün)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-dark-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-20 h-20 text-dark-500 mb-4" />
              <p className="text-dark-600 text-lg mb-2">Sepetiniz boş</p>
              <p className="text-dark-700 text-sm mb-6">
                Alışverişe başlamak için ürünleri keşfedin
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition"
              >
                Ürünleri İncele
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-primary-500/30 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-dark-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary-400 font-bold text-lg mb-2">
                      {item.price.toLocaleString('tr-TR')} ₺
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="p-1.5 bg-gray-800 hover:bg-dark-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      
                      <span className="text-white font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => {
                          if (item.quantity < item.stock) {
                            updateQuantity(item.id, item.quantity + 1);
                          }
                        }}
                        className="p-1.5 bg-gray-800 hover:bg-dark-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-800 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="text-dark-600">Ara Toplam</span>
              <span className="text-white font-bold">
                {getTotalPrice().toLocaleString('tr-TR')} ₺
              </span>
            </div>

            {/* Shipping Info */}
            <p className="text-dark-700 text-sm text-center">
              Kargo ve vergiler ödeme sayfasında hesaplanacaktır
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white text-center rounded-xl font-bold transition shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40"
              >
                Ödemeye Geç
              </Link>
              
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-center rounded-xl font-semibold transition border border-gray-700"
              >
                Sepeti Görüntüle
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
