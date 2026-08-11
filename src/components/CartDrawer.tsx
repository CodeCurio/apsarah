'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Heart, Sparkles, Check, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { fetchProducts, Product, initialProducts } from '@/lib/products-store'
import { PromoCouponWidget } from '@/components/cart/PromoCouponWidget'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingCost,
    total,
    appliedCoupon,
    removeCoupon,
    itemCount,
    addItem,
  } = useCart()

  const [recommendations, setRecommendations] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    fetchProducts().then(prods => {
      if (mounted) {
        setRecommendations(prods)
      }
    }).catch(() => {
      if (mounted) setRecommendations(initialProducts)
    })
    return () => { mounted = false }
  }, [])

  if (!isOpen) return null

  // Filter out items already in cart for recommendations
  const cartProductIds = new Set(items.map(i => i.product.id))
  const suggestedProducts = (recommendations.length > 0 ? recommendations : initialProducts)
    .filter(p => !cartProductIds.has(p.id))
    .slice(0, 3)

  return (
    <>
      {/* Backdrop with z-[3000] to sit above sticky navbar & top bar */}
      <div
        className="fixed inset-0 bg-black/60 z-[3000] backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="fixed right-0 top-0 bottom-0 h-full w-full max-w-[430px] bg-white z-[3005] shadow-2xl flex flex-col font-sans transition-transform duration-300 animate-in slide-in-from-right">
        
        {/* 1. Header (BIBA Style) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#fffaf5]">
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-base tracking-tight text-[#2b1713]">
              My Cart
            </h2>
            <span className="text-slate-300 text-sm">|</span>
            <span className="text-xs font-semibold text-slate-600">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal > 0 && (
          <div className="bg-[#FAF6F0] px-5 py-2 border-b border-[#e8ded5] text-center">
            {subtotal >= 799 ? (
              <p className="text-[11px] font-medium text-emerald-800 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                Yay! You qualify for <strong>FREE Shipping</strong>
              </p>
            ) : (
              <p className="text-[11px] text-slate-600">
                Add <strong>₹{(799 - subtotal).toLocaleString()}</strong> more for <span className="text-[#8f1020] font-bold">FREE Shipping</span>
              </p>
            )}
          </div>
        )}

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
              <div className="w-20 h-20 bg-[#faf6f0] border border-[#e2d4c7] rounded-full flex items-center justify-center text-[#8f1020]">
                <ShoppingBag className="w-10 h-10 opacity-70" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2b1713]">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                  Looks like you haven&apos;t added any handcrafted outfits yet.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 px-8 py-3 bg-[#8f1020] hover:bg-[#a61528] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="p-4 space-y-4">
                {items.map((item) => {
                  const colorName = item.product.colors?.[0]?.name || 'Standard'
                  const displaySize = item.selectedSize || item.product.sizes?.[0]?.size || 'M'
                  const itemOldPrice = item.product.oldPrice || Math.round(item.product.price * 1.6)
                  const itemDiscount = item.product.discountPercent || Math.round(((itemOldPrice - item.product.price) / itemOldPrice) * 100)
                  const sizeObj = item.product.sizes?.find((s) => s.size === displaySize)
                  const maxStock = sizeObj !== undefined ? sizeObj.stock : 999
                  const isAtMax = item.quantity >= maxStock

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all relative group"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                      >
                        <img
                          src={item.product.images[0] || '/assets/logo.png'}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="pr-6">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-semibold text-xs text-[#2b1713] line-clamp-2 hover:text-[#8f1020] transition-colors leading-snug"
                          >
                            {item.product.name}
                          </Link>

                          {/* Attribute Meta (Color, Size) */}
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                            {colorName && (
                              <span>Color: <strong className="text-slate-700 font-medium">{colorName}</strong></span>
                            )}
                            <span>Size: <strong className="text-slate-700 font-medium">{displaySize}</strong></span>
                          </div>

                          {/* Pricing Row with Discount Tag */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-sm text-[#2b1713]">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                            {itemOldPrice > item.product.price && (
                              <del className="text-xs text-slate-400">
                                ₹{itemOldPrice.toLocaleString()}
                              </del>
                            )}
                            {itemDiscount > 0 && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                {itemDiscount}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stock Limit Warning */}
                        {isAtMax && maxStock < 999 && (
                          <div className="text-[10px] font-bold text-amber-700 mt-1">
                            ⚠️ Max stock reached ({maxStock} available)
                          </div>
                        )}

                        {/* Bottom Actions: Qty Control & Delete */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50/50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#2b1713]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isAtMax}
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              className={`w-7 h-7 flex items-center justify-center transition-colors ${
                                isAtMax
                                  ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                                  : 'text-slate-600 hover:bg-slate-200 hover:text-black'
                              }`}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id, item.selectedSize)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove item button (top-right X inside card) */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.selectedSize)}
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Free Delivery Offer Banner */}
              <div className="px-4 py-2.5">
                <div className="bg-[#FAF6F0] border border-[#e8ded5] rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#8f1020] shrink-0" />
                    <span className="text-[#2b1713] text-[11px] font-medium">
                      <strong>Free Express Delivery</strong> on orders above ₹799
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider shrink-0">
                    Active
                  </span>
                </div>
              </div>

              {/* "COMPLETE THE SET" / Recommended Recommendations Section (BIBA style) */}
              {suggestedProducts.length > 0 && (
                <div className="p-4 bg-[#FAF6F0] border-t border-b border-[#e2d4c7]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-[#2b1713] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8f1020]" /> Complete The Set
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">Recommended for you</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {suggestedProducts.map(prod => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-xl p-2 border border-[#e2d4c7] shadow-xs flex flex-col justify-between group"
                      >
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-1 left-1 bg-[#8f1020] text-white text-[8px] font-bold px-1 rounded">
                            {prod.discountPercent || 40}% OFF
                          </span>
                        </div>
                        <p className="text-[10px] font-medium text-[#2b1713] line-clamp-1 leading-tight">
                          {prod.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] font-bold text-[#8f1020]">
                            ₹{prod.price.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => addItem(prod, 1, prod.sizes[0]?.size || 'M')}
                            className="px-2 py-1 bg-[#2b1713] hover:bg-[#8f1020] text-white text-[9px] font-bold rounded-lg transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 3. Sticky Footer (BIBA Style dual action buttons + breakdown) */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-white p-4 space-y-3.5 shadow-lg">
            <PromoCouponWidget compact={true} />

            {/* Bill Summary Lines */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Platform / Shipping Fee</span>
                <span>{shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 mt-2 text-sm text-[#2b1713]">
                <span className="font-bold">Order Total</span>
                <span className="font-bold text-lg text-[#8f1020]">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Dual Buttons (Checkout & View Cart) like BIBA */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3 border-2 border-[#8f1020] text-[#8f1020] hover:bg-rose-50 font-bold text-xs uppercase tracking-wider text-center rounded-xl transition-all flex items-center justify-center"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 bg-[#8f1020] hover:bg-[#a61528] text-white font-bold text-xs uppercase tracking-wider text-center rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Authentic Products & Easy Returns</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

