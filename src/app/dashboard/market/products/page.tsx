'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  sell_price: number;
  buy_price: number;
  stock_quantity: number;
  image_url: string | null;
  category_id: string;
  critical_stock_level: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('market_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('market_products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode?.includes(searchQuery) ||
    p.sku?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Ürün Yönetimi</h1>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Ürün ara (İsim, Barkod, SKU)..."
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-200 font-medium">
              <tr>
                <th className="px-6 py-3">Ürün</th>
                <th className="px-6 py-3">Barkod / SKU</th>
                <th className="px-6 py-3">Stok</th>
                <th className="px-6 py-3">Alış Fiyatı</th>
                <th className="px-6 py-3">Satış Fiyatı</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden relative shrink-0">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold">IMG</div>
                      )}
                    </div>
                    <span className="font-medium text-white">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{product.barcode || '-'}</span>
                      <span className="text-xs">{product.sku || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock_quantity < (product.critical_stock_level || 10) ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {product.stock_quantity} Adet
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.buy_price} ₺</td>
                  <td className="px-6 py-4 text-white font-medium">{product.sell_price} ₺</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchProducts} 
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onSuccess }: { product: Product | null, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    sku: product?.sku || '',
    buy_price: product?.buy_price?.toString() || '',
    sell_price: product?.sell_price?.toString() || '',
    stock_quantity: product?.stock_quantity?.toString() || '',
    critical_stock_level: product?.critical_stock_level?.toString() || '10'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        barcode: formData.barcode || null,
        sku: formData.sku || null,
        buy_price: parseFloat(formData.buy_price) || 0,
        sell_price: parseFloat(formData.sell_price) || 0,
        stock_quantity: parseFloat(formData.stock_quantity) || 0,
        critical_stock_level: parseFloat(formData.critical_stock_level) || 10,
        is_active: true
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('market_products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
      } else {
        // Insert new product
        const { error } = await supabase
          .from('market_products')
          .insert([productData]);
        
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Ürün Adı</label>
              <input
                required
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Barkod</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.barcode}
                onChange={e => setFormData({...formData, barcode: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Stok Kodu (SKU)</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Stok Miktarı</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.stock_quantity}
                onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Alış Fiyatı</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.buy_price}
                onChange={e => setFormData({...formData, buy_price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Satış Fiyatı</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.sell_price}
                onChange={e => setFormData({...formData, sell_price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Kritik Stok Seviyesi</label>
              <input
                type="number"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.critical_stock_level}
                onChange={e => setFormData({...formData, critical_stock_level: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
