'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Mesajınız başarıyla gönderildi!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Mesaj gönderilemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">İletişime Geçin</h1>
            <p className="text-dark-600 text-lg">
              Projeleriniz hakkında konuşmak için bize ulaşın
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* İletişim Bilgileri */}
            <div className="lg:col-span-1 space-y-6">
              <div className="neon-glass-island p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">E-posta</h3>
                    <a 
                      href="mailto:emregocer@vulpax.com.tr"
                      className="text-dark-600 hover:text-primary-400 transition"
                    >
                      emregocer@vulpax.com.tr
                    </a>
                  </div>
                </div>
              </div>

              <div className="neon-glass-island p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Telefon</h3>
                    <a 
                      href="tel:+905070263185"
                      className="text-dark-600 hover:text-primary-400 transition"
                    >
                      0507 026 31 85
                    </a>
                  </div>
                </div>
              </div>

              <div className="neon-glass-island p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Adres</h3>
                    <p className="text-dark-600">
                      Fenerbahçe Mah. İğrip Sk. No:13<br />
                      İç Kapı No:1<br />
                      Kadıköy/İstanbul
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-500/10 to-primary-700/10 border border-primary-500/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-3">Çalışma Saatleri</h3>
                <div className="space-y-2 text-dark-600">
                  <p className="flex justify-between">
                    <span>Pazartesi - Cuma:</span>
                    <span className="text-white">09:00 - 18:00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Cumartesi:</span>
                    <span className="text-white">10:00 - 16:00</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Pazar:</span>
                    <span className="text-white">Kapalı</span>
                  </p>
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <div className="neon-glass-island p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                        placeholder="0500 000 00 00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Konu *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                        placeholder="Mesaj konusu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-800 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      'Gönderiliyor...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Mesajı Gönder
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
