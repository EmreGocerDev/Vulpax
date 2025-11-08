"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../../components/UserMenu";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Application {
  id: string;
  title: string;
  description: string;
  version: string;
  category_id: string;
  categories: Category;
  is_active: boolean;
  download_count: number;
  file_size: number;
  download_url: string;
  created_at: string;
}

export default function ApplicationsAdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [features, setFeatures] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchApplications();
    }
  }, [user]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false });

    if (data) setApplications(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      // Handle image upload if file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `app-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('application-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          alert("Resim yüklenemedi: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('application-images')
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      const featuresArray = features
        .split('\n')
        .filter(f => f.trim())
        .map(f => f.trim());

      const { error } = await supabase
        .from('applications')
        .insert({
          title,
          description,
          version,
          category_id: categoryId,
          file_size: parseInt(fileSize),
          download_url: downloadUrl,
          image_url: finalImageUrl || null,
          image_path: imageFile ? finalImageUrl : null,
          features: featuresArray,
          requirements: requirements || null,
          author_id: user.id,
          is_active: true,
          download_count: 0
        });

      if (error) {
        alert("Hata: " + error.message);
      } else {
        alert("Uygulama başarıyla eklendi!");
        setShowAddModal(false);
        resetForm();
        fetchApplications();
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
    setVersion("");
    setCategoryId("");
    setFileSize("");
    setDownloadUrl("");
    setImageFile(null);
    setImageUrl("");
    setFeatures("");
    setRequirements("");
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('applications')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    fetchApplications();
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Bu uygulamayı silmek istediğinizden emin misiniz?")) return;

    await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    fetchApplications();
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
            <h1 className="text-3xl font-bold mb-2">Uygulama Yönetimi</h1>
            <p className="text-zinc-400">Tüm uygulamalar</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Uygulama
          </button>
        </div>

        {/* Applications Table */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Uygulama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Versiyon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">İndirme</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Henüz uygulama eklenmemiş
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{app.title}</div>
                      <div className="text-sm text-zinc-400 line-clamp-1">{app.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{app.categories.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{app.version}</td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{app.download_count}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(app.id, app.is_active)}
                        className={`px-3 py-1 text-xs font-semibold ${
                          app.is_active
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-red-900/50 text-red-400 border border-red-700'
                        }`}
                      >
                        {app.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteApp(app.id)}
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
              <h2 className="text-2xl font-bold">Yeni Uygulama Ekle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Uygulama Adı *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                    placeholder="Örn: VulpaxCRM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Versiyon *
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                    placeholder="Örn: 1.0.0"
                  />
                </div>
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
                  placeholder="Uygulamanızı kısaca açıklayın"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  >
                    <option value="">Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Dosya Boyutu (bytes) *
                  </label>
                  <input
                    type="number"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                    placeholder="Örn: 52428800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  İndirme URL *
                </label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="https://example.com/download/app.zip"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Uygulama Resmi
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImageUrl("");
                    }
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Özellikler (Her satıra bir özellik)
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none font-mono text-sm"
                  placeholder="Modern arayüz&#10;Hızlı performans"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Sistem Gereksinimleri
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Windows 10 veya üzeri"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Uygulama Ekle'}
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
