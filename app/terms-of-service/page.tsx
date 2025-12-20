export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Kullanım Şartları</h1>
        
        <div className="neon-glass-island p-8 space-y-6 text-dark-700">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Genel Koşullar</h2>
            <p>
              VulpaxSoftware web sitesini kullanarak, bu kullanım şartlarını kabul etmiş sayılırsınız. 
              Şartları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Hizmet Kapsamı</h2>
            <p>
              VulpaxSoftware, yazılım ürünleri ve hizmetleri sunmaktadır. Ürün ve hizmetlerimiz, 
              web sitesinde belirtilen koşullar çerçevesinde sağlanmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Kullanıcı Hesapları</h2>
            <p className="mb-2">Hesap oluştururken:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Doğru ve güncel bilgiler vermelisiniz</li>
              <li>Hesap güvenliğini sağlamakla sorumlusunuz</li>
              <li>Hesabınızda gerçekleşen tüm aktivitelerden sorumlusunuz</li>
              <li>Hesabınızı başkalarıyla paylaşmamalısınız</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Ürün ve Fiyatlar</h2>
            <p>
              Ürün açıklamaları ve fiyatlar değişiklik gösterebilir. Fiyat hataları durumunda, 
              siparişinizi iptal etme veya size bilgi verme hakkımız saklıdır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Sipariş ve Ödeme</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Sipariş verdiğinizde, ödeme yapmayı kabul etmiş olursunuz</li>
              <li>Tüm ödemeler güvenli ödeme sistemleri üzerinden işlenir</li>
              <li>Stokta olmayan ürünler için sipariş iptal edilebilir</li>
              <li>Faturalama bilgilerinizin doğru olması gerekmektedir</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Teslimat</h2>
            <p>
              Ürünler, belirtilen teslimat süresi içinde adresinize gönderilir. Kargo şirketi 
              kaynaklı gecikmelerden sorumlu değiliz. Teslimat adresi bilgilerinizin doğru 
              olduğundan emin olunuz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. İade ve İptal</h2>
            <p>
              İade ve iptal koşulları için "İade ve Değişim Politikası" sayfamızı inceleyiniz. 
              14 gün içinde cayma hakkınızı kullanabilirsiniz (dijital ürünler hariç).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Fikri Mülkiyet Hakları</h2>
            <p>
              Web sitemizdeki tüm içerik, tasarım, logo, metin, grafik ve yazılımlar 
              VulpaxSoftware'in mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Sorumluluk Sınırlaması</h2>
            <p>
              VulpaxSoftware, web sitesinin kesintisiz veya hatasız çalışacağını garanti etmez. 
              Dolaylı zararlardan sorumlu tutulamayız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Değişiklikler</h2>
            <p>
              Bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkımız saklıdır. 
              Değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Uygulanacak Hukuk</h2>
            <p>
              Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Türkiye 
              mahkemelerinde çözülecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. İletişim</h2>
            <p>
              Sorularınız için: emregocer@vulpax.com.tr | 0507 026 31 85
            </p>
          </section>

          <section className="text-sm text-dark-600">
            <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
