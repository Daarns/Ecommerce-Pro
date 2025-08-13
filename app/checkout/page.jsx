import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { CheckoutContent } from './components/CheckoutContent'

export const metadata = {
  title: 'Checkout - Daarns',
  description: 'Complete your order securely',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutContent />
      </main>
      
      <Footer />
    </div>
  )
}