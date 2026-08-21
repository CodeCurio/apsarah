'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Tag, Layers, ChevronRight } from 'lucide-react'
import { fetchPriceTiersSummary } from '@/lib/products-store'

export interface PriceTier {
  id: string
  price: string
  label: string
  description: string
  image: string
  badge: string
  filterValue: string
  minPrice?: number
  maxPrice?: number
}

export const priceTiers: PriceTier[] = [
  {
    id: 'tier-1',
    price: 'UNDER ₹2,500',
    label: 'BUDGET ELEGANCE',
    description: 'Breezy daily-wear cotton suits, printed kurtis & casual tunics',
    image: '/assets/beige-navy-paisley-printed-suit-set-1.webp',
    badge: 'POCKET FRIENDLY',
    filterValue: 'under-2500',
    maxPrice: 2500,
  },
  {
    id: 'tier-2',
    price: '₹2,500 – ₹3,999',
    label: 'EVERYDAY LUXURY',
    description: 'Silk straight suit sets, Kashmiri paisley & modern co-ords',
    image: '/assets/red-embroidered-silk-kurta-set-2.webp',
    badge: 'MOST POPULAR',
    filterValue: '2500-4000',
    minPrice: 2500,
    maxPrice: 4000,
  },
  {
    id: 'tier-3',
    price: '₹4,000 – ₹5,999',
    label: 'CELEBRATION EDIT',
    description: 'Flared pleated Anarkalis, velvet co-ords & strappy shararas',
    image: '/assets/olive-green-pleated-anarkali-kurta-set-2.webp',
    badge: 'FESTIVE SELECTION',
    filterValue: '4000-6000',
    minPrice: 4000,
    maxPrice: 6000,
  },
  {
    id: 'tier-4',
    price: 'ABOVE ₹6,000',
    label: 'ROYAL BRIDAL & LEHENGAS',
    description: 'Intricate zari embroidered lehengas & heavy reception gowns',
    image: '/assets/navy-blue-embroidered-zari-lehenga-set-2.webp',
    badge: 'HERITAGE LUXURY',
    filterValue: 'above-6000',
    minPrice: 6000,
  },
]

export function ShopByPrice() {
  const [products, setProducts] = useState<Array<{ id: string; price: number }>>([])

  useEffect(() => {
    fetchPriceTiersSummary().then((data) => {
      if (data && data.length > 0) setProducts(data)
    })
  }, [])

  const getCountForTier = (tier: PriceTier) => {
    if (!products.length) return null
    return products.filter((p) => {
      if (tier.maxPrice && !tier.minPrice) return p.price < tier.maxPrice
      if (tier.minPrice && tier.maxPrice) return p.price >= tier.minPrice && p.price < tier.maxPrice
      if (tier.minPrice && !tier.maxPrice) return p.price >= tier.minPrice
      return true
    }).length
  }

  return (
    <section className="priceEditSection relative py-20 bg-gradient-to-b from-[#FAF6F0] via-[#F6EEE7] to-[#FAF6F0] overflow-hidden">
      {/* Decorative luxury ambient blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#8F1020]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#EFBD3B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#E2D4C7]/60 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E2D4C7] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#8F1020]" />
              <span className="text-[10px] font-extrabold tracking-widest text-[#8F1020] uppercase font-mono">
                BUDGET-FRIENDLY OPULENCE
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2B1713] tracking-tight">
              Shop by Price
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="text-xs md:text-sm text-slate-600 max-w-md leading-relaxed font-medium">
              Explore curated ethnic collections tailored to your exact budget without compromising on handcrafted elegance.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#8F1020] hover:text-[#590924] transition-colors group"
            >
              <span>Explore All Price Ranges</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4 Price Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {priceTiers.map((tier) => {
            const count = getCountForTier(tier)
            return (
              <Link
                key={tier.id}
                href={`/shop?price=${encodeURIComponent(tier.filterValue)}`}
                className="group relative h-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 border border-[#E2D4C7]/80 transform hover:-translate-y-2"
              >
                {/* Background Image with Zoom */}
                <img
                  src={tier.image}
                  alt={tier.price}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-300" />

                {/* Top Badge & Live Count */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#FAF6F0] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    <Tag className="w-3 h-3 text-[#EFBD3B]" />
                    {tier.badge}
                  </span>

                  {count !== null && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8F1020]/90 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wide shadow-sm">
                      <Layers className="w-3 h-3 text-[#EFBD3B]" />
                      {count} {count === 1 ? 'Design' : 'Designs'}
                    </span>
                  )}
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-3 pt-6">
                  <small className="text-[10px] font-extrabold uppercase tracking-widest text-[#EFBD3B] block">
                    {tier.label}
                  </small>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-sm">
                    {tier.price}
                  </h3>
                  <p className="text-xs text-slate-200/90 leading-relaxed font-medium line-clamp-2">
                    {tier.description}
                  </p>

                  {/* Interactive Button */}
                  <div className="pt-2">
                    <div className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs tracking-wider uppercase group-hover:bg-[#8F1020] group-hover:border-[#8F1020] transition-all duration-300 shadow-sm">
                      <span>Explore Collection</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
