"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSwitchToLogin?: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = "", onSwitchToLogin }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);
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

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;

      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi! Lütfen e-postanızı kontrol edin.");
      setTimeout(() => {
        onClose();
        setEmail("");
        setMessage(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
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

          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Şifremi Unuttum</h2>
            <p className="text-sm text-zinc-400">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
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

          <form onSubmit={handleResetPassword} className="space-y-6">
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

            <div className="button-borders w-full">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "GÖNDERİLİYOR..." : "SIFIRLA BAĞLANTISI GÖNDER"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Şifrenizi hatırladınız mı?{' '}
              <button
                onClick={() => {
                  if (onSwitchToLogin) {
                    onSwitchToLogin();
                  } else {
                    onClose();
                  }
                }}
                className="inline-block ml-2 text-white font-bold uppercase tracking-wide hover:underline"
              >
                GİRİŞ YAP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, containerRef.current);
}
