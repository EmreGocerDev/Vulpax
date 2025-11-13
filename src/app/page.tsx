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
import ContactForm from "./components/ContactForm";
import DemoPages from "./components/DemoPages";
import PricingSection from "./components/PricingSection";
import TechSlider from "./components/TechSlider";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { user, loading, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/30 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={56}
                height={56}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-sm text-zinc-400">DIGITAL</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/demolar" className="text-zinc-300 hover:text-white transition-colors text-base">Demolar</a>
              <a href="/referanslar" className="text-zinc-300 hover:text-white transition-colors text-base">Referanslar</a>
              <a href="/muzik-kutuphanesi" className="text-zinc-300 hover:text-white transition-colors text-base">Müzik</a>
              <a href="#pricing" className="text-zinc-300 hover:text-white transition-colors text-base">Fiyatlar</a>
              <a href="#contact" className="text-zinc-300 hover:text-white transition-colors text-base">İletişim</a>
              <a href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors text-base">Ücretsiz Uygulamalar</a>
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
      <section className="relative min-h-[700px] md:min-h-[800px] overflow-hidden bg-black pt-[72px]">
        {/* Background Slider */}
        <div className="absolute inset-0 top-[72px]">
          <HeroSlider />
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Demo Pages Section - From DEMOS table */}
      <DemoPages />

      {/* References Section */}
      <ReferencesSlider />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">İLETİŞİME GEÇİN</h2>
            <p className="text-zinc-400 text-lg">
              Projeleriniz için özel çözümler geliştirmek üzere sizinle çalışmaya hazırız.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm isOpen={true} onClose={() => {}} />
        </div>
      </section>

      {/* Tech Slider */}
      <TechSlider />

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <p className="font-semibold logo-font">VULPA<span className="text-red-500">X</span> DIGITAL</p>
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
