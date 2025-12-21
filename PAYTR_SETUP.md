# PayTR Entegrasyonu Kurulum Talimatları

## ✅ Yapılması Gerekenler

### 1. PayTR Mağaza Paneli'ne Giriş Yapın
https://www.paytr.com/ adresine gidin ve mağaza panelinize giriş yapın.

### 2. Bildirim URL'sini Ayarlayın

**ÇOK ÖNEMLİ:** PayTR'nin ödeme sonuçlarını sitenize bildirmesi için Bildirim URL'sini tanımlamanız gerekiyor.

1. **Destek & Kurulum** > **Ayarlar** > **Bildirim URL Ayarları** bölümüne gidin
2. Aşağıdaki bilgileri girin:

   - **Protokol**: 
     - Sitenizde SSL varsa: `HTTPS`
     - SSL yoksa: `HTTP`
   
   - **Bildirim URL**: 
     ```
     vulpax.com.tr/api/payment/paytr/callback
     ```
     
     Tam URL şu şekilde olacak:
     - SSL varsa: `https://vulpax.com.tr/api/payment/paytr/callback`
     - SSL yoksa: `http://vulpax.com.tr/api/payment/paytr/callback`

3. **Kaydet** butonuna tıklayın

### 3. Test Ödemesi Yapın

1. Sitenizde bir test ödemesi yapın
2. Ödeme başarılı olduktan sonra PayTR Mağaza Paneli'nde **İşlemler** sayfasına gidin
3. Test işleminizin durumunu kontrol edin:
   - ✅ **"Başarılı"** görünüyorsa: Entegrasyon tamamdır!
   - ❌ **"Devam Ediyor"** görünüyorsa: Bildirim URL'den OK yanıtı alınamıyor demektir
     - İşlemin satırındaki **Detay** linkine tıklayın
     - Bildirim URL'nizden hangi yanıtın geldiğini kontrol edin

## 🔍 Sorun Giderme

### Sipariş "Devam Ediyor" Durumunda Kalıyorsa:

1. **Bildirim URL protokolünü kontrol edin**:
   - SSL var mı? → HTTPS kullanın
   - SSL yok mu? → HTTP kullanın

2. **URL'yi kontrol edin**:
   - Başında `www` var mı yok mu?
   - Sonunda `/` karakteri VAR MI? (olmamalı)

3. **Sunucu loglarını kontrol edin**:
   - Terminal'de: `npm run dev` çalıştırıp console'da hata var mı bakın

4. **PayTR Mağaza Paneli'nde detaylara bakın**:
   - İşlemler > İlgili işlem > Detay
   - Burada Bildirim URL'nizden gelen yanıtı görebilirsiniz

## 📝 Sipariş Durumları

### Payment Status (Ödeme Durumu):
- `pending`: Ödeme bekleniyor (henüz PayTR'den bildirim gelmedi)
- `paid`: Ödeme başarıyla tamamlandı ✅
- `failed`: Ödeme başarısız oldu ❌
- `refunded`: Ödeme iade edildi

### Order Status (Sipariş Durumu):
- `pending`: Beklemede
- `processing`: İşleniyor
- `shipped`: Kargoda
- `delivered`: Teslim edildi
- `cancelled`: İptal edildi

## 🔒 Güvenlik Notları

1. **Hash Doğrulaması**: Callback endpoint'i her PayTR bildiriminde hash değerini doğrular. Bu GÜVENLİK AÇISINDAN ÇOK ÖNEMLİDİR.

2. **Tekrar Eden Bildirimler**: Aynı sipariş için birden fazla bildirim gelebilir (ağ sorunları vb.). Kod bunu otomatik olarak halleder.

3. **Environment Variables**: `.env.local` dosyasındaki PayTR kimlik bilgilerinizi asla paylaşmayın veya git'e commit etmeyin.

## 📞 Destek

PayTR ile ilgili sorunlar için:
- PayTR Mağaza Paneli > Destek sayfasından mesaj gönderin
- PayTR Dokümantasyon: https://dev.paytr.com/

Kod ile ilgili sorunlar için:
- Sunucu loglarını kontrol edin
- Browser console'u kontrol edin
