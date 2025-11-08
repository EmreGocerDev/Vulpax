"use client";

import Image from "next/image";
import { useState } from "react";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import MobileMenu from "./components/MobileMenu";
import HeroSlider from "./components/HeroSlider";
import UserMenu from "./components/UserMenu";
import ReferencesSlider from "./components/ReferencesSlider";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { user, loading, signOut } = useAuth();

  const products = [
    {
      id: 1,
      name: "VulpaxCRM",
      description: "Müşteri ilişkileri yönetim sistemi",
      category: "İş Yönetimi",
      image: "/logo2.png",
      features: ["Müşteri Takibi", "Satış Yönetimi", "Raporlama"]
    },
    {
      id: 2,
      name: "VulpaxERP",
      description: "Kurumsal kaynak planlama sistemi",
      category: "İş Yönetimi",
      image: "/logo2.png",
      features: ["Stok Yönetimi", "Muhasebe", "İnsan Kaynakları"]
    },
    {
      id: 3,
      name: "VulpaxAPI",
      description: "RESTful API entegrasyon hizmetleri",
      category: "Web Entegrasyonu",
      image: "/logo2.png",
      features: ["REST API", "Webhook", "Üçüncü Parti Entegrasyonlar"]
    },
    {
      id: 4,
      name: "VulpaxAnalytics",
      description: "İş zekası ve veri analizi platformu",
      category: "Veri Analizi",
      image: "/logo2.png",
      features: ["Dashboard", "Veri Görselleştirme", "Tahminleme"]
    },
    {
      id: 5,
      name: "VulpaxCommerce",
      description: "E-ticaret platformu ve entegrasyonları",
      category: "E-Ticaret",
      image: "/logo2.png",
      features: ["Mağaza Yönetimi", "Ödeme Entegrasyonu", "Kargo Takibi"]
    },
    {
      id: 6,
      name: "VulpaxMobile",
      description: "Mobil uygulama geliştirme hizmetleri",
      category: "Mobil",
      image: "/logo2.png",
      features: ["iOS", "Android", "React Native"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Software"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">SOFTWARE</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-zinc-300 hover:text-white transition-colors">Ürünler</a>
              <a href="#services" className="text-zinc-300 hover:text-white transition-colors">Hizmetler</a>
              <a href="/references" className="text-zinc-300 hover:text-white transition-colors">Referanslar</a>
              <a href="#contact" className="text-zinc-300 hover:text-white transition-colors">İletişim</a>
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
              {!loading && (
                user ? (
                  <UserMenu user={user} onSignOut={signOut} />
                ) : (
                  <div className="button-borders">
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="primary-button"
                    >
                      GİRİŞ YAP
                    </button>
                  </div>
                )
              )}
            </nav>
            <MobileMenu onLoginClick={() => setIsLoginModalOpen(true)} user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[700px] md:min-h-[800px] overflow-hidden bg-black">
        {/* Background Slider */}
        <div className="absolute inset-0 opacity-60">
          <HeroSlider />
        </div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 py-20 px-6 min-h-[700px] md:min-h-[800px] flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                YAZILIM VE WEB
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-8 text-zinc-300">
                ENTEGRASYONLARİ
              </h3>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-8 drop-shadow-lg">
                Modern teknolojilerle güçlendirilmiş, özelleştirilebilir yazılım çözümleri ve 
                seamless web entegrasyonları ile işinizi dijital dönüşümde önde tutun.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="button-borders">
                  <button className="primary-button">
                    ÜRÜNLERİ KEŞFET
                  </button>
                </div>
                <div className="button-borders">
                  <button className="secondary-button">
                    DEMO TALEBİ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">ÜRÜN GALERİSİ</h2>
            <p className="text-zinc-400 text-lg">İş süreçlerinizi optimize edecek yazılım çözümleri</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-zinc-900 border border-zinc-800 p-6 hover:border-zinc-600 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 mb-4">{product.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-zinc-300">
                        <div className="w-1 h-1 bg-white rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-zinc-800 text-white py-2 text-sm font-medium hover:bg-zinc-700 transition-colors">
                      DETAYLAR
                    </button>
                    <button className="flex-1 border border-zinc-600 text-white py-2 text-sm font-medium hover:border-zinc-400 transition-colors">
                      DEMO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* References Section */}
      <ReferencesSlider />

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">HİZMETLERİMİZ</h2>
            <p className="text-zinc-400 text-lg">Teknoloji ihtiyaçlarınız için kapsamlı çözümler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-600 mx-auto mb-4 flex items-center justify-center group-hover:border-white transition-colors">
                <div className="w-8 h-8 bg-white"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Web Geliştirme</h3>
              <p className="text-zinc-400 text-sm">Modern, responsive ve hızlı web uygulamaları</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-600 mx-auto mb-4 flex items-center justify-center group-hover:border-white transition-colors">
                <div className="w-8 h-8 bg-white"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">API Entegrasyonu</h3>
              <p className="text-zinc-400 text-sm">Sistemler arası veri akışı ve entegrasyon</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-600 mx-auto mb-4 flex items-center justify-center group-hover:border-white transition-colors">
                <div className="w-8 h-8 bg-white"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobil Uygulama</h3>
              <p className="text-zinc-400 text-sm">iOS ve Android platformları için native uygulamalar</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-zinc-800 border border-zinc-600 mx-auto mb-4 flex items-center justify-center group-hover:border-white transition-colors">
                <div className="w-8 h-8 bg-white"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Veri Analizi</h3>
              <p className="text-zinc-400 text-sm">İş zekası ve veri görselleştirme çözümleri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">İLETİŞİME GEÇİN</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Projeleriniz için özel çözümler geliştirmek üzere sizinle çalışmaya hazırız.
          </p>
          <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200 transition-colors">
            PROJENİZİ KONUŞALIM
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/logo2.png"
                alt="Vulpax Software"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <p className="font-semibold logo-font">VULPA<span className="text-red-500">X</span> SOFTWARE</p>
                <p className="text-sm text-zinc-400">© 2025 Tüm hakları saklıdır.</p>
              </div>
            </div>
            <div className="flex space-x-6 text-sm text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors">Destek</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={(email) => {
          setResetEmail(email);
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />

      {/* SignUp Modal */}
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        initialEmail={resetEmail}
        onClose={() => {
          setIsForgotPasswordModalOpen(false);
          setResetEmail("");
        }}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
          setResetEmail("");
        }}
      />
    </div>
  );
}
