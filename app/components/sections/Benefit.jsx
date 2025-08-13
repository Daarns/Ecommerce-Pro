import { Truck, Shield, Headphones, CreditCard } from 'lucide-react'

export function Benefit() {
  const benefits = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Secure Payment", 
      description: "100% secure payment methods",
      color: "text-green-500"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer support",
      color: "text-purple-500"
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "text-orange-500"
    }
  ]

  return (
    <section className="py-16 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Why Choose EcommercePro?
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We're committed to providing the best shopping experience
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}