'use client'
import { Check, CreditCard, Package, Truck } from 'lucide-react'
import { useCheckout } from '@/app/contexts/CheckoutContext'

export function CheckoutSteps() {
  const { currentStep } = useCheckout()

  const steps = [
    {
      id: 1,
      name: 'Shipping',
      description: 'Address & Contact',
      icon: Truck,
      href: '#shipping'
    },
    {
      id: 2,
      name: 'Payment',
      description: 'Payment Method',
      icon: CreditCard,
      href: '#payment'
    },
    {
      id: 3,
      name: 'Review',
      description: 'Order Review',
      icon: Package,
      href: '#review'
    }
  ]

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <nav aria-label="Checkout progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative flex-1">
              <div className="flex items-center">
                {/* Step Circle */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      step.id < currentStep
                        ? 'bg-primary border-primary text-white'
                        : step.id === currentStep
                        ? 'bg-primary border-primary text-white'
                        : 'bg-background border-border text-text-muted hover:border-primary/40'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="ml-4 min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      step.id <= currentStep
                        ? 'text-text-primary'
                        : 'text-text-muted'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-sm transition-colors ${
                      step.id <= currentStep
                        ? 'text-text-secondary'
                        : 'text-text-muted'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-6 left-6 w-full flex">
                  <div
                    className={`h-0.5 flex-1 transition-all duration-500 ${
                      step.id < currentStep
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
                    style={{ marginLeft: '3rem' }}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}