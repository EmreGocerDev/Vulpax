import { Headphones, Truck, CreditCard, Award } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: '500 TL Üzeri Ücretsiz Kargo',
      description: 'Tüm siparişlerinizde hızlı ve güvenli teslimat',
    },
    {
      icon: CreditCard,
      title: 'Güvenli Ödeme',
      description: '256-bit SSL sertifikası ile korumalı ödeme',
    },
    {
      icon: Headphones,
      title: '7/24 Destek',
      description: 'Her zaman yanınızdayız, sorularınızı yanıtlıyoruz',
    },
    {
      icon: Award,
      title: 'Kalite Garantisi',
      description: 'En yüksek kalite standartlarına uygun ürünler',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-950 rounded-xl border border-gray-800 hover:border-primary-500 transition group"
            >
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition">
                <feature.icon className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-dark-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
