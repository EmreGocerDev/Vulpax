'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import { createClient } from '@/lib/supabase';

interface SavedCard {
  id: string;
  card_alias: string;
  card_last4: string;
  card_type: string;
  is_default: boolean;
  created_at: string;
  // optional fields if backend stores them (not present by default)
  card_number?: string | null;
  expiry_date?: string | null;
  cvv?: string | null;
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'cards'>('profile');
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  
  // Yeni kart form state'leri
  const [newCard, setNewCard] = useState({
    alias: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Kullanıcı bilgileri
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.user_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'Kullanıcı';

  const avatarUrl = user?.user_metadata?.avatar_url || 
                    user?.user_metadata?.picture || 
                    null;

  const provider = user?.app_metadata?.provider;
  const isGithubUser = provider === 'github';
  const isGoogleUser = provider === 'google';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && activeTab === 'cards') {
      fetchSavedCards();
    }
  }, [user, activeTab]);

  const fetchSavedCards = async () => {
    if (!user) return;
    
    setLoadingCards(true);
    try {
      const supabase: any = createClient();
      const { data, error } = await supabase
        .from('saved_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedCards(data || []);
    } catch (error) {
      console.error('Kartlar yüklenirken hata:', error);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newCard.alias || !newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.cardName) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    // Kart numarasının son 4 hanesini al
    const last4 = newCard.cardNumber.replace(/\s/g, '').slice(-4);
    
    // Kart tipini otomatik tespit et (ilk haneye göre)
    const firstDigit = newCard.cardNumber.replace(/\s/g, '')[0];
    let cardType = 'mastercard';
    if (firstDigit === '4') {
      cardType = 'visa';
    } else if (firstDigit === '3') {
      cardType = 'amex';
    }

    try {
      const supabase: any = createClient();
      
      const { error } = await supabase
        .from('saved_cards')
        .insert({
          user_id: user.id,
          card_alias: newCard.alias,
          card_last4: last4,
          card_type: cardType,
          is_default: savedCards.length === 0 // İlk kart varsayılan olsun
        });

      if (error) throw error;

      // Formu temizle
      setNewCard({ alias: '', cardNumber: '', expiryDate: '', cvv: '', cardName: '' });
      setShowAddCard(false);
      
      // Kartları yeniden yükle
      fetchSavedCards();
      
      alert('Kart başarıyla eklendi!');
    } catch (error) {
      console.error('Kart eklenirken hata:', error);
      alert('Kart eklenirken bir hata oluştu');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Bu kartı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase: any = createClient();
      const { error } = await supabase
        .from('saved_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      
      // Kartları yeniden yükle
      fetchSavedCards();
      
      alert('Kart başarıyla silindi');
    } catch (error) {
      console.error('Kart silinirken hata:', error);
      alert('Kart silinirken bir hata oluştu');
    }
  };

  const handleSetDefaultCard = async (cardId: string) => {
    try {
      const supabase: any = createClient();
      
      // Önce tüm kartların varsayılan değerini false yap
      await supabase
        .from('saved_cards')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Seçilen kartı varsayılan yap
      const { error } = await supabase
        .from('saved_cards')
        .update({ is_default: true })
        .eq('id', cardId);

      if (error) throw error;
      
      // Kartları yeniden yükle
      fetchSavedCards();
      
      alert('Varsayılan kart güncellendi');
    } catch (error) {
      console.error('Varsayılan kart güncellenirken hata:', error);
      alert('İşlem sırasında bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-black border border-zinc-800 rounded-sm overflow-visible">
          {/* SVG filters for decorative card surrounds (inserted once) */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
            <filter id="unopaq" y="-100%" height="300%" x="-100%" width="300%">
              <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 5 0" />
            </filter>
            <filter id="unopaq2" y="-100%" height="300%" x="-100%" width="300%">
              <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 0" />
            </filter>
            <filter id="unopaq3" y="-100%" height="300%" x="-100%" width="300%">
              <feColorMatrix values="1 0 0 1 0 0 1 0 1 0 0 0 1 1 0 0 0 0 2 0" />
            </filter>
          </svg>
          {/* Header */}
          <div className="bg-zinc-900 p-6 border-b border-zinc-800 rounded-sm">
            <h1 className="text-2xl font-bold text-white">Profilim</h1>
            <p className="text-zinc-500 mt-1">Hesap bilgilerinizi ve kayıtlı kartlarınızı yönetin</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-6 py-4 text-center transition-colors ${
                activeTab === 'profile'
                  ? 'bg-zinc-800 text-white border-b-2 border-red-500'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil Bilgileri
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex-1 px-6 py-4 text-center transition-colors ${
                activeTab === 'cards'
                  ? 'bg-zinc-800 text-white border-b-2 border-red-500'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Kayıtlı Kartlarım
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Profil Bilgileri Sekmesi */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar ve Temel Bilgiler */}
                <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={userName}
                      width={100}
                      height={100}
                      className="rounded-full border-2 border-zinc-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{userName}</h2>
                    <p className="text-zinc-500 mt-1">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      {isGithubUser && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-400 text-sm rounded-full border border-zinc-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </span>
                      )}
                      {isGoogleUser && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-400 text-sm rounded-full border border-zinc-700">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Google
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detaylı Bilgiler */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black border border-zinc-800 rounded-sm p-4">
                    <label className="text-zinc-500 text-sm">E-posta Adresi</label>
                    <p className="text-white mt-1 font-medium">{user.email}</p>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-sm p-4">
                    <label className="text-zinc-500 text-sm">Kullanıcı ID</label>
                    <p className="text-white mt-1 font-mono text-sm">{user.id}</p>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-sm p-4">
                    <label className="text-zinc-500 text-sm">Hesap Oluşturma</label>
                    <p className="text-white mt-1">
                      {new Date(user.created_at || '').toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-black border border-zinc-800 rounded-sm p-4">
                    <label className="text-zinc-500 text-sm">Son Giriş</label>
                    <p className="text-white mt-1">
                      {new Date(user.last_sign_in_at || '').toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Kayıtlı Kartlarım Sekmesi */}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                {/* Kartları Listele */}
                {loadingCards ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    <p className="mt-2 text-zinc-400">Kartlar yükleniyor...</p>
                  </div>
                ) : savedCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {savedCards.map((card) => {
                      const flipped = flippedCard === card.id;
                      return (
                      <div key={card.id} className="relative">
                        <div className="card-container">
                          <div className="spin spin-blur"></div>
                          <div className="spin spin-intense"></div>
                          <div className="backdrop"></div>
                          <div className="card-border"><div className="spin spin-inside"></div></div>
                          <div className="card">
                            <div
                              className="flip-card cursor-pointer"
                              data-default={card.is_default}
                              onClick={() => setFlippedCard(flipped ? null : card.id)}
                              role="button"
                              aria-pressed={flipped}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlippedCard(flipped ? null : card.id); }}
                            >
                              <div
                                className="flip-card-inner"
                                style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                              >
                                {/* Ön Yüz - sadece kart ismi ve temel özet (görseller kaldırıldı) */}
                                <div className="flip-card-front rounded-sm p-5 flex flex-col justify-center h-full w-full transition-all">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-400">{card.card_type.toUpperCase()}</span>
                                    <span className="text-xs text-zinc-400">{new Date(card.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <h3 className="mt-6 text-white text-lg font-bold">{card.card_alias}</h3>
                                    <p className="mt-3 text-white/80 font-mono">
                                      {card.card_number ? card.card_number : `•••• •••• •••• ${card.card_last4}`}
                                    </p>
                                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                                    <span>VALID THRU</span>
                                    <span>{card.expiry_date ?? '••/••'}</span>
                                  </div>
                                </div>

                                {/* Arka Yüz - detaylar */}
                                <div className="flip-card-back rounded-sm p-5 flex flex-col justify-between h-full w-full transition-all">
                                  {/* Arka Yüz - sade ve düz metin */}
                                  <div className="mb-4">
                                    <p className="text-zinc-400 text-sm">Kart Bilgileri</p>
                                  </div>
                                  <div className="space-y-2 text-left">
                                    <div>
                                      <p className="text-zinc-400 text-xs">Kart Numarası</p>
                                      <p className="text-white font-mono">{card.card_number ?? `•••• •••• •••• ${card.card_last4}`}</p>
                                    </div>
                                    <div>
                                      <p className="text-zinc-400 text-xs">İsim</p>
                                      <p className="text-white">{card.card_alias}</p>
                                    </div>
                                    <div className="flex gap-6">
                                      <div>
                                        <p className="text-zinc-400 text-xs">Son Kullanma</p>
                                        <p className="text-white">{card.expiry_date ?? '••/••'}</p>
                                      </div>
                                      <div>
                                        <p className="text-zinc-400 text-xs">CVV</p>
                                        <p className="text-white">{card.cvv ?? '•••'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => { if (!card.is_default) handleSetDefaultCard(card.id); }}
                            className={`primary-button flex-1 text-center transition-colors ${card.is_default ? 'bg-red-600 border-red-600 hover:bg-red-700 text-white' : ''}`}
                            aria-pressed={card.is_default}
                          >
                            {card.is_default ? 'Varsayılan Kart' : 'Varsayılan Yap'}
                          </button>

                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="primary-button flex-1 text-center"
                          >Sil</button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-sm">
                    <svg className="mx-auto w-16 h-16 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="mt-4 text-zinc-500">Henüz kayıtlı kartınız yok</p>
                    <button
                      onClick={() => setShowAddCard(true)}
                      className="primary-button w-full mt-4"
                    >
                      İlk Kartınızı Ekleyin
                    </button>
                  </div>
                )}

                {/* Yeni Kart Ekleme Formu */}
                {showAddCard && (
                  <div className="max-w-xs mx-auto">
                    <div className="flex flex-col justify-around bg-zinc-900 p-4 border border-zinc-800 rounded-sm shadow-md">
                      <form onSubmit={handleAddCard}>
                        <div className="flex flex-row items-center justify-between mb-3">
                          <input
                            className="w-full h-10 border-none outline-none text-sm bg-zinc-900 text-white font-semibold caret-red-500 pl-2 mb-3 grow rounded-sm"
                            type="text"
                            value={newCard.cardName}
                            onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                            placeholder="Full Name"
                            required
                          />
                          <div className="flex items-center justify-center relative w-14 h-9 bg-zinc-900 border border-zinc-800 rounded-sm">
                            <svg
                              className="text-white fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              width="30"
                              height="30"
                              viewBox="0 0 48 48"
                            >
                              <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
                              <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
                              <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <input
                            className="w-full h-10 border-none outline-none text-sm bg-zinc-900 text-white font-semibold caret-red-500 pl-2 rounded-sm"
                            type="text"
                            value={newCard.cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '');
                              const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                              setNewCard({ ...newCard, cardNumber: formatted.slice(0, 19) });
                            }}
                            placeholder="0000 0000 0000 0000"
                            required
                          />
                          <div className="flex flex-row justify-between gap-3">
                            <input
                              className="w-full h-10 border-none outline-none text-sm bg-zinc-900 text-white font-semibold caret-red-500 pl-2 rounded-sm"
                              type="text"
                              value={newCard.expiryDate}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                                setNewCard({ ...newCard, expiryDate: formatted });
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                            <input
                              className="w-full h-10 border-none outline-none text-sm bg-zinc-900 text-white font-semibold caret-red-500 pl-2 rounded-sm"
                              type="text"
                              value={newCard.cvv}
                              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                              placeholder="CVV"
                              maxLength={3}
                              required
                            />
                          </div>
                          <input
                            className="w-full h-10 border-none outline-none text-sm bg-zinc-900 text-white font-semibold caret-red-500 pl-2"
                            type="text"
                            value={newCard.alias}
                            onChange={(e) => setNewCard({ ...newCard, alias: e.target.value })}
                            placeholder="Kart İsmi (Örn: İş Kartım)"
                            required
                          />
                          <div className="flex gap-3 mt-4">
                            <button
                              type="submit"
                              className="primary-button flex-1"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddCard(false);
                                setNewCard({ alias: '', cardNumber: '', expiryDate: '', cvv: '', cardName: '' });
                              }}
                              className="primary-button flex-1"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Yeni Kart Ekle Butonu */}
                {!showAddCard && savedCards.length > 0 && (
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="primary-button w-full py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Kart Ekle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 100%;
          color: #111827;
          perspective: 1200px;
        }
        /* Decorative card container styles (user-provided, adjusted sizes) */
        .card-container {
          position: relative;
          width: 340px;
          height: 220px;
          border-radius: 12px;
          margin: 0 auto;
        }

        .card-border {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.04);
          border-radius: inherit;
        }

        .card {
          position: absolute;
          inset: 0.125em;
          border-radius: 10px;
          background: transparent;
          display: flex;
          flex-direction: column;
          color: #fff;
          overflow: visible;
        }

        .spin { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
        .spin-blur { filter: blur(3em) url(#unopaq); }
        .spin-intense { inset: -0.125em; filter: blur(0.5em) url(#unopaq2); border-radius: 0.75em; }
        .spin-inside { inset: -2px; border-radius: inherit; filter: blur(2px) url(#unopaq3); z-index: 0; }
        .spin::before { content: ""; position: absolute; inset: -30%; animation: speen 8s cubic-bezier(0.56, 0.15, 0.28, 0.86) infinite; }
        .spin-blur::before { background: linear-gradient(-45deg, #f50, #0000 46% 54%, #05f); }
        .spin-intense::before { background: linear-gradient(-45deg, #f95, #0000 35% 65%, #59f); }
        .spin-inside::before { background: linear-gradient(-45deg, #fc9, #0000 35% 65%, #9cf); }

        .backdrop { position: absolute; inset: -100%; background: radial-gradient(circle at 50% 50%, #0000 0, #0000 20%, #111111aa 50%); background-size: 3px 3px; z-index: -1; }

        @keyframes speen { 0% { rotate: 10deg; } 50% { rotate: 190deg; } to { rotate: 370deg; } }

        .heading_8264 {
          position: absolute;
          letter-spacing: .2em;
          font-size: 0.5em;
          top: 2em;
          left: 18.6em;
        }

        .logo {
          position: absolute;
          top: 6.8em;
          left: 11.7em;
        }

        .chip {
          position: absolute;
          top: 2.3em;
          left: 1.5em;
        }

        .contactless {
          position: absolute;
          top: 3.5em;
          left: 12.4em;
        }

        .number {
          position: absolute;
          font-weight: bold;
          font-size: .6em;
          top: 8.3em;
          left: 1.6em;
        }

        .valid_thru {
          position: absolute;
          font-weight: bold;
          top: 635.8em;
          font-size: .01em;
          left: 140.3em;
        }

        .date_8264 {
          position: absolute;
          font-weight: bold;
          font-size: 0.5em;
          top: 13.6em;
          left: 3.2em;
        }

        .name {
          position: absolute;
          font-weight: bold;
          font-size: 0.5em;
          top: 16.1em;
          left: 2em;
        }


        .strip {
          position: relative;
          width: 100%;
          height: 34px;
          background: repeating-linear-gradient(
            90deg,
            #303030,
            #303030 10px,
            #202020 10px,
            #202020 20px
          );
          border-radius: 4px;
        }

        .mstrip {
          position: relative;
          background-color: #fff;
          width: 60%;
          height: 14px;
          margin: 10px 0;
          border-radius: 3px;
        }

        .sstrip {
          position: relative;
          background-color: #fff;
          width: 30%;
          height: 14px;
          border-radius: 3px;
        }

        .code {
          font-weight: bold;
          text-align: center;
          margin: .2em;
          color: black;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .flip-card-front, .flip-card-back {
          box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.4rem;
        }

        .flip-card-front {
          box-shadow: 0 8px 28px rgba(2,6,23,0.7);
          background-image:
            linear-gradient(160deg, #0b0b0d 0%, #131417 30%, #222326 60%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, rgba(0,0,0,0.02) 1px 2px);
          background-blend-mode: overlay, overlay;
          border: 1px solid rgba(255,255,255,0.04);
          color: #e6e7e9;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        .flip-card-front::before {
          /* thin angled sheen */
          content: "";
          position: absolute;
          left: -40%;
          top: -40%;
          width: 140%;
          height: 80%;
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 60%);
          transform: rotate(-18deg) skewX(-6deg);
          mix-blend-mode: screen;
          opacity: 0.65;
          pointer-events: none;
        }

        .flip-card-front::after {
          /* subtle micro-sheen noise */
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(0deg, rgba(255,255,255,0.01) 0%, rgba(0,0,0,0.01) 100%);
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        .flip-card-back {
          box-shadow: 0 8px 28px rgba(2,6,23,0.7);
          background-image:
            linear-gradient(160deg, #0b0b0d 0%, #121316 35%, #1f1f21 65%),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0 1px, rgba(0,0,0,0.01) 1px 2px);
          background-blend-mode: overlay, overlay;
          border: 1px solid rgba(255,255,255,0.03);
          transform: rotateY(180deg);
          display: flex;
          color: #e6e7e9;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .flip-card-back::before {
          content: "";
          position: absolute;
          right: -30%;
          bottom: -30%;
          width: 120%;
          height: 60%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.06), rgba(255,255,255,0) 40%);
          transform: rotate(8deg);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        /* Accent border glow for selected/default state (visual only) */
        .flip-card[data-default="true"] .flip-card-front,
        .flip-card[data-default="true"] .flip-card-back {
          box-shadow: 0 12px 34px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.6) inset;
          border: 1px solid rgba(99,102,241,0.16);
        }
      `}</style>
    </div>
  );
}
