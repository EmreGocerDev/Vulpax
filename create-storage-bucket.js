const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local dosyasını manuel parse et
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  try {
    console.log('Checking existing buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    console.log('Existing buckets:', buckets.map(b => b.name));

    const bucketExists = buckets.some(b => b.name === 'application-images');

    if (bucketExists) {
      console.log('✅ Bucket "application-images" already exists!');
      return;
    }

    console.log('Creating bucket "application-images"...');
    const { data, error } = await supabase.storage.createBucket('application-images', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    });

    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      console.log('\n⚠️  ANON KEY ile bucket oluşturulamıyor.');
      console.log('Lütfen Supabase Dashboard\'dan manuel olarak oluşturun:');
      console.log('1. https://supabase.com/dashboard/project/knqvrvbplqwknlcbrbub/storage/buckets');
      console.log('2. "New Bucket" butonuna tıklayın');
      console.log('3. Name: application-images');
      console.log('4. Public bucket: ✅ İşaretleyin');
      console.log('5. "Create bucket" butonuna tıklayın');
    } else {
      console.log('✅ Bucket created successfully!');
      console.log('Now creating policies...');
      
      // Policies Supabase SQL Editor'dan eklenecek
      console.log('\n📝 Şimdi Supabase SQL Editor\'da bu komutları çalıştırın:');
      console.log(`
-- Public Read Policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-images');

-- Authenticated Upload Policy  
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-images' 
  AND auth.role() = 'authenticated'
);

-- Delete Own Files Policy
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'application-images' 
  AND auth.uid() = owner
);
      `);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

createBucket();
