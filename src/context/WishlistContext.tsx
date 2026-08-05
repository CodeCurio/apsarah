'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface WishlistContextType {
  wishlistIds: string[]
  wishlistCount: number
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string, productName?: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

const WISHLIST_LOCAL_KEY = 'apsarah_wishlist_ids_v1'

function loadLocalWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WISHLIST_LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalWishlist(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(WISHLIST_LOCAL_KEY, JSON.stringify(ids))
  } catch {}
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const { user } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // 1. Fetch Wishlist on Mount or Auth Change
  useEffect(() => {
    if (user) {
      // Fetch from Supabase for logged-in user
      const supabase = createClient()
      supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const ids = data.map((item) => item.product_id)
            setWishlistIds(ids)
            saveLocalWishlist(ids)
          } else {
            setWishlistIds(loadLocalWishlist())
          }
        })
    } else {
      // Load from localStorage for guest user
      setWishlistIds(loadLocalWishlist())
    }
  }, [user])

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  )

  const toggleWishlist = useCallback(
    async (productId: string, productName?: string) => {
      const isSaved = wishlistIds.includes(productId)
      const name = productName || 'Product'

      if (isSaved) {
        // Remove from state & cache
        const updated = wishlistIds.filter((id) => id !== productId)
        setWishlistIds(updated)
        saveLocalWishlist(updated)
        toastSuccess(`Removed "${name}" from wishlist`)

        // Sync with Supabase if logged in
        if (user) {
          const supabase = createClient()
          await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
        }
      } else {
        // Add to state & cache
        const updated = [...wishlistIds, productId]
        setWishlistIds(updated)
        saveLocalWishlist(updated)
        toastSuccess(`Added "${name}" to your wishlist! ❤️`)

        // Sync with Supabase if logged in
        if (user) {
          const supabase = createClient()
          await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
        }
      }
    },
    [wishlistIds, user, toastSuccess, toastError]
  )

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
