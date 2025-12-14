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
  Truck,
  ChevronLeft,
  ChevronRight,
  Menu
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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 text-white rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            isOpen ? "w-auto opacity-100" : "w-0 opacity-0 md:w-0"
          )}>
            <h1 className="text-xl font-bold text-white logo-font leading-none">
              VULPA<span className="text-red-600">X</span>
            </h1>
            <p className="text-[10px] text-zinc-400 leading-none tracking-widest mt-1">MARKET</p>
          </div>
          
          {/* Desktop Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors",
              !isOpen && "mx-auto"
            )}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap group relative",
                  isActive 
                    ? "bg-red-600/10 text-red-500 border border-red-600/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5",
                  !isOpen && "justify-center px-2"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={cn(
                  "font-medium transition-all duration-300 overflow-hidden",
                  isOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 ml-0"
                )}>
                  {item.title}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden md:block border border-zinc-700 shadow-xl">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link 
              href="/"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap group relative",
                !isOpen && "justify-center px-2"
              )}
          >
              <LogOut size={20} className="shrink-0" />
              <span className={cn(
                "font-medium transition-all duration-300 overflow-hidden",
                isOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 ml-0"
              )}>
                Çıkış Yap
              </span>

              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden md:block border border-zinc-700 shadow-xl">
                  Çıkış Yap
                </div>
              )}
          </Link>
        </div>
      </div>
    </>
  );
}
