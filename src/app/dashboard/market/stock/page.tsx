'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRightLeft, ArrowDown, ArrowUp, AlertTriangle, Filter } from 'lucide-react';

interface StockMovement {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT' | 'WASTE' | 'COUNT_SURPLUS' | 'SALE' | 'RETURN';
  quantity: number;
  description: string | null;
  created_at: string;
  product: {
    name: string;
    barcode: string;
  };
}

export default function StockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchMovements();
  }, [filterType]);

  const fetchMovements = async () => {
    setLoading(true);
    let query = supabase
      .from('market_stock_movements')
      .select(`
        *,
        product:market_products (name, barcode)
      `)
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (filterType !== 'ALL') {
      query = query.eq('type', filterType);
    }

    const { data, error } = await query;
    
    if (data) {
      setMovements(data as unknown as StockMovement[]);
    }
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IN':
      case 'COUNT_SURPLUS':
      case 'RETURN':
        return <ArrowDown className="text-green-500" size={20} />;
      case 'OUT':
      case 'SALE':
        return <ArrowUp className="text-blue-500" size={20} />;
      case 'WASTE':
        return <AlertTriangle className="text-red-500" size={20} />;
      default:
        return <ArrowRightLeft className="text-zinc-500" size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'IN': 'Stok Girişi',
      'OUT': 'Stok Çıkışı',
      'WASTE': 'Zayi / Fire',
      'COUNT_SURPLUS': 'Sayım Fazlası',
      'SALE': 'Satış',
      'RETURN': 'İade'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Stok Hareketleri</h1>
        <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-lg border border-white/10">
            <Filter size={16} className="text-zinc-400 ml-2" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-sm text-white p-2 outline-none"
            >
              <option value="ALL">Tüm Hareketler</option>
              <option value="SALE">Satışlar</option>
              <option value="IN">Stok Girişleri</option>
              <option value="WASTE">Zayi / Fire</option>
              <option value="RETURN">İadeler</option>
            </select>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-white/5 text-zinc-200 font-medium">
              <tr>
                <th className="px-6 py-3">Tarih</th>
                <th className="px-6 py-3">İşlem Tipi</th>
                <th className="px-6 py-3">Ürün</th>
                <th className="px-6 py-3">Miktar</th>
                <th className="px-6 py-3">Açıklama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Yükleniyor...</td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">Kayıt bulunamadı.</td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {new Date(movement.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(movement.type)}
                        <span className="text-white">{getTypeLabel(movement.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{movement.product?.name || 'Silinmiş Ürün'}</div>
                      <div className="text-xs">{movement.product?.barcode}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4">
                      {movement.description || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
