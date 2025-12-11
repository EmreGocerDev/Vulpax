'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Minus, Save, ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  barcode: string;
  buy_price: number;
  stock_quantity: number;
}

interface Supplier {
  id: string;
  name: string;
}

interface EntryItem extends Product {
  quantity: number;
  new_buy_price: number;
}

export default function StockEntryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cart, setCart] = useState<EntryItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [documentNo, setDocumentNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [prodRes, suppRes] = await Promise.all([
      supabase.from('market_products').select('id, name, barcode, buy_price, stock_quantity').eq('is_active', true),
      supabase.from('market_suppliers').select('id, name')
    ]);

    if (prodRes.data) setProducts(prodRes.data as unknown as Product[]);
    if (suppRes.data) setSuppliers(suppRes.data as unknown as Supplier[]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, quantity: 1, new_buy_price: product.buy_price }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'quantity' | 'new_buy_price', value: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSave = async () => {
    if (!selectedSupplier) {
      alert('Lütfen bir tedarikçi seçin.');
      return;
    }
    if (cart.length === 0) {
      alert('Listeye ürün ekleyin.');
      return;
    }
    if (!user) return;

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc('complete_market_purchase', {
        p_supplier_id: selectedSupplier,
        p_items: cart.map(item => ({ 
          product_id: item.id, 
          quantity: item.quantity, 
          buy_price: item.new_buy_price 
        })),
        p_user_id: user.id,
        p_document_no: documentNo
      });

      if (error) throw error;

      if (data && (data as any).success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/market/stock');
        }, 2000);
      } else {
        alert('İşlem başarısız: ' + ((data as any)?.error || 'Hata'));
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Hata: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode?.includes(searchQuery)
  );

  const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.new_buy_price), 0);

  if (showSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Stok Girişi Başarılı!</h2>
        <p className="text-zinc-400">Stoklar güncellendi, yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white">Yeni Stok Girişi (Mal Kabul)</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-zinc-400">Toplam Tutar</p>
            <p className="text-2xl font-bold text-white">{totalAmount.toFixed(2)} ₺</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isProcessing}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{isProcessing ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left: Product Selection */}
        <div className="lg:col-span-1 bg-zinc-900/50 border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Tedarikçi Seç</label>
              <select 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-red-600"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">Seçiniz...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1 block">Belge No (Fatura/İrsaliye)</label>
              <input 
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-red-600"
                value={documentNo}
                onChange={(e) => setDocumentNo(e.target.value)}
                placeholder="Örn: IRS-2024-001"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-red-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors text-left group"
              >
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-xs text-zinc-500">{product.barcode} • Stok: {product.stock_quantity}</p>
                </div>
                <Plus size={16} className="text-zinc-500 group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Entry List */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-zinc-400">
              <div className="col-span-5">Ürün</div>
              <div className="col-span-2 text-center">Miktar</div>
              <div className="col-span-3 text-center">Alış Fiyatı (Birim)</div>
              <div className="col-span-2 text-right">Toplam</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 && (
              <div className="text-center text-zinc-500 py-10">
                Listeye ürün ekleyin.
              </div>
            )}
            {cart.map(item => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="col-span-5">
                  <p className="text-white font-medium truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.barcode}</p>
                </div>
                <div className="col-span-2 flex items-center justify-center space-x-2">
                  <button onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))} className="p-1 hover:bg-white/10 rounded text-zinc-400">
                    <Minus size={14} />
                  </button>
                  <input 
                    type="number" 
                    className="w-12 bg-transparent text-center text-white outline-none border-b border-white/10 focus:border-red-600"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <button onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)} className="p-1 hover:bg-white/10 rounded text-zinc-400">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <input 
                    type="number" 
                    className="w-20 bg-transparent text-center text-white outline-none border-b border-white/10 focus:border-red-600"
                    value={item.new_buy_price}
                    onChange={(e) => updateItem(item.id, 'new_buy_price', parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-zinc-500 ml-1">₺</span>
                </div>
                <div className="col-span-2 flex items-center justify-end space-x-3">
                  <span className="text-white font-bold">{(item.quantity * item.new_buy_price).toFixed(2)} ₺</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
