import Link from 'next/link'
import { ArrowRight, Smartphone, Shirt, Home, Dumbbell, Gamepad2, Sparkles } from 'lucide-react'

// Nike-inspired minimalist categories - FIXED descriptions for consistent height
const categories = [
  {
    id: 1,
    name: 'Men',
    description: 'Shoes, Clothing & Accessories',
    icon: Dumbbell,
    count: '2.5K+ items',
    href: '/products/men',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'Women',
    description: 'Shoes, Clothing & Accessories', 
    icon: Sparkles,
    count: '1.8K+ items',
    href: '/products/women',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 3,
    name: 'Kids',
    description: 'Shoes, Clothing & Accessories',
    icon: Home,
    count: '1.2K+ items', 
    href: '/products/kids',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    name: 'Electronics',
    description: 'Gadgets & Technology Items',
    icon: Smartphone,
    count: '800+ items',
    href: '/products/electronics',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 5,
    name: 'Fashion',
    description: 'Trending Styles & Accessories', // FIXED: Made longer to match others
    icon: Shirt,
    count: '900+ items',
    href: '/products/fashion',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 6,
    name: 'Gaming',
    description: 'Games & Console Accessories', // FIXED: Made longer to match others
    icon: Gamepad2,
    count: '650+ items',
    href: '/products/gaming',
    color: 'from-red-500 to-red-600'
  }
]

export function Categories() {
  return (
    <section className="py-16 lg:py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Explore our curated collections designed for every style and every story.
          </p>
        </div>
        
        {/* Categories Grid - FIXED HEIGHT: All Cards Exactly Same Size */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            
            return (
              <Link key={category.id} href={category.href} className="group">
                {/* FIXED: Use h-[280px] instead of min-h for exact same height */}
                <div className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-primary hover:bg-surface-elevated transition-all duration-300 hover:scale-105 h-[280px] flex flex-col">
                  
                  {/* Top Section: Icon - Fixed position */}
                  <div className="flex flex-col items-center">
                    {/* Icon - Consistent size */}
                    <div className={`w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  {/* Middle Section: Text Content - Takes remaining space */}
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-muted font-semibold">
                      {category.count}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed px-2">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Bottom Section: Hover Arrow - Fixed position at bottom */}
                  <div className="flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 pt-4">
                    <span className="text-sm font-semibold mr-2">Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}