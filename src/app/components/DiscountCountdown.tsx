"use client";

import { useState, useEffect } from "react";

export default function DiscountCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set the date we're counting down to (3 days from now for demo purposes)
    // In a real app, this would be a fixed date or fetched from a config
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 3);
    countDownDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-900 via-black to-red-900 border-b border-red-900/50 text-white py-2 px-4 relative overflow-hidden z-[60]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 relative z-10">
        <div className="flex items-center gap-2 animate-pulse">
          <span className="text-2xl">🎉</span>
          <span className="font-bold text-red-400 whitespace-nowrap">BÜYÜK KASIM İNDİRİMİ</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm md:text-base">
          <span className="text-zinc-300 hidden md:inline">Tüm paketlerde geçerli %25 indirim için son:</span>
          <div className="flex items-center gap-2 font-mono font-bold text-red-500 bg-black/50 px-4 py-1 rounded border border-red-900/50">
            <div className="flex flex-col items-center">
              <span className="text-lg leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Gün</span>
            </div>
            <span className="text-zinc-600">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Sa</span>
            </div>
            <span className="text-zinc-600">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Dk</span>
            </div>
            <span className="text-zinc-600">:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Sn</span>
            </div>
          </div>
        </div>

        <a 
          href="#pricing" 
          className="hidden md:inline-block text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
        >
          FIRSATI YAKALA
        </a>
      </div>
    </div>
  );
}
