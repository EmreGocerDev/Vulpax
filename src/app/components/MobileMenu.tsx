"use client";

import { useState } from "react";
import Image from "next/image";
import type { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  onLoginClick: () => void;
  user: User | null;
  onSignOut: () => void;
}

export default function MobileMenu({ onLoginClick, user, onSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const userName = user?.user_metadata.full_name || 
                   user?.user_metadata.user_name || 
                   user?.user_metadata.name || 
                   user?.email?.split('@')[0] || 
                   'Kullanıcı';

  const avatarUrl = user?.user_metadata.avatar_url || 
                    user?.user_metadata.picture || 
                    null;

  const isGithubUser = user?.app_metadata.provider === 'github';

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
        aria-label="Menu"
      >
        <div className="space-y-1">
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-24 left-4 right-4 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/90 z-50 shadow-2xl animate-fade-in-down overflow-hidden">
            <div className="flex flex-col p-4 space-y-2">
              <a 
                href="/magaza" 
                className="text-zinc-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                Mağaza
              </a>
              <a 
                href="/uygulamalar" 
                className="text-zinc-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                Uygulamalar
              </a>
              
              {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
                <a 
                  href="/admin" 
                  className="text-zinc-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Editör Modu
                </a>
              )}

              <div className="h-px bg-white/10 my-2"></div>

              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={userName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userName}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <a 
                    href="/profil" 
                    className="text-zinc-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profilim
                  </a>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all text-left w-full flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="bg-white text-black hover:bg-zinc-200 px-4 py-3 rounded-xl transition-all font-medium text-center w-full"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}