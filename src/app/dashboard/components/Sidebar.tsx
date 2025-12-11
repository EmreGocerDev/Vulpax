'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ArrowRightLeft, 
  Users, 
  Settings,
  LogOut,
  BarChart3,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Genel Bakış',
    href: '/dashboard/market',
    icon: LayoutDashboard
  },
  {
    title: 'POS (Kasa)',
    href: '/dashboard/market/pos',
    icon: ShoppingCart
  },
  {
    title: 'Ürün Yönetimi',
    href: '/dashboard/market/products',
    icon: Package
  },
  {
    title: 'Stok Girişi',
    href: '/dashboard/market/stock/entry',
    icon: Truck
  },
  {
    title: 'Stok Hareketleri',
    href: '/dashboard/market/stock',
    icon: ArrowRightLeft
  },
  {
    title: 'Cari Hesaplar',
    href: '/dashboard/market/accounts',
    icon: Users
  },
  {
    title: 'Raporlar',
    href: '/dashboard/market/reports',
    icon: BarChart3
  },
  {
    title: 'Ayarlar',
    href: '/dashboard/market/settings',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white logo-font leading-none">
          VULPA<span className="text-red-600">X</span>
        </h1>
        <p className="text-[10px] text-zinc-400 leading-none tracking-widest mt-1">MARKET</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-red-600/10 text-red-500 border border-red-600/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link 
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
            <LogOut size={20} />
            <span className="font-medium">Çıkış Yap</span>
        </Link>
      </div>
    </div>
  );
}
