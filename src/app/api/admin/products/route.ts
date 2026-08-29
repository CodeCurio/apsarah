import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

function getAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  })
}

// Helper: convert JS camelCase Product object to Supabase row format
function toDbRow(productData: any) {
  const baseId = productData.id || `prod-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
  let slug = (productData.slug || productData.name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slug) slug = `product-${Date.now()}`

  return {
    id: baseId,
    name: productData.name,
    slug,
    category: productData.category,
    sub_category: productData.subCategory || productData.sub_category || null,
    price: Number(productData.price) || 0,
    old_price: Number(productData.oldPrice ?? productData.old_price ?? productData.price) || 0,
    discount_percent: Number(productData.discountPercent ?? productData.discount_percent) || 0,
    rating: Number(productData.rating) || 4.9,
    review_count: Number(productData.reviewCount ?? productData.review_count) || 5,
    images: Array.isArray(productData.images) ? productData.images : [],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
    colors: Array.isArray(productData.colors) ? productData.colors : [],
    fabric: productData.fabric || '',
    fit: productData.fit || '',
    pattern: productData.pattern || '',
    neckline: productData.neckline || '',
    sleeves: productData.sleeves || '',
    occasion: productData.occasion || '',
    wash_care: productData.washCare || productData.wash_care || '',
    description: productData.description || '',
    highlights: Array.isArray(productData.highlights) ? productData.highlights : [],
    is_new_arrival: Boolean(productData.isNewArrival ?? productData.is_new_arrival),
    is_bestseller: Boolean(productData.isBestseller ?? productData.is_bestseller),
  }
}



// GET /api/admin/products (Authenticated Admin Endpoint - Fresh Data)
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('apsarah_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products from DB:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data || [] })
  } catch (err: any) {
    console.error('Products API GET failure:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

// Helper: upload base64 image strings to Supabase Storage if any exist
async function processImages(images: string[], supabase: any): Promise<string[]> {
  if (!Array.isArray(images)) return []
  const processed: string[] = []

  for (const img of images) {
    if (!img) continue
    if (img.startsWith('data:image/')) {
      try {
        const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
        if (match) {
          const mimeType = match[1]
          const fileBuffer = Buffer.from(match[2], 'base64')
          let fileExtension = 'jpg'
          if (mimeType.includes('png')) fileExtension = 'png'
          else if (mimeType.includes('webp')) fileExtension = 'webp'

          const filename = `img-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${fileExtension}`
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filename, fileBuffer, { contentType: mimeType, upsert: true })

          if (!error && data) {
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`
            processed.push(publicUrl)
            continue
          }
        }
      } catch (e) {
        console.error('Base64 auto-upload error:', e)
      }
    }
    processed.push(img)
  }
  return processed
}

// POST /api/admin/products (Create Product)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const row = toDbRow(body)

    // Process images to replace any base64 string with Supabase Storage public URL
    row.images = await processImages(row.images, supabase)

    // Check if slug exists in DB, append random suffix if conflict
    const { data: existingSlug } = await supabase
      .from('apsarah_products')
      .select('id')
      .eq('slug', row.slug)
      .maybeSingle()

    if (existingSlug) {
      row.slug = `${row.slug}-${Math.floor(100 + Math.random() * 900)}`
    }

    const { data, error } = await supabase
      .from('apsarah_products')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('DB Insert error for apsarah_products:', error)
      return NextResponse.json({ error: `Database Save Failed: ${error.message}` }, { status: 500 })
    }



    return NextResponse.json({ success: true, product: data }, { status: 201 })
  } catch (err: any) {
    console.error('Products API POST failure:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create product' }, { status: 500 })
  }
}

// PUT /api/admin/products (Update Product)
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const updates: Record<string, any> = {}

    if (body.name !== undefined) updates.name = body.name
    if (body.slug !== undefined) updates.slug = body.slug
    if (body.category !== undefined) updates.category = body.category
    if (body.subCategory !== undefined || body.sub_category !== undefined)
      updates.sub_category = body.subCategory ?? body.sub_category
    if (body.price !== undefined) updates.price = Number(body.price)
    if (body.oldPrice !== undefined || body.old_price !== undefined)
      updates.old_price = Number(body.oldPrice ?? body.old_price)
    if (body.discountPercent !== undefined || body.discount_percent !== undefined)
      updates.discount_percent = Number(body.discountPercent ?? body.discount_percent)
    if (body.images !== undefined) {
      updates.images = await processImages(body.images, supabase)
    }
    if (body.sizes !== undefined) updates.sizes = body.sizes
    if (body.colors !== undefined) updates.colors = body.colors
    if (body.fabric !== undefined) updates.fabric = body.fabric
    if (body.fit !== undefined) updates.fit = body.fit
    if (body.pattern !== undefined) updates.pattern = body.pattern
    if (body.neckline !== undefined) updates.neckline = body.neckline
    if (body.sleeves !== undefined) updates.sleeves = body.sleeves
    if (body.occasion !== undefined) updates.occasion = body.occasion
    if (body.washCare !== undefined || body.wash_care !== undefined)
      updates.wash_care = body.washCare ?? body.wash_care
    if (body.description !== undefined) updates.description = body.description
    if (body.highlights !== undefined) updates.highlights = body.highlights
    if (body.isNewArrival !== undefined || body.is_new_arrival !== undefined)
      updates.is_new_arrival = Boolean(body.isNewArrival ?? body.is_new_arrival)
    if (body.isBestseller !== undefined || body.is_bestseller !== undefined)
      updates.is_bestseller = Boolean(body.isBestseller ?? body.is_bestseller)

    const { data, error } = await supabase
      .from('apsarah_products')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('DB Update error for apsarah_products:', error)
      return NextResponse.json({ error: `Database Update Failed: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: data })
  } catch (err: any) {
    console.error('Products API PUT failure:', err)
    return NextResponse.json({ error: err?.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products (Delete Product)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID parameter is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('apsarah_products').delete().eq('id', id)

    if (error) {
      console.error('DB Delete error for apsarah_products:', error)
      return NextResponse.json({ error: `Database Delete Failed: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    console.error('Products API DELETE failure:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete product' }, { status: 500 })
  }
}
