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
    <div className="w-full max-w-4xl mx-auto">
      {/* Novu.co Style Code Card with outer glow */}
      <div className="relative">
        {/* Outer glow - component dışına ışıma - daha yoğun */}
        <div className="absolute -inset-8 bg-gradient-to-r from-[#2666E3]/40 via-[#67DBFF]/40 to-[#2666E3]/40 rounded-[40px] blur-[100px] opacity-90"></div>
        <div className="absolute -inset-6 bg-gradient-to-br from-[#67DBFF]/30 to-[#2666E3]/30 rounded-[36px] blur-[60px] opacity-80"></div>
        
        <div className="relative z-10 h-full w-full overflow-hidden rounded-[20px] p-5 [transform:translateZ(0)] bg-gradient-to-b from-[#0f1419] to-[#05050B] border border-[#BAFFFF]/20">
          
          {/* Inner border glow - blur with stronger cyan */}
          <div 
            className="pointer-events-none absolute inset-5 z-10 rounded-xl blur-lg border-2 border-[#BAFFFF]/50" 
            aria-hidden="true"
          ></div>
          
          {/* Top horizontal line glow - parlama */}
          <div 
            className="pointer-events-none absolute left-3.5 top-5 z-20 h-px w-full max-w-[590px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#BAFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[1px]" 
            aria-hidden="true"
          ></div>

          {/* Main Form Card - Glass morphism */}
          <div className="relative z-10 overflow-y-scroll rounded-xl bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl p-[22px] shadow-[-2px_-2px_10px_0px_rgba(4,9,15,0.1),4px_4px_8px_0px_rgba(0,0,0,0.1),10px_10px_20px_0px_rgba(0,0,0,0.15)] border border-[#BAFFFF]/10">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                    İsim Soyisim
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAFFFF]/50 focus:border-[#BAFFFF] transition-all duration-200 placeholder:text-zinc-600"
                    placeholder="Ad Soyad"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAFFFF]/50 focus:border-[#BAFFFF] transition-all duration-200 placeholder:text-zinc-600"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAFFFF]/50 focus:border-[#BAFFFF] transition-all duration-200 placeholder:text-zinc-600"
                  placeholder="0555 555 55 55"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BAFFFF]/50 focus:border-[#BAFFFF] transition-all duration-200 resize-none placeholder:text-zinc-600 font-mono text-sm"
                  placeholder="Projenizi detaylıca anlatın..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 px-4 py-3 text-sm flex items-center gap-2 backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 px-4 py-3 text-sm flex items-center gap-2 backdrop-blur-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </div>
              )}

              {/* Submit Button - Glass Morphism Dark */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40 hover:bg-gradient-to-r hover:from-[#0a0f1a] hover:via-[#1a1f2e] hover:to-[#0a0f1a]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    Mesaj Gönder
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Multiple glow layers exactly like Novu */}
          <div className="pointer-events-none absolute left-[-94px] top-[50px] h-[328px] w-[1295px] rotate-[-147deg] rounded-[50%] bg-[linear-gradient(270deg,#D2FCFF_13.37%,rgba(210,252,255,0.10)_45.79%)] opacity-30 mix-blend-plus-lighter blur-[100px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-[-38px] top-[-42px] h-[209px] w-[867px] rotate-[-147deg] rounded-[50%] bg-[linear-gradient(270deg,#97E6FF_13.17%,rgba(151,230,255,0.10)_90.73%)] opacity-20 mix-blend-color-dodge blur-[100px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-[-69px] top-[-27px] h-[335px] w-[1067px] rotate-[-147deg] rounded-[50%] bg-[linear-gradient(270deg,#97CDFF_0%,rgba(151,205,255,0.10)_46.49%)] opacity-50 mix-blend-overlay blur-[100px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-[-176px] top-[-168px] h-[742px] w-[1472px] rotate-[-147deg] rounded-[50%] bg-[linear-gradient(270deg,#2666E3_0%,rgba(38,102,227,0.10)_39.76%,rgba(38,102,227,0.00)_75.86%)] opacity-10 blur-[100px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-[-176px] top-[-168px] h-[1468px] w-[1382px] rotate-[-147deg] rounded-full bg-[#6498FF] opacity-[0.03] blur-[100px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-0 top-[-16px] h-[32px] w-[448px] rounded-[50%] bg-[#67DBFF] opacity-25 mix-blend-plus-lighter blur-[50px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute left-[16px] top-[-11px] h-[23px] w-[400px] rounded-[50%] bg-[#E6FCFF] opacity-20 mix-blend-plus-lighter blur-[25px]" aria-hidden="true"></div>
          
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-[#05050B]" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
}
