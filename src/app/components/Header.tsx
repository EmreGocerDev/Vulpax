'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <header className="border-b border-white/10 fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/30 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
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
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/demolar" className="text-zinc-300 hover:text-white transition-colors text-base">
                Demolar
              </Link>
              <Link href="/referanslar" className="text-zinc-300 hover:text-white transition-colors text-base">
                Referanslar
              </Link>
              <Link href="/muzik-kutuphanesi" className="text-zinc-300 hover:text-white transition-colors text-base">
                Müzik
              </Link>
              <Link href="/#pricing" className="text-zinc-300 hover:text-white transition-colors text-base">
                Fiyatlar
              </Link>
              <Link href="/#contact" className="text-zinc-300 hover:text-white transition-colors text-base">
                İletişim
              </Link>
              <Link href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors text-base">
                Ücretsiz Uygulamalar
              </Link>
              {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
                <Link href="/admin" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Editör
                </Link>
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
    </>
  );
}
