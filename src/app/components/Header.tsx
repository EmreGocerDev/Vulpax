'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function Header() {
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { user, loading, signOut } = useAuth();

  if (pathname?.startsWith('/dashboard/market')) {
    return null;
  }

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <header className="border border-white/10 backdrop-blur-xl bg-black/20 w-full max-w-5xl shadow-2xl rounded-full">
          <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={40}
                height={40}
                className="rounded-lg transition-transform group-hover:scale-105"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font leading-none">
                  VULPA<span className="text-red-600">X</span>
                </h1>
                <p className="text-[10px] text-zinc-400 leading-none tracking-widest">DIGITAL</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/magaza" className="text-sm text-white/80 hover:text-[#BAFFFF] transition-colors font-medium">
                Mağaza
              </Link>
              <Link href="/uygulamalar" className="text-sm text-white/80 hover:text-[#BAFFFF] transition-colors font-medium">
                Uygulamalar
              </Link>
              {!loading && (
                user ? (
                  <UserMenu user={user} onSignOut={signOut} />
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    GİRİŞ YAP
                  </button>
                )
              )}
            </nav>
            <MobileMenu onLoginClick={() => setIsLoginModalOpen(true)} user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>
      </div>

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
