import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, Users, Settings, BarChart3 } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 text-white bg-primary-500/10 rounded-lg"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <Package className="w-5 h-5" />
                <span>Ürünler</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Kategoriler</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Siparişler</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <Users className="w-5 h-5" />
                <span>Kullanıcılar</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <Settings className="w-5 h-5" />
                <span>Ayarlar</span>
              </Link>
            </nav>
            <Link
              href="/"
              className="block mt-6 text-center text-primary-400 hover:text-primary-300 transition"
            >
              ← Ana Siteye Dön
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
