'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Türkiye',
    is_default: false
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    fetchAddresses()
  }

  async function fetchAddresses() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAddresses(data)
    }
    setLoading(false)
  }

  function startEdit(address: Address) {
    setEditingId(address.id)
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default
    })
    setShowForm(true)
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Türkiye',
      is_default: false
    })
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const addressData = {
      user_id: user.id,
      full_name: formData.full_name,
      phone: formData.phone,
      address_line1: formData.address_line1,
      address_line2: formData.address_line2 || null,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country,
      is_default: formData.is_default
    }

    // If setting as default, unset others
    if (formData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    if (editingId) {
      const { error } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', editingId)

      if (error) {
        alert('Adres güncellenirken hata: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('addresses')
        .insert([addressData])

      if (error) {
        alert('Adres eklenirken hata: ' + error.message)
        setSaving(false)
        return
      }
    }

    resetForm()
    fetchAddresses()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Adres silinirken hata: ' + error.message)
    } else {
      fetchAddresses()
    }
  }

  async function setAsDefault(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Unset all defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Set new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)

    if (!error) {
      fetchAddresses()
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/account" className="text-white/70 hover:text-white">
            ← Hesabıma Dön
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Adreslerim</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              + Yeni Adres Ekle
            </button>
          )}
        </div>

        {showForm && (
          <div className="neon-glass-island p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Adres *</label>
                <input
                  type="text"
                  required
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Adres 2 (Apartman, Daire No, vb.)</label>
                <input
                  type="text"
                  value={formData.address_line2}
                  onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">İl *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">İlçe *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Posta Kodu *</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Ülke *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Varsayılan adres olarak ayarla
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                >
                  {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        ) : addresses.length === 0 ? (
          <div className="neon-glass-island p-12 text-center">
            <p className="text-white/50">Henüz kayıtlı adresiniz bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="neon-glass-island p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-white font-semibold mb-1">{address.full_name}</div>
                    {address.is_default && (
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Varsayılan Adres
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(address)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                
                <div className="text-white/70 space-y-1 text-sm">
                  <p>{address.phone}</p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.state} / {address.city}</p>
                  <p>{address.postal_code}, {address.country}</p>
                </div>

                {!address.is_default && (
                  <button
                    onClick={() => setAsDefault(address.id)}
                    className="mt-4 text-sm text-red-400 hover:text-red-300"
                  >
                    Varsayılan Adres Yap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
