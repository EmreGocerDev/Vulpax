'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Store, Receipt, Percent, MapPin, Phone } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: '',
    store_name: '',
    address: '',
    phone: '',
    currency: 'TRY',
    tax_rate: 18,
    receipt_header: '',
    receipt_footer: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('market_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { error } = await supabase
        .from('market_settings')
        .upsert({
          user_id: user.id,
          id: settings.id || undefined,
          store_name: settings.store_name,
          address: settings.address,
          phone: settings.phone,
          currency: settings.currency,
          tax_rate: settings.tax_rate,
          receipt_header: settings.receipt_header,
          receipt_footer: settings.receipt_footer,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Ayarlar kaydedildi.');
      fetchSettings(); // Refresh to get ID if it was a new insert
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Kaydetme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Market Ayarları</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-2 text-lg font-medium text-white border-b border-white/10 pb-2">
            <Store size={20} className="text-red-500" />
            <h2>Genel Bilgiler</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Mağaza Adı</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={settings.store_name}
                onChange={e => setSettings({...settings, store_name: e.target.value})}
                placeholder="Örn: Vulpax Market"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <MapPin size={14} />
                Adres
              </label>
              <textarea
                rows={2}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none resize-none"
                value={settings.address || ''}
                onChange={e => setSettings({...settings, address: e.target.value})}
                placeholder="Örn: Atatürk Cad. No:123 İstanbul"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <Phone size={14} />
                Telefon
              </label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={settings.phone || ''}
                onChange={e => setSettings({...settings, phone: e.target.value})}
                placeholder="Örn: (0212) 555 00 00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Para Birimi</label>
              <select
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={settings.currency}
                onChange={e => setSettings({...settings, currency: e.target.value})}
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">Amerikan Doları ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Varsayılan KDV (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="number"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-600 outline-none"
                  value={settings.tax_rate}
                  onChange={e => setSettings({...settings, tax_rate: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-2 text-lg font-medium text-white border-b border-white/10 pb-2">
            <Receipt size={20} className="text-red-500" />
            <h2>Fiş / Fatura Ayarları</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Fiş Başlığı (Header)</label>
            <textarea
              rows={2}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none resize-none"
              value={settings.receipt_header || ''}
              onChange={e => setSettings({...settings, receipt_header: e.target.value})}
              placeholder="Örn: Hoşgeldiniz"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Fiş Alt Bilgisi (Footer)</label>
            <textarea
              rows={2}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none resize-none"
              value={settings.receipt_footer || ''}
              onChange={e => setSettings({...settings, receipt_footer: e.target.value})}
              placeholder="Örn: Bizi tercih ettiğiniz için teşekkürler"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
