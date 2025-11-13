'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import UserMenu from '../../components/UserMenu';
import { Upload, X, Music, Trash2 } from 'lucide-react';

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  genre: string | null;
  duration: number | null;
  cover_image: string | null;
  file_path: string;
  file_url: string;
  play_count: number;
  created_at: string;
  created_by: string | null;
  is_public: boolean;
}

export default function AdminMusicUploadPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    duration: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      fetchMusicList();
    }
  }, [user, authLoading, router]);

  const fetchMusicList = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMusicList(data || []);
    } catch (error) {
      console.error('Müzikler yüklenirken hata:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDelete = async (musicId: string, filePath: string, coverImage: string | null) => {
    if (!confirm('Bu müziği silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      
      // Storage'dan müzik dosyasını sil
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('music')
          .remove([filePath]);

        if (storageError) {
          console.error('Storage silme hatası:', storageError);
        }
      }

      // Kapak resmini sil (varsa)
      if (coverImage) {
        const coverPath = coverImage.split('/music/').pop();
        if (coverPath) {
          const { error: coverError } = await supabase.storage
            .from('music')
            .remove([coverPath]);

          if (coverError) {
            console.error('Kapak resmi silme hatası:', coverError);
          }
        }
      }

      // Veritabanından kaydı sil
      const { error: dbError } = await supabase
        .from('music_library')
        .delete()
        .eq('id', musicId);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Müzik başarıyla silindi!' });
      fetchMusicList();
    } catch (error: any) {
      console.error('Silme hatası:', error);
      setMessage({ type: 'error', text: 'Müzik silinirken hata oluştu.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      
      // Müzik süresini al
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener('loadedmetadata', () => {
        setFormData(prev => ({ ...prev, duration: Math.floor(audio.duration) }));
      });
    } else {
      setMessage({ type: 'error', text: 'Lütfen geçerli bir müzik dosyası seçin.' });
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Lütfen bir müzik dosyası seçin.' });
      return;
    }

    if (!formData.title || !formData.artist) {
      setMessage({ type: 'error', text: 'Lütfen tüm zorunlu alanları doldurun.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      // Müzik dosyasını yükle
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `music/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('music')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Public URL al
      const { data: urlData } = supabase.storage
        .from('music')
        .getPublicUrl(filePath);

      // Kapak resmini yükle (varsa)
      let coverUrl = null;
      if (coverImage) {
        const coverExt = coverImage.name.split('.').pop();
        const coverFileName = `cover-${Date.now()}.${coverExt}`;
        const coverPath = `covers/${coverFileName}`;

        const { error: coverError } = await supabase.storage
          .from('music')
          .upload(coverPath, coverImage);

        if (!coverError) {
          const { data: coverData } = supabase.storage
            .from('music')
            .getPublicUrl(coverPath);
          coverUrl = coverData.publicUrl;
        }
      }

      // Veritabanına kaydet
      const { error: dbError } = await supabase
        .from('music_library')
        // @ts-ignore
        .insert({
          title: formData.title,
          artist: formData.artist,
          genre: formData.genre || null,
          file_path: filePath,
          file_url: urlData.publicUrl,
          duration: formData.duration,
          cover_image: coverUrl,
          is_public: true,
          created_by: user?.id || null
        });

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Müzik başarıyla yüklendi!' });
      
      // Formu temizle
      setFormData({ title: '', artist: '', genre: '', duration: 0 });
      setSelectedFile(null);
      setCoverImage(null);
      
      // Listeyi yenile
      fetchMusicList();
      
    } catch (error: any) {
      console.error('Yükleme hatası:', error);
      setMessage({ type: 'error', text: error.message || 'Müzik yüklenirken hata oluştu.' });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-white">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tighter">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">ADMIN PANEL</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Panel
              </Link>
              <Link
                href="/muzik-kutuphanesi"
                className="text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Müzik Kütüphanesi
              </Link>
              <UserMenu user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Müzik Yönetimi</h1>
            <p className="text-zinc-400">Müzik kütüphanesine yeni parça ekle ve mevcut müzikleri yönet</p>
          </div>

        {message && (
          <div className={`mb-6 p-4 border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h2 className="text-2xl font-bold mb-6">Yeni Müzik Ekle</h2>
              
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Müzik Dosyası */}
          <div className="mb-6">
            <label className="block text-white mb-2 font-semibold">
              Müzik Dosyası * <span className="text-sm text-zinc-400">(MP3, WAV, etc.)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="music-file"
              />
              <label
                htmlFor="music-file"
                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-white/30 hover:border-white/50 cursor-pointer transition-all"
              >
                {selectedFile ? (
                  <>
                    <Music className="w-6 h-6 text-green-400" />
                    <span className="text-white">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      className="ml-auto text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-400" />
                    <span className="text-zinc-400">Müzik dosyası seç</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Başlık */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-white mb-2 font-semibold">
              Müzik Başlığı *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 transition-all"
              placeholder="Örn: Vulpax Vibes"
              required
            />
          </div>

          {/* Sanatçı */}
          <div className="mb-6">
            <label htmlFor="artist" className="block text-white mb-2 font-semibold">
              Sanatçı *
            </label>
            <input
              type="text"
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 transition-all"
              placeholder="Örn: Vulpax Studio"
              required
            />
          </div>

          {/* Tür */}
          <div className="mb-6">
            <label htmlFor="genre" className="block text-white mb-2 font-semibold">
              Müzik Türü
            </label>
            <input
              type="text"
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-zinc-400 focus:outline-none focus:border-white/40 transition-all"
              placeholder="Örn: Electronic, Ambient, etc."
            />
          </div>

          {/* Kapak Resmi */}
          <div className="mb-8">
            <label className="block text-white mb-2 font-semibold">
              Kapak Resmi <span className="text-sm text-zinc-400">(Opsiyonel)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-white/30 hover:border-white/50 cursor-pointer transition-all"
              >
                {coverImage ? (
                  <>
                    <img 
                      src={URL.createObjectURL(coverImage)} 
                      alt="Cover preview" 
                      className="w-16 h-16 object-cover"
                    />
                    <span className="text-white">{coverImage.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCoverImage(null);
                      }}
                      className="ml-auto text-red-400 hover:text-red-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-400" />
                    <span className="text-zinc-400">Kapak resmi seç</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                Yükleniyor...
              </span>
            ) : (
              'Müziği Yükle'
            )}
          </button>
        </form>
            </div>

            {/* Music List */}
            <div className="bg-zinc-900 border border-zinc-800 p-6">
              <h2 className="text-2xl font-bold mb-6">Mevcut Müzikler ({musicList.length})</h2>
              
              {loadingList ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : musicList.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Henüz müzik eklenmemiş</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {musicList.map((music) => (
                    <div key={music.id} className="bg-zinc-800 border border-zinc-700 p-4 hover:border-zinc-600 transition-all">
                      <div className="flex items-start gap-3">
                        {music.cover_image ? (
                          <img src={music.cover_image} alt={music.title} className="w-16 h-16 object-cover" />
                        ) : (
                          <div className="w-16 h-16 bg-zinc-700 flex items-center justify-center">
                            <Music className="w-8 h-8 text-zinc-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{music.title}</h3>
                          <p className="text-sm text-zinc-400 truncate">{music.artist}</p>
                          {music.genre && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-zinc-700 border border-zinc-600 text-zinc-300">
                              {music.genre}
                            </span>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                            <span>{music.play_count} dinlenme</span>
                            {music.duration && <span>{Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(music.id, music.file_path, music.cover_image)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2"
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/muzik-kutuphanesi" 
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ← Müzik Kütüphanesine Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
