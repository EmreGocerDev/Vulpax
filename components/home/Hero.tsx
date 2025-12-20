'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import GridBackground from '@/components/effects/GridBackground';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  const technologies = [
    'angular.svg', 'authjs.svg', 'bootstrap.svg', 'c-plusplus.svg', 
    'dotnet.svg', 'electron.svg', 'firebase-studio.svg', 'illustrator.svg',
    'javascript.svg', 'netlify.svg', 'nextjs_icon_dark.svg', 'nodejs.svg',
    'postgresql.svg', 'python.svg', 'sql-server.svg', 'supabase.svg',
    'tailwindcss.svg', 'typescript.svg', 'vercel_dark.svg'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-48 pb-12">
      {/* Animated Grid Background */}
      {mounted && <GridBackground />}

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full glass-card px-3 py-1.5 text-xs text-white/90">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-white">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            Güvenilir Çözüm Ortağınız
          </div>

          {/* Main Heading */}
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Dijital Dünyada{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, hsl(var(--hue1) 70% 70%), hsl(var(--hue2) 70% 70%))'
              }}
            >
              İzinizi
            </span>{' '}
            Bırakın
          </h1>

          {/* Description */}
          <p className="mb-8 text-base leading-7 text-white/70 sm:text-lg max-w-2xl mx-auto">
            Vulpax Software ile işletmenizi bir sonraki seviyeye taşıyın. Modern, hızlı ve güvenilir yazılım çözümleri.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/contact"
              className="neon-button group relative overflow-hidden inline-flex items-center justify-center px-6 py-3 text-base font-semibold"
            >
              <span className="relative z-10 flex items-center">
                Mesaj Gönder
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </Link>
            <Link
              href="/products"
              className="group relative overflow-hidden rounded-full inline-flex items-center justify-center font-medium transition-all glass-card glass-card-hover text-white px-6 py-3 text-base font-semibold"
            >
              <span className="relative z-10 flex items-center">Uygulamalarımız</span>
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
            <div className="text-center neon-glass-island p-4">
              <div 
                className="text-2xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(var(--hue1) 70% 70%), white)'
                }}
              >
                50+
              </div>
              <div className="text-white/50 text-xs">Proje</div>
            </div>
            <div className="text-center neon-glass-island p-4">
              <div 
                className="text-2xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, white, hsl(var(--hue2) 70% 70%))'
                }}
              >
                100%
              </div>
              <div className="text-white/50 text-xs">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center neon-glass-island p-4">
              <div 
                className="text-2xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(var(--hue2) 70% 70%), hsl(var(--hue1) 70% 70%))'
                }}
              >
                7/24
              </div>
              <div className="text-white/50 text-xs">Destek</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="container mx-auto px-4 relative z-10 mt-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            Teknolojiler
          </h2>
          <p className="text-white/40 text-center mb-8 text-sm font-light">
            Modern ve güvenilir teknolojilerle projelerinizi hayata geçiriyoruz
          </p>

          {/* Infinite Scroll Animation */}
          <div 
            className="relative overflow-hidden py-3"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
            }}
          >
            <div className="flex animate-scroll">
              {/* First set */}
              {technologies.map((tech, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-4 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                  <img
                    src={`/sliderbot/${tech}`}
                    alt={tech.replace('.svg', '')}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {technologies.map((tech, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-4 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                  <img
                    src={`/sliderbot/${tech}`}
                    alt={tech.replace('.svg', '')}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
