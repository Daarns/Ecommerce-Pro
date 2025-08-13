'use client'
import { useState } from 'react'
import { useCheckout } from '@/app/contexts/CheckoutContext'
import { Button } from '@/app/components/ui/Button'
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Building2 } from 'lucide-react'

export function PaymentForm() {
  const { paymentMethod, setPaymentMethod, setStep } = useCheckout()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      description: 'GoPay, OVO, DANA, ShopeePay',
      icon: Smartphone
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'BCA, Mandiri, BNI, BRI',
      icon: Building2
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Move to next step
    setStep(3)
    setIsSubmitting(false)
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Payment Method
        </h2>
        <p className="text-text-secondary">
          Choose your preferred payment method
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Methods */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-lg ${
                  paymentMethod === method.id ? 'bg-primary text-white' : 'bg-background text-text-muted'
                }`}>
                  <method.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {method.name}
                    </span>
                    {method.popular && (
                      <span className="px-2 py-1 bg-accent text-white text-xs font-bold rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {method.description}
                  </p>
                </div>
              </div>

              {/* Radio indicator */}
              <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                paymentMethod === method.id
                  ? 'border-primary bg-primary'
                  : 'border-border'
              }`}>
                {paymentMethod === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary mb-1">
                Secure Payment
              </p>
              <p className="text-xs text-text-secondary">
                Your payment information is encrypted and secure. We never store your credit card details.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shipping
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary-hover text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Review Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}