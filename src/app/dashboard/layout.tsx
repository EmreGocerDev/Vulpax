'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;

      try {
        // 1. Check profile flag
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('has_market_access')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        if (profileData?.has_market_access) {
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }

        // 2. Check active orders if profile flag is false
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, expiry_date')
          .eq('user_id', user.id)
          .eq('status', 'success');

        if (ordersError) throw ordersError;

        // Check if any order is active (expiry_date > now OR expiry_date is null/lifetime)
        const hasActiveOrder = ordersData?.some(order => {
            if (!order.expiry_date) return true; // Lifetime
            return new Date(order.expiry_date) > new Date();
        });

        if (hasActiveOrder) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
            router.push('/magaza');
        }

      } catch (error) {
        console.error('Error checking market access:', error);
        setHasAccess(false);
        router.push('/magaza');
      } finally {
        setCheckingAccess(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/dashboard/market');
      } else {
        checkAccess();
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || checkingAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
