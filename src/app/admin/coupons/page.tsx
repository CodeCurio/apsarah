'use client'

import React, { useEffect, useState } from 'react'
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, Power, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import {
  PromoCoupon,
  fetchAllCoupons,
  createCoupon,
  toggleCouponActive,
  removeCouponById,
  getCouponsStore,
} from '@/lib/coupons-store'

export default function AdminCouponsPage() {
  const { toastSuccess, toastError } = useToast()
  const [coupons, setCoupons] = useState<PromoCoupon[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage')
  const [value, setValue] = useState(20)
  const [minOrder, setMinOrder] = useState(2999)
  const [maxDiscount, setMaxDiscount] = useState<number | ''>(2000)
  const [usageLimit, setUsageLimit] = useState<number | ''>(100)
  const [description, setDescription] = useState('Flat 20% OFF on luxury ethnic wear above ₹2,999')
  const [creating, setCreating] = useState(false)

  const loadCoupons = async () => {
    setLoading(true)
    const data = await fetchAllCoupons()
    setCoupons(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '')
    if (!cleanCode) {
      toastError('Please enter a valid coupon code (letters and numbers only)')
      return
    }

    if (coupons.some((c) => c.code === cleanCode)) {
      toastError(`Coupon "${cleanCode}" already exists!`)
      return
    }

    setCreating(true)
    const newDoc = await createCoupon({
      code: cleanCode,
      type,
      value: Number(value),
      min_order_amount: Number(minOrder),
      max_discount_amount: maxDiscount ? Number(maxDiscount) : undefined,
      usage_limit: usageLimit ? Number(usageLimit) : undefined,
      description: description.trim() || `${type === 'percentage' ? `${value}%` : `₹${value}`} OFF on orders above ₹${minOrder}`,
      is_active: true,
    })
    setCreating(false)

    setCoupons((prev) => [newDoc, ...prev.filter((c) => c.code !== newDoc.code)])
    setCode('')
    toastSuccess(`🎉 Promo Code "${newDoc.code}" has been published to the store!`)
  }

  const handleToggleActive = async (id: string, codeStr: string, currentStatus: boolean) => {
    const updated = await toggleCouponActive(id)
    setCoupons(updated)
    toastSuccess(`Coupon "${codeStr}" is now ${!currentStatus ? 'ACTIVE ✅' : 'INACTIVE ⏸️'}`)
  }

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you certain you wish to remove promo code "${couponCode}" forever?`)) return
    const updated = await removeCouponById(id)
    setCoupons(updated)
    toastSuccess(`Promo code "${couponCode}" deleted successfully`)
  }

  const handleApplyPreset = (
    preCode: string,
    preType: 'percentage' | 'fixed',
    preValue: number,
    preMin: number,
    preMax: number | '',
    preDesc: string
  ) => {
    setCode(preCode)
    setType(preType)
    setValue(preValue)
    setMinOrder(preMin)
    setMaxDiscount(preMax)
    setDescription(preDesc)
    toastSuccess('Template settings loaded into form! Edit code if needed and hit Publish.')
  }

  const totalRedemptions = coupons.reduce((sum, c) => sum + c.times_used, 0)
  const activeCount = coupons.filter((c) => c.is_active).length

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1f0b08] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-white/10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#efbd3b]">STORE PROMOTIONS ENGINE</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Coupon & Voucher Management</h1>
          <p className="text-xs text-white/70 max-w-xl">
            Create high-converting promo codes with automated condition checking, minimum spend thresholds, and maximum discount caps.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex gap-3 text-xs">
          <div className="bg-white/10 border border-white/15 p-3.5 rounded-2xl text-center min-w-[110px]">
            <span className="text-[10px] uppercase text-white/60 block font-bold">Active Vouchers</span>
            <span className="text-2xl font-serif font-extrabold text-[#efbd3b]">{activeCount}</span>
          </div>
          <div className="bg-white/10 border border-white/15 p-3.5 rounded-2xl text-center min-w-[110px]">
            <span className="text-[10px] uppercase text-white/60 block font-bold">Times Redeemed</span>
            <span className="text-2xl font-serif font-extrabold text-white">{totalRedemptions}</span>
          </div>
        </div>
      </div>

      {/* ⚡ ONE-CLICK TEMPLATES STRIP */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
          <span className="text-xs font-extrabold text-[#2b1713] uppercase tracking-wider">
            ⚡ Quick One-Click Campaign Presets (Click to Auto-fill Form below)
          </span>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleApplyPreset('FESTIVE25', 'percentage', 25, 3999, 3000, 'Special 25% OFF on Bridal & Wedding collections above ₹3,999 (Max ₹3,000 off)')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#8f1020] border border-amber-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            🔥 Festive 25% OFF (Min ₹3,999)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('WELCOME500', 'fixed', 500, 2999, '', 'Instant ₹500 Flat voucher on your first order above ₹2,999')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-emerald-800 border border-emerald-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            🎁 Flat ₹500 Welcome Voucher (Min ₹2,999)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('ROYAL15', 'percentage', 15, 1999, 1500, 'Flat 15% discount on everyday Silk & Kurta orders above ₹1,999')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-blue-900 border border-blue-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            👑 Royal 15% OFF (Min ₹1,999)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('VIP1000', 'fixed', 1000, 6999, '', 'Exclusive ₹1,000 Flat savings on VIP order carts exceeding ₹6,999')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-purple-900 border border-purple-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            💎 VIP ₹1,000 Flat Deal (Min ₹6,999)
          </button>
        </div>
      </div>

      {/* Main Content Grid: Create Form (Left) vs Active List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CREATE COUPON FORM (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-[#e2d4c7] shadow-md space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e2d4c7]/60 pb-3.5">
            <h2 className="font-serif font-bold text-base text-[#2b1713] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#8f1020]" /> Create New Promo Code
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Instant Store Activation</span>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Promo Code Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-4 py-3 outline-none font-mono font-bold text-base uppercase focus:border-[#8f1020] text-[#8f1020] shadow-inner"
                />
                <span className="absolute right-3.5 top-3.5 text-[10px] text-slate-400 font-semibold">ALL CAPS</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-3 outline-none font-bold text-slate-800"
                >
                  <option value="percentage">Percentage (% OFF)</option>
                  <option value="fixed">Fixed Amount (₹ OFF)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {type === 'percentage' ? 'Percentage Rate (%) *' : 'Flat Discount (₹) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={type === 'percentage' ? 95 : 50000}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-3 outline-none font-bold text-slate-800 focus:border-[#8f1020]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Min Order Subtotal (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-800 focus:border-[#8f1020]"
                  placeholder="e.g. 2999"
                />
              </div>

              {type === 'percentage' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-800 focus:border-[#8f1020]"
                    placeholder="Optional ceiling"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-800"
                    placeholder="e.g. 100 uses"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer-Facing Offer Description *</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe why this coupon is awesome..."
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl p-3.5 outline-none font-medium text-slate-800 focus:border-[#8f1020] leading-snug"
              />
              <p className="text-[10px] text-slate-400 mt-1">This text appears directly inside the Cart & Checkout available vouchers drawer!</p>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-4 bg-[#8f1020] hover:bg-[#720C18] disabled:opacity-60 text-white font-serif font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>{creating ? 'Publishing Offer...' : 'PUBLISH PROMO CODE TO STORE'}</span>
            </button>
          </form>
        </div>

        {/* ACTIVE COUPONS CATALOG TABLE (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2b1713] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#8f1020]" /> Active Promotions ({coupons.length})
            </h3>
            <span className="text-xs text-slate-500">Customers can apply these at Checkout & Bag</span>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-[#e2d4c7] text-center text-slate-400">
              Loading store promotional catalog...
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#e2d4c7] text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-[#8f1020] mx-auto opacity-60" />
              <p className="font-bold text-sm text-[#2b1713]">No discount codes published yet.</p>
              <p className="text-xs text-slate-500">Click a preset button above or fill the form to create your first promotion!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl bg-white border transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    c.is_active ? 'border-[#e2d4c7] hover:border-[#8f1020]' : 'border-slate-200 bg-slate-50 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-extrabold text-sm sm:text-base text-white bg-[#8f1020] px-3 py-1 rounded-lg shadow-xs tracking-wider">
                        {c.code}
                      </span>
                      {c.is_active ? (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          🟢 ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                          ⏸️ DISABLED
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                        {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 leading-snug pt-0.5">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 pt-1">
                      <span>🛒 Min Order: <strong>₹{c.min_order_amount.toLocaleString()}</strong></span>
                      {c.max_discount_amount && (
                        <span>Max Cap: <strong>₹{c.max_discount_amount.toLocaleString()}</strong></span>
                      )}
                      <span>🔥 Redeemed: <strong className="text-[#8f1020]">{c.times_used}</strong> times</span>
                    </div>
                  </div>

                  {/* Actions: Toggle Active & Delete */}
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c.id, c.code, c.is_active)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
                        c.is_active
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{c.is_active ? 'Disable' : 'Enable'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.code)}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
