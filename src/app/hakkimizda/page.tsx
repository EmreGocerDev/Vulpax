import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Fixed Character Image - Desktop only */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40 pointer-events-none">
        <Image
          src="/KarakterGorsellleri/hakkimizda..png"
          alt="Vulpax Professional"
          width={280}
          height={280}
          className="animate-fade-in drop-shadow-2xl"
        />
      </div>
      
      {/* Hero Section */}
      <div className="relative py-20 px-6 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 logo-font">
            VULPA<span className="text-red-500">X</span> DIGITAL
          </h1>
          <p className="text-xl text-zinc-300">
            Modern Yazılım Çözümleri ile Dijital Geleceğinizi Şekillendirin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12 text-zinc-300 leading-relaxed">
          
          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Biz Kimiz?</h2>
            <p className="mb-4">
              Vulpax Digital, modern teknolojiler kullanarak işletmelere özel yazılım çözümleri sunan 
              yenilikçi bir yazılım şirketidir. 2025 yılında kurulan firmamız, web uygulamaları, 
              mobil uygulamalar ve API geliştirme konularında uzmanlaşmış bir ekiple hizmet vermektedir.
            </p>
            <p>
              Müşterilerimize en kaliteli hizmeti sunmak için sürekli kendimizi geliştiriyor ve 
              sektördeki en güncel teknolojileri takip ediyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Misyonumuz</h2>
            <p>
              İşletmelerin dijital dönüşüm süreçlerinde en güvenilir çözüm ortağı olmak. 
              Müşterilerimizin ihtiyaçlarını anlayarak, onlara özel, ölçeklenebilir ve güvenli 
              yazılım çözümleri sunmak. Teknoloji ile iş süreçlerini optimize ederek, 
              işletmelerin rekabet gücünü artırmalarına katkıda bulunmak.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Vizyonumuz</h2>
            <p>
              Türkiye'nin önde gelen yazılım şirketlerinden biri olarak, uluslararası pazarda 
              tanınan ve tercih edilen bir marka haline gelmek. Sürekli yenilik ve gelişim 
              anlayışıyla, teknoloji dünyasında iz bırakan projeler üretmek.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Hizmetlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Web Uygulama Geliştirme</h3>
                <p className="text-zinc-400">
                  Modern framework'ler kullanarak responsive, hızlı ve SEO uyumlu web uygulamaları geliştiriyoruz.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Mobil Uygulama Geliştirme</h3>
                <p className="text-zinc-400">
                  iOS ve Android platformları için native ve cross-platform mobil uygulamalar geliştiriyoruz.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">API & Backend Sistemleri</h3>
                <p className="text-zinc-400">
                  Ölçeklenebilir, güvenli ve performanslı API ve backend sistemleri tasarlıyoruz.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Güvenlik & Optimizasyon</h3>
                <p className="text-zinc-400">
                  Uygulamalarınızın güvenliğini sağlıyor ve performansını optimize ediyoruz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white mb-6">Neden Biz?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uzman Ekip</h3>
                  <p className="text-zinc-400">
                    Alanında uzman, deneyimli yazılım geliştiricilerden oluşan ekibimizle projelerinizi hayata geçiriyoruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Güncel Teknolojiler</h3>
                  <p className="text-zinc-400">
                    React, Next.js, Node.js, PostgreSQL gibi modern teknolojiler kullanarak projeler geliştiriyoruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Müşteri Odaklı</h3>
                  <p className="text-zinc-400">
                    Müşteri memnuniyetini ön planda tutarak, ihtiyaçlarınıza özel çözümler üretiyoruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sürekli Destek</h3>
                  <p className="text-zinc-400">
                    Proje tesliminden sonra da yanınızdayız. Teknik destek ve bakım hizmetleri sunuyoruz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Projenizi Birlikte Hayata Geçirelim
            </h2>
            <p className="text-zinc-400 mb-6">
              Size nasıl yardımcı olabileceğimizi konuşmak için bizimle iletişime geçin.
            </p>
            <Link
              href="/iletisim"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              İletişime Geçin
            </Link>
          </section>
        </div>
        
        {/* Mobile Character Image */}
        <div className="md:hidden flex justify-center mt-12">
          <Image
            src="/KarakterGorsellleri/hakkimizda..png"
            alt="Vulpax Professional"
            width={280}
            height={280}
            className="animate-fade-in drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
