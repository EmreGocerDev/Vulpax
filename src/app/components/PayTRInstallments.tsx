"use client";

import { useEffect } from "react";

export default function PayTRInstallments() {
  useEffect(() => {
    // Check if script already exists to prevent duplicates
    if (document.querySelector('script[src*="paytr.com/odeme/taksit-tablosu"]')) {
      return;
    }

    const script = document.createElement("script");
    // Using a default amount of 10000 TL for demonstration
    script.src = "https://www.paytr.com/odeme/taksit-tablosu/v2?token=f80896a41a13286f5849388e5fae77b00e8aa3e62f12c53e470012bc92e26472&merchant_id=642054&amount=10000&taksit=0&tumu=0";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional: cleanup if needed, but usually these scripts modify DOM in place
    };
  }, []);

  return (
    <section className="py-10 border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-white mb-8 logo-font">
          TAKSİT <span className="text-red-500">SEÇENEKLERİ</span>
        </h2>
        <div id="paytr_taksit_tablosu"></div>
        <style jsx global>{`
            #paytr_taksit_tablosu {
                clear: both;
                font-size: 12px;
                max-width: 1200px;
                text-align: center;
                font-family: var(--font-geist-sans), Arial, sans-serif;
                margin: 0 auto;
            }
            #paytr_taksit_tablosu::before {
                display: table;
                content: " ";
            }
            #paytr_taksit_tablosu::after {
                content: "";
                clear: both;
                display: table;
            }
            .taksit-tablosu-wrapper {
                margin: 10px;
                width: 280px;
                padding: 15px;
                cursor: default;
                text-align: center;
                display: inline-block;
                border: 1px solid #27272a;
                background-color: #09090b;
                border-radius: 12px;
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .taksit-tablosu-wrapper:hover {
                transform: translateY(-5px);
                border-color: #ef4444;
            }
            .taksit-logo img {
                max-height: 35px;
                padding-bottom: 15px;
                filter: brightness(0.9);
            }
            .taksit-tutari-text {
                float: left;
                width: 120px;
                color: #71717a;
                margin-bottom: 8px;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .taksit-tutar-wrapper {
                display: inline-block;
                background-color: #18181b;
                border-radius: 6px;
                margin-bottom: 4px;
                overflow: hidden;
                width: 100%;
            }
            .taksit-tutar-wrapper:hover {
                background-color: #27272a;
            }
            .taksit-tutari {
                float: left;
                width: 50%;
                padding: 8px 0;
                color: #d4d4d8;
                border: none;
                font-size: 13px;
            }
            .taksit-tutari:first-child {
                border-right: 1px solid #27272a;
            }
            .taksit-tutari-bold {
                font-weight: bold;
                color: #ffffff;
            }
            @media all and (max-width: 600px) {
                .taksit-tablosu-wrapper {
                    margin: 10px 0;
                    width: 100%;
                }
            }
        `}</style>
      </div>
    </section>
  );
}
