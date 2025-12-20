export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Gizlilik Politikası</h1>
        
        <div className="neon-glass-island p-8 space-y-6 text-dark-700">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Genel Bilgiler</h2>
            <p>
              VulpaxSoftware olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
              Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde toplanan bilgilerin nasıl 
              kullanıldığını açıklamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Toplanan Bilgiler</h2>
            <p className="mb-2">Aşağıdaki bilgiler toplanabilir:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>İsim ve iletişim bilgileri</li>
              <li>E-posta adresi</li>
              <li>Telefon numarası</li>
              <li>Teslimat ve fatura adresi</li>
              <li>Ödeme bilgileri</li>
              <li>Sipariş geçmişi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="mb-2">Toplanan bilgiler şu amaçlarla kullanılır:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Siparişlerinizi işleme koymak ve teslim etmek</li>
              <li>Müşteri hizmetleri sağlamak</li>
              <li>Ürün ve hizmetlerimizi geliştirmek</li>
              <li>Pazarlama iletişimi (izniniz dahilinde)</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Bilgi Güvenliği</h2>
            <p>
              Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. 
              Tüm hassas veriler şifrelenmiş bağlantılar üzerinden iletilir ve güvenli sunucularda saklanır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Çerezler</h2>
            <p>
              Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
              Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz, ancak bu durumda bazı site 
              özelliklerinin çalışmayabileceğini unutmayın.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Üçüncü Taraf Paylaşımı</h2>
            <p>
              Kişisel bilgilerinizi, yasal zorunluluklar haricinde üçüncü taraflarla paylaşmıyoruz. 
              Hizmet sağlayıcılarımız (ödeme işlemcileri, kargo firmaları) yalnızca gerekli bilgilere 
              erişebilir ve bu bilgileri yalnızca belirlenen amaçlar için kullanabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Haklarınız</h2>
            <p className="mb-2">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>Verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme</li>
              <li>Verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız varsa, bizimle emregocer@vulpax.com.tr 
              adresinden veya 0507 026 31 85 numaralı telefondan iletişime geçebilirsiniz.
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
