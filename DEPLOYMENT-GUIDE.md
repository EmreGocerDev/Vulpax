# GitHub OAuth ve Supabase Callback URL Ayarları

Sitenizi Vercel'e deploy ettiyseniz callback URL'lerini güncellemeniz gerekiyor.

## 1. Supabase Authentication Ayarları

1. Supabase Dashboard'a gidin:
   https://supabase.com/dashboard/project/knqvrvbplqwknlcbrbub/auth/url-configuration

2. **Site URL** güncelleme:
   - Localhost değil, Vercel URL'inizi yazın
   - Örnek: `https://your-app.vercel.app`

3. **Redirect URLs** ekleyin:
   ```
   http://localhost:3000/**
   http://localhost:3001/**
   https://your-app.vercel.app/**
   https://your-domain.com/**
   ```

## 2. GitHub OAuth Application Ayarları

1. GitHub'a gidin:
   https://github.com/settings/developers

2. OAuth Apps > "Vulpax Software" (veya app adınız)

3. **Homepage URL:**
   ```
   https://your-app.vercel.app
   ```

4. **Authorization callback URL:**
   ```
   https://knqvrvbplqwknlcbrbub.supabase.co/auth/v1/callback
   ```
   
   ÖNEMLİ: Bu URL Supabase'in callback URL'i olmalı, sitenizin değil!

## 3. Environment Variables (Vercel)

Vercel'de environment variables'ları ekleyin:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Test

- Localhost: http://localhost:3000
- Production: https://your-app.vercel.app

Her iki ortamda da GitHub login çalışmalı!

## Sorun Devam Ederse

GitHub OAuth'un callback URL'i MUTLAKA şu olmalı:
```
https://knqvrvbplqwknlcbrbub.supabase.co/auth/v1/callback
```

Site URL'iniz ne olursa olsun, callback her zaman Supabase'e gider!
