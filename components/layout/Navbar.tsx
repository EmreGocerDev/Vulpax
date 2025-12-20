'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className="neon-glass-island mx-auto max-w-6xl">
        <div className="inner px-6">
          <div className="flex items-center justify-between h-14 relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/Lightlogo.png"
                alt="Vulpax Digital"
                width={130}
                height={35}
                className="h-8 w-auto"
                priority
              />
              <div className="hidden md:flex items-center text-xl tracking-tight" style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}>
                <span className="text-white" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>VULPA</span>
                <span className="text-red-500" style={{ fontWeight: 900 }}>X</span>
                <span className="text-white/80 ml-2 text-sm" style={{ fontWeight: 400, letterSpacing: '0.1em' }}>digital</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="nav-item">
                <span className="relative z-10">Ana Sayfa</span>
              </Link>
              <Link href="/products" className="nav-item">
                <span className="relative z-10">Ürünler</span>
              </Link>
              <Link href="/about" className="nav-item">
                <span className="relative z-10">Hakkımızda</span>
              </Link>
              <Link href="/contact" className="nav-item">
                <span className="relative z-10">İletişim</span>
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1">
              <button className="nav-icon-btn">
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/account" className="nav-icon-btn">
                <User className="w-5 h-5" />
              </Link>
              
              <Link href="/cart" className="nav-icon-btn relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 neon-badge">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden nav-icon-btn"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10 animate-slide-down">
              <div className="flex flex-col space-y-1 relative z-10">
                <Link
                  href="/"
                  className="mobile-nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  href="/products"
                  className="mobile-nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ürünler
                </Link>
                <Link
                  href="/about"
                  className="mobile-nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/contact"
                  className="mobile-nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </Link>
                <Link
                  href="/cart"
                  className="mobile-nav-item flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Sepetim</span>
                  {totalItems > 0 && (
                    <span className="neon-badge">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
