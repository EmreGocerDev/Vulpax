'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, AlertTriangle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MarketDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    todaySalesCount: 0,
    todayRevenue: 0,
    totalCustomers: 0
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch Total Products
      const { count: productsCount } = await supabase
        .from('market_products')
        .select('*', { count: 'exact', head: true });

      // Fetch Low Stock
      const { count: lowStockCount } = await supabase
        .from('market_products')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10);

      // Fetch Today's Sales & Revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: salesData } = await supabase
        .from('market_sales')
        .select('total_amount, created_at')
        .gte('created_at', today.toISOString());

      const salesCount = salesData?.length || 0;
      const revenue = salesData?.reduce((sum: number, sale: any) => sum + Number(sale.total_amount), 0) || 0;

      // Fetch Customers
      const { count: customersCount } = await supabase
        .from('market_customers')
        .select('*', { count: 'exact', head: true });

      // Fetch Recent Sales
      const { data: recent } = await supabase
        .from('market_sales')
        .select('*, customer:market_customers(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalProducts: productsCount || 0,
        lowStock: lowStockCount || 0,
        todaySalesCount: salesCount,
        todayRevenue: revenue,
        totalCustomers: customersCount || 0
      });
      
      if (recent) {
        setRecentSales(recent);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Market Paneli</h1>
        <p className="text-zinc-400">İşletmenizin genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Toplam Ürün" 
          value={stats.totalProducts} 
          icon={Package} 
          color="blue"
        />
        <StatCard 
          title="Kritik Stok" 
          value={stats.lowStock} 
          icon={AlertTriangle} 
          color="red"
        />
        <StatCard 
          title="Bugünkü Ciro" 
          value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.todayRevenue)} 
          icon={TrendingUp} 
          color="green"
          subValue={`${stats.todaySalesCount} Satış`}
        />
        <StatCard 
          title="Müşteriler" 
          value={stats.totalCustomers} 
          icon={Users} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Son Satışlar</h2>
            <Link href="/dashboard/market/reports" className="text-sm text-blue-400 hover:text-blue-300 flex items-center">
              Tümünü Gör <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {recentSales.length === 0 ? (
            <div className="text-zinc-500 text-sm text-center py-8">
              Henüz işlem kaydı bulunmuyor.
            </div>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-white font-medium">
                      {sale.customer?.name || 'Misafir Müşteri'}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(sale.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • 
                      {sale.payment_method === 'CASH' ? ' Nakit' : sale.payment_method === 'CREDIT_CARD' ? ' Kredi Kartı' : ' Veresiye'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-bold">
                      +{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(sale.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/market/pos" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left group">
              <span className="block text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">Yeni Satış</span>
              <span className="text-xs text-zinc-400">POS ekranını aç</span>
            </Link>
            <Link href="/dashboard/market/products" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left group">
              <span className="block text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">Ürün Ekle</span>
              <span className="text-xs text-zinc-400">Stok kartı oluştur</span>
            </Link>
            <Link href="/dashboard/market/stock/entry" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left group">
              <span className="block text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">Mal Kabul</span>
              <span className="text-xs text-zinc-400">Stok girişi yap</span>
            </Link>
            <Link href="/dashboard/market/accounts" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-left group">
              <span className="block text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">Cari Hesap</span>
              <span className="text-xs text-zinc-400">Müşteri/Tedarikçi ekle</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subValue }: any) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
          <Icon size={24} />
        </div>
        <div>
            <span className="text-2xl font-bold text-white block text-right">{value}</span>
            {subValue && <span className="text-xs text-zinc-400 block text-right">{subValue}</span>}
        </div>
      </div>
      <h3 className="text-zinc-400 font-medium">{title}</h3>
    </div>
  );
}
