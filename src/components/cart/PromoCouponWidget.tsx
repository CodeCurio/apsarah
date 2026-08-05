'use client'

import React, { useState, useEffect } from 'react'
import { Tag, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Sparkles, X, Gift } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { PromoCoupon, fetchAllCoupons } from '@/lib/coupons-store'

interface PromoCouponWidgetProps {
  compact?: boolean // True for CartDrawer, False for full Cart/Checkout pages
}

export function PromoCouponWidget({ compact = false }: PromoCouponWidgetProps) {
  const { subtotal, appliedCoupon, applyCoupon, removeCoupon, discount } = useCart()
  const { toastSuccess, toastError } = useToast()
  
  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [availableOffers, setAvailableOffers] = useState<PromoCoupon[]>([])
  const [showOffers, setShowOffers] = useState(!compact) // Open by default on cart/checkout page

  useEffect(() => {
    fetchAllCoupons().then((data) => {
      setAvailableOffers(data.filter((c) => c.is_active))
    })

    // Listen to admin updates in real-time
    const handleUpdate = () => {
      fetchAllCoupons().then((data) => setAvailableOffers(data.filter((c) => c.is_active)))
    }
    window.addEventListener('coupons_updated', handleUpdate)
    return () => window.removeEventListener('coupons_updated', handleUpdate)
  }, [])

  const handleManualApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    setLoading(true)
    const res = await applyCoupon(inputCode)
    setLoading(false)

    if (res.success) {
      toastSuccess(res.message)
      setInputCode('')
    } else {
      toastError(res.message)
    }
  }

  const handleCardApply = async (code: string) => {
    setLoading(true)
    const res = await applyCoupon(code)
    setLoading(false)

    if (res.success) {
      toastSuccess(res.message)
    } else {
      toastError(res.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2d4c7] p-4 sm:p-5 shadow-2xs space-y-4 text-xs">
      
      {/* Header & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#2b1713]">
          <Gift className="w-4 h-4 text-[#8f1020]" />
          <span>Apply Promo Code or Gift Voucher</span>
        </div>
        {appliedCoupon && (
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 fill-emerald-600 text-white" /> Applied
          </span>
        )}
      </div>

      {/* Applied Coupon Active state Banner */}
      {appliedCoupon ? (
        <div className="p-3.5 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-300 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-mono font-extrabold text-sm text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-200" />
              <span>{appliedCoupon.code}</span>
            </div>
            <p className="text-emerald-800 font-semibold text-xs">
              Awesome! You save <strong className="text-emerald-950 font-bold">₹{discount.toLocaleString()}</strong> on this order.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              removeCoupon()
              toastSuccess('Coupon removed from bag')
            }}
            className="p-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-2xs flex items-center gap-1"
            title="Remove Coupon"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      ) : (
        /* Input Box */
        <form onSubmit={handleManualApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code (e.g. FESTIVE20)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="flex-1 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none font-mono font-bold text-xs uppercase text-slate-800 focus:border-[#8f1020]"
          />
          <button
            type="submit"
            disabled={loading || !inputCode.trim()}
            className="px-5 py-2.5 bg-[#2b1713] hover:bg-[#8f1020] disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            {loading ? '...' : 'APPLY'}
          </button>
        </form>
      )}

      {/* Available Coupons Accordion */}
      {availableOffers.length > 0 && (
        <div className="pt-2 border-t border-[#e2d4c7]/60">
          <button
            type="button"
            onClick={() => setShowOffers(!showOffers)}
            className="w-full py-1 flex items-center justify-between text-[#8f1020] font-bold text-xs cursor-pointer hover:underline"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Available Promotional Offers for You ({availableOffers.length})</span>
            </span>
            {showOffers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOffers && (
            <div className="space-y-2.5 mt-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {availableOffers.map((offer) => {
                const isCurrent = appliedCoupon?.code === offer.code
                const eligible = subtotal >= offer.min_order_amount
                const shortfall = offer.min_order_amount - subtotal

                return (
                  <div
                    key={offer.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : eligible
                        ? 'bg-[#faf5f0] border-[#e2d4c7] hover:border-[#8f1020]'
                        : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-white text-[#8f1020] border border-[#e2d4c7] px-2.5 py-1 rounded-md shadow-2xs">
                          {offer.code}
                        </span>
                        <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded">
                          {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} FLAT OFF`}
                        </span>
                      </div>

                      {isCurrent ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!eligible || loading}
                          onClick={() => handleCardApply(offer.code)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                            eligible
                              ? 'bg-[#8f1020] hover:bg-[#720C18] text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          APPLY
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-700 font-medium leading-snug">
                      {offer.description}
                    </p>

                    {!eligible && subtotal > 0 && (
                      <p className="text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-md flex items-center gap-1">
                        <span>⚠️ Add items worth ₹{shortfall.toLocaleString()} more to unlock this offer! (Min spend: ₹{offer.min_order_amount.toLocaleString()})</span>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
