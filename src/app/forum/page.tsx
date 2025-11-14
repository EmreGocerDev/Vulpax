import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Forum - Vulpax Software",
  description: "Vulpax Software Forum Sayfası",
  themeColor: '#000000',
};

export default function ForumPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-black">
      <div className="w-full h-[calc(100vh-96px)] relative">
        <Image
          src="/nopage.png"
          alt="Forum Yakında"
          fill
          className="object-contain"
          priority
          quality={100}
        />
      </div>
    </div>
  );
}
