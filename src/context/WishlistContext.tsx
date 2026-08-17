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
  const { toastSuccess } = useToast()

  // Sync & Merge Wishlist on Mount or Auth Change
  useEffect(() => {
    const supabase = createClient()

    if (user) {
      const localIds = loadLocalWishlist()

      // Fetch user's wishlist from Supabase
      supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)
        .then(async ({ data, error }) => {
          if (!error && data) {
            const dbIds = data.map((item) => item.product_id)

            // Merge local guest wishlist items into user's DB wishlist if there are unsynced guest items
            const newGuestItems = localIds.filter((id) => !dbIds.includes(id))

            if (newGuestItems.length > 0) {
              const toInsert = newGuestItems.map((id) => ({
                user_id: user.id,
                product_id: id,
              }))
              await supabase.from('wishlist').upsert(toInsert, { onConflict: 'user_id,product_id' })
            }

            const mergedIds = Array.from(new Set([...dbIds, ...localIds]))
            setWishlistIds(mergedIds)
            saveLocalWishlist(mergedIds)
          } else {
            // Fallback to local cache if DB error / network offline
            setWishlistIds(loadLocalWishlist())
          }
        })
    } else {
      // Guest user: load from localStorage
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
        // Remove from state & local cache immediately
        const updated = wishlistIds.filter((id) => id !== productId)
        setWishlistIds(updated)
        saveLocalWishlist(updated)
        toastSuccess(`Removed "${name}" from wishlist`)

        // Sync deletion with Supabase if logged in
        if (user) {
          try {
            const supabase = createClient()
            await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
          } catch (err) {
            console.error('Failed to sync wishlist removal with Supabase:', err)
          }
        }
      } else {
        // Add to state & local cache immediately
        const updated = [...wishlistIds, productId]
        setWishlistIds(updated)
        saveLocalWishlist(updated)
        toastSuccess(`Added "${name}" to your wishlist! ❤️`)

        // Sync addition with Supabase if logged in
        if (user) {
          try {
            const supabase = createClient()
            await supabase.from('wishlist').upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            )
          } catch (err) {
            console.error('Failed to sync wishlist addition with Supabase:', err)
          }
        }
      }
    },
    [wishlistIds, user, toastSuccess]
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
