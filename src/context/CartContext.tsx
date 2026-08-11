'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Product } from '@/lib/products-store'
import { fetchAllCoupons, validateCoupon } from '@/lib/coupons-store'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
}

interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  max_discount_amount?: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  appliedCoupon: Coupon | null
  isOpen: boolean
  addItem: (product: Product, quantity?: number, size?: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'apsarah_cart_v1'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCart())
  }, [])

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCart(items)
  }, [items])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  let discount = 0
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100)
      if (appliedCoupon.max_discount_amount && discount > appliedCoupon.max_discount_amount) {
        discount = appliedCoupon.max_discount_amount
      }
    } else {
      discount = Math.min(appliedCoupon.value, subtotal)
    }
  }

  const shippingCost = subtotal - discount >= 799 || subtotal === 0 ? 0 : 99
  const total = Math.max(0, subtotal - discount + shippingCost)

  const addItem = useCallback((product: Product, quantity = 1, size = '') => {
    setItems(prev => {
      const selectedSize = size || product.sizes?.find(s => s.stock > 0)?.size || product.sizes?.[0]?.size || 'M'
      const sizeObj = product.sizes?.find(s => s.size === selectedSize)
      const maxAvailable = sizeObj !== undefined ? sizeObj.stock : 999

      if (maxAvailable <= 0) return prev

      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === selectedSize)
      const currentQty = existing ? existing.quantity : 0
      const allowedQty = Math.min(currentQty + quantity, maxAvailable)

      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedSize === selectedSize
            ? { ...i, quantity: allowedQty }
            : i
        )
      }
      return [...prev, { product, quantity: Math.min(quantity, maxAvailable), selectedSize }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size)))
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(i => {
        if (i.product.id === productId && i.selectedSize === size) {
          const sizeObj = i.product.sizes?.find(s => s.size === size)
          const maxAvailable = sizeObj !== undefined ? sizeObj.stock : 999
          return { ...i, quantity: Math.min(quantity, maxAvailable) }
        }
        return i
      })
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) return { success: false, message: 'Please enter a coupon code' }
    
    const allCoupons = await fetchAllCoupons()
    const result = validateCoupon(code, subtotal, allCoupons)

    if (!result.valid || !result.coupon) {
      return { success: false, message: result.message }
    }

    setAppliedCoupon({
      code: result.coupon.code,
      type: result.coupon.type,
      value: result.coupon.value,
      max_discount_amount: result.coupon.max_discount_amount,
    })

    return { success: true, message: result.message }
  }, [subtotal])

  const removeCoupon = useCallback(() => setAppliedCoupon(null), [])

  return (
    <CartContext.Provider
      value={{
        items, itemCount, subtotal, discount, shippingCost, total,
        appliedCoupon, isOpen,
        addItem, removeItem, updateQuantity, clearCart,
        openCart, closeCart, applyCoupon, removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
