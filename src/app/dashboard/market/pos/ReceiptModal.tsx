'use client';

import { X, Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface ReceiptData {
  id: string;
  date: Date;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  customerName?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}

interface MarketSettings {
  store_name: string;
  address: string;
  phone: string;
  receipt_header: string;
  receipt_footer: string;
}

export default function ReceiptModal({ isOpen, onClose, data }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<MarketSettings>({
    store_name: 'VULPAX MARKET',
    address: '',
    phone: '',
    receipt_header: '',
    receipt_footer: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('market_settings')
      .select('store_name, address, phone, receipt_header, receipt_footer')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setSettings({
        store_name: data.store_name || 'VULPAX MARKET',
        address: data.address || '',
        phone: data.phone || '',
        receipt_header: data.receipt_header || '',
        receipt_footer: data.receipt_footer || ''
      });
    }
  };

  useEffect(() => {
    const handlePrint = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrintClick();
      }
    };
    window.addEventListener('keydown', handlePrint);
    return () => window.removeEventListener('keydown', handlePrint);
  }, []);

  if (!isOpen || !data) return null;

  const handlePrintClick = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Fiş Yazdır</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              margin: 0;
              padding: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .store-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .meta {
              margin-bottom: 15px;
              font-size: 11px;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .totals {
              margin-top: 15px;
              text-align: right;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            .grand-total {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
            @media print {
              @page { margin: 0; }
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-lg">Satış Fişi</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintClick}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
              title="Yazdır"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Receipt Preview Area */}
        <div className="p-8 overflow-y-auto bg-white flex justify-center">
          <div 
            ref={receiptRef} 
            className="w-[300px] bg-white p-4 border border-gray-100 shadow-sm text-xs font-mono leading-relaxed"
          >
            <div className="header">
              <div className="store-name">{settings.store_name}</div>
              {settings.receipt_header && <div className="mb-2">{settings.receipt_header}</div>}
              {settings.address && <div className="whitespace-pre-wrap">{settings.address}</div>}
              {settings.phone && <div>Tel: {settings.phone}</div>}
            </div>

            <div className="divider"></div>

            <div className="meta">
              <div>Tarih: {data.date.toLocaleString('tr-TR')}</div>
              <div>Fiş No: #{data.id.slice(0, 8)}</div>
              {data.customerName && <div>Müşteri: {data.customerName}</div>}
              <div>Ödeme: {data.paymentMethod === 'cash' ? 'Nakit' : data.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Veresiye'}</div>
            </div>

            <div className="divider"></div>

            <div className="items">
              {data.items.map((item, index) => (
                <div key={index} className="item">
                  <div style={{ width: '50%' }}>{item.name}</div>
                  <div style={{ width: '15%', textAlign: 'center' }}>x{item.quantity}</div>
                  <div style={{ width: '35%', textAlign: 'right' }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.total)}
                  </div>
                </div>
              ))}
            </div>

            <div className="divider"></div>

            <div className="totals">
              <div className="total-row">
                <span>Ara Toplam:</span>
                <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.subtotal)}</span>
              </div>
              <div className="total-row">
                <span>KDV (%18):</span>
                <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.tax)}</span>
              </div>
              <div className="total-row grand-total">
                <span>GENEL TOPLAM:</span>
                <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.total)}</span>
              </div>
            </div>

            {settings.receipt_footer && (
              <>
                <div className="divider"></div>
                <div className="footer">
                  {settings.receipt_footer}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
