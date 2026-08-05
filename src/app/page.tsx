import { HeroEditorial } from '@/components/hero/HeroEditorial'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { MostLovedSection } from '@/components/home/MostLovedSection'
import { OfferCarousel } from '@/components/home/OfferCarousel'
import { ShopByPrice } from '@/components/home/ShopByPrice'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#fffaf5]">
      {/* 1. Hero Carousel Banners */}
      <HeroEditorial />

      {/* 2. Shop By Category Showcase */}
      <CategoryShowcase />

      {/* 3. Most Loved Products Rail */}
      <MostLovedSection />

      {/* 4. Campaign & Offer Carousel */}
      <OfferCarousel />

      {/* 5. Shop By Price */}
      <ShopByPrice />
    </main>
  )
}
