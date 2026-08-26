'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react'
import { fetchFeaturedProducts, fetchProducts, Product, readCache } from '@/lib/products-store'
import { useWishlist } from '@/context/WishlistContext'

export function MostLovedSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = readCache()
      if (cached && cached.length > 0) {
        const featured = cached.filter((p) => p.isBestseller)
        return (featured.length > 0 ? featured : cached).slice(0, 6)
      }
    }
    return []
  })
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    fetchFeaturedProducts(15).then((data) => {
      if (data && data.length > 0) {
        setProducts(data)
      } else {
        fetchProducts().then((all) => {
          if (all && all.length > 0) {
            setProducts(all.slice(0, 15))
          }
        })
      }
    })
  }, [])

  const scrollTrack = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = direction === 'right'
        ? trackRef.current.clientWidth * 0.75
        : -trackRef.current.clientWidth * 0.75
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="mostLovedSection">
      <div className="mostLovedContainer">
        {/* Section Header */}
        <div className="mostLovedHeader">
          <div>
            <span className="mostLovedEyebrow">CURATED FOR YOU</span>
            <h2>Most Loved</h2>
            <p className="mostLovedDesc">
              Handpicked bestsellers crafted for timeless grace.
            </p>
          </div>

          <div className="mostLovedControls">
            <Link href="/shop" className="mostLovedViewAll">
              DISCOVER ALL
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollTrack('left')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollTrack('right')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid / Track with signature curve layout */}
        <div className="mostLovedGrid" ref={trackRef}>
          {products.length === 0 ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="mostLovedCard animate-pulse space-y-3">
                <div className="mostLovedImageArch bg-[#FAF6F0] w-full aspect-[3/4]" />
                <div className="h-4 bg-[#f0e7dc] rounded w-3/4" />
                <div className="h-3 bg-[#ede2d5] rounded w-1/2" />
              </div>
            ))
          ) : (
            products.map((prod) => {
              const isWishlisted = isInWishlist(prod.id)
              const productSlug = prod.slug || prod.id
              return (
                <Link key={prod.id} href={`/products/${productSlug}`} className="mostLovedCard group">
                  <div className="relative w-full">
                    <div className="mostLovedImageArch">
                      <img src={prod.images[0]} alt={prod.name} loading="lazy" />
                      
                      {prod.discountPercent > 0 && (
                        <span className="mostLovedBadge">SALE • {prod.discountPercent}% OFF</span>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label="Wishlist"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        await toggleWishlist(prod.id, prod.name)
                      }}
                      className="mostLovedWishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#8f1020] text-[#8f1020]' : 'text-slate-700'}`} />
                    </button>
                  </div>

                  <div className="mostLovedMetaRow">
                    <span className="mostLovedCategory">{prod.category.toUpperCase()}</span>
                    <span className="mostLovedRating">
                      <Star className="w-3 h-3 fill-[#EFBD3B] text-[#EFBD3B] inline mr-1" />
                      {prod.rating || '4.9'}
                    </span>
                  </div>

                  <h3 className="mostLovedTitle">{prod.name}</h3>

                  <div className="mostLovedPriceRow">
                    <span className="mostLovedPrice">₹{prod.price.toLocaleString()}</span>
                    {prod.oldPrice > prod.price && (
                      <del className="mostLovedOldPrice">₹{prod.oldPrice.toLocaleString()}</del>
                    )}
                    {prod.discountPercent > 0 && (
                      <span className="mostLovedDiscountTag font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        SAVE ₹{(prod.oldPrice - prod.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
