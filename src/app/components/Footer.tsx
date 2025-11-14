'use client';

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 px-6 bg-black animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Company Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <p className="font-semibold logo-font text-lg">VULPA<span className="text-red-500">X</span> DIGITAL</p>
                <p className="text-xs text-zinc-400">Software Solutions</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Modern ve güvenli yazılım çözümleri ile işletmenizi dijital dünyada güçlendiriyoruz.
            </p>
            {/* SSL Certificate Badge */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Sertifikalı Güvenli Bağlantı</span>
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/hakkimizda" className="hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/referanslar" className="hover:text-white transition-colors">
                  Referanslar
                </Link>
              </li>
              <li>
                <Link href="/demolar" className="hover:text-white transition-colors">
                  Demolar
                </Link>
              </li>
              <li>
                <Link href="/muzik-kutuphanesi" className="hover:text-white transition-colors">
                  Müzik Kütüphanesi
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="font-semibold text-white mb-4">Hizmetler</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/uygulamalar" className="hover:text-white transition-colors">
                  Ücretsiz Uygulamalar
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:emregocer@vulpax.com.tr" className="hover:text-white transition-colors">
                  emregocer@vulpax.com.tr
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+905070263185" className="hover:text-white transition-colors">
                  0507 026 31 85
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-500">
              <p className="mb-2">Güvenli Ödeme Yöntemleri</p>
              <div className="flex items-center gap-4">
                <Image
                  src="/payment/iyzico-logo.svg"
                  alt="iyzico ile öde"
                  width={80}
                  height={30}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
                <div className="flex gap-2">
                  <Image
                    src="/payment/visa.svg"
                    alt="Visa"
                    width={40}
                    height={25}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/payment/mastercard.svg"
                    alt="Mastercard"
                    width={40}
                    height={25}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-zinc-500">
              <p>© 2025 Vulpax Digital. Tüm hakları saklıdır.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
              <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors">
                Mesafeli Satış Sözleşmesi
              </Link>
              <Link href="/teslimat-iade" className="hover:text-white transition-colors">
                Teslimat ve İade
              </Link>
              <Link href="/iletisim" className="hover:text-white transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
