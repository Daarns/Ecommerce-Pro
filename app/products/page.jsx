"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { ProductGrid } from './components/ProductGrid'
import { FilterSidebar } from './components/FilterSidebar'
import { SearchBar } from './components/SearchBar'
import { featuredProducts } from '@/app/data/dummy-data'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'

export default function ProductsPage({ category }) {
  const [filters, setFilters] = useState({})
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setFilters({});
  }, [category]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Filter produk berdasarkan search query
  const filteredProducts = search
    ? featuredProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : featuredProducts;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products', active: true }
          ]} 
        />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            {search
              ? `Search results for "${search}"`
              : category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
              : 'All Products'}
          </h1>
          <p className="text-text-secondary max-w-2xl">
            {search
              ? `Showing products matching "${search}"`
              : category
              ? `Discover our premium ${category} products`
              : 'Discover our complete collection of premium products across all categories'
            }
          </p>
        </div>
        
        {/* Search Bar */}
        {/*<div className="mb-8">
          <SearchBar />
        </div>*/}
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Hide on desktop when sidebarVisible is false */}
          {sidebarVisible && (
            <aside className="hidden lg:block flex-shrink-0">
              <FilterSidebar
                key={category || 'all'}
                currentCategory={category}
                onFiltersChange={handleFiltersChange}
              />
            </aside>
          )}
          
          {/* Products Grid */}
          <div className={`flex-1 transition-all duration-300 ${
            sidebarVisible ? '' : 'lg:max-w-none'
          }`}>
            <ProductGrid 
              products={filteredProducts} 
              filters={filters} 
              category={category}
              onToggleSidebar={toggleSidebar}
              sidebarVisible={sidebarVisible}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}