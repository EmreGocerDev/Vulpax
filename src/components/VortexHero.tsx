"use client";

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function VortexHero() {
  return (
    <div className="w-full mx-auto h-[calc(100vh-72px)] overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={220} // Blueish hue for tech feel
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Dijital Dünyada İzinizi Bırakın
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Vulpax Software ile işletmenizi bir sonraki seviyeye taşıyın. Modern, hızlı ve güvenilir yazılım çözümleri.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link href="#contact">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              İletişime Geç
            </button>
          </Link>
          <Link href="/uygulamalar">
            <button className="px-4 py-2 text-white hover:text-blue-300 transition duration-200 flex items-center gap-2">
              Uygulamalarımız <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
