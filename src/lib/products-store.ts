/**
 * products-store.ts
 * -----------------
 * All product data comes from Supabase table `apsarah_products`.
 * The browser client (anon key) is used for all reads and writes.
 * localStorage is used as a fast cache so the shop page never shows
 * a blank state while the Supabase fetch is in flight.
 */

import { createClient } from '@supabase/supabase-js'

// ─── Supabase browser client ──────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  category: string
  subCategory?: string
  price: number
  oldPrice: number
  discountPercent: number
  rating: number
  reviewCount: number
  images: string[]
  sizes: Array<{ size: string; stock: number }>
  colors: Array<{ name: string; hex: string; images?: string[] }>
  fabric: string
  fit: string
  pattern: string
  neckline: string
  sleeves: string
  occasion: string
  washCare: string
  description: string
  highlights: string[]
  isNewArrival?: boolean
  isBestseller?: boolean
}

// ─── DB row ↔ Product mapper ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    subCategory: row.sub_category ?? undefined,
    price: row.price,
    oldPrice: row.old_price,
    discountPercent: row.discount_percent,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    images: row.images ?? [],
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    fabric: row.fabric ?? '',
    fit: row.fit ?? '',
    pattern: row.pattern ?? '',
    neckline: row.neckline ?? '',
    sleeves: row.sleeves ?? '',
    occasion: row.occasion ?? '',
    washCare: row.wash_care ?? '',
    description: row.description ?? '',
    highlights: row.highlights ?? [],
    isNewArrival: row.is_new_arrival ?? false,
    isBestseller: row.is_bestseller ?? false,
  }
}

function productToRow(p: Omit<Product, 'id'> & { id?: string }) {
  return {
    id: p.id ?? `prod-${Date.now()}`,
    name: p.name,
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: p.category,
    sub_category: p.subCategory ?? null,
    price: p.price,
    old_price: p.oldPrice,
    discount_percent: p.discountPercent,
    rating: p.rating,
    review_count: p.reviewCount,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    fabric: p.fabric,
    fit: p.fit,
    pattern: p.pattern,
    neckline: p.neckline,
    sleeves: p.sleeves,
    occasion: p.occasion,
    wash_care: p.washCare,
    description: p.description,
    highlights: p.highlights,
    is_new_arrival: p.isNewArrival ?? false,
    is_bestseller: p.isBestseller ?? false,
  }
}

// ─── localStorage cache helpers ───────────────────────────────────────────────
export const CACHE_KEY = 'apsarah_products_cache_v2'

export function readCache(): Product[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {}
  return null
}

export function writeCache(products: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products))
  } catch {}
}

// ─── Direct Supabase Storage (No Hardcoded Mock Products) ───────────────────
export const initialProducts: Product[] = []

import { cache } from 'react'

// ─── Module-level cache & Promise deduplication ─────────────────────────────
let inFlightFetchPromise: Promise<Product[]> | null = null
let memoryCache: { products: Product[]; timestamp: number } | null = null
const MEMORY_CACHE_TTL_MS = 60 * 1000 // 1 minute in-memory cache

/** Fetch all products from Supabase/API. Falls back to cache, then initialProducts. */
export async function fetchProducts(forceRefresh = false): Promise<Product[]> {
  const now = Date.now()
  if (!forceRefresh && memoryCache && now - memoryCache.timestamp < MEMORY_CACHE_TTL_MS) {
    return memoryCache.products
  }

  if (inFlightFetchPromise && !forceRefresh) {
    return inFlightFetchPromise
  }

  inFlightFetchPromise = (async () => {
    try {
      // 1. Try server API route first (uses Next.js / browser revalidation cache)
      const res = await fetch('/api/admin/products', {
        next: { revalidate: 60, tags: ['products'] },
      } as RequestInit).catch(() => null)

      if (res && res.ok) {
        const json = await res.json()
        if (json.products && json.products.length > 0) {
          const products = json.products.map(rowToProduct)
          memoryCache = { products, timestamp: Date.now() }
          writeCache(products)
          return products
        }
      }

      // 2. Direct Supabase fallback
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('apsarah_products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const products = data.map(rowToProduct)
        memoryCache = { products, timestamp: Date.now() }
        writeCache(products)
        return products
      }

      throw new Error('No DB data returned')
    } catch {
      // Try local cache first
      const cached = readCache()
      if (cached && cached.length > 0) {
        memoryCache = { products: cached, timestamp: Date.now() }
        return cached
      }
      return initialProducts
    } finally {
      inFlightFetchPromise = null
    }
  })()

  return inFlightFetchPromise
}

/** Fetch only featured/bestseller products with minimal columns for homepage rails. */
export async function fetchFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('apsarah_products')
      .select('id, name, slug, category, sub_category, price, old_price, discount_percent, rating, review_count, images, is_bestseller, is_new_arrival')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!error && data && data.length > 0) {
      return data.map(rowToProduct)
    }
  } catch {}

  const cached = readCache() ?? []
  return cached.slice(0, limit)
}

/** Fetch minimal price data for price tier counting. */
export async function fetchPriceTiersSummary(): Promise<Array<{ id: string; price: number }>> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('apsarah_products')
      .select('id, price')

    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({ id: d.id, price: Number(d.price || 0) }))
    }
  } catch {}

  const cached = readCache() ?? []
  return cached.map((p) => ({ id: p.id, price: p.price }))
}

/** Fetch light product summaries for cart drawer recommendations. */
export async function fetchCartRecommendations(limit = 3): Promise<Product[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('apsarah_products')
      .select('id, name, slug, price, old_price, discount_percent, images, sizes')
      .limit(limit + 3)

    if (!error && data && data.length > 0) {
      return data.map(rowToProduct)
    }
  } catch {}

  const cached = readCache() ?? []
  return cached.slice(0, limit + 3)
}

/** Fetch single product by slug (deduplicated per request via React cache). */
export const fetchProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('apsarah_products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return rowToProduct(data)
  } catch {
    // Fallback to cache
    const cached = readCache() ?? []
    return cached.find((p) => p.slug === slug || p.id === slug) ?? null
  }
})


/** Insert a new product into Supabase via API route. */
export async function addProduct(newProduct: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  // 1. Call server API endpoint
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  })

  const resData = await response.json().catch(() => ({}))

  if (!response.ok || !resData.success || !resData.product) {
    // Direct Supabase fallback if API route fails
    console.warn('API route failed, trying direct Supabase insert...', resData.error)
    const row = productToRow(newProduct)
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('apsarah_products')
      .insert(row)
      .select()
      .single()

    if (error) {
      throw new Error(resData.error || error.message || 'Failed to save product in database.')
    }

    const product = rowToProduct(data)
    const cached = readCache() ?? []
    writeCache([product, ...cached.filter((p) => p.id !== product.id)])
    return product
  }

  const createdProduct = rowToProduct(resData.product)

  // Update local cache with saved product from server
  const cached = readCache() ?? []
  writeCache([createdProduct, ...cached.filter((p) => p.id !== createdProduct.id)])

  return createdProduct
}

/** Update an existing product in Supabase via API route. */
export async function updateProduct(id: string, fields: Partial<Product>): Promise<Product | null> {
  const response = await fetch('/api/admin/products', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...fields }),
  })

  const resData = await response.json().catch(() => ({}))

  if (!response.ok || !resData.success || !resData.product) {
    // Direct Supabase fallback
    console.warn('API route failed, trying direct Supabase update...', resData.error)
    const supabase = getSupabase()
    const updates: Record<string, any> = {}
    if (fields.name !== undefined) updates.name = fields.name
    if (fields.slug !== undefined) updates.slug = fields.slug
    if (fields.category !== undefined) updates.category = fields.category
    if (fields.subCategory !== undefined) updates.sub_category = fields.subCategory
    if (fields.price !== undefined) updates.price = fields.price
    if (fields.oldPrice !== undefined) updates.old_price = fields.oldPrice
    if (fields.discountPercent !== undefined) updates.discount_percent = fields.discountPercent
    if (fields.images !== undefined) updates.images = fields.images
    if (fields.sizes !== undefined) updates.sizes = fields.sizes
    if (fields.colors !== undefined) updates.colors = fields.colors
    if (fields.fabric !== undefined) updates.fabric = fields.fabric
    if (fields.fit !== undefined) updates.fit = fields.fit
    if (fields.pattern !== undefined) updates.pattern = fields.pattern
    if (fields.neckline !== undefined) updates.neckline = fields.neckline
    if (fields.sleeves !== undefined) updates.sleeves = fields.sleeves
    if (fields.occasion !== undefined) updates.occasion = fields.occasion
    if (fields.washCare !== undefined) updates.wash_care = fields.washCare
    if (fields.description !== undefined) updates.description = fields.description
    if (fields.highlights !== undefined) updates.highlights = fields.highlights

    const { data, error } = await supabase
      .from('apsarah_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(resData.error || error.message || 'Failed to update product.')

    const updated = rowToProduct(data)
    const cached = readCache() ?? []
    writeCache(cached.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const updatedProduct = rowToProduct(resData.product)
  const cached = readCache() ?? []
  writeCache(cached.map((p) => (p.id === id ? updatedProduct : p)))
  return updatedProduct
}

/** Delete a product from Supabase via API route. */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  const resData = await response.json().catch(() => ({}))

  if (!response.ok || !resData.success) {
    // Direct Supabase fallback
    const supabase = getSupabase()
    const { error } = await supabase.from('apsarah_products').delete().eq('id', id)
    if (error) throw new Error(resData.error || error.message || 'Failed to delete product.')
  }

  const cached = readCache() ?? []
  writeCache(cached.filter((p) => p.id !== id))
}

/** Decrement stock for ordered product sizes in Supabase apsarah_products table. */
export async function decrementProductStock(
  orderedItems: Array<{ productId: string; size: string; quantity: number }>
): Promise<void> {
  try {
    const supabase = getSupabase()

    for (const item of orderedItems) {
      if (!item.productId || !item.size) continue

      const { data: prod, error } = await supabase
        .from('apsarah_products')
        .select('id, sizes')
        .eq('id', item.productId)
        .single()

      if (error || !prod || !Array.isArray(prod.sizes)) continue

      let updated = false
      const updatedSizes = prod.sizes.map((s: { size: string; stock: number }) => {
        if (s.size === item.size) {
          updated = true
          return { ...s, stock: Math.max(0, (s.stock || 0) - item.quantity) }
        }
        return s
      })

      if (updated) {
        await supabase
          .from('apsarah_products')
          .update({ sizes: updatedSizes })
          .eq('id', item.productId)
      }
    }

    // Refresh products cache after stock update
    await fetchProducts().catch(() => {})
  } catch (err) {
    console.error('Failed to decrement product stock:', err)
  }
}

// Legacy sync helpers (for places that haven't migrated to async yet)
export function getProductsStore(): Product[] {
  return readCache() ?? []
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductsStore().find((p) => p.slug === slug || p.id === slug)
}
