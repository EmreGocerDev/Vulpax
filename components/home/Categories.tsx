import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default async function Categories() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null)
    .order('display_order', { ascending: true })
    .limit(6);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Kategoriler</h2>
            <p className="text-dark-600">İhtiyacınıza göre kategorileri keşfedin</p>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center text-primary-400 hover:text-primary-300 transition group"
          >
            Tümünü Gör
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden neon-glass-island hover:border-primary-500 transition-all duration-300"
            >
              <div className="aspect-square relative">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-400/50">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm text-center group-hover:text-primary-400 transition">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/categories"
          className="md:hidden flex items-center justify-center text-primary-400 hover:text-primary-300 transition mt-6 group"
        >
          Tümünü Gör
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
