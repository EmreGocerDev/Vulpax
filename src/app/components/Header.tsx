'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
  onLoginClick?: () => void;
}

export default function Header({ user, onSignOut, onLoginClick }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors uppercase tracking-wide">
            VULPAX
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors uppercase tracking-wide ${
                isActive('/') && pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ANA SAYFA
            </Link>
            <Link 
              href="/uygulamalar" 
              className={`text-sm font-semibold transition-colors uppercase tracking-wide ${
                isActive('/uygulamalar') ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              UYGULAMALAR
            </Link>
            <Link 
              href="/references" 
              className={`text-sm font-semibold transition-colors uppercase tracking-wide ${
                isActive('/references') ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              REFERANSLAR
            </Link>
            {user ? (
              <UserMenu user={user} onSignOut={onSignOut} />
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold uppercase tracking-wide"
              >
                GİRİŞ YAP
              </button>
            )}
          </nav>
          <MobileMenu onLoginClick={onLoginClick || (() => {})} user={user} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}
