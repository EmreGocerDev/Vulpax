import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative border-t" style={{ borderColor: 'var(--border-color)', background: 'linear-gradient(to bottom, hsl(220deg 25% 4.8% / 0.8), hsl(220deg 25% 2% / 0.95))' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/Lightlogo.png" 
                alt="Vulpax Digital" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <div>
                <div className="text-white font-bold text-sm">VULPAX DIGITAL</div>
                <div className="text-white/40 text-xs">Software Solutions</div>
              </div>
            </Link>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              Modern ve güvenli yazılım çözümleri ile işletmenizi dijital dünyada güçlendiriyoruz.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              SSL Sertifikalı Güvenli Bağlantı
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/50 hover:text-white text-xs transition">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Hizmetler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-white/50 hover:text-white text-xs transition">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/50 hover:text-white text-xs transition">
                  Uygulamalar
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white text-xs transition">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-white/40">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <a href="mailto:emregocer@vulpax.com.tr" className="text-white/50 hover:text-white text-xs transition break-all">
                  emregocer@vulpax.com.tr
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-white/40">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+905070263185" className="text-white/50 hover:text-white text-xs transition">
                  0507 026 31 85
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-white/40">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-white/50 text-xs leading-relaxed">
                  FENERBAHÇE MAH. İĞRİP SK. NO: 13 İÇ KAPI NO: 1 KADIKÖY/ İSTANBUL
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t pt-6 mb-6" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-white/30 text-xs mb-3">Güvenli Ödeme Yöntemleri</p>
          <div className="flex items-center gap-4">
            <Image 
              src="/payment/paytr-logo.svg" 
              alt="PayTR" 
              width={60} 
              height={24}
              className="h-6 w-auto opacity-40 hover:opacity-100 transition"
            />
            <Image 
              src="/payment/visa.svg" 
              alt="Visa" 
              width={40} 
              height={24}
              className="h-6 w-auto opacity-40 hover:opacity-100 transition"
            />
            <Image 
              src="/payment/mastercard.svg" 
              alt="Mastercard" 
              width={40} 
              height={24}
              className="h-6 w-auto opacity-40 hover:opacity-100 transition"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Vulpax Digital. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy-policy" className="text-white/50 hover:text-white transition">
              Gizlilik Politikası
            </Link>
            <Link href="/terms-of-service" className="text-white/50 hover:text-white transition">
              Mesafeli Satış Sözleşmesi
            </Link>
            <Link href="/return-policy" className="text-white/50 hover:text-white transition">
              Teslimat ve İade
            </Link>
            <Link href="/contact" className="text-white/50 hover:text-white transition">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
