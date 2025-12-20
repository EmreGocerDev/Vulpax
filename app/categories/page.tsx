import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function CategoriesPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Kategoriler</h1>
          <p className="text-dark-600">
            Tüm ürün kategorilerimize göz atın
          </p>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden neon-glass-island hover:border-primary-500 transition-all duration-300 aspect-square"
              >
                <div className="absolute inset-0">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary-400/50">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-dark-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-dark-600 text-lg">Henüz kategori bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
