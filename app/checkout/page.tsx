'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { CreditCard, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || '',
            email: user.email || '',
            phone: profile.phone || '',
          }));
        }
      }
    };
    getUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }

    if (!user) {
      toast.error('Lütfen giriş yapın');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Ensure user profile exists (important for OAuth users)
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: formData.fullName || user.user_metadata?.full_name || '',
            role: 'customer',
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('Kullanıcı profili oluşturulamadı. Lütfen tekrar giriş yapın.');
          return;
        }
      }

      const total = getTotalPrice();

      // Create order
      const orderNumber = generateOrderNumber();
      
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'credit_card',
          subtotal: total,
          shipping_cost: 0,
          total_amount: total,
          shipping_address: formData,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create PayTR payment
      const response = await fetch('/api/payment/paytr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: orderNumber,
          amount: total,
          userEmail: formData.email,
          userName: formData.fullName,
          userPhone: formData.phone,
          userAddress: `${formData.address}, ${formData.district}, ${formData.city}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('API boş yanıt döndü');
      }

      const paymentData = JSON.parse(text);

      if (paymentData.status === 'success' && paymentData.token) {
        // Show payment iframe
        setPaymentToken(paymentData.token);
        setLoading(false);
      } else {
        throw new Error(paymentData.reason || 'Ödeme başlatılamadı');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Bir hata oluştu');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold text-white mb-4">Sepetiniz Boş</h1>
            <p className="text-dark-600 mb-8">
              Ödeme yapabilmek için sepetinize ürün eklemelisiniz.
            </p>
            <a
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition"
            >
              Alışverişe Başla
            </a>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();

  // Payment iframe modal
  if (paymentToken) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-gray-950 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Güvenli Ödeme</h2>
            <button
              onClick={() => {
                setPaymentToken(null);
                router.push('/cart');
              }}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${paymentToken}`}
            className="w-full h-[600px]"
            frameBorder="0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Ödeme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="neon-glass-island p-6">
                <h2 className="text-xl font-bold text-white mb-6">İletişim Bilgileri</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Adres *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        İl *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-800 text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Ödemeye Geç
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="neon-glass-island p-6 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="text-white">
                      {item.quantity}x {item.name}
                    </div>
                    <div className="ml-auto text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Toplam</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
