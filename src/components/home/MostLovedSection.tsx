'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react'
import { fetchProducts, initialProducts, Product } from '@/lib/products-store'
import { useWishlist } from '@/context/WishlistContext'

export function MostLovedSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts.slice(0, 6))
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.slice(0, 6))
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
          {products.map((prod) => {
            const isWishlisted = isInWishlist(prod.id)
            return (
              <Link key={prod.id} href={`/product/${prod.slug || prod.id}`} className="mostLovedCard group">
                <div className="mostLovedImageArch">
                  <img src={prod.images[0]} alt={prod.name} loading="lazy" />
                  
                  {prod.discountPercent > 0 && (
                    <span className="mostLovedBadge">SALE • {prod.discountPercent}% OFF</span>
                  )}

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
          })}
        </div>
      </div>
    </section>
  )
}
