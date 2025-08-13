import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { ProductGrid } from '../components/ProductGrid'
import { FilterSidebar } from '../components/FilterSidebar'
import { SearchBar } from '../components/SearchBar'
import { ProductDetail } from '../components/ProductDetail'
import { featuredProducts } from '@/app/data/dummy-data'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'
import { notFound } from 'next/navigation'

// Valid categories for routing
const validCategories = ['electronics', 'fashion', 'gaming', 'men', 'women', 'kids', 'sports', 'home']

export function generateStaticParams() {
  const categoryParams = validCategories.map((category) => ({
    slug: category,
  }))
  
  const productParams = featuredProducts.map((product) => ({
    slug: product.id.toString(),
  }))
  
  return [...categoryParams, ...productParams]
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  
  // Check if it's a product ID (numeric)
  const isProductId = /^\d+$/.test(slug)
  
  if (isProductId) {
    const product = featuredProducts.find(p => p.id.toString() === slug)
    if (!product) {
      return { title: 'Product Not Found - EcommercePro' }
    }
    
    return {
      title: `${product.name} - EcommercePro`,
      description: `Buy ${product.name} for ${product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}. ${product.rating} ⭐ rating.`,
    }
  } else {
    // Handle as category
    if (!validCategories.includes(slug)) {
      return { title: 'Category Not Found - EcommercePro' }
    }
    
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    return {
      title: `${categoryName} Products - EcommercePro`,
      description: `Browse our premium ${categoryName.toLowerCase()} collection`,
    }
  }
}

export default async function ProductSlugPage({ params }) {
  const { slug } = await params
  
  // Determine if slug is product ID (numeric) or category (string)
  const isProductId = /^\d+$/.test(slug)
  
  if (isProductId) {
    // Handle Product Detail Page
    const product = featuredProducts.find(p => p.id.toString() === slug)
    
    if (!product) {
      notFound()
    }
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb for Product */}
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.category, href: `/products/${product.category.toLowerCase()}` },
              { label: product.name, href: `/products/${slug}`, active: true }
            ]} 
          />
          
          <ProductDetail product={product} />
        </main>
        
        <Footer />
      </div>
    )
  } else {
    // Handle Category Page
    if (!validCategories.includes(slug)) {
      notFound()
    }
    
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb for Category */}
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: categoryName, href: `/products/${slug}`, active: true }
            ]} 
          />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              {categoryName} Products
            </h1>
            <p className="text-text-secondary max-w-2xl">
              Discover our premium {categoryName.toLowerCase()} collection
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar />
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <FilterSidebar currentCategory={slug} />
            </aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid products={featuredProducts} category={slug} />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }
}