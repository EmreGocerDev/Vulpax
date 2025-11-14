export default function ShippingReturnsPage() {
  return (
    <div className="pt-24">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Teslimat ve İade Koşulları</h1>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Genel Bilgiler</h2>
            <p>
              Vulpax Digital olarak sunduğumuz yazılım hizmetleri ve dijital ürünler için teslimat ve 
              iade koşullarımız aşağıda detaylı olarak açıklanmıştır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Yazılım Projelerinin Teslimi</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1. Teslimat Süresi</h3>
            <p className="mb-3">
              Yazılım projelerinin teslimat süresi, projenin kapsamına ve karmaşıklığına göre değişiklik gösterir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Basit Web Uygulamaları: 2-4 hafta</li>
              <li>Orta Ölçekli Projeler: 4-8 hafta</li>
              <li>Kurumsal Çözümler: 8-16 hafta</li>
              <li>Mobil Uygulamalar: 6-12 hafta</li>
            </ul>
            <p className="mt-3">
              Teslimat süresi, sözleşme aşamasında net olarak belirlenir ve yazılı olarak taraflara bildirilir.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2. Teslimat Şekli</h3>
            <p className="mb-3">
              Projeler aşağıdaki şekillerde teslim edilir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Canlı sunucu üzerine kurulum ve yapılandırma</li>
              <li>Git repository (GitHub, GitLab, vb.) üzerinden kaynak kod teslimi</li>
              <li>Dokümantasyon ve kullanım kılavuzu</li>
              <li>Test ortamında demo sunumu</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3. Kabul Süreci</h3>
            <p>
              Proje teslim edildikten sonra müşteriye 7 iş günü süre ile test ve kabul süreci verilir. 
              Bu süre içerisinde tespit edilen hatalar ücretsiz olarak düzeltilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Dijital Ürünler ve Uygulamalar</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1. Anında Teslimat</h3>
            <p>
              Ücretsiz uygulamalar ve hazır dijital ürünler, ödeme onayından sonra anında indirilebilir 
              hale gelir. İndirme linki e-posta adresinize gönderilir.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2. Lisans Teslimatı</h3>
            <p>
              Satın alınan dijital ürünlerin lisans anahtarları, ödeme onayından sonra 24 saat içinde 
              e-posta yoluyla teslim edilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. İade Koşulları</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1. Yazılım Projeleri</h3>
            <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg mb-4">
              <p className="text-yellow-200">
                <strong>Önemli:</strong> Yazılım projeleri özel olarak geliştirildiği için, geliştirme 
                başladıktan sonra iade kabul edilmemektedir.
              </p>
            </div>
            <p className="mb-3">
              Ancak aşağıdaki durumlarda iade talep edilebilir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sözleşmede belirtilen özelliklerin karşılanmaması</li>
              <li>Belirlenen teslimat süresinin makul bir sebep olmaksızın aşılması (2 kat ve üzeri)</li>
              <li>Kritik hataların düzeltilememesi</li>
              <li>Projenin hiç başlatılmamış olması (geliştirme başlamadan önce)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2. Dijital Ürünler</h3>
            <p className="mb-3">
              Dijital ürünler için 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca cayma hakkı 
              aşağıdaki şartlarda geçerlidir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ürün indirilmemişse veya aktivasyonu yapılmamışsa 14 gün içinde iade mümkündür</li>
              <li>İndirilen veya aktive edilen ürünlerde cayma hakkı kullanılamaz</li>
              <li>Ürünün sözleşmede belirtilen özellikleri taşımaması durumunda iade yapılabilir</li>
              <li>Teknik hatalar nedeniyle ürünün kullanılamaması durumunda iade veya değişim yapılır</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3. İade Süreci</h3>
            <p className="mb-3">
              İade talebiniz için:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>emregocer@vulpax.com.tr adresine e-posta gönderin</li>
              <li>Sipariş numaranızı ve iade sebebinizi belirtin</li>
              <li>Talebiniz 3 iş günü içinde değerlendirilir</li>
              <li>Onaylanan iadeler için ödeme 10 iş günü içinde yapılır</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Garanti ve Destek</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1. Garanti Süresi</h3>
            <p className="mb-3">
              Teslim edilen yazılım projeleri için garanti süreleri:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Basit Web Uygulamaları: 3 ay</li>
              <li>Orta Ölçekli Projeler: 6 ay</li>
              <li>Kurumsal Çözümler: 12 ay</li>
            </ul>
            <p className="mt-3">
              Garanti süresi içinde ortaya çıkan yazılımsal hatalar ücretsiz olarak düzeltilir.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2. Teknik Destek</h3>
            <p>
              Tüm projeler için proje kapsamında belirlenen süre boyunca teknik destek verilir. 
              Destek talepleri e-posta veya telefon ile iletilebilir ve en geç 2 iş günü içinde yanıtlanır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Ödeme İadeleri</h2>
            <p className="mb-3">
              Onaylanan iade taleplerinde ödeme iadesi:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kredi kartı ödemeleri: Kartınıza iade edilir (10-14 iş günü)</li>
              <li>Havale/EFT: Belirttiğiniz hesaba iade edilir (5-7 iş günü)</li>
              <li>İyzico ödemeleri: Ödeme yönteminize göre iade edilir</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Cayma Hakkı Bildirimi</h2>
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg">
              <p className="mb-3">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 15. maddesi gereğince aşağıdaki 
                durumlarda cayma hakkı kullanılamaz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li>Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallar</li>
                <li>Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallar</li>
                <li>Cayma hakkı süresi sona erdikten sonra yapılan talepler</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. İletişim</h2>
            <p className="mb-3">
              Teslimat ve iade konularında sorularınız için:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
              <p className="mb-2">
                <strong>E-posta:</strong> <a href="mailto:emregocer@vulpax.com.tr" className="text-blue-400 hover:underline">emregocer@vulpax.com.tr</a>
              </p>
              <p>
                <strong>Telefon:</strong> <a href="tel:+905070263185" className="text-blue-400 hover:underline">0507 026 31 85</a>
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                Çalışma Saatleri: Pazartesi - Cuma, 09:00 - 18:00
              </p>
            </div>
          </section>

          <section className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Son güncelleme: 14 Kasım 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
