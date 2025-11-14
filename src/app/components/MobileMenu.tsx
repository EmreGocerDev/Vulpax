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
          <div className="fixed top-[73px] left-0 right-0 backdrop-blur-xl bg-black/80 border-t border-white/10 z-50 shadow-2xl animate-fade-in-down">
            <div className="flex flex-col p-6 space-y-4 max-h-[calc(100vh-73px)] overflow-y-auto">
            <a 
              href="/demolar" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Demolar
            </a>
            <a 
              href="/referanslar" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Referanslar
            </a>
            <a 
              href="/forum" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Forum
            </a>
            <a 
              href="#pricing" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Fiyatlar
            </a>
            <a 
              href="#contact" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </a>

            <a 
              href="/uygulamalar" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Uygulamalar
            </a>

            <a 
              href="/muzik-kutuphanesi" 
              className="text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Müzik Kütüphanesi
            </a>
            {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
              <a 
                href="/admin" 
                className="text-zinc-300 hover:text-white transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Editör Modu
              </a>
            )}
            
            {user ? (
              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <div className="flex items-center gap-3 px-3 py-2 bg-zinc-800 border border-zinc-700">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={userName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{userName}</p>
                    <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                    {isGithubUser && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-zinc-400 text-xs">GitHub</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 border border-zinc-600 transition-all duration-300 hover:border-zinc-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 border border-zinc-600 transition-all duration-300 hover:border-zinc-400 text-left"
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