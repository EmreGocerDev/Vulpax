'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../hooks/useAuth';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import UserMenu from '../components/UserMenu';
import MusicPlayerCard from '@/app/components/MusicPlayerCard';
import Footer from '../components/Footer';

interface Music {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  duration: number | null;
  cover_image: string | null;
  genre: string | null;
  play_count: number;
  created_at: string;
}

export default function MusicLibraryPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMusicList(data || []);
    } catch (error) {
      console.error('Müzikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayCount = async (musicId: string) => {
    try {
      const supabase = createClient();
      const music = musicList.find(m => m.id === musicId);
      if (music) {
        await supabase
          .from('music_library')
          // @ts-ignore
          .update({ play_count: music.play_count + 1 })
          .eq('id', musicId);
      }
    } catch (error) {
      console.error('Play count güncellenirken hata:', error);
    }
  };

  const handlePlay = (musicId: string) => {
    setCurrentPlaying(musicId);
    updatePlayCount(musicId);
  };

  const handlePause = () => {
    setCurrentPlaying(null);
  };

  // Filtreleme
  const genres = ['all', ...Array.from(new Set(musicList.map(m => m.genre).filter((g): g is string => g !== null)))];
  
  const filteredMusic = musicList.filter(music => {
    const matchesSearch = music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         music.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || music.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header - Same as homepage */}
      <header className="border-b border-white/10 fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/30 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/logo2.png"
                alt="Vulpax Digital"
                width={56}
                height={56}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-sm text-zinc-400">DIGITAL</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-zinc-300 hover:text-white transition-colors text-base">Ana Sayfa</a>
              <a href="/demolar" className="text-zinc-300 hover:text-white transition-colors text-base">Demolar</a>
              <a href="/referanslar" className="text-zinc-300 hover:text-white transition-colors text-base">Referanslar</a>
              <a href="/muzik-kutuphanesi" className="text-white transition-colors text-base">Müzik</a>
              <a href="/#pricing" className="text-zinc-300 hover:text-white transition-colors text-base">Fiyatlar</a>
              <a href="/#contact" className="text-zinc-300 hover:text-white transition-colors text-base">İletişim</a>
              <a href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors text-base">Ücretsiz Uygulamalar</a>
              {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
                <a href="/admin" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Editör
                </a>
              )}
              {!authLoading && (
                user ? (
                  <UserMenu user={user} onSignOut={handleSignOut} />
                ) : (
                  <div className="button-borders">
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="primary-button"
                    >
                      GİRİŞ YAP
                    </button>
                  </div>
                )
              )}
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
                aria-label="Menu"
              >
                <div className="space-y-1">
                  <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-40">
            <div className="flex flex-col p-6 space-y-4">
              <a href="/" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Ana Sayfa
              </a>
              <a href="/demolar" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Demolar
              </a>
              <a href="/referanslar" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Referanslar
              </a>
              <a href="/muzik-kutuphanesi" className="text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Müzik
              </a>
              <a href="/#pricing" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Fiyatlar
              </a>
              <a href="/#contact" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                İletişim
              </a>
              <a href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Uygulamalar
              </a>
              
              {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
                <a href="/admin" className="text-zinc-300 hover:text-white transition-colors py-2 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Editör Modu
                </a>
              )}
              
              {user ? (
                <div className="border-t border-zinc-800 pt-4 space-y-4">
                  <div className="flex items-center gap-3 px-3 py-2 bg-zinc-800 border border-zinc-700">
                    {user.user_metadata.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.full_name || user.email}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {(user.user_metadata.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {user.user_metadata.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 border border-zinc-600 transition-all duration-300 hover:border-zinc-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors font-semibold"
                >
                  GİRİŞ YAP
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />
      
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <div className="pt-32 pb-20 bg-linear-to-b from-black via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black mb-4 logo-font">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Müzik Kütüphanesi
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Müziklerimizi dinleyin ve keyfini çıkarın
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Müzik veya sanatçı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 transition-all"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-6 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition-all"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-black">
                  {genre === 'all' ? 'Tüm Türler' : genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Music Grid */}
        {filteredMusic.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-zinc-400">
              {searchQuery || selectedGenre !== 'all' 
                ? 'Aradığınız kriterlere uygun müzik bulunamadı.' 
                : 'Henüz müzik eklenmemiş.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMusic.map((music) => (
              <MusicPlayerCard
                key={music.id}
                music={music}
                isPlaying={currentPlaying === music.id}
                onPlay={() => handlePlay(music.id)}
                onPause={handlePause}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center text-zinc-400">
          <p className="text-lg">
            Toplam <span className="text-white font-bold">{musicList.length}</span> müzik
            {filteredMusic.length !== musicList.length && (
              <> • <span className="text-white font-bold">{filteredMusic.length}</span> gösteriliyor</>
            )}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
