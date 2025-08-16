'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const router = useRouter()
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store user info as customer by default
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: 'customer' // Default role
      }
      
      localStorage.setItem('user', JSON.stringify(newUser))
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Demo: Create a Google user
      const googleUser = {
        id: 'google_' + Date.now(),
        name: 'Jane Smith',
        email: 'jane.smith@gmail.com',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        provider: 'google'
      }
      
      localStorage.setItem('user', JSON.stringify(googleUser))
      router.push('/')
      
    } catch (error) {
      setErrors({ general: 'Google registration failed. Please try again.' })
    } finally {
      setGoogleLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated relative overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_-100px,_rgba(30,58,138,0.15),_transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_20%_100%,_rgba(245,158,11,0.1),_transparent)]"></div>
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center text-text-muted hover:text-text-primary mb-8 transition-all duration-200 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          {/* Main Card */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-2xl mb-6 shadow-lg">
                <User className="w-8 h-8 text-primary-text" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Join EcommercePro</h1>
              <p className="text-text-muted text-sm">Create your account and start shopping</p>
            </div>
            
            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <p className="text-error text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}
            
            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-text-primary">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-surface-elevated/50 border rounded-xl text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-elevated
                      transition-all duration-200 ${
                      errors.name ? 'border-error ring-2 ring-error/20' : 'border-border/30 hover:border-border/60'
                    }`}
                    placeholder="Enter your full name"
                  />
                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    errors.name ? 'text-error' : 'text-text-muted group-focus-within:text-primary'
                  }`} />
                </div>
                {errors.name && (
                  <p className="text-error text-xs flex items-center mt-2">
                    <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-text-primary">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-surface-elevated/50 border rounded-xl text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-elevated
                      transition-all duration-200 ${
                      errors.email ? 'border-error ring-2 ring-error/20' : 'border-border/30 hover:border-border/60'
                    }`}
                    placeholder="Enter your email"
                  />
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    errors.email ? 'text-error' : 'text-text-muted group-focus-within:text-primary'
                  }`} />
                </div>
                {errors.email && (
                  <p className="text-error text-xs flex items-center mt-2">
                    <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 pr-12 bg-surface-elevated/50 border rounded-xl text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-elevated
                      transition-all duration-200 ${
                      errors.password ? 'border-error ring-2 ring-error/20' : 'border-border/30 hover:border-border/60'
                    }`}
                    placeholder="Create a password"
                  />
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    errors.password ? 'text-error' : 'text-text-muted group-focus-within:text-primary'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs flex items-center mt-2">
                    <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 pr-12 bg-surface-elevated/50 border rounded-xl text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-surface-elevated
                      transition-all duration-200 ${
                      errors.confirmPassword ? 'border-error ring-2 ring-error/20' : 'border-border/30 hover:border-border/60'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    errors.confirmPassword ? 'text-error' : 'text-text-muted group-focus-within:text-primary'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-xs flex items-center mt-2">
                    <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              
              {/* Terms Agreement */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary-hover font-medium transition-colors">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary-hover font-medium transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-error text-xs flex items-center">
                    <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>
              
              {/* Register Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-primary-text font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Divider - MOVED AFTER FORM */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-text-muted">or continue with</span>
              </div>
            </div>

            {/* Google Register Button - MOVED TO BOTTOM */}
            <Button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-6"
            >
              {googleLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-700 rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
            
            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-text-muted text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
