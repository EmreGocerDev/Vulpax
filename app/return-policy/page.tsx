export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">İade ve Değişim Politikası</h1>
        
        <div className="neon-glass-island p-8 space-y-6 text-dark-700">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cayma Hakkı</h2>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, ürünün teslim 
              tarihinden itibaren 14 gün içerisinde cayma hakkınızı kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">İade Koşulları</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
              <li>Ürünle birlikte gelen tüm aksesuarlar ve belgeler eksiksiz olmalıdır</li>
              <li>Fatura aslı iade edilmelidir</li>
              <li>Ürün hasarlı veya kullanım izleri taşımamalıdır</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">İade Edilemeyen Ürünler</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dijital içerik ve yazılım ürünleri (indirildikten sonra)</li>
              <li>Kişiye özel üretilmiş ürünler</li>
              <li>Açılmış yazılım paketleri ve lisanslar</li>
              <li>Hijyen açısından uygun olmayan ürünler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">İade Süreci</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. İade Talebi</h3>
                <p>
                  Hesabınıza giriş yaparak "Siparişlerim" bölümünden iade talebinde bulunabilirsiniz. 
                  Alternatif olarak info@vulpaxsoftware.com adresine e-posta gönderebilirsiniz.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Onay</h3>
                <p>
                  İade talebiniz 1-2 iş günü içerisinde incelenip onaylanacaktır. 
                  Onaylandıktan sonra kargo bilgileri tarafınıza iletilecektir.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Gönderim</h3>
                <p>
                  Ürünü, belirtilen kargo şirketi ile göndermeniz gerekmektedir. 
                  Kargo ücreti, cayma hakkı kapsamındaki iadeler için tarafımızca karşılanır.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4. İnceleme</h3>
                <p>
                  Ürün tarafımıza ulaştıktan sonra, iade koşullarına uygunluğu kontrol edilir. 
                  Onay sonrası iade işlemi başlatılır.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5. Ödeme İadesi</h3>
                <p>
                  İade onaylandıktan sonra, ödeme iadeniz 10 iş günü içerisinde 
                  aynı ödeme yöntemi ile yapılacaktır.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Değişim</h2>
            <p>
              Ürün değişimi yapmıyoruz. İade işleminizi tamamladıktan sonra, 
              istediğiniz ürünü yeniden sipariş edebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Hasarlı veya Hatalı Ürün</h2>
            <p>
              Ürün hasarlı veya hatalı olarak size ulaştıysa, derhal bizimle iletişime geçiniz. 
              Bu durumda tüm masraflar (kargo dahil) tarafımızca karşılanacak ve ürün 
              değiştirilecek veya ücret iadesi yapılacaktır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Kargo Hasarı</h2>
            <p>
              Kargo sırasında hasar gören ürünler için, kargo görevlisinin huzurunda 
              tutanak tutturulmalıdır. Aksi takdirde iade kabul edilmeyebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">İletişim</h2>
            <p className="mb-2">İade ve değişim işlemleri için:</p>
            <ul className="space-y-1 ml-4">
              <li><strong className="text-white">E-posta:</strong> emregocer@vulpax.com.tr</li>
              <li><strong className="text-white">Telefon:</strong> 0507 026 31 85</li>
              <li><strong className="text-white">Adres:</strong> Fenerbahçe Mah. İğrip Sk. No:13 İç Kapı No:1 Kadıköy/İstanbul</li>
            </ul>
          </section>

          <section className="text-sm text-dark-600">
            <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
