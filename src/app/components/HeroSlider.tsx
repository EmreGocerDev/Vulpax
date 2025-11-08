"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Web Uygulama Geliştirme",
    subtitle: "Modern ve Ölçeklenebilir Çözümler",
    description: "İşletmeniz için özelleştirilmiş, güvenli ve performanslı web uygulamaları",
    image: "/hero/hero-1.svg",
    gradient: "from-blue-900/90 via-purple-900/80 to-black/90"
  },
  {
    id: 2,
    title: "Mobil Uygulama Geliştirme",
    subtitle: "iOS ve Android Platformları",
    description: "Kullanıcı dostu, hızlı ve güvenilir mobil uygulamalar",
    image: "/hero/hero-2.svg",
    gradient: "from-red-900/90 via-pink-900/80 to-black/90"
  },
  {
    id: 3,
    title: "API & Backend Sistemleri",
    subtitle: "Güçlü Altyapı Çözümleri",
    description: "Ölçeklenebilir, güvenli ve performanslı backend sistemleri",
    image: "/hero/hero-3.svg",
    gradient: "from-green-900/90 via-teal-900/80 to-black/90"
  },
  {
    id: 4,
    title: "Kurumsal Yazılım Çözümleri",
    subtitle: "İşletmenize Özel Sistemler",
    description: "CRM, ERP ve özelleştirilmiş kurumsal yazılımlar",
    image: "/hero/hero-4.svg",
    gradient: "from-orange-900/90 via-yellow-900/80 to-black/90"
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
              className="object-cover"
              priority={index === 0}
              quality={100}
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${slide.gradient}`} />
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          {/* Content - Yatayda Ortalı, Dikeyde Yukarıda */}
          <div className="relative z-20 h-full flex items-start pt-32">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-4xl mx-auto text-center">
                {index === currentSlide && (
                  <>
                    {/* Title */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6">
                      <span className="bg-linear-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-2xl">
                        {slide.title}
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-red-400 mb-6">
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div className="transition-all duration-500 opacity-100">
                      <a 
                        href="#contact"
                        className="hero-animated-button relative z-0 inline-block w-60 h-14 no-underline text-sm font-bold transition-all duration-300"
                      >
                        <div className="button__line"></div>
                        <div className="button__line"></div>
                        <span className="button__text flex justify-center items-center w-full h-full whitespace-nowrap">İLETİŞİME GEÇ</span>
                        <div className="button__drow1"></div>
                        <div className="button__drow2"></div>
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
