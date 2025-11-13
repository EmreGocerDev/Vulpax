'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Play, Music as MusicIcon } from 'lucide-react';

interface Music {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  cover_image: string | null;
  genre: string | null;
}

export default function MusicPreview() {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('music_library')
        .select('id, title, artist, file_url, cover_image, genre')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setMusicList(data || []);
    } catch (error) {
      console.error('Müzikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (musicList.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-linear-to-b from-black via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-black mb-4 logo-font">
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              MÜZİK KÜTÜPHANESİ
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Özel olarak seçilmiş müziklerimizi keşfedin
          </p>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {musicList.map((music, index) => (
            <div
              key={music.id}
              className="group backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-square bg-linear-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center overflow-hidden">
                {music.cover_image ? (
                  <img 
                    src={music.cover_image} 
                    alt={music.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <MusicIcon className="w-20 h-20 text-white/20" />
                )}
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110">
                    <Play className="w-8 h-8" fill="white" />
                  </div>
                </div>
              </div>

              {/* Music Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate mb-1 group-hover:text-purple-400 transition-colors">
                  {music.title}
                </h3>
                <p className="text-sm text-zinc-400 truncate mb-2">{music.artist}</p>
                {music.genre && (
                  <span className="inline-block px-2 py-1 text-xs backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-full">
                    {music.genre}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center animate-fade-in-up">
          <Link
            href="/muzik-kutuphanesi"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <MusicIcon className="w-5 h-5" />
            TÜM MÜZİKLERİ GÖRÜNTÜLE
          </Link>
        </div>
      </div>
    </section>
  );
}
