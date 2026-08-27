import React, { Suspense } from 'react'
import { ShopPageClient } from '@/components/shop/ShopPageClient'
import { fetchProducts } from '@/lib/products-store'

export const revalidate = 60

export const metadata = {
  title: 'Shop Ethnic Wear | Apsarah',
  description: 'Explore handcrafted Kurtas, Suit Sets, Anarkalis and Sarees',
}

export default async function ShopPage() {
  const initialProducts = await fetchProducts().catch(() => [])

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] pt-28 text-center text-xs text-slate-400">Loading collection...</div>}>
      <ShopPageClient initialProducts={initialProducts} />
    </Suspense>
  )
}
