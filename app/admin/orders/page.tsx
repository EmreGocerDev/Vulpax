'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string | null
  shipping_address: any
  created_at: string
  user_profile?: {
    full_name: string
    email: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [filterStatus, filterPaymentStatus])

  async function fetchOrders() {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select(`
        *,
        user_profile:user_profiles(full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    if (filterPaymentStatus) {
      query = query.eq('payment_status', filterPaymentStatus)
    }

    const { data, error } = await query

    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400'
    }
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    }
    return (
      <span className={`px-3 py-1 rounded text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
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
      <span className={`px-3 py-1 rounded text-xs ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <h1 className="text-2xl font-bold text-white">Sipariş Yönetimi</h1>

      <div className="neon-glass-island p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Sipariş no veya müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-500/50"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="processing">İşleniyor</option>
            <option value="shipped">Kargoda</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
          </select>

          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          >
            <option value="">Tüm Ödeme Durumları</option>
            <option value="pending">Bekliyor</option>
            <option value="paid">Ödendi</option>
            <option value="failed">Başarısız</option>
            <option value="refunded">İade Edildi</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Sipariş No</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Müşteri</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Tutar</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Durum</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Ödeme</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Tarih</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-white/50">
                      Sipariş bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-mono">{order.order_number}</td>
                      <td className="py-3 px-4">
                        <div className="text-white">{order.user_profile?.full_name || 'N/A'}</div>
                        <div className="text-white/50 text-xs">{order.user_profile?.email}</div>
                      </td>
                      <td className="py-3 px-4 text-white">₺{order.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4">{getPaymentStatusBadge(order.payment_status)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          Detay
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
