"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Web Uygulama Geliştirme",
    subtitle: "Modern ve Ölçeklenebilir Çözümler",
    description: "İşletmeniz için özelleştirilmiş, güvenli ve performanslı web uygulamaları",
    image: "/hero/hero-1.jpg"
  },
  {
    id: 2,
    title: "Mobil Uygulama Geliştirme",
    subtitle: "iOS ve Android Platformları",
    description: "Kullanıcı dostu, hızlı ve güvenilir mobil uygulamalar",
    image: "/hero/hero-2.jpg"
  },
  {
    id: 3,
    title: "API & Backend Sistemleri",
    subtitle: "Güçlü Altyapı Çözümleri",
    description: "Ölçeklenebilir, güvenli ve performanslı backend sistemleri",
    image: "/hero/hero-3.jpg"
  },
  {
    id: 4,
    title: "Kurumsal Yazılım Çözümleri",
    subtitle: "İşletmenize Özel Sistemler",
    description: "CRM, ERP ve özelleştirilmiş kurumsal yazılımlar",
    image: "/hero/hero-4.jpg"
  },
  {
    id: 5,
    title: "Bulut ve DevOps Çözümleri",
    subtitle: "Modern Altyapı Yönetimi",
    description: "Otomatik deployment, izleme ve ölçeklendirme sistemleri",
    image: "/hero/hero-5.jpg"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 12000); // Her 12 saniyede bir değişir

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 600);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 600);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 z-10'
              : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={100}
            />
          </div>

          {/* Content - Yatayda ve Dikeyde Ortalı */}
          <div className="relative z-20 h-full flex items-center justify-center" style={{ marginTop: '-80px' }}>
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-4xl mx-auto">
                {index === currentSlide && (
                  <div className="backdrop-blur-xl bg-black/30 border border-white/20 p-8 md:p-10 lg:p-12 shadow-2xl">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-center logo-font">
                      <span className="bg-linear-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-2xl">
                        {slide.title}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-red-400 mb-4 text-center logo-font">
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p className="text-base md:text-lg lg:text-xl text-zinc-200 mb-8 max-w-3xl mx-auto text-center">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div className="transition-all duration-500 opacity-100 text-center">
                      <a 
                        href="#contact"
                        className="hero-animated-button relative z-0 inline-block w-60 h-14 no-underline text-sm font-bold transition-all duration-300 logo-font"
                      >
                        <div className="button__line"></div>
                        <div className="button__line"></div>
                        <span className="button__text flex justify-center items-center w-full h-full whitespace-nowrap">ILETISIME GEÇ</span>
                        <div className="button__drow1"></div>
                        <div className="button__drow2"></div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white transition-all duration-300 hover:scale-125 group"
        aria-label="Previous slide"
      >
        <svg className="w-10 h-10 group-hover:-translate-x-1 transition-transform drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 text-white/80 hover:text-white transition-all duration-300 hover:scale-125 group"
        aria-label="Next slide"
      >
        <svg className="w-10 h-10 group-hover:translate-x-1 transition-transform drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-12 h-3'
                : 'bg-white/40 hover:bg-white/60 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 hidden md:block animate-bounce">
        <a href="#content" className="flex flex-col items-center text-white/80 hover:text-white transition-colors">
          <span className="text-sm mb-2">Keşfet</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
