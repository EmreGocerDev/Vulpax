'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  shipping_address: any;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const supabase = createClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          product_id,
          quantity,
          unit_price,
          product:products(name, images)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.error('Order fetch error:', error);
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return (
      <span className={`px-3 py-1 rounded border text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      refunded: 'bg-purple-500/20 text-purple-400',
    };
    const labels: Record<string, string> = {
      pending: 'Ödeme Bekleniyor',
      paid: 'Ödendi',
      failed: 'Ödeme Başarısız',
      refunded: 'İade Edildi',
    };
    return (
      <span className={`px-3 py-1 rounded text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-white/50 mb-4">Sipariş bulunamadı</p>
            <Link
              href="/account/orders"
              className="text-red-500 hover:text-red-400"
            >
              Siparişlerime Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || 0;
  const shipping: number = 0; // Ücretsiz kargo
  const tax = subtotal * 0.20; // %20 KDV
  const total = order.total_amount;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header - Yazdırmada gizlenecek */}
        <div className="mb-6 print:hidden">
          <Link href="/account/orders" className="text-white/70 hover:text-white">
            ← Siparişlerime Dön
          </Link>
        </div>

        {/* Sipariş Fişi */}
        <div className="neon-glass-island p-8 print:shadow-none print:border print:border-gray-300">
          {/* Başlık */}
          <div className="border-b border-white/10 pb-6 mb-6 print:border-gray-300">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2 print:text-black">
                  SİPARİŞ FİŞİ
                </h1>
                <p className="text-white/70 print:text-gray-600">
                  Vulpax Software
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors print:hidden"
              >
                🖨️ Yazdır
              </button>
            </div>
          </div>

          {/* Sipariş Bilgileri */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-white font-semibold mb-3 print:text-black">Sipariş Bilgileri</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/70 print:text-gray-600">Sipariş No:</span>
                  <span className="text-white font-mono ml-2 print:text-black">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-white/70 print:text-gray-600">Tarih:</span>
                  <span className="text-white ml-2 print:text-black">
                    {new Date(order.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-white/70 print:text-gray-600">Durum:</span>
                  <span className="ml-2">{getStatusBadge(order.status)}</span>
                </div>
                <div>
                  <span className="text-white/70 print:text-gray-600">Ödeme Durumu:</span>
                  <span className="ml-2">{getPaymentStatusBadge(order.payment_status)}</span>
                </div>
                {order.payment_method && (
                  <div>
                    <span className="text-white/70 print:text-gray-600">Ödeme Yöntemi:</span>
                    <span className="text-white ml-2 print:text-black">
                      {order.payment_method === 'card' ? 'Kredi Kartı' : order.payment_method}
                    </span>
                  </div>
                )}
                {order.tracking_number && (
                  <div>
                    <span className="text-white/70 print:text-gray-600">Kargo Takip No:</span>
                    <span className="text-white ml-2 font-mono print:text-black">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Teslimat Adresi */}
            {order.shipping_address && (
              <div>
                <h2 className="text-white font-semibold mb-3 print:text-black">Teslimat Adresi</h2>
                <div className="space-y-1 text-sm text-white/70 print:text-gray-600">
                  <p className="text-white print:text-black font-medium">{order.shipping_address.fullName}</p>
                  <p>{order.shipping_address.phone}</p>
                  <p>{order.shipping_address.email}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.district}, {order.shipping_address.city} {order.shipping_address.postalCode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ürünler Tablosu */}
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-4 print:text-black">Sipariş Detayları</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 print:border-gray-300">
                    <th className="text-left py-3 text-white/70 font-medium print:text-gray-700">Ürün</th>
                    <th className="text-center py-3 text-white/70 font-medium print:text-gray-700">Miktar</th>
                    <th className="text-right py-3 text-white/70 font-medium print:text-gray-700">Birim Fiyat</th>
                    <th className="text-right py-3 text-white/70 font-medium print:text-gray-700">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 print:border-gray-200">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded print:hidden"
                            />
                          )}
                          <span className="text-white print:text-black">{item.product?.name || 'Ürün'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-white print:text-black">{item.quantity}</td>
                      <td className="py-4 text-right text-white print:text-black">₺{item.unit_price.toFixed(2)}</td>
                      <td className="py-4 text-right text-white font-semibold print:text-black">
                        ₺{(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Toplam */}
          <div className="border-t border-white/10 pt-6 print:border-gray-300">
            <div className="max-w-sm ml-auto space-y-2">
              <div className="flex justify-between text-white/70 print:text-gray-600">
                <span>Ara Toplam:</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/70 print:text-gray-600">
                <span>Kargo:</span>
                <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-white/70 print:text-gray-600">
                <span>KDV (%20):</span>
                <span>₺{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white border-t border-white/10 pt-2 print:text-black print:border-gray-300">
                <span>Genel Toplam:</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notlar */}
          {order.notes && (
            <div className="mt-8 pt-6 border-t border-white/10 print:border-gray-300">
              <h3 className="text-white font-semibold mb-2 print:text-black">Notlar:</h3>
              <p className="text-white/70 text-sm print:text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/50 text-sm print:border-gray-300 print:text-gray-500">
            <p>Vulpax Software ile alışveriş yaptığınız için teşekkür ederiz!</p>
            <p className="mt-1">Sorularınız için: destek@vulpax.com.tr</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .neon-glass-island {
            background: white !important;
            border: 1px solid #e5e7eb !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
}
