"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../../components/UserMenu";
import { supabase } from "@/lib/supabase";

interface ReferenceImage {
  id: string;
  reference_id: string;
  image_url: string;
  display_order: number;
}

interface Reference {
  id: string;
  company_name: string;
  logo_url: string | null;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  reference_images?: ReferenceImage[];
}

export default function ReferencesAdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [references, setReferences] = useState<Reference[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReferences();
    }
  }, [user]);

  const fetchReferences = async () => {
    const { data } = await supabase
      .from('references')
      .select(`
        *,
        reference_images(*)
      `)
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) setReferences(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let logoUrl = null;

      // Handle logo upload if file selected
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('references')
          .upload(filePath, logoFile);

        if (uploadError) {
          alert("Logo yüklenemedi: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('references')
          .getPublicUrl(filePath);

        logoUrl = urlData.publicUrl;
      }

      // Insert reference
      const { data: refData, error: refError } = await supabase
        .from('references')
        .insert({
          company_name: companyName,
          description,
          logo_url: logoUrl,
          display_order: parseInt(displayOrder),
          is_active: true
        })
        .select()
        .single();

      if (refError) {
        alert("Hata: " + refError.message);
        setLoading(false);
        return;
      }

      // Handle banner images upload (max 5)
      if (bannerFiles.length > 0 && refData) {
        const bannersToUpload = bannerFiles.slice(0, 5); // Max 5 images
        
        for (let i = 0; i < bannersToUpload.length; i++) {
          const file = bannersToUpload[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `banner-${refData.id}-${i}-${Date.now()}.${fileExt}`;
          const filePath = `banners/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('references')
            .upload(filePath, file);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('references')
              .getPublicUrl(filePath);

            await supabase
              .from('reference_images')
              .insert({
                reference_id: refData.id,
                image_url: urlData.publicUrl,
                display_order: i
              });
          }
        }
      }

      alert("Referans başarıyla eklendi!");
      setShowAddModal(false);
      resetForm();
      fetchReferences();
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setCompanyName("");
    setDescription("");
    setDisplayOrder("0");
    setLogoFile(null);
    setBannerFiles([]);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('references')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    fetchReferences();
  };

  const deleteReference = async (id: string) => {
    if (!confirm("Bu referansı silmek istediğinizden emin misiniz?")) return;

    await supabase
      .from('references')
      .delete()
      .eq('id', id);

    fetchReferences();
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
            <h1 className="text-3xl font-bold mb-2">Referans Yönetimi</h1>
            <p className="text-zinc-400">Tüm referanslar</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Referans
          </button>
        </div>

        {/* References Table */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Şirket</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Açıklama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Banner Sayısı</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Sıra</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {references.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Henüz referans eklenmemiş
                  </td>
                </tr>
              ) : (
                references.map((ref) => (
                  <tr key={ref.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{ref.company_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-400 line-clamp-2">{ref.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {ref.reference_images?.length || 0} görsel
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{ref.display_order}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(ref.id, ref.is_active)}
                        className={`px-3 py-1 text-xs font-semibold ${
                          ref.is_active
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-red-900/50 text-red-400 border border-red-700'
                        }`}
                      >
                        {ref.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteReference(ref.id)}
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
              <h2 className="text-2xl font-bold">Yeni Referans Ekle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Örn: ABC Teknoloji"
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
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Proje veya iş birliği hakkında açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Görüntüleme Sırası
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="0"
                />
                <p className="text-xs text-zinc-500 mt-1">Yüksek değerler önce görüntülenir</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Şirket Logosu
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoFile(file);
                    }
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Banner Görseller (16:9 oran, max 5 adet)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setBannerFiles(files.slice(0, 5));
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white"
                />
                {bannerFiles.length > 0 && (
                  <p className="text-xs text-zinc-400 mt-1">
                    {bannerFiles.length} görsel seçildi
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Referans Ekle'}
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
