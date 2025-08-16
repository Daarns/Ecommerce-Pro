import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { ProductGrid } from '../components/ProductGrid'
import { FilterSidebar } from '../components/FilterSidebar'
import { SearchBar } from '../components/SearchBar'
import { ProductDetail } from '../components/ProductDetail'
import { featuredProducts } from '@/app/data/dummy-data'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'
import { notFound } from 'next/navigation'
import { generateSlug } from '@/app/lib/utils'

const validCategories = ['electronics', 'fashion', 'gaming', 'men', 'women', 'kids', 'sports', 'home']

export default async function ProductSlugPage({ params }) {
  const { slug } = await params;

  // Cek apakah ini kategori
  if (validCategories.includes(slug.toLowerCase())) {
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: categoryName, href: `/products/${slug}`, active: true }
            ]} 
          />
          {/* Category content */}
          <ProductGrid products={featuredProducts} category={slug} />
        </main>
        <Footer />
      </div>
    )
  }

  // Jika bukan kategori, cari produk berdasarkan slug
  const product = featuredProducts.find(p => 
    p.slug === slug || 
    generateSlug(p.name) === slug.toLowerCase()
  );

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.category, href: `/products/${generateSlug(product.category)}` },
            { label: product.name, href: `/products/${generateSlug(product.name)}`, active: true }
          ]} 
        />
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}

// Untuk static generation
export function generateStaticParams() {
  const categoryParams = validCategories.map((category) => ({
    slug: category.toLowerCase(),
  }))
  
  const productParams = featuredProducts.map((product) => ({
    slug: product.slug || generateSlug(product.name),
  }))
  
  return [...categoryParams, ...productParams]
}

// Untuk metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Cek apakah ini kategori
  if (validCategories.includes(slug.toLowerCase())) {
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    return {
      title: `${categoryName} Products - EcommercePro`,
      description: `Browse our premium ${categoryName.toLowerCase()} collection`,
    }
  }

  // Cari produk berdasarkan slug
  const product = featuredProducts.find(p => 
    p.slug === slug || 
    generateSlug(p.name) === slug.toLowerCase()
  )
  
  if (!product) {
    return { title: 'Product Not Found - EcommercePro' }
  }
  
  return {
    title: `${product.name} - EcommercePro`,
    description: `Buy ${product.name} at great prices. Rating: ${product.rating}⭐`,
  }
}
