'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Truck } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'ORD-10001'

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ORDER CONFIRMED
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1713]">Thank You for Your Order!</h1>
          <p className="text-xs text-slate-500">
            We have received your order and are preparing your handcrafted garments with care.
          </p>
        </div>

        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E2D4C7] space-y-1 text-xs text-center">
          <span className="text-slate-500 block">Order Number</span>
          <strong className="text-lg font-mono text-[#8F1020] block">{orderNumber}</strong>
          <span className="text-[11px] text-slate-500 block pt-1">Estimated Delivery: 3-5 Business Days</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
          <Link
            href="/account/orders"
            className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" /> Track Order
          </Link>
          <Link
            href="/shop"
            className="py-3 px-4 rounded-xl bg-[#8F1020] hover:bg-[#a61528] text-white font-bold flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] pt-28 text-center text-xs text-slate-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
