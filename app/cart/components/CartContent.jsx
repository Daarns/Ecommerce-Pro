'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { formatPrice } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/Button'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'

export function CartContent() {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    totalOriginalPrice,
    savings,
    updateQuantity, 
    removeFromCart,
    clearCart 
  } = useCart()

  const [removingItems, setRemovingItems] = useState(new Set())
  const [editingQuantity, setEditingQuantity] = useState(null)
  const [tempQuantity, setTempQuantity] = useState('')
  const [originalQuantity, setOriginalQuantity] = useState(null) // Store original for cancel

  const handleRemoveItem = async (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId))
    
    setTimeout(() => {
      removeFromCart(itemId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 200)
  }

  const handleQuantityClick = (itemId, currentQuantity) => {
    setEditingQuantity(itemId)
    setOriginalQuantity(currentQuantity)
    setTempQuantity(currentQuantity.toString())
  }

  const handleQuantityInputChange = (value) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '')
    setTempQuantity(numericValue)
  }

  const handleQuantitySave = (itemId, maxStock) => {
    const newQuantity = parseInt(tempQuantity) || 1
    const finalQuantity = Math.min(Math.max(newQuantity, 1), maxStock)
    
    updateQuantity(itemId, finalQuantity)
    setEditingQuantity(null)
    setTempQuantity('')
    setOriginalQuantity(null)
  }

  const handleQuantityCancel = () => {
    setEditingQuantity(null)
    setTempQuantity('')
    setOriginalQuantity(null)
  }

  const handleQuantityInputKeyDown = (e, itemId, maxStock) => {
    if (e.key === 'Enter') {
      handleQuantitySave(itemId, maxStock)
    } else if (e.key === 'Escape') {
      handleQuantityCancel()
    }
  }

  const handleQuantityInputBlur = (itemId, maxStock) => {
    // Auto-save when clicking outside
    handleQuantitySave(itemId, maxStock)
  }

  const handleQuantityChange = (itemId, currentQuantity, action, maxStock) => {
    if (action === 'increase') {
      const newQuantity = Math.min(currentQuantity + 1, maxStock)
      updateQuantity(itemId, newQuantity)
    } else if (action === 'decrease') {
      const newQuantity = Math.max(currentQuantity - 1, 1)
      updateQuantity(itemId, newQuantity)
    }
  }

  const shippingThreshold = 500000
  const needsForFreeShipping = Math.max(0, shippingThreshold - totalPrice)
  const qualifiesForFreeShipping = totalPrice >= shippingThreshold

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Your cart is empty
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary-hover text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart', active: true }
        ]} 
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
            Shopping Cart
          </h1>
          <p className="text-text-secondary mt-1">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        
        <button
          onClick={clearCart}
          className="text-sm text-error hover:text-error/80 transition-colors"
        >
          Clear all items
        </button>
      </div>

      {/* Free Shipping Progress */}
      {!qualifiesForFreeShipping && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-accent">
              Free shipping on orders over {formatPrice(shippingThreshold)}
            </span>
            <span className="text-sm text-accent">
              {formatPrice(needsForFreeShipping)} to go
            </span>
          </div>
          <div className="w-full bg-accent/20 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalPrice / shippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {qualifiesForFreeShipping && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm font-medium text-success">
              🎉 You qualify for free shipping!
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`bg-surface border border-border rounded-2xl p-6 transition-all duration-200 ${
                removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <Link href={`/products/${item.product.id}`}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform"
                    />
                  </Link>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link 
                        href={`/products/${item.product.id}`}
                        className="font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-text-secondary mt-1">
                        <span className="text-xs bg-surface-elevated px-2 py-1 rounded">
                          {item.product.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-text-muted hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options */}
                  {(item.size || item.color) && (
                    <div className="text-sm text-text-secondary mb-3">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span> • </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  )}

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </div>
                      {item.product.originalPrice && (
                        <div className="text-sm text-text-muted line-through">
                          {formatPrice(item.product.originalPrice)}
                        </div>
                      )}
                    </div>

                    {/* Simplified Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 'decrease', item.product.stock)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-surface-elevated transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        {/* Simple Editable Quantity Input */}
                        {editingQuantity === item.id ? (
                          <input
                            type="text"
                            value={tempQuantity}
                            onChange={(e) => handleQuantityInputChange(e.target.value)}
                            onBlur={() => handleQuantityInputBlur(item.id, item.product.stock)}
                            onKeyDown={(e) => handleQuantityInputKeyDown(e, item.id, item.product.stock)}
                            className="w-16 py-2 text-sm font-medium text-center bg-transparent focus:outline-none focus:bg-background/50 rounded"
                            autoFocus
                            maxLength="3"
                          />
                        ) : (
                          <button
                            onClick={() => handleQuantityClick(item.id, item.quantity)}
                            className="px-4 py-2 text-sm font-medium min-w-[4rem] text-center hover:bg-surface-elevated transition-colors rounded"
                            title="Click to edit quantity"
                          >
                            {item.quantity}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity, 'increase', item.product.stock)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-2 hover:bg-surface-elevated transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Stock indicator */}
                      <div className="text-xs text-text-muted">
                        Max: {item.product.stock}
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Subtotal:</span>
                      <span className="font-bold text-text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-2xl p-6 sticky top-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              {savings > 0 && (
                <div className="flex justify-between text-success">
                  <span>Savings</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span>{qualifiesForFreeShipping ? 'Free' : 'Calculated at checkout'}</span>
              </div>
              
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold text-text-primary">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <div className="mt-4">
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}