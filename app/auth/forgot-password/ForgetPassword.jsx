'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSent(true)
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-lg border border-border p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">Check Your Email</h1>
            
            <p className="text-text-secondary mb-6">
              We've sent a password reset link to{' '}
              <span className="text-text-primary font-medium">{email}</span>
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                variant="secondary"
                className="w-full"
              >
                Try Another Email
              </Button>
              
              <Link href="/login">
                <Button className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
            
            <p className="text-xs text-text-muted mt-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link href="/login" className="inline-flex items-center text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>
        
        <div className="bg-surface rounded-lg border border-border p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password?</h1>
            <p className="text-text-secondary">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-6">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}
          
          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 bg-background border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    error ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter your email address"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              </div>
            </div>
            
            {/* Reset Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>
          </form>
          
          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}