import { MASTER_CATEGORIES, PrimaryCategory } from '@/lib/constants/categories'

export async function fetchCatalogCategories(): Promise<PrimaryCategory[]> {
  try {
    const res = await fetch('/api/admin/categories', {
      method: 'GET',
      cache: 'no-store',
    })
    if (!res.ok) {
      return MASTER_CATEGORIES
    }
    const data = await res.json()
    if (data && Array.isArray(data.tree) && data.tree.length > 0) {
      return data.tree as PrimaryCategory[]
    }
    return MASTER_CATEGORIES
  } catch (err) {
    console.warn('Failed to fetch dynamic categories, falling back to defaults:', err)
    return MASTER_CATEGORIES
  }
}
