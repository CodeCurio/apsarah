'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { Product, fetchProducts, readCache } from '@/lib/products-store'
import { ProductCard } from '@/components/shop/ProductCard'

export default function WishlistPage() {
  const { wishlistIds, wishlistCount, toggleWishlist } = useWishlist()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = readCache()
      if (cached && cached.length > 0) {
        return cached.filter((p) => wishlistIds.includes(p.id))
      }
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
    fetchProducts().then((all) => {
      setWishlistProducts(all.filter((p) => wishlistIds.includes(p.id)))
      setLoading(false)
    })
  }, [wishlistIds])

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#8F1020] fill-current" /> My Wishlist ({wishlistCount})
            </h1>
            <p className="text-xs text-slate-500">Your saved ethnic outfits and luxury apparel</p>
          </div>
          <Link href="/account" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#8F1020]" />
            <span>Loading saved outfits...</span>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2D4C7] shadow-sm space-y-4 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-serif font-bold">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500">Save items you love by clicking the heart icon on any product card.</p>
            <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#8F1020] text-white text-xs font-bold rounded-xl shadow-md">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className="absolute top-3 right-3 z-20 p-2 bg-white/90 rounded-full shadow-md text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
