'use client'

import { createClient } from '@/lib/supabase/client'

export interface PromoCoupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order_amount: number
  max_discount_amount?: number
  usage_limit?: number
  times_used: number
  is_active: boolean
  description: string
  created_at: string
  expires_at?: string
}

export const initialCoupons: PromoCoupon[] = [
  {
    id: 'c1',
    code: 'FESTIVE20',
    type: 'percentage',
    value: 20,
    min_order_amount: 2999,
    max_discount_amount: 2500,
    times_used: 14,
    is_active: true,
    description: 'Flat 20% OFF on all luxury bridal & festive ensembles above ₹2,999 (Max ₹2,500 off)',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    code: 'WELCOME500',
    type: 'fixed',
    value: 500,
    min_order_amount: 3499,
    times_used: 29,
    is_active: true,
    description: 'Instant ₹500 Flat OFF on your first royal shopping bag above ₹3,499',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    code: 'ROYAL10',
    type: 'percentage',
    value: 10,
    min_order_amount: 1499,
    max_discount_amount: 1000,
    times_used: 42,
    is_active: true,
    description: 'Special 10% OFF privilege discount on heritage silk & everyday kurtas (Max ₹1,000 off)',
    created_at: new Date().toISOString(),
  },
]

const COUPONS_KEY = 'apsarah_coupons_store_v1'

// Load coupons from localStorage or initialize with defaults
export function getCouponsStore(): PromoCoupon[] {
  if (typeof window === 'undefined') return initialCoupons
  try {
    const saved = localStorage.getItem(COUPONS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to load coupons from storage:', e)
  }
  return initialCoupons
}

export function saveCouponsStore(coupons: PromoCoupon[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
    window.dispatchEvent(new Event('coupons_updated'))
  } catch (e) {
    console.error('Failed to save coupons to storage:', e)
  }
}

// Sync from Supabase if table exists, fallback to localStorage
export async function fetchAllCoupons(): Promise<PromoCoupon[]> {
  const local = getCouponsStore()
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    
    if (!error && data && data.length > 0) {
      const mapped: PromoCoupon[] = data.map((d: any) => ({
        id: d.id || String(Math.random()),
        code: (d.code || '').toUpperCase(),
        type: d.type === 'fixed' || d.type === 'percentage' ? d.type : 'percentage',
        value: Number(d.value || d.discount_value || 0),
        min_order_amount: Number(d.min_order_amount || 0),
        max_discount_amount: d.max_discount_amount ? Number(d.max_discount_amount) : undefined,
        usage_limit: d.usage_limit ? Number(d.usage_limit) : undefined,
        times_used: Number(d.times_used || 0),
        is_active: Boolean(d.is_active ?? true),
        description: d.description || `${d.type === 'percentage' ? `${d.value}% OFF` : `₹${d.value} OFF`} on orders over ₹${d.min_order_amount}`,
        created_at: d.created_at || new Date().toISOString(),
        expires_at: d.valid_until || d.expires_at || undefined
      }))
      saveCouponsStore(mapped)
      return mapped
    }
  } catch {
    // Suppress error, return local store
  }
  return local
}

export async function createCoupon(newCoupon: Omit<PromoCoupon, 'id' | 'times_used' | 'created_at'>): Promise<PromoCoupon> {
  const current = getCouponsStore()
  const toSave: PromoCoupon = {
    ...newCoupon,
    id: 'cp_' + Math.random().toString(36).substr(2, 9),
    times_used: 0,
    created_at: new Date().toISOString(),
  }

  // Save in local storage immediately for responsive UI
  const updated = [toSave, ...current]
  saveCouponsStore(updated)

  // Try saving to Supabase in parallel
  try {
    const supabase = createClient()
    await supabase.from('coupons').insert({
      code: toSave.code,
      type: toSave.type,
      value: toSave.value,
      min_order_amount: toSave.min_order_amount,
      max_discount_amount: toSave.max_discount_amount || null,
      usage_limit: toSave.usage_limit || null,
      times_used: 0,
      is_active: toSave.is_active,
    })
  } catch (e) {
    console.warn('Saved coupon locally (Supabase write skipped):', e)
  }

  return toSave
}

export async function toggleCouponActive(id: string): Promise<PromoCoupon[]> {
  const current = getCouponsStore()
  const target = current.find((c) => c.id === id)
  if (!target) return current

  const newActive = !target.is_active
  const updated = current.map((c) => (c.id === id ? { ...c, is_active: newActive } : c))
  saveCouponsStore(updated)

  try {
    const supabase = createClient()
    await supabase.from('coupons').update({ is_active: newActive }).eq('id', id)
  } catch {
    // Ignore db failure
  }

  return updated
}

export async function removeCouponById(id: string): Promise<PromoCoupon[]> {
  const current = getCouponsStore()
  const updated = current.filter((c) => c.id !== id)
  saveCouponsStore(updated)

  try {
    const supabase = createClient()
    await supabase.from('coupons').delete().eq('id', id)
  } catch {
    // Ignore db failure
  }

  return updated
}

// Validate coupon code against subtotal
export function validateCoupon(code: string, subtotal: number, allCoupons: PromoCoupon[]): {
  valid: boolean
  coupon?: PromoCoupon
  discountAmount: number
  message: string
} {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) {
    return { valid: false, discountAmount: 0, message: 'Please enter a valid coupon code.' }
  }

  const found = allCoupons.find((c) => c.code === trimmed)
  if (!found || !found.is_active) {
    return { valid: false, discountAmount: 0, message: `Coupon "${trimmed}" is invalid or currently inactive.` }
  }

  if (found.expires_at && new Date(found.expires_at) < new Date()) {
    return { valid: false, discountAmount: 0, message: `Coupon "${trimmed}" has already expired.` }
  }

  if (found.usage_limit && found.times_used >= found.usage_limit) {
    return { valid: false, discountAmount: 0, message: `Coupon "${trimmed}" has reached its maximum store usage limit.` }
  }

  if (subtotal < found.min_order_amount) {
    const diff = found.min_order_amount - subtotal
    return {
      valid: false,
      discountAmount: 0,
      message: `Add ₹${diff.toLocaleString()} more to your cart to unlock coupon "${trimmed}" (Min order ₹${found.min_order_amount.toLocaleString()}).`,
    }
  }

  // Calculate discount
  let disc = 0
  if (found.type === 'percentage') {
    disc = Math.round((subtotal * found.value) / 100)
    if (found.max_discount_amount && disc > found.max_discount_amount) {
      disc = found.max_discount_amount
    }
  } else {
    disc = found.value
    if (disc > subtotal) disc = subtotal
  }

  return {
    valid: true,
    coupon: found,
    discountAmount: disc,
    message: `🎉 Promo code "${found.code}" applied successfully! You save ₹${disc.toLocaleString()}.`,
  }
}
