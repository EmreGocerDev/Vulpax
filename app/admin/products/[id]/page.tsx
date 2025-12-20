'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { uploadProductImage, deleteProductImage } from '@/lib/supabase/storage'
import { Upload, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Category {
  id: string
  name: string
  parent_id: string | null
}

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'new'
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    is_active: true,
    images: [] as string[],
    features: [] as string[]
  })

  const [featureInput, setFeatureInput] = useState('')

  useEffect(() => {
    fetchCategories()
    if (!isNew) {
      fetchProduct()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (data) setCategories(data)
  }

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      alert('Ürün yüklenirken hata oluştu')
      router.push('/admin/products')
      return
    }

    if (data) {
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        stock_quantity: data.stock_quantity?.toString() || '',
        category_id: data.category_id || '',
        is_active: data.is_active ?? true,
        images: data.images || [],
        features: data.features || []
      })
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Check if image is square or needs cropping
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      
      await new Promise((resolve) => {
        img.onload = async () => {
          URL.revokeObjectURL(objectUrl)
          
          // Create canvas to make image square
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const size = Math.min(img.width, img.height)
          canvas.width = size
          canvas.height = size
          
          const offsetX = (img.width - size) / 2
          const offsetY = (img.height - size) / 2
          
          ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)
          
          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (!blob) {
              resolve(null)
              return
            }
            
            const squareFile = new File([blob], file.name, { type: 'image/jpeg' })
            const url = await uploadProductImage(squareFile)
            
            if (url) {
              uploadedUrls.push(url)
            } else {
              toast.error(`${file.name} yüklenemedi`)
            }
            resolve(null)
          }, 'image/jpeg', 0.9)
        }
        img.src = objectUrl
      })
    }

    if (uploadedUrls.length > 0) {
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls]
      })
      toast.success(`${uploadedUrls.length} görsel yüklendi`)
    }
    
    setUploading(false)
    e.target.value = ''
  }

  async function removeImage(index: number) {
    const imageUrl = formData.images[index]
    const confirmed = confirm('Bu görseli silmek istediğinizden emin misiniz?')
    
    if (!confirmed) return

    // Try to delete from storage
    await deleteProductImage(imageUrl)
    
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
    
    toast.success('Görsel silindi')
  }

  function addFeature() {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  function removeFeature(index: number) {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      category_id: formData.category_id || null,
      is_active: formData.is_active,
      images: formData.images,
      features: formData.features
    }

    if (isNew) {
      const { error } = await supabase
        .from('products')
        .insert([productData])

      if (error) {
        alert('Ürün eklenirken hata oluştu: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)

      if (error) {
        alert('Ürün güncellenirken hata oluştu: ' + error.message)
        setSaving(false)
        return
      }
    }

    router.push('/admin/products')
  }

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="text-center py-12 text-white/50">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 px-4">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-white/70 hover:text-white"
          >
            ← Geri
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="neon-glass-island p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 mb-2">Ürün Adı *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-2">Açıklama</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white/70 mb-2">Fiyat (₺) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">Stok Miktarı *</label>
              <input
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">Kategori</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              Ürünü aktif et
            </label>
          </div>

          <div>
            <label className="block text-white/70 mb-2">Görseller (Kare Format)</label>
            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 px-4 py-8 bg-black/40 border-2 border-dashed border-white/10 rounded-lg text-white/70 hover:border-blue-500/50 hover:text-white cursor-pointer transition-all">
                <Upload className="w-5 h-5" />
                <span>{uploading ? 'Yükleniyor...' : 'Görsel Seç (Otomatik kare formata çevrilecek)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-white/40 text-xs mt-2">
                Görseller otomatik olarak kare formata çevrilecek ve yüklenecek
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-2">Özellikler</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Özellik ekleyin"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded">
                  <span className="flex-1 text-white">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
