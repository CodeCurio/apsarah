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

// POST /api/admin/upload
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    const supabase = getAdminClient()
    const bucketName = 'product-images'

    let fileBuffer: Buffer
    let mimeType = 'image/jpeg'
    let fileExtension = 'jpg'

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No image file provided in formData' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      fileBuffer = Buffer.from(bytes)
      mimeType = file.type || 'image/jpeg'
      if (mimeType.includes('png')) fileExtension = 'png'
      else if (mimeType.includes('webp')) fileExtension = 'webp'
      else if (mimeType.includes('gif')) fileExtension = 'gif'
    } else {
      // JSON payload containing base64 string
      const body = await request.json()
      const base64Data: string = body.base64 || body.image || ''

      if (!base64Data) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 })
      }

      // If it's already an HTTP URL, return as is
      if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
        return NextResponse.json({ success: true, url: base64Data })
      }

      const match = base64Data.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
      if (match) {
        mimeType = match[1]
        const rawBase64 = match[2]
        fileBuffer = Buffer.from(rawBase64, 'base64')
        if (mimeType.includes('png')) fileExtension = 'png'
        else if (mimeType.includes('webp')) fileExtension = 'webp'
        else if (mimeType.includes('gif')) fileExtension = 'gif'
      } else {
        fileBuffer = Buffer.from(base64Data, 'base64')
      }
    }

    const uniqueId = `img-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${fileExtension}`

    // Upload to Supabase Storage bucket 'product-images'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uniqueId, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path)

    const publicUrl = publicUrlData.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uniqueId}`

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err: any) {
    console.error('Image Upload API error:', err)
    return NextResponse.json({ error: err?.message || 'Server upload error' }, { status: 500 })
  }
}
