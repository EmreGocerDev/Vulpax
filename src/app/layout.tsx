import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vulpax Software - Yazılım ve Web Entegrasyonları",
  description: "Vulpax Software - Modern yazılım çözümleri ve web entegrasyonları",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo2.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo2.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo2.png',
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vulpax Software',
  },
  openGraph: {
    title: 'Vulpax Software - Yazılım ve Web Entegrasyonları',
    description: 'Modern yazılım çözümleri ve web entegrasyonları',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Vulpax Software',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Vulpax Software Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vulpax Software - Yazılım ve Web Entegrasyonları',
    description: 'Modern yazılım çözümleri ve web entegrasyonları',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
