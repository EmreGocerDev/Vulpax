import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="neon-glass-island p-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Ödeme Başarısız
          </h1>

          <p className="text-dark-600 mb-8">
            Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
          </p>

          <div className="space-y-4">
            <Link
              href="/checkout"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Tekrar Dene
            </Link>

            <Link
              href="/cart"
              className="block w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition border border-gray-700"
            >
              Sepete Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
