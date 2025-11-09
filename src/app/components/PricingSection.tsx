'use client';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-black">
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
        {/* Neden Biz Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Neden Biz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
            
            {/* Card 1 - Hızlı & Optimize */}
            <div className="why-card">
              <div className="why-icon">⚡</div>
              <h3 className="why-title">Hızlı & Optimize</h3>
              <p className="why-description">Yıldırım hızında web siteleri ile kullanıcı deneyimini maksimuma çıkarıyoruz</p>
            </div>

            {/* Card 2 - Basit & Anlaşılır */}
            <div className="why-card">
              <div className="why-icon">🎨</div>
              <h3 className="why-title">Basit & Anlaşılır</h3>
              <p className="why-description">Sade ve etkili tasarımlar ile markanızı öne çıkarıyoruz</p>
            </div>

            {/* Card 3 - Responsive & Adaptif */}
            <div className="why-card">
              <div className="why-icon">📱</div>
              <h3 className="why-title">Responsive & Adaptif</h3>
              <p className="why-description">Her cihazda mükemmel görünüm ve kullanılabilirlik sağlıyoruz</p>
            </div>

            {/* Card 4 - Güvenli & Profesyonel */}
            <div className="why-card">
              <div className="why-icon">🛡️</div>
              <h3 className="why-title">Güvenli & Profesyonel</h3>
              <p className="why-description">Güncel güvenlik standartları ile verilerinizi koruyoruz</p>
            </div>

          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fiyatlarımız</h2>
          <p className="text-lg text-gray-400">İşletmeniz için en uygun paketi seçin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Card 1 - Stabil Web Uygulamaları */}
          <div className="pricing-card-container">
            <div className="pricing-spin pricing-spin-blur pricing-card-1-blur"></div>
            <div className="pricing-spin pricing-spin-intense pricing-card-1-intense"></div>
            <div className="pricing-backdrop"></div>
            <div className="pricing-card-border">
              <div className="pricing-spin pricing-spin-inside pricing-card-1-inside"></div>
            </div>
            <div className="pricing-card">
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
                <button className="primary-button w-full">Hemen Başla</button>
              </div>
            </div>
          </div>

          {/* Card 2 - Profesyonel */}
          <div className="pricing-card-container pricing-featured">
            <div className="pricing-spin pricing-spin-blur pricing-card-2-blur"></div>
            <div className="pricing-spin pricing-spin-intense pricing-card-2-intense"></div>
            <div className="pricing-backdrop"></div>
            <div className="pricing-card-border">
              <div className="pricing-spin pricing-spin-inside pricing-card-2-inside"></div>
            </div>
            <div className="pricing-card">
              <div className="pricing-badge">ÖNERİLEN</div>
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
                <button className="primary-button w-full">Hemen Başla</button>
              </div>
            </div>
          </div>

          {/* Card 3 - Enterprise */}
          <div className="pricing-card-container">
            <div className="pricing-spin pricing-spin-blur pricing-card-3-blur"></div>
            <div className="pricing-spin pricing-spin-intense pricing-card-3-intense"></div>
            <div className="pricing-backdrop"></div>
            <div className="pricing-card-border">
              <div className="pricing-spin pricing-spin-inside pricing-card-3-inside"></div>
            </div>
            <div className="pricing-card">
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
                <button className="primary-button w-full">Hemen Başla</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
