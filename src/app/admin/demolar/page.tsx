"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../../components/UserMenu";
import { supabase } from "@/lib/supabase";

interface Demo {
  id: string;
  title: string;
  description: string;
  demo_url: string;
  preview_image_url: string | null;
  preview_image_path: string | null;
  is_active: boolean;
  created_at: string;
}

export default function DemosAdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [demos, setDemos] = useState<Demo[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDemos();
    }
  }, [user]);

  const fetchDemos = async () => {
    const { data } = await supabase
      .from('demos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setDemos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let previewImageUrl = null;
      let previewImagePath = null;

      // Handle image upload if file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `demo-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('demo-previews')
          .upload(filePath, imageFile);

        if (uploadError) {
          alert("Resim yüklenemedi: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('demo-previews')
          .getPublicUrl(filePath);

        previewImageUrl = urlData.publicUrl;
        previewImagePath = filePath;
      }

      const { error } = await supabase
        .from('demos')
        // @ts-ignore
        .insert({
          title,
          description,
          demo_url: demoUrl,
          preview_image_url: previewImageUrl,
          preview_image_path: previewImagePath,
          author_id: user.id,
          is_active: true
        });

      if (error) {
        alert("Hata: " + error.message);
      } else {
        alert("Demo başarıyla eklendi!");
        setShowAddModal(false);
        resetForm();
        fetchDemos();
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDemoUrl("");
    setImageFile(null);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('demos')
      // @ts-ignore
      .update({ is_active: !currentStatus })
      .eq('id', id);

    fetchDemos();
  };

  const deleteDemo = async (id: string) => {
    if (!confirm("Bu demoyu silmek istediğinizden emin misiniz?")) return;

    await supabase
      .from('demos')
      .delete()
      .eq('id', id);

    fetchDemos();
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tighter">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">ADMIN PANEL</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Dashboard
              </Link>
              <UserMenu user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Demo Yönetimi</h1>
            <p className="text-zinc-400">Tüm demolar</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Demo
          </button>
        </div>

        {/* Demos Table */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Demo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {demos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Henüz demo eklenmemiş
                  </td>
                </tr>
              ) : (
                demos.map((demo) => (
                  <tr key={demo.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{demo.title}</div>
                      <div className="text-sm text-zinc-400 line-clamp-1">{demo.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={demo.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                      >
                        {demo.demo_url.substring(0, 40)}...
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(demo.id, demo.is_active)}
                        className={`px-3 py-1 text-xs font-semibold ${
                          demo.is_active
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-red-900/50 text-red-400 border border-red-700'
                        }`}
                      >
                        {demo.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteDemo(demo.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 max-w-3xl w-full my-8">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Yeni Demo Ekle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Demo Başlığı *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Örn: E-Ticaret Demo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Demo hakkında kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Demo URL *
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Önizleme Resmi
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                    }
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Demo Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
