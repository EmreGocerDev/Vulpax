'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

export default function MobileOrientationWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Show warning if screen width is less than 768px (mobile) 
      // AND orientation is portrait
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      
      setShowWarning(isMobile && isPortrait);
    };

    // Check initially
    checkOrientation();

    // Check on resize and orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 max-w-sm mx-auto shadow-2xl">
        <div className="flex justify-center mb-6 space-x-4">
          <div className="relative">
            <Smartphone className="w-12 h-12 text-zinc-500 animate-pulse" />
            <div className="absolute -right-2 -bottom-2">
              <svg className="w-6 h-6 text-red-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <Monitor className="w-12 h-12 text-green-500" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">
          Daha İyi Bir Deneyim İçin
        </h2>
        
        <p className="text-zinc-400 mb-6 leading-relaxed">
          Market uygulaması detaylı veri tabloları ve grafikler içerir. En iyi deneyim için lütfen:
        </p>
        
        <ul className="text-left space-y-3 text-sm text-zinc-300 mb-8 bg-black/30 p-4 rounded-lg">
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">1</span>
            Cihazınızı yan çevirin
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">2</span>
            Veya büyük ekranlı bir cihaz kullanın
          </li>
        </ul>

        <button 
          onClick={() => setShowWarning(false)}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/10"
        >
          Yine de Devam Et
        </button>
      </div>
    </div>
  );
}
