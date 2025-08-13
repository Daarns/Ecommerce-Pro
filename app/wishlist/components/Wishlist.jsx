'use client'
import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/Button'
import { WishlistItem } from './WishlistItem'

const ITEMS_PER_PAGE = 8

export function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state for smooth UX
    setTimeout(() => {
      const stored = localStorage.getItem('wishlist')
      setWishlist(stored ? JSON.parse(stored) : [])
      setIsLoading(false)
    }, 300)
  }, [])

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  // Pagination logic
  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE)
  const paginatedWishlist = wishlist.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-surface rounded-lg"></div>
          <div className="w-48 h-8 bg-surface rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6">
              <div className="w-full h-48 bg-surface-elevated rounded-xl mb-4"></div>
              <div className="w-3/4 h-6 bg-surface-elevated rounded mb-2"></div>
              <div className="w-1/2 h-5 bg-surface-elevated rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
          </div>
          <div className="relative">
            <Heart className="w-20 h-20 text-text-muted mx-auto mb-4 animate-pulse" />
            <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-4 bg-gradient-to-r from-text-primary to-primary bg-clip-text">
            Your Wishlist Awaits
          </h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Discover amazing products and save your favorites. Your perfect finds are just a click away.
          </p>
          
          <Link href="/products">
            <Button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header with gradient background */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Heart className="w-8 h-8 text-primary fill-primary" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">My Wishlist</h1>
                <p className="text-text-secondary text-sm">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-text-muted">
              <Sparkles className="w-4 h-4" />
              <span>Your favorite picks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Grid with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {paginatedWishlist.map((product, index) => (
          <div 
            key={product.id}
            className="animate-slide-up"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <WishlistItem 
              product={product} 
              onRemove={removeFromWishlist}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ←
          </Button>
          
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1
              const isActive = page === pageNum
              
              return (
                <button
                  key={idx}
                  className={`relative w-10 h-10 rounded-full font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                  )}
                  <span className="relative z-10">{pageNum}</span>
                </button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            →
          </Button>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}