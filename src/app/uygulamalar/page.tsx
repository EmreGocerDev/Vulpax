"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
import MobileMenu from "../components/MobileMenu";
import LoginModal from "../components/LoginModal";
import SignUpModal from "../components/SignUpModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import Footer from "../components/Footer";
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
  price: number;
}

export default function ApplicationsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen text-white pt-24 md:pt-32">
      {/* Header removed */}
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Hero Section */}
      <section className="py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Uygulamalar
          </h1>
          <p className="text-zinc-400 text-lg">
            Vulpax Digital tarafından geliştirilen uygulamaları keşfedin
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-zinc-800 sticky top-[73px] backdrop-blur-xl bg-black/30 z-30 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 whitespace-nowrap transition-all duration-300 hover:scale-105 ${
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
                className={`px-4 py-2 whitespace-nowrap transition-all duration-300 hover:scale-105 ${
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
            <div className="text-center py-20 animate-fade-in">
              <div className="text-zinc-400 text-lg">Uygulamalar yükleniyor...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-zinc-400 text-lg">
                {selectedCategory
                  ? 'Bu kategoride henüz uygulama bulunmuyor.'
                  : 'Henüz yayınlanmış uygulama bulunmuyor.'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/uygulamalar/${app.id}`}
                  className="group relative overflow-hidden transition-all duration-300"
                >
                  {/* Outer glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#2666E3]/30 via-[#67DBFF]/30 to-[#2666E3]/30 rounded-xl blur-[40px] opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Glass card */}
                  <div className="relative bg-gradient-to-br from-[#0a0f1a]/80 via-[#0d1117]/60 to-[#05050B]/80 backdrop-blur-xl border border-[#BAFFFF]/20 group-hover:border-[#BAFFFF]/50 rounded-lg overflow-hidden transition-all duration-300">
                    {/* App Image */}
                    <div className="aspect-video bg-zinc-900/50 relative overflow-hidden">
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
                        <span className="bg-[#0a0f1a]/90 backdrop-blur-sm border border-[#BAFFFF]/30 text-white text-xs px-3 py-1 font-semibold rounded">
                          {app.categories.name}
                        </span>
                      </div>
                    </div>

                    {/* App Info */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#BAFFFF] transition-colors">
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
                        <div className="flex items-center gap-2">
                          {app.price > 0 ? (
                            <span className="text-[#BAFFFF] font-bold text-sm">{app.price} ₺</span>
                          ) : (
                            <span className="text-green-400 font-bold text-sm">Ücretsiz</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#BAFFFF]/20 text-xs text-zinc-500">
                        {formatDate(app.created_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
