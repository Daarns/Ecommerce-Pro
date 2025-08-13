import { ProductCard } from '@/app/components/ui/ProductCard'
import { featuredProducts } from '@/app/data/dummy-data'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function FeaturedProducts() {
  const sorted = featuredProducts.filter(product => product.bestSeller);
  const limitedProducts = sorted.slice(0, 12);
  return (
    <section className="py-16 lg:py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm text-accent font-medium uppercase tracking-wide">Featured</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
              Trending Now
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl">
              Hand-picked products that are flying off our shelves
            </p>
          </div>
          
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {limitedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-primary hover:bg-primary-hover text-text-inverse px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg">
              Explore All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}