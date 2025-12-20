import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="neon-glass-island p-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Ödeme Başarılı!
          </h1>

          <p className="text-dark-600 mb-8">
            Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
          </p>

          <div className="space-y-4">
            <Link
              href="/account/orders"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Siparişlerim
            </Link>

            <Link
              href="/products"
              className="block w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition border border-gray-700"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
