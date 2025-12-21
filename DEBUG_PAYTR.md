# PayTR Callback Debug Kılavuzu

## 🔍 Callback Çalışıyor mu Kontrol Etme

### 1. Yeni Bir Test Ödemesi Yapın

1. Sitenizde yeni bir sipariş oluşturun
2. PayTR ile ödeme yapın
3. Ödeme başarılı olduktan sonra **hemen** terminale bakın

### 2. Terminal Loglarını Kontrol Edin

Terminalde şu logları görmelisiniz:

```
=== PayTR Callback Received ===
merchant_oid: ORDXXXXXXXXXXXXX
status: success
total_amount: 100
payment_type: card
test_mode: 0
hash received: xxxxxxxxxxxxxxxx
hash_str to calculate: ORDXXXXXXXXXXXXXXsaltsuccess100
hash calculated: xxxxxxxxxxxxxxxx
hash match: true
Looking for order with order_number: ORDXXXXXXXXXXXXX
Order found: YES
Current order payment_status: pending
Payment SUCCESS - updating order to paid...
Order payment confirmed successfully: {...}
```

### 3. Sorun Tespiti

#### ❌ Eğer hiç log görmüyorsanız:
- PayTR Bildirim URL'si yanlış tanımlanmış olabilir
- PayTR Mağaza Paneli > Destek & Kurulum > Ayarlar > Bildirim URL kontrol edin
- Doğru URL: `vulpax.com.tr/api/payment/paytr/callback`

#### ❌ "hash match: false" görüyorsanız:
- PAYTR_MERCHANT_KEY veya PAYTR_MERCHANT_SALT yanlış
- `.env.local` dosyasını kontrol edin
- PayTR Mağaza Paneli'nden doğru değerleri alın

#### ❌ "Order found: NO" görüyorsanız:
- Sipariş numarası veritabanında yok
- merchant_oid ile order_number eşleşmiyor

#### ❌ "Failed to update order" görüyorsanız:
- Supabase bağlantı hatası
- Row Level Security (RLS) sorunu olabilir

## 🔧 Manuel Sipariş Güncelleme

Eğer callback çalışmıyorsa ve siparişleri manuel paid yapmak istiyorsanız:

### PostgreSQL Sorgusu ile:

```sql
-- Belirli bir siparişi paid yap
UPDATE orders
SET 
  payment_status = 'paid',
  payment_method = 'card',
  updated_at = NOW()
WHERE order_number = 'ORDXXXXXXXXXXXXX';

-- Tüm pending siparişleri paid yap (DİKKATLİ!)
UPDATE orders
SET 
  payment_status = 'paid',
  payment_method = 'card',
  updated_at = NOW()
WHERE payment_status = 'pending'
  AND created_at > NOW() - INTERVAL '1 day';
```

## 📋 Kontrol Listesi

- [ ] `.env.local` dosyasında PAYTR_MERCHANT_KEY doğru
- [ ] `.env.local` dosyasında PAYTR_MERCHANT_SALT doğru
- [ ] `.env.local` dosyasında NEXT_PUBLIC_SITE_URL doğru (sonunda / YOK)
- [ ] PayTR Paneli'nde Bildirim URL doğru tanımlı
- [ ] PayTR Paneli'nde SSL ayarı doğru (HTTP/HTTPS)
- [ ] Sunucu çalışıyor (`npm run dev` veya production)
- [ ] Supabase bağlantısı çalışıyor

## 🧪 Test Senaryosu

1. **Yeni sipariş oluştur**
2. **Ödeme yap** (test kartı: 4111 1111 1111 1111)
3. **Terminal loglarına bak** (callback geldi mi?)
4. **Veritabanını kontrol et**:
   ```sql
   SELECT order_number, payment_status, created_at 
   FROM orders 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
5. **Siparişlerim sayfasında görünüyor mu?**

## 💡 İpuçları

- Callback'ler **arka planda** çalışır, kullanıcı görmez
- Callback başarısız olsa bile kullanıcı "Ödeme Başarılı" sayfasını görür
- Asıl kontrol PayTR Mağaza Paneli > İşlemler sayfasındadır
- İşlem "Başarılı" ise = Callback çalıştı ✅
- İşlem "Devam Ediyor" ise = Callback çalışmadı ❌

## 🆘 Hala Çalışmıyorsa

1. PayTR Destek'e yazın (Mağaza Paneli > Destek)
2. Callback URL'ye manuel POST testi yapın
3. Supabase loglarını kontrol edin
4. RLS politikalarını kontrol edin
