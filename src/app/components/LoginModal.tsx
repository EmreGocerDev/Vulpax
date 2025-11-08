"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: (email: string) => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp, onSwitchToForgotPassword }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Render modal into a portal to ensure it's positioned relative to viewport
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
    }
    const container = containerRef.current;
    document.body.appendChild(container);
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage("Giriş başarılı!");
      setTimeout(() => {
        onClose();
        setEmail("");
        setPassword("");
        setMessage(null);
      }, 1000);
    } catch (error: any) {
      setError(error.message || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "GitHub ile giriş yapılamadı.");
      setIsLoading(false);
    }
  };

  if (!isOpen || !containerRef.current) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-700 p-8 w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-xl"
          >
            ×
          </button>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Image
              src="/logo2.png"
              alt="Vulpax Software"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white logo-font">
                VULPA<span className="text-red-500">X</span>
              </h1>
              <p className="text-xs text-zinc-400">SOFTWARE</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500 text-green-200 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="ornek@vulpax.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-zinc-300">
                <input
                  type="checkbox"
                  className="mr-2 bg-zinc-800 border-zinc-600 text-white focus:ring-zinc-400"
                />
                Beni hatırla
              </label>
              <button
                type="button"
                onClick={() => onSwitchToForgotPassword(email)}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Şifremi unuttum
              </button>
            </div>

            <div className="button-borders w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Hesabınız yok mu?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="inline-block ml-2 text-white font-bold uppercase tracking-wide hover:underline"
              >
                KAYIT OL
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="text-center">
              <p className="text-zinc-500 text-xs mb-4">veya</p>
              <div className="button-borders w-full">
                <button 
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="secondary-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="font-medium">GITHUB İLE GİRİŞ YAP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, containerRef.current);
}