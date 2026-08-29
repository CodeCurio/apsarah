'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import { Product } from '@/lib/products-store'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product: prod }: ProductCardProps) {
  const [currentImg, setCurrentImg] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { addItem } = useCart()
  const { toastSuccess } = useToast()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const wishlisted = isInWishlist(prod.id)

  // Image slideshow on hover
  const startSlide = useCallback(() => {
    if (prod.images.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % prod.images.length)
    }, 1000)
  }, [prod.images.length])

  const stopSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setCurrentImg(0)
  }, [])

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        startSlide()
      }, 350)
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      stopSlide()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, startSlide, stopSlide])

  // 1. Wishlist Heart Click Handler
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(prod.id, prod.name)
  }

  // 2. Quick Add to Cart Handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const size = prod.sizes.find((s) => s.stock > 0)?.size || 'M'
    addItem(prod, 1, size)
    toastSuccess(`Added "${prod.name}" (${size}) to your bag!`)
  }

  return (
    <Link
      href={`/products/${prod.slug}`}
      className="bibaCard group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Area ── */}
      <div className="bibaCardImg relative overflow-hidden">
        {/* Primary and active slideshow image */}
        <img
          src={prod.images[currentImg] || prod.images[0] || '/assets/logo.png'}
          alt={prod.name}
          loading="lazy"
          decoding="async"
          className="bibaCardImgSlide bibaCardImgActive"
        />

        {/* Sale Badge — top left */}
        {prod.discountPercent > 0 && (
          <span className="bibaSaleBadge">Sale</span>
        )}

        {/* Wishlist — top right */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className={`bibaWishlistBtn ${wishlisted ? 'bibaWishlistActive text-rose-600 bg-white' : ''}`}
          onClick={handleWishlistClick}
        >
          <Heart className={`w-[15px] h-[15px] ${wishlisted ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* Quick Add to Bag — bottom center on hover */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`absolute bottom-3 left-3 right-3 py-2 bg-[#8F1020] text-white text-[11px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all duration-300 transform cursor-pointer z-10 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> ADD TO BAG
        </button>

        {/* Dot Indicators — bottom center (when not hovered) */}
        {prod.images.length > 1 && !isHovered && (
          <div className="bibaDots">
            {prod.images.map((_, i) => (
              <span
                key={i}
                className={`bibaDot ${i === currentImg ? 'bibaDotActive' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Card Meta ── */}
      <div className="bibaCardMeta">
        {/* Product Name */}
        <h3 className="bibaCardName">{prod.name}</h3>

        {/* Rating */}
        <div className="bibaCardRating">
          {[1,2,3,4,5].map((s) => (
            <Star
              key={s}
              className={`w-2.5 h-2.5 ${s <= Math.round(prod.rating) ? 'fill-[#c2975c] text-[#c2975c]' : 'text-slate-300'}`}
            />
          ))}
          <span>({prod.reviewCount})</span>
        </div>

        {/* Price Row */}
        <div className="bibaCardPrice">
          <strong>₹{prod.price.toLocaleString()}</strong>
          {prod.oldPrice > prod.price && <del>MRP ₹{prod.oldPrice.toLocaleString()}</del>}
          {prod.discountPercent > 0 && <span className="bibaOffTag">{prod.discountPercent}% OFF</span>}
        </div>

        {/* Colour Swatches */}
        {prod.colors.length > 0 && (
          <div className="bibaColorDots">
            {prod.colors.map((c) => (
              <span
                key={c.hex}
                className="bibaColorDot"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
