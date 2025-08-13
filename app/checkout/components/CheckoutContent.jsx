'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/contexts/CartContext'
import { useCheckout } from '@/app/contexts/CheckoutContext'
import { CheckoutSteps } from './CheckoutSteps'
import { ShippingForm } from './ShippingForm'
import { PaymentForm } from './PaymentForm'
import { OrderReview } from './OrderReview'
import { OrderSummary } from './OrderSummary'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'

export function CheckoutContent() {
  const router = useRouter()
  const { items, totalItems } = useCart()
  const { currentStep } = useCheckout()

  // Redirect if cart is empty
  useEffect(() => {
    if (totalItems === 0) {
      router.push('/cart')
    }
  }, [totalItems, router])

  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          No items to checkout
        </h1>
        <p className="text-text-secondary">
          Your cart is empty. Please add some items before proceeding to checkout.
        </p>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm />
      case 2:
        return <PaymentForm />
      case 3:
        return <OrderReview />
      default:
        return <ShippingForm />
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout', href: '/checkout', active: true }
        ]} 
      />

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Checkout
        </h1>
        <p className="text-text-secondary">
          Complete your order in just a few steps
        </p>
      </div>

      {/* Progress Steps */}
      <CheckoutSteps />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {renderStep()}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}