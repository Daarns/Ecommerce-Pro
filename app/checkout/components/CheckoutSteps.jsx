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
    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6">
      <nav aria-label="Checkout progress">
        <ol className="flex items-start sm:items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative flex-1">
              <div className="flex flex-col sm:flex-row items-center">
                {/* Step Circle */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      step.id < currentStep
                        ? 'bg-primary border-primary text-primary-text'
                        : step.id === currentStep
                        ? 'bg-primary border-primary text-primary-text'
                        : 'bg-background border-border text-text-muted hover:border-primary/40'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : (
                      <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="mt-2 sm:mt-0 sm:ml-4 min-w-0 flex-1">
                  <p
                    className={`text-xs sm:text-sm font-semibold text-center sm:text-left transition-colors ${
                      step.id <= currentStep
                        ? 'text-text-primary'
                        : 'text-text-muted'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-[10px] sm:text-sm text-center sm:text-left transition-colors ${
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
                <div className="absolute hidden sm:flex top-6 left-6 w-full">
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

              {/* Mobile Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div className="absolute sm:hidden top-5 left-[50%] w-[calc(100%-1rem)]">
                  <div
                    className={`h-0.5 transition-all duration-500 ${
                      step.id < currentStep
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
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
