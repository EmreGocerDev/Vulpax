'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[] | null;
}

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlanIds, setActivePlanIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchActiveOrders();
    }
  }, [user]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (data) {
      setPlans(data as any);
    }
    setLoading(false);
  };

  const fetchActiveOrders = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('orders')
      .select('plan_id, status, expiry_date')
      .eq('user_id', user.id)
      .in('status', ['success', 'pending']); // Fetch both success and pending
    
    if (data) {
      // Filter active or pending plans
      const activeIds = data
        .filter((order: any) => {
          if (order.status === 'pending') return true; // Block if pending
          if (order.status === 'success') {
            // If no expiry date, assume active (or handle as needed)
            if (!order.expiry_date) return true;
            return new Date(order.expiry_date) > new Date();
          }
          return false;
        })
        .map((order: any) => order.plan_id);

      setActivePlanIds(activeIds);
    }
  };

  const handlePurchase = async (plan: Plan) => {
    if (!user) {
      router.push('/login'); // Or open login modal
      return;
    }

    if (activePlanIds.length > 0) return; // Prevent purchase if ANY plan is active

    setProcessingId(plan.id);

    try {
      // 1. Create Order
      const merchant_oid = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const { error } = await supabase
        .from('orders')
        .insert({
          merchant_oid,
          user_id: user.id,
          plan_id: plan.id,
          amount: plan.price,
          status: 'pending'
        });

      if (error) throw error;

      // 2. Redirect to Payment
      router.push(`/odeme?oid=${merchant_oid}&amount=${plan.price}&type=plan`);

    } catch (error) {
      console.error('Purchase error:', error);
      alert('Satın alma işlemi başlatılamadı.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-white">Yükleniyor...</div>;
  }

  const filteredPlans = plans.filter(p => p.interval === billingInterval);
  const hasAnyActivePlan = activePlanIds.length > 0;

  return (
    <section id="pricing" className="py-20 relative">
       {/* SVG Filters */}
       <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="unopaq1" y="-100%" height="300%" x="-100%" width="300%">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 5 0"></feColorMatrix>
        </filter>
      </svg>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fiyatlarımız</h2>
          <p className="text-lg text-gray-400 mb-8">İşletmeniz için en uygun paketi seçin</p>
          
          {/* Billing Interval Toggle */}
          <div className="inline-flex bg-zinc-900/80 backdrop-blur-sm p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingInterval === 'monthly' 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingInterval === 'yearly' 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yıllık <span className="text-xs text-green-400 ml-1">(2 Ay Bedava)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPlans.map((plan, index) => {
            const isOwned = activePlanIds.includes(plan.id);
            const isRecommended = index === 1; // Middle plan recommended

            return (
              <div key={plan.id} className="relative group">
                {/* Outer glow */}
                <div className={`absolute -inset-4 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-90 transition-opacity duration-300 ${isRecommended ? 'opacity-60' : ''}`}></div>
                
                {/* Glass card */}
                <div className={`relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border ${isRecommended ? 'border-2 border-[#BAFFFF]/40' : 'border-[#BAFFFF]/20'} group-hover:border-[#BAFFFF]/50 rounded-xl p-8 transition-all duration-300 h-full flex flex-col`}>
                  
                  {isRecommended && (
                    <div className="absolute top-4 right-4 bg-[#BAFFFF]/20 backdrop-blur-sm border border-[#BAFFFF]/50 text-white px-3 py-1 text-xs font-bold rounded">ÖNERİLEN</div>
                  )}

                  <div className="pricing-header">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="pricing-price">
                      <span className="text-3xl font-bold text-white">₺</span>
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 text-sm">/{plan.interval === 'yearly' ? 'yıl' : 'ay'}</span>
                    </div>
                    {plan.description && <p className="text-gray-400 text-sm mt-2">{plan.description}</p>}
                  </div>

                  <div className="pricing-content flex-1 flex flex-col">
                    <ul className="pricing-features flex-1 my-6 space-y-3">
                      {plan.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                          <svg className="w-5 h-5 text-[#BAFFFF] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => handlePurchase(plan)}
                      disabled={hasAnyActivePlan || processingId === plan.id}
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg 
                        ${hasAnyActivePlan 
                          ? 'bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#0a0f1a]/90 via-[#1a1f2e]/80 to-[#0a0f1a]/90 backdrop-blur-xl border border-[#BAFFFF]/30 hover:border-[#BAFFFF]/60 text-white shadow-[#BAFFFF]/20 hover:shadow-[#BAFFFF]/40'
                        }`}
                    >
                      {isOwned ? 'Satın Alındı' : hasAnyActivePlan ? 'Mevcut Planınız Var' : processingId === plan.id ? 'İşleniyor...' : 'Hemen Başla'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
