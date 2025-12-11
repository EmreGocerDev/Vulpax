'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Edit, Trash2, X, User, Building2, Phone, Mail, MapPin } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  balance: number;
  created_at: string;
}

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [activeTab]);

  const fetchAccounts = async () => {
    setLoading(true);
    const table = activeTab === 'customers' ? 'market_customers' : 'market_suppliers';
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setAccounts(data as unknown as Account[]);
    }
    setLoading(false);
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    acc.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Cari Hesaplar</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Yeni {activeTab === 'customers' ? 'Müşteri' : 'Tedarikçi'} Ekle</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-4 font-medium transition-colors relative ${
            activeTab === 'customers' ? 'text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Müşteriler
          {activeTab === 'customers' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-4 font-medium transition-colors relative ${
            activeTab === 'suppliers' ? 'text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Tedarikçiler
          {activeTab === 'suppliers' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
          )}
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder={`${activeTab === 'customers' ? 'Müşteri' : 'Tedarikçi'} ara...`}
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
                <th className="px-6 py-3">İsim / Ünvan</th>
                <th className="px-6 py-3">İletişim</th>
                <th className="px-6 py-3">Bakiye</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
                        {activeTab === 'customers' ? <User size={20} /> : <Building2 size={20} />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{account.name}</p>
                        {account.contact_name && (
                          <p className="text-xs text-zinc-500">{account.contact_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {account.phone && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Phone size={14} />
                          <span>{account.phone}</span>
                        </div>
                      )}
                      {account.email && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Mail size={14} />
                          <span>{account.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${account.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(account.balance).toFixed(2)} ₺
                    </span>
                    <span className="text-xs ml-1 text-zinc-500">
                      {account.balance > 0 ? '(Borçlu)' : '(Alacaklı)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddAccountModal 
          type={activeTab} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchAccounts} 
        />
      )}
    </div>
  );
}

function AddAccountModal({ type, onClose, onSuccess }: { type: 'customers' | 'suppliers', onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const table = type === 'customers' ? 'market_customers' : 'market_suppliers';
      const { error } = await supabase
        .from(table)
        .insert([{
          ...formData,
          balance: 0
        }]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Kayıt eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            Yeni {type === 'customers' ? 'Müşteri' : 'Tedarikçi'} Ekle
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">İsim / Ünvan *</label>
            <input
              required
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Yetkili Kişi</label>
            <input
              type="text"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
              value={formData.contact_name}
              onChange={e => setFormData({...formData, contact_name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Telefon</label>
              <input
                type="text"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">E-posta</label>
              <input
                type="email"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Adres</label>
            <textarea
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-600 outline-none resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
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
