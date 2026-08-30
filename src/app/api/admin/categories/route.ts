import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { MASTER_CATEGORIES, PrimaryCategory } from '@/lib/constants/categories'

export interface DbCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  parent_id?: string | null
  is_coming_soon?: boolean
  sort_order?: number
  created_at?: string
}

// Helper: Auto-seed MASTER_CATEGORIES into Supabase if table is empty
async function seedMasterCategoriesIfEmpty() {
  try {
    const { count, error } = await supabaseAdmin
      .from('categories')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.warn('Could not check categories count:', error.message)
      return
    }

    if (count === 0) {
      console.log('Seeding MASTER_CATEGORIES into Supabase categories table...')
      for (const master of MASTER_CATEGORIES) {
        // Insert primary
        const { data: primaryRow, error: pErr } = await supabaseAdmin
          .from('categories')
          .insert({
            name: master.name,
            slug: master.slug,
            description: master.description || null,
            image_url: master.image || null,
            is_coming_soon: Boolean(master.isComingSoon),
            parent_id: null,
          })
          .select()
          .single()

        if (!pErr && primaryRow && master.subcategories?.length > 0) {
          const subRows = master.subcategories.map((subName) => ({
            name: subName,
            slug: `${master.slug}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/(^-|-$)/g, ''),
            parent_id: primaryRow.id,
          }))
          await supabaseAdmin.from('categories').insert(subRows)
        }
      }
    }
  } catch (err) {
    console.error('Auto-seed categories failed:', err)
  }
}

// Convert flat DB categories into a clean tree for dropdowns and admin
export function buildCategoryTree(dbRows: DbCategory[]): PrimaryCategory[] {
  const primaries = dbRows.filter((r) => !r.parent_id)
  const masterMap = new Map(MASTER_CATEGORIES.map((m) => [m.name.toLowerCase(), m]))

  const result: PrimaryCategory[] = []

  // 1. Process all DB primary categories
  for (const p of primaries) {
    const subs = dbRows
      .filter((s) => s.parent_id === p.id)
      .map((s) => s.name)

    const masterMatch = masterMap.get(p.name.toLowerCase())
    
    // Combine db subcategories with any default master subcategories without duplicates
    const combinedSubcategories = Array.from(
      new Set([...(masterMatch?.subcategories || []), ...subs])
    )

    result.push({
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: p.image_url || masterMatch?.image || '/assets/red-embroidered-silk-kurta-set-2.webp',
      subtitle: masterMatch?.subtitle || 'ROYALTY & HERITAGE',
      description: p.description || masterMatch?.description || '',
      isComingSoon: p.is_coming_soon ?? masterMatch?.isComingSoon ?? false,
      subcategories: combinedSubcategories.length > 0 ? combinedSubcategories : ['General'],
    })
  }

  // 2. Add any MASTER_CATEGORIES that might not be in DB yet
  for (const m of MASTER_CATEGORIES) {
    if (!result.some((r) => r.name.toLowerCase() === m.name.toLowerCase())) {
      result.push(m)
    }
  }

  return result
}

// GET /api/admin/categories
export async function GET() {
  try {
    await seedMasterCategoriesIfEmpty()

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching categories from Supabase:', error)
      return NextResponse.json({
        categories: [],
        tree: MASTER_CATEGORIES,
        error: error.message,
      })
    }

    const rows = (data || []) as DbCategory[]
    const tree = buildCategoryTree(rows)

    return NextResponse.json({
      success: true,
      categories: rows,
      tree,
    })
  } catch (err: any) {
    console.error('GET /api/admin/categories failed:', err)
    return NextResponse.json(
      { categories: [], tree: MASTER_CATEGORIES, error: err.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create Primary or Sub Category
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { name, slug, description, parent_id, is_coming_soon, image_url } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()
    let cleanSlug = (slug || trimmedName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (!cleanSlug) cleanSlug = `cat-${Date.now()}`

    // Check if slug exists in DB, append unique suffix if conflict
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', cleanSlug)
      .maybeSingle()

    if (existing) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`
    }

    const insertPayload: any = {
      name: trimmedName,
      slug: cleanSlug,
      description: description?.trim() || null,
      parent_id: parent_id || null,
      is_coming_soon: Boolean(is_coming_soon),
      image_url: image_url || null,
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      console.error('Supabase category insertion error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      category: data,
      message: `Category "${trimmedName}" created and saved to database successfully.`,
    })
  } catch (err: any) {
    console.error('POST /api/admin/categories error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

// PUT /api/admin/categories - Update Category
export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, name, slug, description, is_coming_soon, parent_id, image_url } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const updates: any = {}
    if (name !== undefined) {
      updates.name = name.trim()
      if (!slug) {
        updates.slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }
    }
    if (slug !== undefined) updates.slug = slug
    if (description !== undefined) updates.description = description
    if (is_coming_soon !== undefined) updates.is_coming_soon = Boolean(is_coming_soon)
    if (parent_id !== undefined) updates.parent_id = parent_id || null
    if (image_url !== undefined) updates.image_url = image_url

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase category update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      category: data,
    })
  } catch (err: any) {
    console.error('PUT /api/admin/categories error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/categories - Delete Category & its Subcategories
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')

    if (!id) {
      const body = await request.json().catch(() => ({}))
      id = body.id
    }

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // 1. Delete any child subcategories first
    await supabaseAdmin.from('categories').delete().eq('parent_id', id)

    // 2. Delete the category itself
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)

    if (error) {
      console.error('Supabase category delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted from database successfully',
      id,
    })
  } catch (err: any) {
    console.error('DELETE /api/admin/categories error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
