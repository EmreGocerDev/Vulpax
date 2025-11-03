"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
import MobileMenu from "../components/MobileMenu";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Application {
  id: string;
  title: string;
  description: string;
  version: string;
  image_url: string;
  file_size: number;
  download_count: number;
  category_id: string;
  categories: Category;
  created_at: string;
}

export default function ApplicationsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchApplications();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    let query = supabase
      .from('applications')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
            Uygulamaları görüntülemek için giriş yapmanız gerekiyor.
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
                <p className="text-xs text-zinc-400">SOFTWARE</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/uygulamalar" className="text-white font-semibold">
                Uygulamalar
              </Link>
              <UserMenu user={user} onSignOut={signOut} />
            </nav>
            <MobileMenu onLoginClick={() => {}} user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Uygulamalar
          </h1>
          <p className="text-zinc-400 text-lg">
            Vulpax Software tarafından geliştirilen uygulamaları keşfedin
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-zinc-800 sticky top-[73px] bg-black z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-zinc-400 text-lg">Uygulamalar yükleniyor...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-zinc-400 text-lg">
                {selectedCategory
                  ? 'Bu kategoride henüz uygulama bulunmuyor.'
                  : 'Henüz yayınlanmış uygulama bulunmuyor.'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/uygulamalar/${app.id}`}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all group"
                >
                  {/* App Image */}
                  <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                    {app.image_url ? (
                      <Image
                        src={app.image_url}
                        alt={app.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-zinc-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/80 text-white text-xs px-2 py-1">
                        {app.categories.name}
                      </span>
                    </div>
                  </div>

                  {/* App Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-4">
                        <span>v{app.version}</span>
                        <span>{formatFileSize(app.file_size)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span>{app.download_count}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
                      {formatDate(app.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>&copy; 2025 Vulpax Software. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
