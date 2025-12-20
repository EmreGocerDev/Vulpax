import { createClient } from '@/lib/supabase/server';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // İstatistikleri çek
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: usersCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')    .in('payment_status', ['paid', 'processing', 'refunded'])    .order('created_at', { ascending: false })
    .limit(10);

  const totalRevenue = recentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  const stats = [
    {
      title: 'Toplam Ürün',
      value: productsCount || 0,
      icon: Package,
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      title: 'Toplam Sipariş',
      value: ordersCount || 0,
      icon: ShoppingBag,
      color: 'bg-green-500/10 text-green-400',
    },
    {
      title: 'Toplam Kullanıcı',
      value: usersCount || 0,
      icon: Users,
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'Toplam Gelir',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'bg-orange-500/10 text-orange-400',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="neon-glass-island p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-dark-600 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="neon-glass-island p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Son Siparişler</h2>
        
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-dark-600 font-semibold">Sipariş No</th>
                  <th className="text-left py-3 px-4 text-dark-600 font-semibold">Tarih</th>
                  <th className="text-left py-3 px-4 text-dark-600 font-semibold">Durum</th>
                  <th className="text-left py-3 px-4 text-dark-600 font-semibold">Ödeme</th>
                  <th className="text-right py-3 px-4 text-dark-600 font-semibold">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-3 px-4 text-white">{order.order_number}</td>
                    <td className="py-3 px-4 text-dark-600">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.payment_status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white font-semibold">
                      {formatPrice(order.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-dark-600 text-center py-8">Henüz sipariş yok.</p>
        )}
      </div>
    </div>
  );
}
