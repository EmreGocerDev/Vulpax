'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Trash2, Plus, Minus, CreditCard, Banknote, Wallet, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import ReceiptModal from './ReceiptModal';

interface Product {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  sell_price: number;
  image_url: string | null;
  category_id: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  balance: number;
}

export default function POSPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    // Focus barcode input on load
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('market_products')
      .select('*')
      .eq('is_active', true);
    
    if (data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('market_customers')
      .select('id, name, balance');
    
    if (data) {
      setCustomers(data as unknown as Customer[]);
    }
  };

  const handleCheckout = async (paymentMethod: 'CASH' | 'CREDIT_CARD' | 'ON_ACCOUNT') => {
    if (cart.length === 0) return;
    if (paymentMethod === 'ON_ACCOUNT' && !selectedCustomer) {
      alert('Veresiye satış için müşteri seçmelisiniz!');
      return;
    }
    if (!user) return;

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc('complete_market_sale', {
        p_customer_id: selectedCustomer?.id || null,
        p_payment_method: paymentMethod,
        p_items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        p_user_id: user.id,
        p_discount_amount: 0
      });

      if (error) throw error;

      if (data && (data as any).success) {
        // Prepare receipt data
        const saleId = (data as any).sale_id;
        const newReceiptData = {
          id: saleId,
          date: new Date(),
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.sell_price,
            total: item.sell_price * item.quantity
          })),
          subtotal: totalAmount / 1.18, // Assuming 18% VAT included
          tax: totalAmount - (totalAmount / 1.18),
          total: totalAmount,
          paymentMethod: paymentMethod.toLowerCase(),
          customerName: selectedCustomer?.name
        };
        
        setReceiptData(newReceiptData);
        setShowReceiptModal(true);
        
        setCart([]);
        setSelectedCustomer(null);
        // Refresh products to update stock
        fetchProducts();
      } else {
        alert('Satış işlemi başarısız: ' + ((data as any)?.error || 'Bilinmeyen hata'));
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Hata: ' + error.message);
    } finally {
      setIsProcessing(false);
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.barcode === searchQuery || p.sku === searchQuery);
    if (product) {
      addToCart(product);
      setSearchQuery('');
    } else {
      // Maybe play error sound
      alert('Ürün bulunamadı!');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.sell_price * item.quantity), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode?.includes(searchQuery)
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Left Side - Product Grid */}
      <div className="flex-1 flex flex-col bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <form onSubmit={handleBarcodeSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="Barkod okutun veya ürün arayın..."
              className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="group relative aspect-square bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-red-600/50 transition-all"
              >
                {product.image_url ? (
                  <Image 
                    src={product.image_url} 
                    alt={product.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <span className="text-2xl font-bold text-zinc-700">IMG</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 to-transparent">
                  <p className="text-white font-medium truncate">{product.name}</p>
                  <p className="text-red-500 font-bold">{product.sell_price} ₺</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-zinc-900 border border-white/10 rounded-xl flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Sepet</h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-zinc-400">{cart.length} ürün eklendi</p>
            <select 
              className="bg-black/50 border border-white/10 rounded text-sm text-white p-1 outline-none focus:border-red-600"
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find(c => c.id === e.target.value);
                setSelectedCustomer(customer || null);
              }}
            >
              <option value="">Müşteri Seç (Opsiyonel)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-white font-medium truncate">{item.name}</p>
                <p className="text-sm text-zinc-400">{item.sell_price} ₺ x {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="text-white w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
                >
                  <Plus size={16} />
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 hover:bg-red-500/20 rounded text-red-500 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold text-white">
            <span>Toplam</span>
            <span className="text-2xl text-red-500">{totalAmount.toFixed(2)} ₺</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleCheckout('CASH')}
              disabled={isProcessing || cart.length === 0}
              className="flex flex-col items-center justify-center p-3 bg-green-600/10 border border-green-600/20 rounded-lg text-green-500 hover:bg-green-600/20 transition-colors disabled:opacity-50"
            >
              <Banknote size={24} className="mb-1" />
              <span className="text-xs font-bold">NAKİT</span>
            </button>
            <button 
              onClick={() => handleCheckout('CREDIT_CARD')}
              disabled={isProcessing || cart.length === 0}
              className="flex flex-col items-center justify-center p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-500 hover:bg-blue-600/20 transition-colors disabled:opacity-50"
            >
              <CreditCard size={24} className="mb-1" />
              <span className="text-xs font-bold">KART</span>
            </button>
            <button 
              onClick={() => handleCheckout('ON_ACCOUNT')}
              disabled={isProcessing || cart.length === 0}
              className="flex flex-col items-center justify-center p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg text-purple-500 hover:bg-purple-600/20 transition-colors disabled:opacity-50"
            >
              <Wallet size={24} className="mb-1" />
              <span className="text-xs font-bold">VERESİYE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-green-500/50 p-8 rounded-xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Satış Başarılı!</h2>
            <p className="text-zinc-400">İşlem kaydedildi.</p>
          </div>
        </div>
      )}
      {/* Receipt Modal */}
      <ReceiptModal 
        isOpen={showReceiptModal} 
        onClose={() => setShowReceiptModal(false)} 
        data={receiptData} 
      />
    </div>
  );
}
