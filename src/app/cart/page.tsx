'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { PromoCouponWidget } from '@/components/cart/PromoCouponWidget'

export default function CartPage() {
  const { items, itemCount, subtotal, discount, shippingCost, total, appliedCoupon, applyCoupon, removeCoupon, updateQuantity, removeItem } = useCart()
  const { toastSuccess, toastError } = useToast()
  const [couponCode, setCouponCode] = useState('')
  const [applying, setApplying] = useState(false)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    const res = await applyCoupon(couponCode)
    setApplying(false)
    if (res.success) {
      toastSuccess(res.message)
      setCouponCode('')
    } else {
      toastError(res.message)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 bg-white border border-[#E2D4C7] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-10 h-10 text-[#8F1020]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2B1713]">Your Shopping Bag is Empty</h1>
          <p className="text-xs text-slate-500">Explore our handcrafted Indian wear collection and add your favorite outfits to your bag.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8F1020] hover:bg-[#a61528] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all"
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-[#E2D4C7] pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shopping Bag ({itemCount})</h1>
            <p className="text-xs text-slate-500 mt-1">Review your selected items and apply discounts before proceeding to checkout</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1020] hover:underline"
          >
            + Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Item List (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm divide-y divide-slate-100">
            {items.map((item) => {
              const colorName = item.product.colors?.[0]?.name || 'Standard'
              const displaySize = item.selectedSize || item.product.sizes?.[0]?.size || 'M'
              const itemOldPrice = item.product.oldPrice || Math.round(item.product.price * 1.6)
              const itemDiscount = item.product.discountPercent || Math.round(((itemOldPrice - item.product.price) / itemOldPrice) * 100)

              return (
                <div key={`${item.product.id}-${item.selectedSize}`} className="py-6 first:pt-0 last:pb-0 flex gap-4 sm:gap-6 relative">
                  {/* Thumbnail Image */}
                  <Link href={`/products/${item.product.slug}`} className="relative shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-34 sm:w-28 sm:h-38 object-cover rounded-2xl border border-slate-200 shadow-xs"
                    />
                    {itemDiscount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#8F1020] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                        {itemDiscount}% OFF
                      </span>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-sm sm:text-base text-[#2B1713] hover:text-[#8F1020] transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.selectedSize)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant details (Color, Size) */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        {colorName && (
                          <span className="bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#E2D4C7]">
                            Color: <strong className="text-slate-800">{colorName}</strong>
                          </span>
                        )}
                        <span className="bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-[#E2D4C7]">
                          Size: <strong className="text-slate-800">{displaySize}</strong>
                        </span>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-center gap-2.5 mt-3">
                        <strong className="text-[#8F1020] text-base sm:text-lg font-bold">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </strong>
                        {itemOldPrice > item.product.price && (
                          <del className="text-xs text-slate-400">
                            MRP ₹{(itemOldPrice * item.quantity).toLocaleString()}
                          </del>
                        )}
                        {itemDiscount > 0 && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            Save {itemDiscount}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom controls */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                      {/* Quantity adjuster */}
                      <div className="flex items-center gap-1 border border-slate-300 rounded-xl p-1 bg-[#FAF6F0]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="text-xs text-slate-500 hover:text-rose-600 font-medium underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Interactive Promo Codes & Vouchers Section */}
            <PromoCouponWidget compact={false} />

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#2B1713] border-b border-slate-100 pb-3">Order Summary</h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Shipping</span>
                  <span className="font-semibold">{shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingCost}`}</span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg">
                    Add items worth ₹{(799 - (subtotal - discount)).toLocaleString()} more for FREE shipping!
                  </p>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline font-bold text-sm text-[#2B1713]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#8F1020]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 bg-[#8F1020] hover:bg-[#a61528] text-white font-bold text-xs uppercase tracking-wider text-center rounded-2xl shadow-lg shadow-[#8F1020]/20 transition-all"
              >
                Proceed to Checkout →
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-around text-center text-[10px] text-slate-500 pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#8F1020]" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#8F1020]" />
                <span>Express Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
