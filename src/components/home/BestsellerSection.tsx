'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Crown, ArrowRight, Sparkles, Filter } from 'lucide-react'
import { Product, fetchProducts, readCache } from '@/lib/products-store'
import { ProductCard } from '@/components/shop/ProductCard'
import { getCategoryAliases } from '@/lib/constants/categories'

const TABS = [
  'All Bestsellers',
  'Suit Sets',
  'Kurtas & Tops',
  'Lehengas',
  'Co-ord Sets',
  'Dresses',
]

export function BestsellerSection() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = readCache()
      if (cached && cached.length > 0) {
        return cached
      }
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Bestsellers')

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data)
      }
      setLoading(false)
    })
  }, [])

  // Filter products by Bestseller and selected tab
  const displayedProducts = useMemo(() => {
    // 1. Prioritize products marked isBestseller or rating >= 4.7
    let pool = products.filter((p) => p.isBestseller)
    if (pool.length < 4) {
      pool = products.slice() // fallback to all products if few marked
    }

    if (activeTab !== 'All Bestsellers') {
      const allowedAliases = [activeTab, ...getCategoryAliases(activeTab)].map((a) => a.toLowerCase())
      pool = pool.filter((p) => allowedAliases.includes((p.category || '').trim().toLowerCase()))
    }

    return pool.slice(0, 8)
  }, [products, activeTab])

  return (
    <section className="relative py-16 md:py-24 bg-[#FAF6F0] border-t border-[#E2D4C7]/60 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8F1020]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EFBD3B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 border-b border-[#E2D4C7]/70 pb-6 md:pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2D4C7] shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-[#8F1020]" />
              <span className="text-[10px] font-extrabold tracking-widest text-[#8F1020] uppercase font-mono">
                ICONIC & TOP RATED
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2B1713] tracking-tight">
              Bestseller Showcase
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed font-medium">
              Handcrafted royal heirlooms and celebratory favourites worn and loved by thousands.
            </p>
          </div>

          {/* Tab Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer shadow-2xs border ${
                    isSelected
                      ? 'bg-[#8F1020] border-[#8F1020] text-white shadow-md scale-105'
                      : 'bg-white border-[#E2D4C7] text-slate-700 hover:border-[#8F1020] hover:text-[#8F1020]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Product Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-[#ede2d5] rounded-2xl" />
                <div className="h-4 bg-[#ede2d5] rounded w-3/4" />
                <div className="h-3 bg-[#f0e7dc] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#E2D4C7] p-8 space-y-4 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-[#8F1020] mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              No bestsellers found under this category right now.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('All Bestsellers')}
              className="px-5 py-2 bg-[#8F1020] text-white font-bold text-xs rounded-xl shadow-md"
            >
              View All Bestsellers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {displayedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#8F1020] text-[#2B1713] hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-[#E2D4C7] hover:border-[#8F1020] shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <span>Explore All 50+ Bestsellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
