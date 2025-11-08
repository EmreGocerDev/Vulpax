'use client';

import { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Email sent successfully:', result);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        console.error('Email send failed:', result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full animate-scale-in-up">
      {/* Form Container */}
      <div className="bg-black border-2 border-zinc-800 max-w-3xl mx-auto p-8 md:p-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="stagger-delay-100">
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                Ad Soyad *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border-2 border-zinc-800 text-white px-4 py-4 focus:outline-none focus:border-white transition-all duration-300 hover:border-zinc-600"
                placeholder="Ad Soyad giriniz"
              />
            </div>

            {/* Email */}
            <div className="stagger-delay-200">
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                E-posta *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-900 border-2 border-zinc-800 text-white px-4 py-4 focus:outline-none focus:border-white transition-all duration-300 hover:border-zinc-600"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="stagger-delay-300">
            <label htmlFor="phone" className="block text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Telefon Numarası *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-zinc-900 border-2 border-zinc-800 text-white px-4 py-4 focus:outline-none focus:border-white transition-all duration-300 hover:border-zinc-600"
              placeholder="0555 555 55 55"
            />
          </div>

          {/* Message */}
          <div className="stagger-delay-400">
            <label htmlFor="message" className="block text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Mesajınız *
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-zinc-900 border-2 border-zinc-800 text-white px-4 py-4 focus:outline-none focus:border-white transition-all duration-300 hover:border-zinc-600 resize-none"
              placeholder="Projeniz hakkında detayları paylaşın..."
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-500/10 border-2 border-green-500 text-green-500 px-6 py-4 text-center font-semibold animate-fade-in">
              ✓ MESAJINIZ BAŞARIYLA GÖNDERİLDİ! EN KISA SÜREDE SİZE DÖNÜŞ YAPACAĞIZ.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-500/10 border-2 border-red-500 text-red-500 px-6 py-4 text-center font-semibold animate-fade-in">
              ✗ BİR HATA OLUŞTU. LÜTFEN DAHA SONRA TEKRAR DENEYİN.
            </div>
          )}

          {/* Submit Button */}
          <div className="stagger-delay-500">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black px-8 py-5 text-lg font-bold hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wider"
            >
              {isSubmitting ? 'GÖNDERİLİYOR...' : 'PROJENİZİ KONUŞALIM'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
          <p>Formunuzu gönderdikten sonra 24 saat içinde size geri dönüş yapacağız.</p>
        </div>
      </div>
    </div>
  );
}
