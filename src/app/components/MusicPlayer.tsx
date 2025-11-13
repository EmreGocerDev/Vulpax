'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Audio elementi oluştur
    audioRef.current = new Audio('/music/Vulpax Vibes.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Ses seviyesi %30
    
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Müzik çalma hatası:', error);
      });
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={togglePlay}
      disabled={!isLoaded}
      className="fixed bottom-6 left-6 z-50 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white p-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed group"
      title={isPlaying ? 'Müziği Durdur' : 'Müziği Çal'}
    >
      {isPlaying ? (
        <Volume2 className="w-6 h-6 animate-pulse" />
      ) : (
        <VolumeX className="w-6 h-6" />
      )}
      
      {/* Tooltip */}
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 backdrop-blur-md bg-black/80 border border-white/20 text-white text-sm px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {isPlaying ? 'Müziği Durdur' : 'Müziği Çal'}
      </span>
      
      {/* Yükleniyor göstergesi */}
      {!isLoaded && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
        </span>
      )}
    </button>
  );
}
