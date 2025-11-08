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

interface Reference {
  id: string;
  company_name: string;
  logo_url: string | null;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface ReferenceImage {
  id: string;
  reference_id: string;
  image_url: string;
  display_order: number;
}

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  
  // Admin user ID
  const ADMIN_USER_ID = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911';
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // References states
  const [references, setReferences] = useState<Reference[]>([]);
  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [refLoading, setRefLoading] = useState(false);

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

  // Reference form states
  const [refCompanyName, setRefCompanyName] = useState("");
  const [refDescription, setRefDescription] = useState("");
  const [refLogoFile, setRefLogoFile] = useState<File | null>(null);
  const [refLogoUrl, setRefLogoUrl] = useState("");
  const [refBannerFiles, setRefBannerFiles] = useState<File[]>([]);
  const [refDisplayOrder, setRefDisplayOrder] = useState(0);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user is admin
      if (user.id !== ADMIN_USER_ID) {
        alert('Bu sayfaya erişim yetkiniz yok.');
        router.push('/');
        return;
      }
      
      fetchCategories();
      fetchApplications();
      fetchReferences();
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

  // ========== REFERENCES MANAGEMENT ==========
  
  const fetchReferences = async () => {
    const { data } = await supabase
      .from('references')
      .select('*')
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) setReferences(data);
  };

  const handleRefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setRefLoading(true);

    try {
      let logoPath = refLogoUrl;

      // Logo upload
      if (refLogoFile) {
        const fileExt = refLogoFile.name.split('.').pop();
        const fileName = `logo-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reference-banners')
          .upload(filePath, refLogoFile);

        if (uploadError) {
          console.error("Logo upload error:", uploadError);
          alert("Logo yüklenemedi: " + uploadError.message);
          setRefLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('reference-banners')
          .getPublicUrl(filePath);

        logoPath = urlData.publicUrl;
      }

      // Insert reference
      const { data: refData, error: refError } = await supabase
        .from('references')
        .insert({
          company_name: refCompanyName,
          logo_url: logoPath || null,
          description: refDescription,
          is_active: true,
          display_order: refDisplayOrder
        })
        .select()
        .single();

      if (refError) {
        alert("Referans eklenirken hata: " + refError.message);
        setRefLoading(false);
        return;
      }

      // Upload banner images (max 5)
      if (refBannerFiles.length > 0) {
        const bannerUploads = refBannerFiles.slice(0, 5).map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `banner-${refData.id}-${index}-${Date.now()}.${fileExt}`;
          const filePath = `banners/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('reference-banners')
            .upload(filePath, file);

          if (uploadError) {
            console.error("Banner upload error:", uploadError);
            return null;
          }

          const { data: urlData } = supabase.storage
            .from('reference-banners')
            .getPublicUrl(filePath);

          return {
            reference_id: refData.id,
            image_url: urlData.publicUrl,
            display_order: index
          };
        });

        const uploadedBanners = (await Promise.all(bannerUploads)).filter(b => b !== null);

        if (uploadedBanners.length > 0) {
          await supabase
            .from('reference_images')
            .insert(uploadedBanners);
        }
      }

      // Reset form
      setRefCompanyName("");
      setRefDescription("");
      setRefLogoFile(null);
      setRefLogoUrl("");
      setRefBannerFiles([]);
      setRefDisplayOrder(0);
      setShowAddRefModal(false);
      fetchReferences();
      alert("Referans başarıyla eklendi!");

    } catch (error: any) {
      console.error("Error:", error);
      alert("Hata oluştu: " + error.message);
    }

    setRefLoading(false);
  };

  const toggleRefActive = async (refId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('references')
      .update({ is_active: !currentStatus })
      .eq('id', refId);

    if (!error) {
      fetchReferences();
    }
  };

  const deleteReference = async (refId: string) => {
    if (!confirm("Bu referansı silmek istediğinizden emin misiniz? Tüm görseller de silinecek.")) return;

    // First delete images from storage
    const { data: images } = await supabase
      .from('reference_images')
      .select('image_url')
      .eq('reference_id', refId);

    if (images) {
      for (const img of images) {
        const path = img.image_url.split('/reference-banners/')[1];
        if (path) {
          await supabase.storage
            .from('reference-banners')
            .remove([path]);
        }
      }
    }

    // Delete logo from storage
    const reference = references.find(r => r.id === refId);
    if (reference?.logo_url) {
      const logoPath = reference.logo_url.split('/reference-banners/')[1];
      if (logoPath) {
        await supabase.storage
          .from('reference-banners')
          .remove([logoPath]);
      }
    }

    // Delete reference (will cascade delete images from DB)
    const { error } = await supabase
      .from('references')
      .delete()
      .eq('id', refId);

    if (!error) {
      fetchReferences();
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5); // Max 5
      setRefBannerFiles(files);
      
      if (files.length === 5 && e.target.files.length > 5) {
        alert("Maksimum 5 banner görseli ekleyebilirsiniz.");
      }
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
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Uygulamalar</h3>
                <p className="text-sm text-zinc-400">Uygulama yönetimi</p>
              </div>
            </div>
          </Link>

          <Link
            href="/uygulamalar"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Önizleme</h3>
                <p className="text-sm text-zinc-400">Siteyi görüntüle</p>
              </div>
            </div>
          </Link>
        </div>

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

        {/* REFERENCES SECTION */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Referans Yönetimi</h1>
              <p className="text-zinc-400">Şirket referanslarını ve proje görsellerini yönetin</p>
            </div>
            <button
              onClick={() => setShowAddRefModal(true)}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Sıra</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Durum</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {references.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      Henüz referans eklenmemiş
                    </td>
                  </tr>
                ) : (
                  references.map((ref) => (
                    <tr key={ref.id} className="hover:bg-zinc-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {ref.logo_url && (
                            <Image
                              src={ref.logo_url}
                              alt={ref.company_name}
                              width={40}
                              height={40}
                              className="rounded bg-white p-1"
                            />
                          )}
                          <div className="font-semibold text-white">{ref.company_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400 max-w-md truncate">
                        {ref.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">{ref.display_order}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRefActive(ref.id, ref.is_active)}
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

      {/* Add Reference Modal */}
      {showAddRefModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 max-w-3xl w-full my-8">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Yeni Referans Ekle</h2>
              <button
                onClick={() => setShowAddRefModal(false)}
                className="text-zinc-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRefSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Şirket Adı *
                  </label>
                  <input
                    type="text"
                    value={refCompanyName}
                    onChange={(e) => setRefCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                    placeholder="ABC Şirketi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Görüntüleme Sırası
                  </label>
                  <input
                    type="number"
                    value={refDisplayOrder}
                    onChange={(e) => setRefDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                    placeholder="0 (Yüksek önce gösterilir)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={refDescription}
                  onChange={(e) => setRefDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none"
                  placeholder="Proje açıklaması ve detayları..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Şirket Logosu
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setRefLogoFile(e.target.files?.[0] || null);
                    setRefLogoUrl("");
                  }}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white file:cursor-pointer"
                />
                <div className="text-xs text-zinc-500 mt-2">
                  veya URL gir:
                </div>
                <input
                  type="url"
                  value={refLogoUrl}
                  onChange={(e) => {
                    setRefLogoUrl(e.target.value);
                    setRefLogoFile(null);
                  }}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none text-sm mt-2"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Banner Görselleri (16:9 - Maksimum 5 adet)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBannerFileChange}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white focus:border-zinc-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-zinc-700 file:text-white file:cursor-pointer"
                />
                <div className="text-xs text-zinc-500 mt-2">
                  {refBannerFiles.length > 0 && `${refBannerFiles.length} dosya seçildi`}
                  {refBannerFiles.length === 0 && 'Banner görselleri 16:9 oranında olmalıdır'}
                </div>
                {refBannerFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {refBannerFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video bg-zinc-800 rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRefBannerFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={refLoading}
                  className="flex-1 bg-white text-black py-3 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {refLoading ? 'Ekleniyor...' : 'Referans Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRefModal(false)}
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
