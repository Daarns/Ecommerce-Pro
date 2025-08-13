import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { OrderDetail } from './components/OrderDetail'

export const metadata = {
  title: 'Order Details - Daarns',
  description: 'View your order details and tracking information',
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderDetail orderId={id} />
      </main>
      
      <Footer />
    </div>
  )
}