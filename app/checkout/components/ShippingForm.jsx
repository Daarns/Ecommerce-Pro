'use client'
import { useState } from 'react'
import { useCheckout } from '@/app/contexts/CheckoutContext'
import { Button } from '@/app/components/ui/Button'
import { ArrowRight, MapPin, User, Mail, Phone } from 'lucide-react'

export function ShippingForm() {
  const { 
    shippingInfo, 
    setShippingInfo, 
    setStep, 
    validateShippingInfo 
  } = useCheckout()
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo({ [name]: value })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    const validationErrors = validateShippingInfo()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Move to next step
    setStep(2)
    setIsSubmitting(false)
  }

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 bg-surface border rounded-xl text-text-primary placeholder-text-muted
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-200 ${
      errors[fieldName] 
        ? 'border-error ring-2 ring-error/20' 
        : 'border-border hover:border-border/80'
    }
  `

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Shipping Information
        </h2>
        <p className="text-text-secondary">
          Please provide your shipping address and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-text-primary">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleInputChange}
                className={inputClasses('firstName')}
                placeholder="Enter first name"
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-error">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-text-primary">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleInputChange}
                className={inputClasses('lastName')}
                placeholder="Enter last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-error">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                className={inputClasses('email')}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                className={inputClasses('phone')}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-error">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-text-primary">
            Street Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
              className={inputClasses('address')}
              placeholder="Enter street address"
            />
          </div>
          {errors.address && (
            <p className="text-sm text-error">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-text-primary">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-surface border rounded-xl text-text-primary placeholder-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all duration-200 ${
                errors.city 
                  ? 'border-error ring-2 ring-error/20' 
                  : 'border-border hover:border-border/80'
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-sm text-error">{errors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-text-primary">
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={shippingInfo.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all duration-200 hover:border-border/80"
              placeholder="Enter state"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="zipCode" className="block text-sm font-medium text-text-primary">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-surface border rounded-xl text-text-primary placeholder-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                transition-all duration-200 ${
                errors.zipCode 
                  ? 'border-error ring-2 ring-error/20' 
                  : 'border-border hover:border-border/80'
              }`}
              placeholder="ZIP code"
            />
            {errors.zipCode && (
              <p className="text-sm text-error">{errors.zipCode}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-medium text-text-primary">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={shippingInfo.country}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200 hover:border-border/80"
          >
            <option value="Indonesia">Indonesia</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Singapore">Singapore</option>
            <option value="Thailand">Thailand</option>
            <option value="Philippines">Philippines</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-primary-text py-3 font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
