'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import UserMenu from '../components/UserMenu';
import MobileMenu from '../components/MobileMenu';
import Footer from '../components/Footer';

interface Demo {
  id: string;
  title: string;
  description: string;
  demo_url: string;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function DemolarPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDemos(data);
    } catch (error) {
      console.error('Error fetching demos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">DIGITAL</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/demolar" className="text-zinc-300 hover:text-white transition-colors">Demolar</a>
              <a href="/referanslar" className="text-zinc-300 hover:text-white transition-colors">Referanslar</a>
              <a href="/#contact" className="text-zinc-300 hover:text-white transition-colors">İletişim</a>
              <a href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors">Ücretsiz Uygulamalar</a>
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
                  <UserMenu user={user} onSignOut={signOut} />
                ) : (
                  <div className="button-borders">
                    <button className="primary-button">
                      GİRİŞ YAP
                    </button>
                  </div>
                )
              )}
            </nav>
            <MobileMenu onLoginClick={() => {}} user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4">TÜM DEMOLARIMIZ</h1>
          <p className="text-zinc-400 text-lg">
            Örnek çalışmalarımız ve demo projelerimiz
          </p>
        </div>

        {demos.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-zinc-500 text-lg">Henüz demo eklenmemiş</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 overflow-hidden group hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2"
              >
                {/* Preview Image */}
                {demo.preview_image_url && (
                  <div className="relative aspect-video">
                    <Image
                      src={demo.preview_image_url}
                      alt={demo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 font-bold">
                      DEMO
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {demo.title}
                  </h3>

                  <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                    {demo.description}
                  </p>

                  <a
                    href={demo.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-red-600 hover:bg-red-700 text-white py-2 text-center text-sm font-semibold transition-colors"
                  >
                    Demoyu İncele →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
