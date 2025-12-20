import { Code, Users, Award, Zap, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-100 via-dark-50 to-dark-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl text-dark-600">
              Modern teknolojiler ve yaratıcı çözümlerle dijital dünyada fark yaratıyoruz
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="neon-glass-island p-8">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Misyonumuz</h2>
              <p className="text-dark-600 leading-relaxed">
                İşletmelerin dijital dönüşüm süreçlerinde güvenilir teknoloji ortağı olmak, 
                modern ve kullanıcı odaklı yazılım çözümleri sunarak müşterilerimizin 
                başarısına katkıda bulunmak.
              </p>
            </div>

            <div className="neon-glass-island p-8">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Vizyonumuz</h2>
              <p className="text-dark-600 leading-relaxed">
                Türkiye'nin en yenilikçi ve güvenilir yazılım şirketlerinden biri olmak, 
                her ölçekteki işletmeye teknoloji ile güç katarak dijital dönüşüme öncülük etmek.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Değerlerimiz</h2>
            <p className="text-dark-600 max-w-2xl mx-auto">
              İş süreçlerimizi şekillendiren ve başarımızın temelini oluşturan değerlerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Kalite</h3>
              <p className="text-dark-600">
                En yüksek kod kalitesi ve test standartlarıyla güvenilir yazılımlar geliştiriyoruz
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">İşbirliği</h3>
              <p className="text-dark-600">
                Müşterilerimizle yakın işbirliği içinde, ihtiyaçlarına özel çözümler üretiyoruz
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">İnovasyon</h3>
              <p className="text-dark-600">
                En güncel teknolojileri takip ederek yenilikçi çözümler sunuyoruz
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Müşteri Memnuniyeti</h3>
              <p className="text-dark-600">
                Müşteri memnuniyeti odaklı yaklaşımla uzun vadeli ilişkiler kuruyoruz
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Güvenilirlik</h3>
              <p className="text-dark-600">
                Verdiğimiz sözlerin arkasında durarak güven tabanlı ilişkiler kuruyoruz
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sonuç Odaklılık</h3>
              <p className="text-dark-600">
                Projelerimizi zamanında ve beklentileri aşan kalitede teslim ediyoruz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">50+</div>
              <div className="text-dark-600">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">100%</div>
              <div className="text-dark-600">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">7/24</div>
              <div className="text-dark-600">Teknik Destek</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">5+</div>
              <div className="text-dark-600">Yıllık Deneyim</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-500/10 to-primary-700/10 border-y border-primary-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Projeniz İçin Hazır mısınız?
          </h2>
          <p className="text-dark-600 mb-8 max-w-2xl mx-auto">
            Dijital dönüşüm yolculuğunuzda sizinle birlikte olmaktan mutluluk duyarız
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition"
            >
              İletişime Geçin
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition border border-gray-700"
            >
              Ürünlerimizi İnceleyin
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
