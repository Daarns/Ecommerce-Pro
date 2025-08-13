import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { UserDashboard } from './components/UserDashboard'

export const metadata = {
  title: 'My Account - Daarns',
  description: 'Manage your profile, addresses, and orders',
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserDashboard />
      </main>
      <Footer />
    </div>
  )
}