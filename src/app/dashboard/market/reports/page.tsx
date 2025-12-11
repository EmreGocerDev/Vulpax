'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dailySales, setDailySales] = useState<{date: string, total: number}[]>([]);
  const [topProducts, setTopProducts] = useState<{name: string, quantity: number}[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    // 1. Daily Sales (Last 7 days)
    // Since we can't do complex aggregation easily with simple client query without grouping, 
    // we will fetch last 7 days sales and process in JS for now.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: salesData } = await supabase
      .from('market_sales')
      .select('created_at, final_amount')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const salesMap = new Map<string, number>();
    salesData?.forEach((sale: any) => {
      const date = new Date(sale.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
      salesMap.set(date, (salesMap.get(date) || 0) + Number(sale.final_amount));
    });

    const salesChartData = Array.from(salesMap.entries()).map(([date, total]) => ({ date, total }));

    // 2. Top Products (From sale_items)
    // Fetching last 50 items to determine top sellers roughly
    const { data: itemsData } = await supabase
      .from('market_sale_items')
      .select('quantity, product:market_products(name)')
      .limit(100);

    const productMap = new Map<string, number>();
    itemsData?.forEach((item: any) => {
      const name = item.product?.name || 'Bilinmeyen';
      productMap.set(name, (productMap.get(name) || 0) + Number(item.quantity));
    });

    const topProductsData = Array.from(productMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    setDailySales(salesChartData);
    setTopProducts(topProductsData);
    setLoading(false);
  };

  if (loading) return <div className="text-white">Yükleniyor...</div>;

  const maxSale = Math.max(...dailySales.map(d => d.total), 100);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Raporlar & Analiz</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Sales Chart */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Son 7 Gün Satış
            </h2>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {dailySales.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">Veri yok</div>
            ) : (
                dailySales.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex items-end justify-center h-full">
                        <div 
                            className="w-full max-w-10 bg-green-600/20 border-t border-x border-green-600/50 rounded-t-sm hover:bg-green-600/40 transition-all relative group-hover:shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                            style={{ height: `${(day.total / maxSale) * 100}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                                {day.total.toFixed(2)} ₺
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-zinc-500 mt-2">{day.date}</span>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <BarChart3 className="mr-2 text-blue-500" size={20} />
              Çok Satan Ürünler
            </h2>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">Veri yok</div>
            ) : (
                topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">
                        {index + 1}
                    </div>
                    <span className="text-white font-medium">{product.name}</span>
                    </div>
                    <span className="text-zinc-400">{product.quantity} Adet</span>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
