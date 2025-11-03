"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
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
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [features, setFeatures] = useState("");
  const [requirements, setRequirements] = useState("");

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCategories();
      fetchApplications();
    }
  }, [isAuthenticated, user]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456") {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert("Yanlış şifre!");
    }
  };

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
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('author_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setApplications(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    let imagePath = imageUrl;

    // Resim upload varsa
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('application-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Resim yükleme hatası:", uploadError);
        alert("Resim yüklenemedi. Storage bucket oluşturulmamış olabilir. Şimdilik URL kullanın veya bucket oluşturun.");
        setLoading(false);
        return;
      }

      // Public URL al
      const { data: urlData } = supabase.storage
        .from('application-images')
        .getPublicUrl(filePath);

      imagePath = urlData.publicUrl;
    }

    const featuresArray = features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const { error } = await supabase
      .from('applications')
      .insert({
        title,
        description,
        version,
        category_id: categoryId,
        download_url: downloadUrl,
        file_size: parseInt(fileSize) || 0,
        image_url: imagePath || null,
        features: featuresArray,
        requirements,
        author_id: user.id,
        is_active: true
      });

    if (!error) {
      // Reset form
      setTitle("");
      setDescription("");
      setVersion("");
      setCategoryId("");
      setDownloadUrl("");
      setFileSize("");
      setImageUrl("");
      setImageFile(null);
      setFeatures("");
      setRequirements("");
      setShowAddModal(false);
      fetchApplications();
    } else {
      alert("Hata: " + error.message);
    }

    setLoading(false);
  };

  const toggleActive = async (appId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('applications')
      .update({ is_active: !currentStatus })
      .eq('id', appId);

    if (!error) {
      fetchApplications();
    }
  };

  const deleteApp = async (appId: string) => {
    if (!confirm("Bu uygulamayı silmek istediğinizden emin misiniz?")) return;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', appId);

    if (!error) {
      fetchApplications();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Giriş Gerekli</h1>
          <p className="text-zinc-400 mb-8">
            Admin paneline erişmek için giriş yapmanız gerekiyor.
          </p>
          <Link
            href="/"
            className="bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-700 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Image
              src="/logo.png"
              alt="Vulpax Software"
              width={60}
              height={60}
              className="mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Editör Modu</h1>
            <p className="text-zinc-400 text-sm">Admin şifresini girin</p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition-colors"
            >
              Giriş Yap
            </button>
          </form>

          <Link
            href="/"
            className="block text-center text-zinc-400 text-sm mt-4 hover:text-white"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Software"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">ADMIN PANEL</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/uygulamalar"
                className="text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Uygulamalar
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
            <p className="text-zinc-400">Yeni uygulama ekleyin veya mevcut uygulamaları yönetin</p>
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

      {/* Add Application Modal */}
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

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    placeholder="Örn: 52428800 (50MB)"
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
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImageUrl(""); // URL'yi temizle
                      }
                    }}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white file:cursor-pointer hover:file:bg-zinc-600"
                  />
                  {imageFile && (
                    <div className="text-sm text-zinc-400">
                      Seçili: {imageFile.name}
                    </div>
                  )}
                  <div className="text-xs text-zinc-500">
                    veya URL gir:
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null); // Dosyayı temizle
                    }}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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
                  placeholder="Modern arayüz&#10;Hızlı performans&#10;Kolay kullanım"
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
                  placeholder="Windows 10 veya üzeri&#10;4GB RAM&#10;500MB disk alanı"
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
