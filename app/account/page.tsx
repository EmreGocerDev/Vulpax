import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, LogOut, User as UserIcon, MapPin } from 'lucide-react';

export default async function AccountPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .in('payment_status', ['paid', 'failed', 'refunded'])
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="neon-glass-island p-6 space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 bg-primary-500/10 text-primary-400 rounded-lg"
              >
                <UserIcon className="w-5 h-5" />
                <span>Genel Bakış</span>
              </Link>
              <Link
                href="/account/profile"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profil Bilgilerim</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <Package className="w-5 h-5" />
                <span>Siparişlerim</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-4 py-3 text-dark-600 hover:text-white hover:bg-gray-900 rounded-lg transition"
              >
                <MapPin className="w-5 h-5" />
                <span>Adreslerim</span>
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-900 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </form>
            </div>

            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="block mt-4 bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-lg font-semibold transition"
              >
                Admin Paneli
              </Link>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Info */}
            <div className="neon-glass-island p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Profil Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-600 mb-1">Ad Soyad</label>
                  <p className="text-white">{profile?.full_name || 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <label className="block text-sm text-dark-600 mb-1">E-posta</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-dark-600 mb-1">Telefon</label>
                  <p className="text-white">{profile?.phone || 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <label className="block text-sm text-dark-600 mb-1">Rol</label>
                  <p className="text-white capitalize">{profile?.role || 'customer'}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="neon-glass-island p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Son Siparişler</h2>
                <Link
                  href="/account/orders"
                  className="text-primary-400 hover:text-primary-300 text-sm transition"
                >
                  Tümünü Gör
                </Link>
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-800 rounded-lg p-4 hover:border-primary-500 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">
                            {order.order_number}
                          </p>
                          <p className="text-dark-600 text-sm">
                            {new Date(order.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {order.total_amount.toFixed(2)} {order.currency}
                          </p>
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-600 text-center py-8">
                  Henüz siparişiniz bulunmuyor.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
