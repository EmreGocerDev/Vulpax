'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  id: string
  user_id: string
  full_name: string
  phone: string | null
  updated_at: string
}

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setEmail(user.email || '')

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setProfile(data)
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || ''
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone || null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) {
      alert('Profil güncellenirken hata: ' + error.message)
    } else {
      alert('Profil başarıyla güncellendi')
      fetchProfile()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link href="/account" className="text-white/70 hover:text-white">
            ← Hesabıma Dön
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Profil Bilgilerim</h1>

        <div className="neon-glass-island p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">E-posta</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
              />
              <p className="text-white/40 text-xs mt-1">E-posta adresi değiştirilemez</p>
            </div>

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
              <label className="block text-white/70 text-sm mb-2">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(5xx) xxx xx xx"
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>

        <div className="neon-glass-island p-6 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hesap Bilgileri</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Hesap Oluşturma</span>
              <span className="text-white">
                {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('tr-TR') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Kullanıcı ID</span>
              <span className="text-white/50 font-mono text-xs">{profile?.user_id || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="neon-glass-island p-6 mt-6 border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Tehlikeli Bölge</h2>
          <p className="text-white/70 text-sm mb-4">
            Hesabınızı silmek istiyorsanız, lütfen destek ekibi ile iletişime geçin.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
          >
            Destek ile İletişime Geç
          </Link>
        </div>
      </div>
    </div>
  )
}
