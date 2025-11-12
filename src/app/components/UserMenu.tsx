'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hangi provider'dan giriş yapıldı?
  const provider = user.app_metadata.provider;
  const isGithubUser = provider === 'github';
  const isGoogleUser = provider === 'google';
  
  // Kullanıcı adını al
  const userName = user.user_metadata.full_name || 
                   user.user_metadata.user_name || 
                   user.user_metadata.name || 
                   user.email?.split('@')[0] || 
                   'Kullanıcı';

  // Avatar URL'ini al
  const avatarUrl = user.user_metadata.avatar_url || 
                    user.user_metadata.picture || 
                    null;

  // Menü dışına tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors rounded"
      >
        <div className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {isGithubUser && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
          )}
          {isGoogleUser && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center p-0.5">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          )}
        </div>
        <span className="text-white text-sm font-medium hidden md:block">{userName}</span>
        <svg 
          className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 shadow-xl z-50 rounded">
          <div className="p-3 border-b border-zinc-700">
            <div className="flex items-center gap-2.5">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-white text-base font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{userName}</p>
                <p className="text-zinc-400 text-xs truncate">{user.email}</p>
                {isGithubUser && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-zinc-400 text-xs">GitHub hesabı</span>
                  </div>
                )}
                {isGoogleUser && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-zinc-400 text-xs">Google hesabı</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-1.5">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors rounded"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
