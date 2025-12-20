'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

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
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string | null
  shipping_address: any
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user_profile?: {
    full_name: string
    email: string
    phone: string
  }
  order_items?: OrderItem[]
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [])

  async function fetchOrder() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user_profile:user_profiles(full_name, email, phone),
        order_items(
          id,
          product_id,
          quantity,
          unit_price,
          product:products(name, images)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      alert('Sipariş yüklenirken hata oluştu')
      router.push('/admin/orders')
      return
    }

    if (data) {
      setOrder(data)
      setStatus(data.status)
      setPaymentStatus(data.payment_status)
      setTrackingNumber(data.tracking_number || '')
      setNotes(data.notes || '')
    }
    setLoading(false)
  }

  async function handleUpdate() {
    setUpdating(true)
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentStatus,
        tracking_number: trackingNumber || null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      alert('Sipariş güncellenirken hata: ' + error.message)
    } else {
      alert('Sipariş başarıyla güncellendi')
      fetchOrder()
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="text-center py-12 text-white/50">Yükleniyor...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="text-center py-12 text-white/50">Sipariş bulunamadı</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-white/70 hover:text-white"
        >
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-white">
          Sipariş Detayı - {order.order_number}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="neon-glass-island p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Sipariş Ürünleri</h2>
            <div className="space-y-4">
              {order.order_items?.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-black/20 rounded-lg">
                  {item.product?.images && item.product.images.length > 0 && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.product?.name}</div>
                    <div className="text-white/50 text-sm mt-1">
                      Miktar: {item.quantity} × ₺{item.unit_price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    ₺{(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-white/70 text-lg">Toplam:</span>
              <span className="text-white text-2xl font-bold">₺{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="neon-glass-island p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Teslimat Adresi</h2>
            {order.shipping_address ? (
              <div className="text-white/70 space-y-1">
                <p>{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city} / {order.shipping_address.state}</p>
                <p>{order.shipping_address.postal_code}</p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && <p className="mt-2">Tel: {order.shipping_address.phone}</p>}
              </div>
            ) : (
              <p className="text-white/50">Adres bilgisi yok</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="neon-glass-island p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-2 text-white/70">
              <p><strong className="text-white">Ad Soyad:</strong> {order.user_profile?.full_name}</p>
              <p><strong className="text-white">E-posta:</strong> {order.user_profile?.email}</p>
              {order.user_profile?.phone && (
                <p><strong className="text-white">Telefon:</strong> {order.user_profile.phone}</p>
              )}
            </div>
          </div>

          <div className="neon-glass-island p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Sipariş Bilgileri</h2>
            <div className="space-y-2 text-white/70 text-sm">
              <p><strong className="text-white">Sipariş No:</strong> {order.order_number}</p>
              <p><strong className="text-white">Tarih:</strong> {new Date(order.created_at).toLocaleString('tr-TR')}</p>
              <p><strong className="text-white">Ödeme Yöntemi:</strong> {order.payment_method || 'N/A'}</p>
            </div>
          </div>

          <div className="neon-glass-island p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Durum Güncelle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Sipariş Durumu</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                >
                  <option value="pending">Beklemede</option>
                  <option value="processing">İşleniyor</option>
                  <option value="shipped">Kargoda</option>
                  <option value="delivered">Teslim Edildi</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Ödeme Durumu</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="paid">Ödendi</option>
                  <option value="failed">Başarısız</option>
                  <option value="refunded">İade Edildi</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Kargo Takip No</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  placeholder="Kargo takip numarası"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Notlar</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
                  placeholder="Sipariş notları"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
              >
                {updating ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
