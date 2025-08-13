'use client'
import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        
        <p className="text-text-secondary mb-8">
          We're having trouble loading the products. Please try again.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-primary hover:bg-primary-hover text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <Button 
            href="/"
            variant="outline"
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}