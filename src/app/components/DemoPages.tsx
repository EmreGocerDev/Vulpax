'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface Demo {
  id: string;
  title: string;
  description: string;
  demo_url: string;
  preview_image_url: string | null;
  preview_image_path: string | null;
  is_active: boolean;
}

export default function DemoApps() {
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
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setDemos(data || []);
    } catch (error) {
      console.error('Error fetching demos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (demo: Demo) => {
    if (demo.preview_image_path) {
      const { data } = supabase.storage
        .from('demo-previews')
        .getPublicUrl(demo.preview_image_path);
      return data.publicUrl;
    }
    return demo.preview_image_url || '/logo2.png';
  };

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (demos.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">DEMO SAYFALARIMIZ</h2>
            <p className="text-zinc-400 text-lg">Demo sayfalarımız sizin projelerinizle entegre edilebilir</p>
          </div>
          
          <div className="text-center">
            <p className="text-zinc-500 mb-6">Henüz demo eklenmemiş.</p>
            <Link 
              href="/demolar"
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              TÜM DEMOLARI GÖRÜNTÜLE
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">DEMO SAYFALARIMIZ</h2>
          <p className="text-zinc-400 text-lg">Demo sayfalarımız sizin projelerinizle entegre edilebilir</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children mb-8">
          {demos.map((demo) => (
            <a
              key={demo.id}
              href={demo.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden transition-all duration-300"
            >
              {/* Outer glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-xl blur-[40px] opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Glass card */}
              <div className="relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border border-[#BAFFFF]/20 group-hover:border-[#BAFFFF]/50 rounded-lg overflow-hidden transition-all duration-300">
                {/* Preview Image */}
                <div className="relative aspect-video bg-zinc-900/50">
                  <Image
                    src={getImageUrl(demo)}
                    alt={demo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#0a0f1a]/90 backdrop-blur-sm border border-[#BAFFFF]/30 text-white text-xs px-3 py-1 font-semibold rounded">
                    DEMO
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#BAFFFF] transition-colors">
                    {demo.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {demo.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="group-hover:text-[#BAFFFF] transition-colors">DEMO'YU AÇ</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All Demos Link */}
        <div className="text-center">
          <Link 
            href="/demolar"
            className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            TÜM DEMOLARI GÖRÜNTÜLE
          </Link>
        </div>
      </div>
    </section>
  );
}
