import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Link from 'next/link';

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  product?: {
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items?: OrderItem[]
}

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  const { data: orders } = await supabase
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
    .eq('user_id', user.id)
    .in('payment_status', ['paid', 'failed', 'refunded'])
    .order('created_at', { ascending: false });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    }
    return (
      <span className={`px-3 py-1 rounded border text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      refunded: 'bg-purple-500/20 text-purple-400'
    }
    const labels: Record<string, string> = {
      pending: 'Bekliyor',
      paid: 'Ödendi',
      failed: 'Başarısız',
      refunded: 'İade Edildi'
    }
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/account" className="text-white/70 hover:text-white">
            ← Hesabıma Dön
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Siparişlerim</h1>

        {!orders || orders.length === 0 ? (
          <div className="neon-glass-island p-12 text-center">
            <p className="text-white/50 mb-6">Henüz siparişiniz bulunmuyor</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div key={order.id} className="neon-glass-island p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Sipariş No</div>
                    <div className="text-white font-mono text-lg">{order.order_number}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Tarih</div>
                    <div className="text-white">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Toplam</div>
                    <div className="text-white text-lg font-bold">₺{order.total_amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-2">Durum</div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      {item.product?.images && item.product.images.length > 0 && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.product?.name || 'Ürün'}</div>
                        <div className="text-white/50 text-sm mt-1">
                          {item.quantity} adet × ₺{item.unit_price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-white font-semibold">
                        ₺{(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Sipariş Fişini Görüntüle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
