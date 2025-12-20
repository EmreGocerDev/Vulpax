'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SiteSetting {
  id: string
  key: string
  value: any
  description: string | null
  category: string
  updated_at: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const supabase = createClient()

  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('category')

    if (!error && data) {
      setSettings(data)
      
      // Initialize form data
      const initialData: Record<string, any> = {}
      data.forEach(setting => {
        initialData[setting.key] = setting.value
      })
      setFormData(initialData)
    }
    setLoading(false)
  }

  async function handleSave(category: string) {
    setSaving(true)
    
    const categorySettings = settings.filter(s => s.category === category)
    
    for (const setting of categorySettings) {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: formData[setting.key],
          updated_at: new Date().toISOString()
        })
        .eq('id', setting.id)

      if (error) {
        alert(`Ayar güncellenirken hata (${setting.key}): ${error.message}`)
        setSaving(false)
        return
      }
    }

    alert('Ayarlar başarıyla kaydedildi')
    await fetchSettings()
    setSaving(false)
  }

  const categories = [
    { id: 'general', label: 'Genel Ayarlar', icon: '⚙️' },
    { id: 'payment', label: 'Ödeme Ayarları', icon: '💳' },
    { id: 'shipping', label: 'Kargo Ayarları', icon: '📦' },
    { id: 'email', label: 'Mail Ayarları', icon: '✉️' }
  ]

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category)
  }

  const renderSettingField = (setting: SiteSetting) => {
    const value = formData[setting.key] || ''

    switch (typeof value) {
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-white/70">Aktif</span>
          </label>
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setFormData({ ...formData, [setting.key]: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          />
        )
      
      default:
        if (String(value).length > 100) {
          return (
            <textarea
              rows={4}
              value={value}
              onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
              className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
            />
          )
        }
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="text-center py-12 text-white/50">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <h1 className="text-2xl font-bold text-white">Site Ayarları</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="neon-glass-island p-4">
          <nav className="space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === cat.id
                    ? 'bg-red-600 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 neon-glass-island p-6">
          <div className="space-y-6">
            {getSettingsByCategory(activeTab).length === 0 ? (
              <div className="text-center py-12 text-white/50">
                Bu kategoride ayar bulunamadı
              </div>
            ) : (
              <>
                {getSettingsByCategory(activeTab).map(setting => (
                  <div key={setting.id} className="space-y-2">
                    <label className="block text-white font-medium">
                      {setting.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </label>
                    {setting.description && (
                      <p className="text-white/50 text-sm">{setting.description}</p>
                    )}
                    {renderSettingField(setting)}
                  </div>
                ))}

                <div className="pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleSave(activeTab)}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                  >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="neon-glass-island p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Sistem Bilgileri</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Toplam Ayar</div>
            <div className="text-white text-2xl font-bold">{settings.length}</div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Son Güncelleme</div>
            <div className="text-white text-sm">
              {settings.length > 0 
                ? new Date(Math.max(...settings.map(s => new Date(s.updated_at).getTime()))).toLocaleString('tr-TR')
                : 'N/A'
              }
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Kategoriler</div>
            <div className="text-white text-2xl font-bold">{categories.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
