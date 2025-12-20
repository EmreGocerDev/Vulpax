'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock_quantity: number
  category_id: string
  is_active: boolean
  images: string[]
  created_at: string
  category?: {
    name: string
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (!error && data) {
      setCategories(data)
    }
  }

  async function fetchProducts() {
    setLoading(true)
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `)
      .order('created_at', { ascending: false })

    if (filterCategory) {
      query = query.eq('category_id', filterCategory)
    }

    const { data, error } = await query

    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [filterCategory])

  async function handleDelete(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (!error) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      alert('Ürün silinirken hata oluştu: ' + error.message)
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentState })
      .eq('id', id)

    if (!error) {
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: !currentState } : p
      ))
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Ürün Yönetimi</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          + Yeni Ürün Ekle
        </Link>
      </div>

      <div className="neon-glass-island p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-500/50"
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Görsel</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Ürün Adı</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Kategori</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Fiyat</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Stok</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Durum</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-white/50">
                      Ürün bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white/30 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-white">{product.name}</td>
                      <td className="py-3 px-4 text-white/70">
                        {product.category?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-white">₺{product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`${product.stock_quantity > 10 ? 'text-green-400' : product.stock_quantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className={`px-3 py-1 rounded text-xs ${
                            product.is_active 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {product.is_active ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                          >
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
