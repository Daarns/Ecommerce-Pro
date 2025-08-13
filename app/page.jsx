import { Hero } from '@/app/components/sections/Hero'
import { Categories } from '@/app/components/sections/Categories'
import { FeaturedProducts } from '@/app/components/sections/FeaturedProducts'
import { Benefit } from '@/app/components/sections/Benefit'
import { Header } from '@/app/components/navigation/Header'
import { Footer } from '@/app/components/navigation/Footer'
 
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Benefit />
      </main>
      
      <Footer />
    </div>
  )
}