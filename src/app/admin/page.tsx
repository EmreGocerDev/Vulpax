"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "../components/UserMenu";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  is_active: boolean;
}

interface Reference {
  id: string;
  is_active: boolean;
}

interface Demo {
  id: string;
  is_active: boolean;
}

export default function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchReferences();
      fetchDemos();
    }
  }, [user]);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('applications')
      .select('id, is_active')
      .order('created_at', { ascending: false });

    if (data) setApplications(data);
  };

  const fetchReferences = async () => {
    const { data } = await supabase
      .from('references')
      .select('id, is_active')
      .order('created_at', { ascending: false });

    if (data) setReferences(data);
  };

  const fetchDemos = async () => {
    const { data } = await supabase
      .from('demos')
      .select('id, is_active')
      .order('created_at', { ascending: false });

    if (data) setDemos(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
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
                href="/"
                className="text-zinc-300 hover:text-white transition-colors text-sm"
              >
                Ana Sayfa
              </Link>
              <UserMenu user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
          <Link
            href="/admin/uygulamalar"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
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
            href="/admin/demolar"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Demolar</h3>
                <p className="text-sm text-zinc-400">Demo yönetimi</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/referanslar"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Referanslar</h3>
                <p className="text-sm text-zinc-400">Referans yönetimi</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/muzik-yukle"
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Müzik Kütüphanesi</h3>
                <p className="text-sm text-zinc-400">Müzik yönetimi</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Dashboard Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yönetim Paneli</h1>
          <p className="text-zinc-400">Genel bakış ve hızlı erişim</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Applications Stats */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">{applications.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Uygulamalar</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Aktif: {applications.filter(app => app.is_active).length}
            </p>
            <Link
              href="/admin/uygulamalar"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
            >
              Tümünü Görüntüle
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Demos Stats */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">{demos.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Demolar</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Aktif: {demos.filter(demo => demo.is_active).length}
            </p>
            <Link
              href="/admin/demolar"
              className="inline-flex items-center text-sm text-red-400 hover:text-red-300"
            >
              Tümünü Görüntüle
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* References Stats */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white">{references.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Referanslar</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Aktif: {references.filter(ref => ref.is_active).length}
            </p>
            <Link
              href="/admin/referanslar"
              className="inline-flex items-center text-sm text-green-400 hover:text-green-300"
            >
              Tümünü Görüntüle
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
