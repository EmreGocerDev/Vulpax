'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Calendar, DollarSign, FileText, Search, Filter } from 'lucide-react';
import ReceiptModal from '../pos/ReceiptModal';

interface Sale {
  id: string;
  created_at: string;
  final_amount: number;
  payment_method: string;
  customer?: { name: string };
  items: any[];
  discount_amount: number;
  total_amount: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dailySales, setDailySales] = useState<{date: string, total: number}[]>([]);
  const [topProducts, setTopProducts] = useState<{name: string, quantity: number}[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const fetchReports = async () => {
    setLoading(true);
    
    // 1. Fetch Sales for the selected period
    const { data: salesData, error } = await supabase
      .from('market_sales')
      .select(`
        *,
        customer:market_customers(name),
        items:market_sale_items(
          quantity,
          unit_price,
          total_price,
          product:market_products(name)
        )
      `)
      .gte('created_at', `${startDate}T00:00:00`)
      .lte('created_at', `${endDate}T23:59:59`)
      .order('created_at', { ascending: false });

    if (salesData) {
      setSales(salesData as any);

      // Process Daily Sales Chart
      const salesMap = new Map<string, number>();
      salesData.forEach((sale: any) => {
        const date = new Date(sale.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        salesMap.set(date, (salesMap.get(date) || 0) + Number(sale.final_amount));
      });
      const salesChartData = Array.from(salesMap.entries()).map(([date, total]) => ({ date, total })).reverse(); // Reverse to show chronological order if needed, but map iteration order is insertion order usually. Let's sort.
      
      // Sort by date is tricky with just "11 Dec" string. 
      // Better to iterate through the date range and fill.
      // For simplicity, let's just use what we have but maybe sort by date object if we had it.
      // Let's just keep it simple for now.
      setDailySales(salesChartData);

      // Process Top Products
      const productMap = new Map<string, number>();
      salesData.forEach((sale: any) => {
        sale.items?.forEach((item: any) => {
          const name = item.product?.name || 'Bilinmeyen';
          productMap.set(name, (productMap.get(name) || 0) + Number(item.quantity));
        });
      });

      const topProductsData = Array.from(productMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));
      
      setTopProducts(topProductsData);
    }
    
    setLoading(false);
  };

  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setIsReceiptOpen(true);
  };

  const maxSale = dailySales.length > 0 ? Math.max(...dailySales.map(d => d.total), 100) : 100;

  // Calculate totals for the period
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.final_amount, 0);
  const totalTransactions = sales.length;
  const averageBasket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Raporlar & Analiz</h1>
        
        <div className="flex items-center space-x-2 bg-zinc-900 p-2 rounded-lg border border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-zinc-400" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-white text-sm outline-none"
            />
          </div>
          <span className="text-zinc-600">-</span>
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-white text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-400 text-sm font-medium">Toplam Ciro</h3>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{totalRevenue.toFixed(2)} ₺</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-400 text-sm font-medium">İşlem Sayısı</h3>
            <FileText className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{totalTransactions}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-400 text-sm font-medium">Ortalama Sepet</h3>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{averageBasket.toFixed(2)} ₺</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Sales Chart */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Günlük Satış Grafiği
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
                    <span className="text-xs text-zinc-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{day.date}</span>
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

      {/* Transactions Table */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">İşlem Geçmişi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-200 font-medium">
              <tr>
                <th className="px-6 py-3">Tarih</th>
                <th className="px-6 py-3">Müşteri</th>
                <th className="px-6 py-3">Ödeme Tipi</th>
                <th className="px-6 py-3">Tutar</th>
                <th className="px-6 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {new Date(sale.created_at).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    {sale.customer?.name || 'Misafir'}
                  </td>
                  <td className="px-6 py-4">
                    {sale.payment_method === 'cash' ? 'Nakit' : sale.payment_method === 'credit_card' ? 'Kredi Kartı' : 'Veresiye'}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {sale.final_amount.toFixed(2)} ₺
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewReceipt(sale)}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Fiş Görüntüle
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    Seçilen tarih aralığında işlem bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedSale && (
        <ReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          data={{
            id: selectedSale.id,
            date: new Date(selectedSale.created_at),
            items: selectedSale.items.map((item: any) => ({
              name: item.product?.name || 'Ürün',
              quantity: item.quantity,
              price: item.unit_price,
              total: item.total_price
            })),
            subtotal: selectedSale.final_amount / 1.18,
            tax: selectedSale.final_amount - (selectedSale.final_amount / 1.18),
            total: selectedSale.final_amount,
            paymentMethod: selectedSale.payment_method,
            customerName: selectedSale.customer?.name
          }}
        />
      )}
    </div>
  );
}
