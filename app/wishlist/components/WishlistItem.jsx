'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/Button'
import { ShoppingBag, Heart, Star, Eye, Trash2 } from 'lucide-react'

export function WishlistItem({ product, onRemove, index }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    // Add slight delay for smooth animation
    setTimeout(() => {
      onRemove(product.id)
    }, 300)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div 
      className={`group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 transform hover:-translate-y-1 ${
        isRemoving ? 'animate-scale-out opacity-0' : ''
      }`}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <div className={`absolute inset-0 bg-surface-elevated animate-pulse ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
        
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Link href={`/products/${product.id}`}>
              <button className="bg-white/90 backdrop-blur-sm text-text-primary p-2.5 rounded-full hover:bg-white transition-all duration-200 hover:scale-110 shadow-lg">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <button 
              onClick={handleRemove}
              className="bg-white/90 backdrop-blur-sm text-error p-2.5 rounded-full hover:bg-error hover:text-white transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-error to-accent text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            -{product.discount}%
          </div>
        )}

        {/* Heart icon */}
        <div className="absolute top-3 right-3 p-2">
          <Heart className="w-5 h-5 text-primary fill-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 space-y-3">
        {/* Product name */}
        <div>
          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-relaxed">
            {product.name}
          </h3>
          
          {/* Category */}
          {product.category && (
            <span className="inline-block mt-1 text-xs text-text-muted bg-surface-elevated px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-text-secondary">{product.rating}</span>
            {product.sold && (
              <span className="text-xs text-text-muted ml-auto">
                {product.sold} sold
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={handleRemove}
            className="px-3 rounded-xl border-error/20 text-error hover:bg-error hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-error/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes scale-out {
          to {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        .animate-scale-out {
          animation: scale-out 0.3s ease-in-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}