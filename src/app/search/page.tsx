'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { Product, fetchProducts, readCache } from '@/lib/products-store'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = readCache()
      if (cached && cached.length > 0) return cached
    }
    return []
  })
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = readCache()
      return !(cached && cached.length > 0)
    }
    return true
  })

  useEffect(() => {
    if (allProducts.length === 0) {
      fetchProducts().then((data) => {
        setAllProducts(data)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [allProducts.length])

  const filtered = allProducts.filter((p) => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.occasion.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-8">
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Search Collection</h1>
          <p className="text-xs text-slate-500">Find your favorite kurtas, suit sets, anarkalis, and sarees</p>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name, fabric, occasion, category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-[#E2D4C7] rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-[#8F1020] shadow-sm"
            />
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-[#8F1020]" />
              <span>Searching collection...</span>
            </div>
          ) : !query.trim() ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Type above to search across our luxury Indian ethnic wear catalog.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm font-bold text-[#2B1713]">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500">Try searching for keywords like &ldquo;Anarkali&rdquo;, &ldquo;Silk&rdquo;, &ldquo;Festive&rdquo;, or &ldquo;Indigo&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {filtered.length} results for &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] pt-28 text-center text-xs text-slate-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
