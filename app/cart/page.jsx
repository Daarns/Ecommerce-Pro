import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { CartContent } from './components/CartContent'

export const metadata = {
  title: 'Shopping Cart - EcommercePro',
  description: 'Review your selected items before checkout',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartContent />
      </main>
      
      <Footer />
    </div>
  )
}