'use client';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        {/* Filters for Card 1 */}
        <filter id="unopaq1" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 5 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq1-2" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 10 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq1-3" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 1 0 
                  0 1 0 1 0 
                  0 0 1 1 0 
                  0 0 0 2 0"
          ></feColorMatrix>
        </filter>

        {/* Filters for Card 2 */}
        <filter id="unopaq2" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 5 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq2-2" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 10 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq2-3" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 1 0 
                  0 1 0 1 0 
                  0 0 1 1 0 
                  0 0 0 2 0"
          ></feColorMatrix>
        </filter>

        {/* Filters for Card 3 */}
        <filter id="unopaq3" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 5 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq3-2" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 0 0 
                  0 1 0 0 0 
                  0 0 1 0 0 
                  0 0 0 10 0"
          ></feColorMatrix>
        </filter>
        <filter id="unopaq3-3" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix
            values="1 0 0 1 0 
                  0 1 0 1 0 
                  0 0 1 1 0 
                  0 0 0 2 0"
          ></feColorMatrix>
        </filter>
      </svg>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fiyatlarımız</h2>
          <p className="text-lg text-gray-400">İşletmeniz için en uygun paketi seçin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Card 1 - Stabil Web Uygulamaları */}
          <div className="relative group">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
            
            {/* Glass card */}
            <div className="relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border border-[#BAFFFF]/20 group-hover:border-[#BAFFFF]/50 rounded-xl p-8 transition-all duration-300">
              <div className="pricing-header">
                <h3 className="text-xl font-bold text-white mb-2">Başlangıç Paketi</h3>
                <div className="pricing-price">
                  <span className="text-3xl font-bold text-white">₺</span>
                  <span className="text-4xl font-bold text-white">6250</span>
                  <span className="text-gray-400 text-sm">/proje</span>
                </div>
              </div>
              <div className="pricing-content">
                <ul className="pricing-features">
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Modern & Responsive Tasarım</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Hızlı & Optimize Kod Yapısı</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Tüm Cihazlarda Uyumlu (Adaptif)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>SEO Optimizasyonu</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Domain (.com veya .com.tr)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Hosting (5GB)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Ücretsiz SSL Sertifikası</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>İletişim Formu Entegrasyonu</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>3 Ay Ücretsiz Teknik Destek</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40">Hemen Başla</button>
              </div>
            </div>
          </div>

          {/* Card 2 - Profesyonel */}
          <div className="relative group">
            {/* Outer glow - daha belirgin (önerilen paket) */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#2666E3]/40 via-[#67DBFF]/40 to-[#2666E3]/40 rounded-2xl blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Glass card */}
            <div className="relative bg-gradient-to-br from-[#0a0f1a]/90 via-[#0d1117]/70 to-[#05050B]/90 backdrop-blur-xl border-2 border-[#BAFFFF]/40 group-hover:border-[#BAFFFF]/70 rounded-xl p-8 transition-all duration-300">
              <div className="absolute top-4 right-4 bg-[#BAFFFF]/20 backdrop-blur-sm border border-[#BAFFFF]/50 text-white px-3 py-1 text-xs font-bold rounded">ÖNERİLEN</div>
              <div className="pricing-header">
                <h3 className="text-xl font-bold text-white mb-2">Profesyonel Paket</h3>
                <div className="pricing-price">
                  <span className="text-3xl font-bold text-white">₺</span>
                  <span className="text-4xl font-bold text-white">12000</span>
                  <span className="text-gray-400 text-sm">/proje</span>
                </div>
              </div>
              <div className="pricing-content">
                <ul className="pricing-features">
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Başlangıç Paket + Tüm Özellikler</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Gelişmiş Animasyonlar & İnteraktif UI</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Domain (.com veya .com.tr)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Hosting (15GB SSD)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Veritabanı (MySQL/PostgreSQL)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Kurumsal E-Posta (5 Adet)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>API Entegrasyonları (Ödeme, SMS, Mail)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Basit Admin Panel</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Google Analytics & Search Console</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>6 Ay Öncelikli Teknik Destek</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40">Hemen Başla</button>
              </div>
            </div>
          </div>

          {/* Card 3 - Enterprise */}
          <div className="relative group">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
            
            {/* Glass card */}
            <div className="relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border border-[#BAFFFF]/20 group-hover:border-[#BAFFFF]/50 rounded-xl p-8 transition-all duration-300">
              <div className="pricing-header">
                <h3 className="text-xl font-bold text-white mb-2">Kurumsal Paket</h3>
                <div className="pricing-price">
                  <span className="text-3xl font-bold text-white">₺</span>
                  <span className="text-4xl font-bold text-white">15000</span>
                  <span className="text-gray-400 text-sm">/proje</span>
                </div>
              </div>
              <div className="pricing-content">
                <ul className="pricing-features">
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Profesyonel Paket + Tüm Özellikler</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Özel İhtiyaçlara Göre Geliştirme</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Premium Domain</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Hosting (50GB SSD + CDN)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Yıllık Veritabanı (Sınırsız Tablo)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Kurumsal E-Posta (Sınırsız)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Gelişmiş Admin Panel & Raporlama</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Bulut Altyapı & Yedekleme Sistemi</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Tüm API Entegrasyonları</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dedike Teknik Destek (7/24)</span>
                  </li>
                  <li>
                    <svg className="pricing-check" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>12 Ay Aylık Bakım & Güncelleme</span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40">Hemen Başla</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
