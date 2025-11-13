'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import UserMenu from '../components/UserMenu';
import MobileMenu from '../components/MobileMenu';

interface ReferenceImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Reference {
  id: string;
  company_name: string;
  logo_url: string | null;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  images?: ReferenceImage[];
}

export default function ReferencesPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRef, setSelectedRef] = useState<Reference | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      // Fetch references
      const { data: refsData, error: refsError } = await supabase
        .from('references')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: false })
        .order('created_at', { ascending: false });

      if (refsError) throw refsError;

      if (!refsData || refsData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch images for all references
      const { data: imagesData, error: imagesError } = await supabase
        .from('reference_images')
        .select('*')
        // @ts-ignore
        .in('reference_id', refsData.map(r => r.id))
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;

      // Combine data
      // @ts-ignore
      const referencesWithImages = refsData.map((ref: any) => ({
        ...ref,
        images: imagesData?.filter((img: any) => img.reference_id === ref.id) || []
      }));

      setReferences(referencesWithImages);
    } catch (error) {
      console.error('Error fetching references:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (reference: Reference, imageIndex: number = 0) => {
    setSelectedRef(reference);
    setSelectedImageIndex(imageIndex);
  };

  const closeLightbox = () => {
    setSelectedRef(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedRef && selectedRef.images) {
      setSelectedImageIndex((prev) => (prev + 1) % selectedRef.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedRef && selectedRef.images) {
      setSelectedImageIndex((prev) => (prev - 1 + selectedRef.images!.length) % selectedRef.images!.length);
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
              <a href="/#products" className="text-zinc-300 hover:text-white transition-colors">Ürünler</a>
              <a href="/#services" className="text-zinc-300 hover:text-white transition-colors">Hizmetler</a>
              <a href="/references" className="text-zinc-300 hover:text-white transition-colors">Referanslar</a>
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
          <h1 className="text-5xl font-bold mb-4">REFERANSLARIMIZ</h1>
          <p className="text-zinc-400 text-lg">
            Birlikte çalıştığımız başarılı projeler ve iş ortaklıkları
          </p>
        </div>

        {references.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-zinc-500 text-lg">Henüz referans eklenmemiş</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {references.map((reference) => (
              <div
                key={reference.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 overflow-hidden group hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2"
              >
                {/* Banner Image */}
                {reference.images && reference.images.length > 0 && (
                  <div
                    className="relative aspect-video cursor-pointer"
                    onClick={() => openLightbox(reference, 0)}
                  >
                    <Image
                      src={reference.images[0].image_url}
                      alt={reference.company_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {reference.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{reference.images.length - 1} fotoğraf
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Logo */}
                  {reference.logo_url && (
                    <div className="mb-4 flex justify-center">
                      <div className="bg-white p-3 rounded-lg inline-block">
                        <Image
                          src={reference.logo_url}
                          alt={reference.company_name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Company Name */}
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {reference.company_name}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm line-clamp-3 text-center">
                    {reference.description}
                  </p>

                  {/* View Button */}
                  {reference.images && reference.images.length > 0 && (
                    <button
                      onClick={() => openLightbox(reference, 0)}
                      className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 text-sm font-semibold transition-colors"
                    >
                      Görselleri İncele
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedRef && selectedRef.images && selectedRef.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-red-500 transition-colors z-10"
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          {selectedRef.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white text-6xl hover:text-zinc-400 transition-colors z-10"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white text-6xl hover:text-zinc-400 transition-colors z-10"
              >
                ›
              </button>
            </>
          )}

          {/* Image Container */}
          <div className="max-w-6xl w-full">
            <div className="relative aspect-video mb-4">
              <Image
                src={selectedRef.images[selectedImageIndex].image_url}
                alt={selectedRef.company_name}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-2">
                {selectedRef.company_name}
              </h3>
              <p className="text-zinc-400 mb-4">{selectedRef.description}</p>
              <p className="text-zinc-500 text-sm">
                {selectedImageIndex + 1} / {selectedRef.images.length}
              </p>
            </div>

            {/* Thumbnails */}
            {selectedRef.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 overflow-x-auto">
                {selectedRef.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 relative w-20 h-12 border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-white'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${selectedRef.company_name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
