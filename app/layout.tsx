import type { Metadata } from "next";
import { Poppins, Asap, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NeonContextMenu from '@/components/effects/NeonContextMenu';

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
});

const asap = Asap({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-asap"
});

export const metadata: Metadata = {
  title: "Vulpax Digital - Modern Yazılım Çözümleri",
  description: "Modern ve güvenli yazılım çözümleri ile işletmenizi dijital dünyada güçlendiriyoruz",
  keywords: "yazılım, web tasarım, mobil uygulama, e-ticaret, kurumsal yazılım",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${poppins.className} ${asap.variable} ${orbitron.variable}`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <NeonContextMenu />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#27272a',
              color: '#fff',
              border: '1px solid #3f3f46',
            },
          }}
        />
      </body>
    </html>
  );
}
