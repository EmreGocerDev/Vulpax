"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[] | null;
  is_active: boolean;
  interval: 'monthly' | 'yearly';
}

export default function PlansAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState("monthly");
  const [features, setFeatures] = useState(""); // Newline separated

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    } else if (user) {
      fetchPlans();
    }
  }, [user, authLoading, router]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data as any || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const featureArray = features.split('\n').filter(f => f.trim() !== '');
    const planData = {
      name,
      description,
      price: parseFloat(price),
      interval,
      features: featureArray,
    };

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update(planData)
          .eq('id', editingPlan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plans')
          .insert([planData]);
        if (error) throw error;
      }

      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Plan kaydedilirken bir hata oluştu.');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || "");
    setPrice(plan.price.toString());
    setInterval(plan.interval || "monthly");
    setFeatures(plan.features ? plan.features.join('\n') : "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu planı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Plan silinirken bir hata oluştu.');
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setName("");
    setDescription("");
    setPrice("");
    setInterval("monthly");
    setFeatures("");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Plan Yönetimi</h1>
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
            &larr; Panele Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg sticky top-32">
              <h2 className="text-xl font-bold mb-4">
                {editingPlan ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Plan Adı</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Fiyat (TL)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Periyot</label>
                  <select
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
                  >
                    <option value="monthly">Aylık</option>
                    <option value="yearly">Yıllık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Özellikler (Her satıra bir özellik)</label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white h-40"
                    placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition-colors"
                  >
                    {editingPlan ? 'GÜNCELLE' : 'EKLE'}
                  </button>
                  {editingPlan && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded transition-colors"
                    >
                      İPTAL
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-sm">
                        {plan.price.toLocaleString('tr-TR')} TL / {plan.interval === 'yearly' ? 'Yıl' : 'Ay'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-3">{plan.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.features?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-zinc-800/50 border border-zinc-700 px-2 py-1 rounded text-zinc-300">
                          {feature}
                        </span>
                      ))}
                      {(plan.features?.length ?? 0) > 3 && (
                        <span className="text-xs text-zinc-500 py-1">+{(plan.features?.length ?? 0) - 3} özellik daha</span>
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 px-4 py-2 rounded transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 px-4 py-2 rounded transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}

              {plans.length === 0 && (
                <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
                  Henüz plan eklenmemiş.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
