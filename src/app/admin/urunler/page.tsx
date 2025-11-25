"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  is_active: boolean;
}

export default function ProductsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState(""); // Newline separated

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    } else if (user) {
      fetchProducts();
    }
  }, [user, authLoading, router]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const featureArray = features.split('\n').filter(f => f.trim() !== '');
    const productData = {
      name,
      description,
      price: parseFloat(price),
      features: featureArray,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken bir hata oluştu.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setFeatures(product.features ? product.features.join('\n') : "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setFeatures("");
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold logo-font">ÜRÜN YÖNETİMİ</h1>
          <Link href="/admin" className="text-zinc-400 hover:text-white">
            ← Admin Paneline Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Ürün Adı</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Fiyat (TL)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Özellikler (Her satıra bir özellik)</label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white h-40"
                    placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition-colors"
                  >
                    {editingProduct ? 'GÜNCELLE' : 'EKLE'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded transition-colors"
                    >
                      İPTAL
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-sm">
                        {product.price.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.features?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-zinc-800/50 border border-zinc-700 px-2 py-1 rounded text-zinc-300">
                          {feature}
                        </span>
                      ))}
                      {(product.features?.length ?? 0) > 3 && (
                        <span className="text-xs text-zinc-500 py-1">+{(product.features?.length ?? 0) - 3} özellik daha</span>
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 px-4 py-2 rounded transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 px-4 py-2 rounded transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                  Henüz ürün eklenmemiş.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
