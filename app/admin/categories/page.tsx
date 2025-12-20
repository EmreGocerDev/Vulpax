'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
  image_url: string | null
  parent?: { name: string }
  children?: Category[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    display_order: 0,
    is_active: true,
    image_url: ''
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(name)
      `)
      .order('display_order')

    if (!error && data) {
      // Organize into tree structure
      const categoryMap = new Map<string, Category>()
      data.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }))
      
      const rootCategories: Category[] = []
      data.forEach(cat => {
        const category = categoryMap.get(cat.id)!
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id)
          if (parent) {
            parent.children = parent.children || []
            parent.children.push(category)
          }
        } else {
          rootCategories.push(category)
        }
      })
      
      setCategories(rootCategories)
    }
    setLoading(false)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleNameChange(name: string) {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      display_order: category.display_order,
      is_active: category.is_active,
      image_url: category.image_url || ''
    })
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      display_order: 0,
      is_active: true,
      image_url: ''
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const categoryData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      parent_id: formData.parent_id || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
      image_url: formData.image_url || null
    }

    if (editingId) {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingId)

      if (error) {
        alert('Kategori güncellenirken hata: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData])

      if (error) {
        alert('Kategori eklenirken hata: ' + error.message)
        return
      }
    }

    resetForm()
    fetchCategories()
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Kategori silinirken hata: ' + error.message)
    } else {
      fetchCategories()
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: !currentState })
      .eq('id', id)

    if (!error) {
      fetchCategories()
    }
  }

  // Get all categories as flat list for parent selection
  const getAllCategories = (cats: Category[], exclude?: string): Category[] => {
    let result: Category[] = []
    cats.forEach(cat => {
      if (cat.id !== exclude) {
        result.push(cat)
        if (cat.children && cat.children.length > 0) {
          result = result.concat(getAllCategories(cat.children, exclude))
        }
      }
    })
    return result
  }

  const renderCategoryTree = (cats: Category[], depth = 0) => {
    return cats.map(cat => (
      <div key={cat.id}>
        <div className="flex items-center gap-4 py-3 px-4 border-b border-white/5 hover:bg-white/5">
          <div style={{ paddingLeft: `${depth * 2}rem` }} className="flex-1 flex items-center gap-3">
            {cat.image_url && (
              <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-cover rounded" />
            )}
            <div>
              <div className="text-white font-medium">{cat.name}</div>
              {cat.parent && (
                <div className="text-xs text-white/50">Alt kategori: {cat.parent.name}</div>
              )}
            </div>
          </div>
          
          <div className="text-white/50 text-sm">{cat.display_order}</div>
          
          <button
            onClick={() => toggleActive(cat.id, cat.is_active)}
            className={`px-3 py-1 rounded text-xs ${
              cat.is_active 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {cat.is_active ? 'Aktif' : 'Pasif'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => startEdit(cat)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={() => handleDelete(cat.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              Sil
            </button>
          </div>
        </div>
        {cat.children && cat.children.length > 0 && renderCategoryTree(cat.children, depth + 1)}
      </div>
    ))
  }

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <h1 className="text-2xl font-bold text-white">Kategori Yönetimi</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="neon-glass-island p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Kategori Adı *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Açıklama</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Üst Kategori</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="">Ana Kategori</option>
                {getAllCategories(categories, editingId || undefined).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Sıra</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Görsel URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                Aktif
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 neon-glass-island p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Kategoriler</h2>
          
          {loading ? (
            <div className="text-center py-12 text-white/50">Yükleniyor...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-white/50">Henüz kategori eklenmemiş</div>
          ) : (
            <div className="space-y-1">
              {renderCategoryTree(categories)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
