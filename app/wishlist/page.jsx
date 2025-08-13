'use client'
import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
import { Wishlist } from './components/Wishlist'

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto py-8 px-4 w-full">
        <Wishlist />
      </main>
      <Footer />
    </div>
  )
}