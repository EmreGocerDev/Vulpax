# Vulpax Digital - E-Ticaret Platformu

Modern, profesyonel ve tam özellikli e-ticaret platformu. Next.js 15, TypeScript, Tailwind CSS, Supabase ve PayTR entegrasyonu ile geliştirilmiştir.

## Özellikler

- 🎨 Modern ve koyu temalı arayüz
- 🛒 Tam özellikli sepet sistemi
- 👤 Kullanıcı kayıt ve giriş sistemi
- 🔒 Güvenli authentication (Supabase Auth)
- 📦 Ürün yönetimi
- 📂 Kategori sistemi
- 💳 Ödeme entegrasyonu hazır (PayTR)
- 👨‍💼 Admin paneli
- 📱 Responsive tasarım
- 🔍 SEO dostu yapı
- 📄 Yasal sayfalar (Gizlilik, KVKK, İade Politikası)

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyası zaten mevcut ve yapılandırılmış.

3. Database tablolarınız PostgreSQL'de hazır.

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda açın: [http://localhost:3000](http://localhost:3000)

## Database Yapısı

- `categories` - Ürün kategorileri
- `products` - Ürünler
- `user_profiles` - Kullanıcı profilleri
- `addresses` - Teslimat adresleri
- `orders` - Siparişler
- `order_items` - Sipariş kalemleri
- `site_settings` - Site ayarları
- `contact_messages` - İletişim mesajları
- `coupons` - İndirim kuponları

## Admin Paneli

Admin paneline erişmek için:
1. Kayıt olun veya giriş yapın
2. Database'de `user_profiles` tablosunda role'ünüzü `admin` yapın
3. `/admin` adresine gidin

## Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide icons
- **Notifications**: React Hot Toast

## Proje Yapısı

```
├── app/                    # Next.js App Router sayfaları
│   ├── admin/             # Admin paneli
│   ├── account/           # Kullanıcı hesap sayfaları
│   ├── products/          # Ürün sayfaları
│   ├── cart/              # Sepet sayfası
│   └── ...                # Diğer sayfalar
├── components/            # React bileşenleri
│   ├── home/             # Ana sayfa bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── products/         # Ürün bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
│   ├── supabase/         # Supabase istemcileri
│   ├── store/            # Zustand store'ları
│   └── types/            # TypeScript tipleri
└── public/                # Statik dosyalar

```

## Geliştirme

### Ürün Ekleme

Admin panelinden veya doğrudan database'e:

```sql
INSERT INTO products (name, slug, price, description, category_id, is_active, is_featured)
VALUES ('Ürün Adı', 'urun-adi', 999.99, 'Açıklama', 'kategori_id', true, true);
```

### Kategori Ekleme

```sql
INSERT INTO categories (name, slug, is_active)
VALUES ('Kategori Adı', 'kategori-adi', true);
```

## PayTR Entegrasyonu

✅ PayTR entegrasyonu eklenmiştir ve aktiftir!

Mağaza Bilgileri:
- Merchant ID: 642054
- Test ve canlı ödemeler yapılabilir

Ödeme akışı:
1. Kullanıcı checkout sayfasına gider
2. Teslimat bilgilerini doldurur
3. "Ödemeye Geç" butonuna tıklar
4. PayTR güvenli ödeme sayfasına yönlendirilir
5. Kredi kartı ile ödeme yapar
6. Başarılı/başarısız sayfasına yönlendirilir

## Production Build

```bash
npm run build
npm start
```

## İletişim

- **E-posta:** emregocer@vulpax.com.tr
- **Telefon:** 0507 026 31 85
- **Adres:** Fenerbahçe Mah. İğrip Sk. No:13 İç Kapı No:1 Kadıköy/İstanbul
- **Web:** https://vulpax.com.tr

## Lisans

© 2025 Vulpax Digital. Tüm hakları saklıdır.
