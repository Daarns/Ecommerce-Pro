'use client'
import { useCart } from '@/app/contexts/CartContext'
import { formatPrice } from '@/app/lib/utils'
import Image from 'next/image'
import { Truck, Shield, Clock } from 'lucide-react'

export function OrderSummary() {
  const { items, totalItems, totalPrice, totalOriginalPrice, savings } = useCart()

  const shippingCost = totalPrice >= 500000 ? 0 : 25000
  const taxRate = 0.11 // 11% PPN
  const taxAmount = Math.round(totalPrice * taxRate)
  const finalTotal = totalPrice + shippingCost + taxAmount

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden sticky top-8">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">
          Order Summary
        </h3>
        <p className="text-sm text-text-secondary">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Items List */}
      <div className="p-6 border-b border-border max-h-64 overflow-y-auto">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-background flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal:</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-success">
            <span>Savings:</span>
            <span>-{formatPrice(savings)}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary">
          <span>Shipping:</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-success font-medium">FREE</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        <div className="flex justify-between text-text-secondary">
          <span>Tax (PPN 11%):</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-text-primary">Total:</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        {/* Free Shipping Notice */}
        {shippingCost === 0 && totalPrice >= 500000 && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-success" />
              <span className="text-sm text-success font-medium">
                Free shipping applied!
              </span>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure payment protection</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free shipping on orders over Rp 500K</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Clock className="w-4 h-4 text-primary" />
              <span>2-3 business days delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}