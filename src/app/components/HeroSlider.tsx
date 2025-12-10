"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Smartphone, Brain, Shield } from "lucide-react";

const services = [
  {
    id: 1,
    title: "WEB GELİŞTİRME",
    subtitle: "MODERN & HIZLI",
    description: "İşletmeniz için özel, SEO uyumlu ve yüksek performanslı web uygulamaları geliştiriyoruz.",
    color: "from-[#2666E3] to-[#67DBFF]",
    glowColor: "from-[#2666E3]/40 via-[#67DBFF]/40 to-[#2666E3]/40",
    icon: Code
  },
  {
    id: 2,
    title: "MOBİL UYGULAMA",
    subtitle: "IOS & ANDROID",
    description: "Kullanıcı deneyimi odaklı, native performansında çalışan mobil çözümler.",
    color: "from-purple-500 to-pink-500",
    glowColor: "from-purple-500/40 via-pink-500/40 to-purple-500/40",
    icon: Smartphone
  },
  {
    id: 3,
    title: "YAPAY ZEKA",
    subtitle: "AKILLI ÇÖZÜMLER",
    description: "İş süreçlerinizi otomatize eden ve verimliliği artıran AI entegrasyonları.",
    color: "from-emerald-500 to-teal-500",
    glowColor: "from-emerald-500/40 via-teal-500/40 to-emerald-500/40",
    icon: Brain
  },
  {
    id: 4,
    title: "SİBER GÜVENLİK",
    subtitle: "GÜVENLİ ALTYAPI",
    description: "Verilerinizi ve sistemlerinizi en güncel tehditlere karşı koruyoruz.",
    color: "from-red-500 to-orange-500",
    glowColor: "from-red-500/40 via-orange-500/40 to-red-500/40",
    icon: Shield
  }
];

export default function HeroSlider() {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentService = services[activeService];
  const IconComponent = currentService.icon;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Animated Background Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${currentService.glowColor} blur-[120px] opacity-30 transition-all duration-1000`}
        style={{ transform: 'translate(-20%, -20%) scale(1.5)' }}
      />
      
      {/* Additional subtle glow layer */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#BAFFFF]/10 to-[#2666E3]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Badge */}
      <aside className="relative z-10 mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#BAFFFF]/30 bg-[#0a0f1a]/50 backdrop-blur-sm animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-[#BAFFFF] animate-pulse" />
        <span className="text-xs text-center whitespace-nowrap text-zinc-400">
          GELECEĞİ KODLUYORUZ
        </span>
        <Link
          href="/referanslar"
          className="flex items-center gap-1 text-xs text-[#BAFFFF] hover:text-white transition-all active:scale-95 whitespace-nowrap"
        >
          Referanslarımız
          <ArrowRight size={12} />
        </Link>
      </aside>

      {/* Main Title Area */}
      <div className="relative z-10 text-center max-w-4xl mb-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`transition-all duration-700 ease-out ${
              index === activeService 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-4 absolute inset-0 pointer-events-none'
            }`}
          >
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              style={{
                background: `linear-gradient(to bottom right, #ffffff, #ffffff, rgba(186, 255, 255, 0.8))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em"
              }}
            >
              {service.title}
            </h1>
            <h2 className={`text-xl md:text-2xl font-semibold tracking-widest mb-6 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
              {service.subtitle}
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link 
          href="/#contact"
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40"
        >
          PROJEMİ BAŞLAT
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/referanslar"
          className="inline-flex items-center gap-2 border border-[#BAFFFF]/20 hover:border-[#BAFFFF]/50 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:bg-[#BAFFFF]/5"
        >
          REFERANSLARIMIZ
        </Link>
      </div>

      {/* Service Cards - Glass Morphism */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`group relative p-6 rounded-xl transition-all duration-300 ${
                  index === activeService 
                    ? 'bg-gradient-to-br from-[#0a0f1a]/90 via-[#0d1117]/80 to-[#05050B]/90 border-2 border-[#BAFFFF]/50 shadow-lg shadow-[#BAFFFF]/20' 
                    : 'bg-[#0a0f1a]/40 border border-[#BAFFFF]/10 hover:border-[#BAFFFF]/30 hover:bg-[#0a0f1a]/60'
                }`}
              >
                {/* Card glow on active */}
                {index === activeService && (
                  <div className={`absolute -inset-2 bg-gradient-to-r ${service.glowColor} rounded-2xl blur-xl opacity-40 -z-10`} />
                )}
                
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${
                  index === activeService 
                    ? `bg-gradient-to-br ${service.color}` 
                    : 'bg-[#1a1f2e]'
                }`}>
                  <ServiceIcon 
                    size={20} 
                    className={index === activeService ? 'text-white' : 'text-zinc-400 group-hover:text-[#BAFFFF]'}
                  />
                </div>
                
                <h3 className={`text-xs font-semibold tracking-wide transition-colors ${
                  index === activeService ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                }`}>
                  {service.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveService(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === activeService 
                ? 'w-12 bg-[#BAFFFF]' 
                : 'w-2 bg-zinc-800 hover:bg-zinc-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
