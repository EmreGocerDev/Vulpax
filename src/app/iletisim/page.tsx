'use client';

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-24">
      {/* Fixed Character Image - Desktop only */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40 pointer-events-none">
        <Image
          src="/KarakterGorsellleri/iletisimVulpax.png"
          alt="İletişim"
          width={280}
          height={280}
          className="animate-fade-in drop-shadow-2xl"
        />
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-zinc-300">
            Projeleriniz için bizimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">Mesaj Gönderin</h2>
              
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-900/50 border border-green-500 text-green-200' 
                    : 'bg-red-900/50 border border-red-500 text-red-200'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors rounded-lg"
                    placeholder="Adınız Soyadınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors rounded-lg"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors rounded-lg"
                    placeholder="0500 000 00 00"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors rounded-lg"
                    placeholder="Mesaj konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors rounded-lg resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">E-posta</h3>
                    <a href="mailto:emregocer@vulpax.com.tr" className="text-zinc-400 hover:text-white transition-colors">
                      emregocer@vulpax.com.tr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Telefon</h3>
                    <a href="tel:+905070263185" className="text-zinc-400 hover:text-white transition-colors">
                      0507 026 31 85
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Çalışma Saatleri</h3>
                    <p className="text-zinc-400">Pazartesi - Cuma: 09:00 - 18:00</p>
                    <p className="text-zinc-400">Cumartesi - Pazar: Kapalı</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Sıkça Sorulan Sorular</h2>
              <div className="space-y-4 text-sm text-zinc-400">
                <div>
                  <h3 className="text-white font-semibold mb-1">Proje süresi ne kadar?</h3>
                  <p>Proje süreleri, ihtiyaçlarınıza göre değişiklik gösterir. Genellikle 2-12 hafta arasında tamamlanır.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Destek hizmeti veriyor musunuz?</h3>
                  <p>Evet, tüm projelerimiz için teknik destek ve bakım hizmeti sunuyoruz.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Ödeme nasıl yapılır?</h3>
                  <p>Havale/EFT veya iyzico üzerinden kredi kartı ile güvenli ödeme yapabilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Character Image */}
        <div className="md:hidden flex justify-center mt-12">
          <Image
            src="/KarakterGorsellleri/iletisimVulpax.png"
            alt="İletişim"
            width={280}
            height={280}
            className="animate-fade-in drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
