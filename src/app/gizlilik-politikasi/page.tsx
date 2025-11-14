'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">DIGITAL</p>
              </div>
            </Link>
            <Link
              href="/"
              className="text-zinc-300 hover:text-white transition-colors text-sm"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Genel Bilgiler</h2>
            <p>
              Vulpax Digital olarak, kullanıcılarımızın gizliliğini korumayı en önemli önceliklerimizden biri olarak görüyoruz. 
              Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda kişisel bilgilerinizin 
              nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Toplanan Bilgiler</h2>
            <p className="mb-3">Web sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ad, soyad ve iletişim bilgileri (e-posta, telefon)</li>
              <li>Kullanıcı hesap bilgileri</li>
              <li>IP adresi ve tarayıcı bilgileri</li>
              <li>Site kullanım istatistikleri</li>
              <li>Çerezler aracılığıyla toplanan bilgiler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Bilgilerin Kullanımı</h2>
            <p className="mb-3">Topladığımız bilgileri şu amaçlarla kullanırız:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
              <li>Kullanıcı deneyimini iyileştirmek</li>
              <li>İletişim taleplerini yanıtlamak</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Bilgi Güvenliği</h2>
            <p>
              Kişisel bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. 
              Tüm hassas veriler SSL/TLS şifrelemesi ile korunmaktadır. Ancak, internet üzerinden 
              iletilen hiçbir verinin %100 güvenli olmadığını unutmayın.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Çerezler</h2>
            <p>
              Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerezler, 
              tarayıcınızda saklanan küçük veri dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri 
              devre dışı bırakabilirsiniz, ancak bu durumda bazı site özellikleri düzgün çalışmayabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Üçüncü Taraf Hizmetler</h2>
            <p className="mb-3">
              Web sitemiz, aşağıdaki üçüncü taraf hizmetlerini kullanabilir:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Google Analytics (analitik)</li>
              <li>iyzico (ödeme işlemleri)</li>
              <li>Supabase (veritabanı ve kimlik doğrulama)</li>
            </ul>
            <p className="mt-3">
              Bu hizmetler kendi gizlilik politikalarına sahiptir ve verilerinizi kendi politikaları 
              doğrultusunda işlerler.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Kullanıcı Hakları</h2>
            <p className="mb-3">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Kişisel verilerin yurt içinde veya yurt dışında üçüncü kişilere aktarılıp aktarılmadığını öğrenme</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Çocukların Gizliliği</h2>
            <p>
              Hizmetlerimiz 18 yaşın altındaki çocuklara yönelik değildir. 18 yaşından küçük kullanıcılardan 
              bilerek kişisel bilgi toplamıyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Politika Değişiklikleri</h2>
            <p>
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda 
              kullanıcılarımızı bilgilendireceğiz. Güncellenmiş politikayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. İletişim</h2>
            <p className="mb-3">
              Gizlilik politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
              <p className="mb-2">
                <strong>E-posta:</strong> <a href="mailto:emregocer@vulpax.com.tr" className="text-blue-400 hover:underline">emregocer@vulpax.com.tr</a>
              </p>
              <p>
                <strong>Telefon:</strong> <a href="tel:+905070263185" className="text-blue-400 hover:underline">0507 026 31 85</a>
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

      <Footer />
    </div>
  );
}
