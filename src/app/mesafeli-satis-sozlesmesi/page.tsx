import Image from "next/image";

export default function DistanceSalesAgreementPage() {
  return (
    <div className="pt-24">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex justify-center mb-8">
          <Image
            src="/KarakterGorsellleri/satis.png"
            alt="Satış Sözleşmesi"
            width={200}
            height={200}
            className="animate-fade-in"
          />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">Mesafeli Satış Sözleşmesi</h1>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. TARAFLAR</h2>
            
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">SATICI</h3>
              <p><strong>Ünvan:</strong> Vulpax Digital</p>
              <p><strong>Adres:</strong> Türkiye</p>
              <p><strong>E-posta:</strong> emregocer@vulpax.com.tr</p>
              <p><strong>Telefon:</strong> 0507 026 31 85</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">ALICI</h3>
              <p>İşbu sözleşmeyi kabul eden ve Vulpax Digital'dan hizmet/ürün satın alan gerçek veya tüzel kişi.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. SÖZLEŞME KONUSU</h2>
            <p>
              İşbu sözleşme, SATICI'nın ALICI'ya satışını yaptığı, aşağıda nitelikleri ve satış fiyatı 
              belirtilen ürün/hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin 
              Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince 
              tarafların hak ve yükümlülüklerini düzenler.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. SÖZLEŞME KONUSU HİZMET/ÜRÜN BİLGİLERİ</h2>
            <p className="mb-3">
              SATICI tarafından sunulan hizmet ve ürünler aşağıdaki kategorilerde yer almaktadır:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Özel yazılım geliştirme hizmetleri (Web, Mobil, API)</li>
              <li>Hazır yazılım ürünleri ve uygulamalar</li>
              <li>Yazılım danışmanlık hizmetleri</li>
              <li>Teknik destek ve bakım hizmetleri</li>
            </ul>
            <p className="mt-3">
              Hizmet/ürüne ilişkin detaylı bilgiler (özellikler, fiyat, teslimat süresi vb.) 
              sipariş sırasında ALICI'ya sunulan ön bilgilendirme formunda yer almaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. GENEL HÜKÜMLER</h2>
            <p className="mb-3">
              ALICI, işbu sözleşmeyi elektronik ortamda onayladığında, aşağıdaki hususları kabul etmiş sayılır:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sipariş verdiği hizmet/ürünün temel niteliklerini, satış fiyatını ve ödeme şeklini incelediğini</li>
              <li>Hizmet/ürünün teslimat süresini ve şartlarını kabul ettiğini</li>
              <li>Cayma hakkı, teslimat ve iade koşullarını okuduğunu ve kabul ettiğini</li>
              <li>Gizlilik politikasını okuduğunu ve kabul ettiğini</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. ÖDEME VE TESLİMAT</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1. Ödeme Şekli</h3>
            <p className="mb-3">
              ALICI, aşağıdaki ödeme yöntemlerinden birini seçebilir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kredi Kartı (Tek çekim veya taksitli)</li>
              <li>Banka Havalesi / EFT</li>
              <li>iyzico ile Güvenli Ödeme</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2. Fiyat ve Ödeme Planı</h3>
            <p>
              Yazılım projeleri için ödeme planı genellikle aşağıdaki şekildedir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>%40 Ön ödeme (Proje başlangıcında)</li>
              <li>%30 Ara ödeme (Projenin %50'si tamamlandığında)</li>
              <li>%30 Son ödeme (Proje tesliminde)</li>
            </ul>
            <p className="mt-3">
              Dijital ürünler için ödeme tek seferde ve peşin olarak yapılır.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3. Teslimat</h3>
            <p className="mb-3">
              Teslimat şekli hizmet/ürün tipine göre değişir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Yazılım Projeleri:</strong> Canlı sunucuya kurulum veya Git repository üzerinden kaynak kod teslimi</li>
              <li><strong>Dijital Ürünler:</strong> E-posta ile indirme linki gönderimi</li>
              <li><strong>Lisans Anahtarları:</strong> E-posta ile teslimat</li>
            </ul>
            <p className="mt-3">
              Teslimat süresi, sipariş sırasında ALICI'ya bildirilir ve sözleşmede belirtilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. CAYMA HAKKI</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.1. Cayma Hakkı Süresi</h3>
            <p>
              ALICI, sözleşme konusu hizmetin yerine getirilmesine başlanmamış veya dijital ürünün 
              teslim edilmemiş olması koşuluyla, 14 (ondört) gün içinde herhangi bir gerekçe göstermeksizin 
              ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.2. Cayma Hakkının Kullanılamadığı Durumlar</h3>
            <p className="mb-3">
              6502 sayılı Kanun'un 15. maddesi uyarınca aşağıdaki durumlarda cayma hakkı kullanılamaz:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan özel yazılım projeleri</li>
              <li>Elektronik ortamda anında ifa edilen hizmetler</li>
              <li>ALICI'ya anında teslim edilen dijital içerikler (indirilen veya aktive edilen)</li>
              <li>Hizmetin ifasına başlanmış olması (ALICI'nın onayı ile)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">6.3. Cayma Hakkının Kullanımı</h3>
            <p>
              Cayma hakkını kullanmak isteyen ALICI, cayma talebini emregocer@vulpax.com.tr adresine 
              e-posta göndererek bildirir. Cayma bildirimi SATICI'ya ulaştığı tarihten itibaren 14 gün 
              içinde ödeme ALICI'ya iade edilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. GEÇERSİZLİK</h2>
            <p>
              ALICI'nın ödemeyi yapmaması veya banka kayıtlarında iptal etmesi halinde, SATICI'nın 
              hizmet/ürünü teslim yükümlülüğü sona erer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. SATICI'NIN YÜKÜMLÜLÜKLERİ</h2>
            <p className="mb-3">
              SATICI, işbu sözleşme kapsamında:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sözleşmede belirtilen özelliklere uygun hizmet/ürünü teslim etmekle yükümlüdür</li>
              <li>Belirlenen süre içinde teslim gerçekleştirmekle yükümlüdür</li>
              <li>Garanti süresi içinde ortaya çıkan hataları düzeltmekle yükümlüdür</li>
              <li>ALICI'nın kişisel verilerini korumakla yükümlüdür</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. ALICI'NIN YÜKÜMLÜLÜKLERİ</h2>
            <p className="mb-3">
              ALICI, işbu sözleşme kapsamında:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sözleşmede belirlenen ödemeleri zamanında yapmakla yükümlüdür</li>
              <li>Proje için gerekli bilgi ve dokümanları temin etmekle yükümlüdür</li>
              <li>Test ve kabul süreçlerine aktif katılmakla yükümlüdür</li>
              <li>Lisans ve kullanım koşullarına uymakla yükümlüdür</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. FİKRİ MÜLKİYET HAKLARI</h2>
            <p className="mb-3">
              Teslim edilen yazılım projelerinin fikri mülkiyet hakları:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Özel yazılım projeleri: ALICI'ya aittir (sözleşmede aksi belirtilmedikçe)</li>
              <li>Hazır ürünler: SATICI'ya ait olup, ALICI'ya kullanım lisansı verilir</li>
              <li>Kaynak kodlar: Sözleşmede belirtilen şekilde teslim edilir</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. GİZLİLİK</h2>
            <p>
              Taraflar, işbu sözleşme kapsamında edindikleri ticari bilgileri gizli tutmayı ve üçüncü 
              kişilerle paylaşmamayı taahhüt ederler. ALICI'nın kişisel verileri, KVKK kapsamında korunur 
              ve Gizlilik Politikası hükümlerine tabidir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h2>
            <p>
              İşbu sözleşmeden doğabilecek her türlü uyuşmazlığın çözümünde, Türkiye Cumhuriyeti 
              yasaları uygulanır. Uyuşmazlıkların çözümünde ALICI'nın yerleşim yerindeki Tüketici 
              Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. YÜRÜRLÜK</h2>
            <p>
              İşbu sözleşme, ALICI tarafından elektronik ortamda onaylandığı anda yürürlüğe girer ve 
              taraflar için bağlayıcı olur. Sözleşme, hizmetin tamamlanması veya ürünün teslimi ve 
              garanti süresinin sona ermesi ile son bulur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. ÖN BİLGİLENDİRME</h2>
            <p>
              ALICI, sipariş vermeden önce aşağıdaki bilgileri incelemiş ve kabul etmiş sayılır:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hizmet/ürünün temel özellikleri</li>
              <li>Vergiler dahil toplam fiyat</li>
              <li>Ödeme şekli ve planı</li>
              <li>Teslimat süresi ve şartları</li>
              <li>Cayma hakkı ve koşulları</li>
              <li>İade ve garanti koşulları</li>
              <li>Gizlilik politikası</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. İLETİŞİM</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Şirket:</strong> Vulpax Digital
              </p>
              <p className="mb-2">
                <strong>E-posta:</strong> <a href="mailto:emregocer@vulpax.com.tr" className="text-blue-400 hover:underline">emregocer@vulpax.com.tr</a>
              </p>
              <p className="mb-2">
                <strong>Telefon:</strong> <a href="tel:+905070263185" className="text-blue-400 hover:underline">0507 026 31 85</a>
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                Çalışma Saatleri: Pazartesi - Cuma, 09:00 - 18:00
              </p>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg mt-8">
            <p className="text-center font-semibold">
              ALICI, işbu sözleşmeyi elektronik ortamda onaylamakla tüm koşulları kabul etmiş sayılır.
            </p>
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
