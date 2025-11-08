'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface Application {
  id: string;
  name: string;
  title?: string;
  description: string;
  category: string;
  category_id?: string;
  image_url: string | null;
  image_path: string | null;
  demo_url: string | null;
  is_active: boolean;
}

export default function DemoApps() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (app: Application) => {
    if (app.image_path) {
      const { data } = supabase.storage
        .from('demo-apps')
        .getPublicUrl(app.image_path);
      return data.publicUrl;
    }
    return app.image_url || '/logo2.png';
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-zinc-500 text-sm">Yükleniyor...</div>
        </div>
      </section>
    );
  }

  if (apps.length === 0) {
    return (
      <section className="py-16 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">DEMO SAYFALARIMIZ</h2>
            <p className="text-zinc-400 text-lg">Demo uygulamalarımız sizin projelerinizle entegre edilebilir</p>
          </div>
          
          <div className="text-center">
            <p className="text-zinc-500 mb-6">Henüz demo uygulama eklenmemiş.</p>
            <Link 
              href="/admin"
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              EDİTÖRE GİT - DEMO EKLE
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">DEMO SAYFALARIMIZ</h2>
          <p className="text-zinc-400 text-lg">Demo uygulamalarımız sizin projelerinizle entegre edilebilir</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children mb-8">
          {apps.map((app) => (
            <Link 
              key={app.id} 
              href={`/uygulamalar/${app.id}`}
              className="group bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10"
            >
              {/* Image */}
              <div className="relative aspect-video bg-zinc-800">
                <Image
                  src={getImageUrl(app)}
                  alt={app.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {app.category && (
                  <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-3 py-1 font-semibold">
                    {app.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                  {app.name || app.title || 'Başlıksız'}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                  {app.description}
                </p>

                <div className="flex gap-2">
                  <span className="flex-1 text-center bg-zinc-800 text-white py-2 text-xs font-medium group-hover:bg-white group-hover:text-black transition-colors">
                    DETAYLARI GÖR
                  </span>
                  {app.demo_url && (
                    <span className="flex-1 text-center border border-zinc-600 text-white py-2 text-xs font-medium group-hover:border-white transition-colors">
                      DEMO
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Editor Link */}
        <div className="text-center">
          <Link 
            href="/admin"
            className="bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            YÖNETİCİ PANELİ - DEMO EKLE
          </Link>
        </div>
      </div>
    </section>
  );
}
