'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

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
  images?: ReferenceImage[];
}

export default function ReferencesSlider() {
  const [references, setReferences] = useState<Reference[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || references.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % references.length);
    }, 5000); // 5 saniyede bir değişir

    return () => clearInterval(interval);
  }, [isAutoPlaying, references.length]);

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
        .in('reference_id', refsData.map(r => r.id))
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;

      // Combine data
      const referencesWithImages = refsData.map(ref => ({
        ...ref,
        images: imagesData?.filter(img => img.reference_id === ref.id) || []
      }));

      setReferences(referencesWithImages);
    } catch (error) {
      console.error('Error fetching references:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % references.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + references.length) % references.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-zinc-500">Yükleniyor...</div>
        </div>
      </section>
    );
  }

  if (references.length === 0) {
    return null;
  }

  const currentRef = references[currentIndex];
  const displayImage = currentRef.images && currentRef.images.length > 0 
    ? currentRef.images[0].image_url 
    : null;

  return (
    <section className="py-20 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">REFERANSLARIMIZ</h2>
          <p className="text-zinc-400 text-lg">Birlikte çalıştığımız başarılı projeler</p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Main Slide */}
          <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 group">
            {/* Banner Image */}
            {displayImage && (
              <div className="relative w-full aspect-video">
                <Image
                  src={displayImage}
                  alt={currentRef.company_name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
            )}

            {/* Content Overlay */}
            <div className={`${displayImage ? 'absolute bottom-0 left-0 right-0' : ''} p-8 md:p-12`}>
              <div className="flex items-start gap-6">
                {/* Logo */}
                {currentRef.logo_url && (
                  <div className="shrink-0 bg-white p-4 rounded-lg hidden md:block">
                    <Image
                      src={currentRef.logo_url}
                      alt={currentRef.company_name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {currentRef.company_name}
                  </h3>
                  <p className="text-zinc-300 text-sm md:text-base line-clamp-3">
                    {currentRef.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {references.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots Navigation */}
          {references.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {references.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Grid (Desktop - Show 3, Mobile - Show 1) */}
          {references.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {references
                .slice(0, 3)
                .map((ref, idx) => (
                  <button
                    key={ref.id}
                    onClick={() => goToSlide(references.indexOf(ref))}
                    className={`relative aspect-video bg-zinc-900 border-2 transition-all overflow-hidden group ${
                      references.indexOf(ref) === currentIndex
                        ? 'border-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {ref.images && ref.images.length > 0 && (
                      <Image
                        src={ref.images[0].image_url}
                        alt={ref.company_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                      <div className="text-left">
                        {ref.logo_url && (
                          <div className="bg-white p-2 rounded mb-2 inline-block">
                            <Image
                              src={ref.logo_url}
                              alt={ref.company_name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <h4 className="text-white font-bold text-sm">
                          {ref.company_name}
                        </h4>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/references"
            className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-zinc-200 transition-colors"
          >
            TÜM REFERANSLARI GÖR
          </Link>
        </div>
      </div>
    </section>
  );
}
