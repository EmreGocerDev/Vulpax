-- Create products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  features text[], -- Array of strings for features
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;

-- Create policies
create policy "Public products are viewable by everyone"
  on products for select
  using ( true );

create policy "Admins can insert products"
  on products for insert
  with check ( auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' );

create policy "Admins can update products"
  on products for update
  using ( auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' );

create policy "Admins can delete products"
  on products for delete
  using ( auth.uid() = 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' );

-- Insert default packages
insert into products (name, description, price, features) values
('Başlangıç Paketi', 'İşletmeniz için temel web çözümü', 6250.00, array['Modern & Responsive Tasarım', 'Hızlı & Optimize Kod Yapısı', 'Tüm Cihazlarda Uyumlu', 'SEO Optimizasyonu', '1 Yıllık Domain', '1 Yıllık Hosting (5GB)', 'Ücretsiz SSL', 'İletişim Formu', '3 Ay Destek']),
('Profesyonel Paket', 'Gelişmiş özellikler ve kurumsal kimlik', 12000.00, array['Başlangıç Paket + Tüm Özellikler', 'Gelişmiş Animasyonlar', '1 Yıllık Domain', '1 Yıllık Hosting (15GB SSD)', '1 Yıllık Veritabanı', 'Kurumsal E-Posta (5 Adet)', 'API Entegrasyonları', 'Basit Admin Panel', 'Google Analytics', '6 Ay Destek']),
('Kurumsal Paket', 'Tam kapsamlı kurumsal çözüm', 15000.00, array['Profesyonel Paket + Tüm Özellikler', 'Özel İhtiyaçlara Göre Geliştirme', '1 Yıllık Premium Domain', '1 Yıllık Hosting (50GB SSD)', 'Sınırsız Veritabanı', 'Sınırsız E-Posta', 'Gelişmiş Admin Panel', 'Bulut Altyapı', 'Tüm API Entegrasyonları', '7/24 Destek', '12 Ay Bakım']);
