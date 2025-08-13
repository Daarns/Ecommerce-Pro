import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { OrderHistory } from './components/OrderHistory'

export const metadata = {
  title: 'Order History - Daarns',
  description: 'View all your orders and track their status',
}

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderHistory />
      </main>
      
      <Footer />
    </div>
  )
}