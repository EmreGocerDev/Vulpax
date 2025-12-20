import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knqvrvbplqwknlcbrbub.supabase.co',
      },
    ],
  },
};

export default nextConfig;
