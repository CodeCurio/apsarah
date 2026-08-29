import { HeroEditorial } from '@/components/hero/HeroEditorial'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { MostLovedSection } from '@/components/home/MostLovedSection'
import { BestsellerSection } from '@/components/home/BestsellerSection'
import { OfferCarousel } from '@/components/home/OfferCarousel'
import { ShopByPrice } from '@/components/home/ShopByPrice'

import { fetchProducts } from '@/lib/products-store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const initialProducts = await fetchProducts().catch(() => [])

  return (
    <main className="relative min-h-screen bg-[#fffaf5]">
      {/* 1. Hero Carousel Banners */}
      <HeroEditorial />

      {/* 2. Shop By Category Showcase */}
      <CategoryShowcase />

      {/* 3. Most Loved Products Rail */}
      <MostLovedSection initialProducts={initialProducts} />

      {/* 4. Bestseller Showcase Grid with Category Filter Tabs */}
      <BestsellerSection initialProducts={initialProducts} />

      {/* 5. Campaign & Offer Carousel */}
      <OfferCarousel />

      {/* 6. Shop By Price */}
      <ShopByPrice initialProducts={initialProducts} />
    </main>
  )
}
