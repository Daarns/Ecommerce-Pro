'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckout } from '@/app/contexts/CheckoutContext'
import { useCart } from '@/app/contexts/CartContext'
import { useOrders } from '@/app/contexts/OrderContext' // Add this
import { Button } from '@/app/components/ui/Button'
import { ArrowLeft, Check, Package } from 'lucide-react'

export function OrderReview() {
  const router = useRouter()
  const { setStep, shippingInfo, paymentMethod, resetCheckout } = useCheckout()
  const { items, totalPrice, clearCart } = useCart()
  const { createOrder } = useOrders() // Add this
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Calculate totals
  const shippingCost = totalPrice >= 500000 ? 0 : 25000
  const taxAmount = Math.round(totalPrice * 0.11)
  const finalTotal = totalPrice + shippingCost + taxAmount

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Create order data
    const orderData = {
      items: items.map(item => ({
        ...item,
        priceAtTime: item.product.price // Capture price at order time
      })),
      shippingInfo,
      paymentMethod,
      subtotal: totalPrice,
      shipping: shippingCost,
      tax: taxAmount,
      totalAmount: finalTotal,
      currency: 'IDR'
    }

    // Create the order
    const newOrder = createOrder(orderData)
    setOrderId(newOrder.id)
    setOrderComplete(true)
    setIsProcessing(false)

    // Clear cart and reset checkout after successful order
    setTimeout(() => {
      clearCart()
      resetCheckout()
      // Redirect to order confirmation page
      router.push(`/orders/${newOrder.id}`)
    }, 3000)
  }

  if (orderComplete) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-text-secondary mb-6">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div className="bg-background border border-border rounded-lg p-4 mb-6">
          <p className="text-sm text-text-primary">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
        </div>
        <div className="text-sm text-text-secondary flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          Redirecting to order details...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Review Your Order
        </h2>
        <p className="text-text-secondary">
          Please review your order details before placing your order
        </p>
      </div>

      <div className="space-y-6">
        {/* Shipping Information */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text-primary mb-3">Shipping Address</h3>
          <div className="space-y-1 text-sm text-text-secondary">
            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.address}</p>
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
            <p>{shippingInfo.country}</p>
            <p className="pt-2 border-t border-border mt-2">
              Email: {shippingInfo.email}
            </p>
            <p>Phone: {shippingInfo.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text-primary mb-3">Payment Method</h3>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-text-muted" />
            <span className="text-sm text-text-secondary capitalize">
              {paymentMethod.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-background border border-border rounded-lg p-4">
          <label className="flex items-start gap-3 text-sm">
            <input 
              type="checkbox" 
              required
              className="mt-1 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-text-secondary">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(2)}
            disabled={isProcessing}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payment
          </Button>

          <Button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="flex-1 bg-primary hover:bg-primary-hover text-white"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing Order...
              </>
            ) : (
              <>
                Place Order
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}