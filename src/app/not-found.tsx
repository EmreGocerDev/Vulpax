import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı - Vulpax Software",
  description: "Aradığınız sayfa bulunamadı",
  themeColor: '#000000',
};

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-black">
      <div className="w-full h-[calc(100vh-96px)] relative">
        <Image
          src="/nopagehere.png"
          alt="Sayfa Bulunamadı"
          fill
          className="object-contain"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
