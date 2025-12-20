import { createClient } from './client'

const supabase = createClient()

export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'products')
    
    if (!bucketExists) {
      await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function deleteProductImage(url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/products/')
    if (urlParts.length < 2) return false
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('products')
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}
