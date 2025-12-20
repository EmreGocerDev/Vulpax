import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function FeaturedProducts() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Öne Çıkan Ürünler</h2>
            <p className="text-dark-600">En popüler ve önerilen yazılım çözümlerimiz</p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center text-primary-400 hover:text-primary-300 transition group"
          >
            Tüm Ürünler
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          href="/products"
          className="md:hidden flex items-center justify-center text-primary-400 hover:text-primary-300 transition mt-8 group"
        >
          Tüm Ürünler
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
