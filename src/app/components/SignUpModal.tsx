'use client';

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!acceptedPrivacyPolicy) {
      setError("Gizlilik Politikası'nı kabul etmelisiniz!");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır!");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      setMessage("Kayıt başarılı! Email adresinizi kontrol edin.");
      setTimeout(() => {
        onClose();
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setAcceptedPrivacyPolicy(false);
        setMessage(null);
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Kayıt oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
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
      setError(error.message || "GitHub ile kayıt oluşturulamadı.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Google ile kayıt oluşturulamadı.");
      setIsLoading(false);
    }
  };

  if (!isOpen || !containerRef.current) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-zinc-900 border border-zinc-700 p-8 w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-xl z-10"
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

        <div>
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

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="ornek@vulpax.com"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-300 mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="privacy-policy"
                checked={acceptedPrivacyPolicy}
                onChange={(e) => setAcceptedPrivacyPolicy(e.target.checked)}
                required
                className="mt-1 w-4 h-4 bg-zinc-800 border border-zinc-600 text-red-500 focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor="privacy-policy" className="text-sm text-zinc-300">
                <a href="/gizlilik-politikasi" target="_blank" className="text-red-400 hover:text-red-300 underline">
                  Gizlilik Politikası
                </a>
                'nı ve{' '}
                <a href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-red-400 hover:text-red-300 underline">
                  Mesafeli Satış Sözleşmesi
                </a>
                'ni okudum, kabul ediyorum.
              </label>
            </div>

            <div className="button-borders w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "KAYIT OLUŞTURULUYOR..." : "KAYIT OL"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Hesabınız var mı?{' '}
              <button
                onClick={onSwitchToLogin}
                className="inline-block ml-2 text-white font-bold uppercase tracking-wide hover:underline"
              >
                GİRİŞ YAP
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="text-center">
              <p className="text-zinc-500 text-xs mb-4">veya</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="button-borders w-full">
                  <button 
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="secondary-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium">GOOGLE</span>
                  </button>
                </div>
                <div className="button-borders w-full">
                  <button 
                    type="button"
                    onClick={handleGithubSignUp}
                    disabled={isLoading}
                    className="secondary-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="font-medium">GITHUB</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, containerRef.current);
}
