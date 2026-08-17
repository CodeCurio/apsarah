'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  ImageIcon,
  Plus,
  Ruler,
  Layers,
  Sparkles,
  CheckCircle,
  Trash2,
  Tag,
  Clock,
  Info,
  Loader2,
} from 'lucide-react'
import { updateProduct, fetchProducts, Product } from '@/lib/products-store'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'

// ─── Single Image Slot Component ──────────────────────────────────────────────
function ImageSlot({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success && data.url) {
        onChange(data.url)
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error'
      alert('Upload error: ' + msg)
    } finally {
      setUploading(false)
    }
  }

  const uploadBase64OrUrl = async (urlOrBase64: string) => {
    if (!urlOrBase64) {
      onChange('')
      return
    }
    if (urlOrBase64.startsWith('http://') || urlOrBase64.startsWith('https://')) {
      onChange(urlOrBase64)
      return
    }
    if (urlOrBase64.startsWith('data:image/')) {
      setUploading(true)
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: urlOrBase64 }),
        })
        const data = await res.json()
        if (res.ok && data.success && data.url) {
          onChange(data.url)
        } else {
          onChange(urlOrBase64)
        }
      } catch {
        onChange(urlOrBase64)
      } finally {
        setUploading(false)
      }
    } else {
      onChange(urlOrBase64)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-1.5 flex flex-col">
      <span className="block text-[11px] font-bold text-slate-700 truncate">{label}</span>

      <div
        className="relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-[#e2d4c7] bg-[#FAF6F0]/40 overflow-hidden cursor-pointer group hover:border-[#8f1020] hover:bg-[#FAF6F0]/80 transition-all shadow-2xs flex-1 flex flex-col justify-center"
        onClick={() => !uploading && fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center p-3 text-center gap-2">
            <div className="w-8 h-8 border-2 border-[#8f1020] border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-bold text-[#8f1020]">Uploading to Cloud...</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover object-top absolute inset-0" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 z-10">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-[11px] font-bold">Replace Photo</span>
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-rose-50 hover:text-rose-600 z-20 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              title="Remove Image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white border border-[#e2d4c7] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4 text-[#8f1020]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-700">Click to upload photo</p>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">or drag &amp; drop file</p>
            </div>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
      </div>

      <input
        type="text"
        placeholder="Or paste image URL..."
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => uploadBase64OrUrl(e.target.value)}
        className="w-full bg-white border border-[#e2d4c7] rounded-xl px-2.5 py-1.5 text-[11px] outline-none focus:border-[#8f1020] text-slate-700 placeholder:text-slate-400 font-mono shadow-2xs transition-colors"
      />
    </div>
  )
}

interface ColorVariantForm {
  id: string
  name: string
  hex: string
  images: string[]
}

interface SizeItem {
  size: string
  enabled: boolean
  stock: string
}

const DEFAULT_SIZES: SizeItem[] = [
  { size: 'XS', enabled: false, stock: '5' },
  { size: 'S', enabled: true, stock: '8' },
  { size: 'M', enabled: true, stock: '12' },
  { size: 'L', enabled: true, stock: '10' },
  { size: 'XL', enabled: true, stock: '6' },
  { size: 'XXL', enabled: true, stock: '4' },
  { size: '3XL', enabled: false, stock: '3' },
  { size: 'Unstitched', enabled: false, stock: '15' },
  { size: 'Custom Fit', enabled: false, stock: '5' },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('Suit Sets')
  const [subCategory, setSubCategory] = useState<string>('')
  const [dispatchTimeline, setDispatchTimeline] = useState('Ready to Ship (Dispatched within 24-48 Hours)')
  const [price, setPrice] = useState('3300')
  const [oldPrice, setOldPrice] = useState('5500')

  const [colorVariants, setColorVariants] = useState<ColorVariantForm[]>([
    { id: 'color-1', name: 'Standard Shade', hex: '#8f1020', images: ['', '', '', ''] },
  ])
  const [sizes, setSizes] = useState<SizeItem[]>(DEFAULT_SIZES)

  const [setInclusions, setSetInclusions] = useState('3-Piece Set: 1 Kurta, 1 Pant, 1 Dupatta')
  const [fabric, setFabric] = useState('')
  const [fit, setFit] = useState('')
  const [pattern, setPattern] = useState('')
  const [neckline, setNeckline] = useState('')
  const [sleeves, setSleeves] = useState('')
  const [occasion, setOccasion] = useState('')
  const [washCare, setWashCare] = useState('Dry Clean Only (Recommended for Embroidery & Gold Print)')
  const [modelSizeNote, setModelSizeNote] = useState('Model is 5\'8" wearing Size S')

  const [highlight1, setHighlight1] = useState('')
  const [highlight2, setHighlight2] = useState('')
  const [highlight3, setHighlight3] = useState('')
  const [highlight4, setHighlight4] = useState('')

  // Shop Filter Tagging States
  const [selectedFabricTags, setSelectedFabricTags] = useState<string[]>([])
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([])
  const [selectedOccasionTags, setSelectedOccasionTags] = useState<string[]>([])
  const [selectedWorkTags, setSelectedWorkTags] = useState<string[]>([])
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('Red, Wine & Maroon')

  const toggleTag = (arr: string[], val: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn(arr.includes(val) ? arr.filter((t) => t !== val) : [...arr, val])
  }

  // Load Product Data
  useEffect(() => {
    if (!productId) return
    fetchProducts().then((all) => {
      const found = all.find((p) => p.id === productId || p.slug === productId)
      if (found) {
        setOriginalProduct(found)
        setName(found.name || '')
        setSlug(found.slug || '')
        setDescription(found.description || '')
        setCategory(found.category || 'Suit Sets')
        setSubCategory(found.subCategory || '')
        setPrice((found.price || 0).toString())
        setOldPrice((found.oldPrice || 0).toString())
        setFabric(found.fabric || '')
        setFit(found.fit || '')
        setPattern(found.pattern || '')
        setNeckline(found.neckline || '')
        setSleeves(found.sleeves || '')
        setOccasion(found.occasion || '')
        setWashCare(found.washCare || 'Dry Clean Only (Recommended for Embroidery & Gold Print)')

        if (found.colors && found.colors.length > 0) {
          setColorVariants(
            found.colors.map((c, i) => ({
              id: `color-${i}-${Date.now()}`,
              name: c.name || `Shade ${i + 1}`,
              hex: c.hex || '#8f1020',
              images: [c.images?.[0] || '', c.images?.[1] || '', c.images?.[2] || '', c.images?.[3] || ''],
            }))
          )
        } else if (found.images && found.images.length > 0) {
          setColorVariants([
            {
              id: 'color-default',
              name: 'Original Variant',
              hex: '#8f1020',
              images: [found.images[0] || '', found.images[1] || '', found.images[2] || '', found.images[3] || ''],
            },
          ])
        }

        // Parse Sizes
        if (found.sizes && found.sizes.length > 0) {
          const loadedSizes = DEFAULT_SIZES.map((d) => {
            const match = found.sizes.find((s) => s.size === d.size)
            if (match) return { size: d.size, enabled: true, stock: match.stock.toString() }
            return { ...d, enabled: false }
          })
          setSizes(loadedSizes)
        }

        // Parse Highlights & existing keywords
        const hils = found.highlights || []
        const normalHils: string[] = []
        hils.forEach((h) => {
          if (h.startsWith('Set Inclusions:')) setSetInclusions(h.replace('Set Inclusions:', '').trim())
          else if (h.startsWith('Fitting & Model Info:')) setModelSizeNote(h.replace('Fitting & Model Info:', '').trim())
          else if (h.startsWith('Dispatch Timeline:')) setDispatchTimeline(h.replace('Dispatch Timeline:', '').trim())
          else if (h.startsWith('Shop Filter Keywords:')) {
            // keywords present
          } else {
            normalHils.push(h)
          }
        })
        if (normalHils[0]) setHighlight1(normalHils[0])
        if (normalHils[1]) setHighlight2(normalHils[1])
        if (normalHils[2]) setHighlight3(normalHils[2])
        if (normalHils[3]) setHighlight4(normalHils[3])

        // Smart guess initial filter tags based on text fields
        const combinedText = [found.name, found.fabric, found.fit, found.pattern, found.occasion, found.description].join(' ').toLowerCase()
        
        const possibleFabrics = ['Silk', 'Chanderi', 'Cotton', 'Mulmul', 'Velvet', 'Georgette', 'Chiffon', 'Pashmina', 'Organza', 'Linen', 'Banarasi', 'Raw Silk']
        setSelectedFabricTags(possibleFabrics.filter(f => combinedText.includes(f.toLowerCase())))

        const possibleStyles = ['Flared & Anarkali', 'Straight Suit', 'Sharara & Gharara', 'Lehenga Set', 'Co-ord & Tunic', 'Palazzo & Pants', 'Jacket Style', 'Drape Set']
        setSelectedStyleTags(possibleStyles.filter(s => combinedText.includes(s.split('&')[0].trim().toLowerCase()) || combinedText.includes(s.split('/')[0].trim().toLowerCase())))

        const possibleOccasions = ['Wedding & Reception', 'Festive & Puja', 'Haldi & Mehndi', 'Party & Evening', 'Casual & Everyday', 'Summer Resort', 'Winter Wear']
        setSelectedOccasionTags(possibleOccasions.filter(o => combinedText.includes(o.split('&')[0].trim().toLowerCase()) || combinedText.includes(o.split('/')[0].trim().toLowerCase())))

        const possibleWorks = ['Zari & Sequin Work', 'Gota Patti & Mirror Work', 'Floral & Botanical Print', 'Handpainted & Craft', 'Chikankari & Thread Work', 'Minimalist & Solid']
        setSelectedWorkTags(possibleWorks.filter(w => combinedText.includes(w.split('&')[0].trim().toLowerCase()) || combinedText.includes(w.split('/')[0].trim().toLowerCase())))

        setLoading(false)
      } else {
        alert('Product not found in database or catalog cache.')
        router.push('/admin/products')
      }
    })
  }, [productId, router])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const addColorVariant = () => {
    const presetColors = [
      { name: 'Emerald Green', hex: '#056038' },
      { name: 'Royal Blue', hex: '#0e2b5c' },
      { name: 'Mustard Gold', hex: '#d49b08' },
      { name: 'Wine Velvet', hex: '#590924' },
      { name: 'Pastel Rose', hex: '#e8a59b' },
    ]
    const next = presetColors[colorVariants.length % presetColors.length]
    setColorVariants((prev) => [
      ...prev,
      { id: `color-${Date.now()}`, name: next.name, hex: next.hex, images: ['', '', '', ''] },
    ])
  }

  const removeColorVariant = (id: string) => {
    if (colorVariants.length <= 1) {
      alert('You must retain at least one color variant.')
      return
    }
    setColorVariants((prev) => prev.filter((c) => c.id !== id))
  }

  const updateColorField = (id: string, field: 'name' | 'hex', value: string) => {
    setColorVariants((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const updateColorImage = (colorId: string, imageIdx: number, url: string) => {
    setColorVariants((prev) =>
      prev.map((c) => {
        if (c.id === colorId) {
          const newImgs = [...c.images]
          newImgs[imageIdx] = url
          return { ...c, images: newImgs }
        }
        return c
      })
    )
  }

  const toggleSizeEnabled = (sizeName: string) => {
    setSizes((prev) => prev.map((s) => (s.size === sizeName ? { ...s, enabled: !s.enabled } : s)))
  }

  const updateSizeStock = (sizeName: string, stockVal: string) => {
    setSizes((prev) => prev.map((s) => (s.size === sizeName ? { ...s, stock: stockVal } : s)))
  }

  const handleQuickStock = (qty: string) => {
    setSizes((prev) => prev.map((s) => ({ ...s, enabled: true, stock: qty })))
  }

  const originalPriceNum = Number(oldPrice) || 0
  const sellingPriceNum = Number(price) || 0
  const discountPercent =
    originalPriceNum > sellingPriceNum ? Math.round(((originalPriceNum - sellingPriceNum) / originalPriceNum) * 100) : 0
  const savingsAmount = originalPriceNum - sellingPriceNum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (!originalProduct?.id) {
      alert('Original product ID is missing.')
      return
    }

    const allImages: string[] = []
    colorVariants.forEach((c) => {
      c.images.forEach((img) => {
        if (img && !allImages.includes(img)) allImages.push(img)
      })
    })

    if (allImages.length === 0) {
      alert('Please add at least one photo for this product.')
      return
    }

    const activeSizes = sizes.filter((s) => s.enabled).map((s) => ({ size: s.size, stock: Number(s.stock) || 0 }))
    if (activeSizes.length === 0) {
      alert('Please enable at least one size.')
      return
    }

    const processedColors = colorVariants.map((c) => ({
      name: c.name.trim() || 'Standard',
      hex: c.hex || '#8f1020',
      images: c.images.filter(Boolean),
    }))

    const filterKeywordTagLine = `Shop Filter Keywords: ${[...selectedFabricTags, ...selectedStyleTags, ...selectedOccasionTags, ...selectedWorkTags, selectedColorFamily].join(', ')}`
    const finalHighlights = [
      setInclusions ? `Set Inclusions: ${setInclusions}` : '',
      modelSizeNote ? `Fitting & Model Info: ${modelSizeNote}` : '',
      dispatchTimeline ? `Dispatch Timeline: ${dispatchTimeline}` : '',
      filterKeywordTagLine,
      highlight1,
      highlight2,
      highlight3,
      highlight4,
    ].filter(Boolean)

    setSaving(true)
    try {
      await updateProduct(originalProduct.id, {
        name: name.trim(),
        slug: slug || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        subCategory,
        price: sellingPriceNum,
        oldPrice: originalPriceNum,
        discountPercent,
        images: allImages,
        sizes: activeSizes,
        colors: processedColors,
        fabric,
        fit,
        pattern,
        neckline,
        sleeves,
        occasion,
        washCare,
        description: description.trim(),
        highlights: finalHighlights,
      })

      alert(`✅ Product "${name.trim()}" and its shop filter tags updated successfully! Now live on /shop!`)
      router.push('/admin/products')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      alert(`❌ Failed to update product: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const selectedMasterCat = MASTER_CATEGORIES.find((m) => m.name === category)

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#8f1020]" />
        <span className="font-serif font-bold text-sm">Loading product details for editing...</span>
      </div>
    )
  }

  return (
    <div className="max-w-[1380px] mx-auto pb-24 text-slate-800 space-y-8 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d4c7] pb-5 pt-2">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-2xl bg-white border border-[#e2d4c7] hover:bg-[#FAF6F0] text-[#2B1713] transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#8F1020] uppercase px-2.5 py-0.5 rounded-full bg-white border border-[#e2d4c7]">
              Edit Existing Product &amp; Shop Filters
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2b1713] tracking-tight mt-1.5">
              Edit: &ldquo;{name}&rdquo;
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Modify inventory, colors, pricing, and adjust which shop filters this design is shown under.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-2xl border border-[#e2d4c7] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-7 py-3 rounded-2xl bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-50 text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Update & Sync to Shop'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (8) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Box 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-serif font-bold text-[#2b1713]">Basic Details &amp; Storytelling</h2>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Title / Garment Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-slate-900 text-sm font-bold outline-none focus:border-[#8f1020] transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Storefront URL Slug *
                </label>
                <div className="flex items-center shadow-2xs rounded-2xl overflow-hidden border border-[#e2d4c7]">
                  <span className="bg-[#FAF6F0] px-4 py-3 text-slate-500 font-mono text-xs border-r border-[#e2d4c7] shrink-0 font-medium">
                    apsarah.in/products/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    className="w-full bg-white px-4 py-3 font-mono text-xs text-slate-900 font-bold outline-none focus:bg-[#FAF6F0]/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Description &amp; Craftmanship *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl p-4 text-slate-800 text-xs leading-relaxed outline-none focus:border-[#8f1020] transition-colors shadow-2xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Color Variants */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2b1713]">Color Variants &amp; Galleries</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Edit variant photos for user selection.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addColorVariant}
                className="px-4 py-2 bg-[#8f1020]/10 hover:bg-[#8f1020]/20 text-[#8f1020] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Color Shade
              </button>
            </div>

            <div className="space-y-6">
              {colorVariants.map((variant, index) => (
                <div key={variant.id} className="p-6 rounded-2xl bg-[#FAF6F0]/50 border border-[#E2D4C7] space-y-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2d4c7] shadow-2xs">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-[#2b1713] text-white font-mono font-bold text-xs uppercase tracking-wider">
                        Shade #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700">Color Name:</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateColorField(variant.id, 'name', e.target.value)}
                          className="bg-white border border-[#e2d4c7] rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-[#8f1020] w-48 shadow-2xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700">Shade Hex:</label>
                        <input
                          type="color"
                          value={variant.hex || '#000000'}
                          onChange={(e) => updateColorField(variant.id, 'hex', e.target.value)}
                          className="w-8 h-8 rounded-lg border border-[#e2d4c7] cursor-pointer p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={variant.hex}
                          onChange={(e) => updateColorField(variant.id, 'hex', e.target.value)}
                          className="w-24 font-mono text-xs bg-white border border-[#e2d4c7] rounded-lg px-2.5 py-1.5 outline-none shadow-2xs uppercase font-semibold"
                        />
                      </div>
                    </div>
                    {colorVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorVariant(variant.id)}
                        className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-3.5 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8f1020]" /> Dedicated Gallery for &ldquo;{variant.name || 'Shade'}&rdquo;
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((slotIdx) => (
                        <ImageSlot
                          key={slotIdx}
                          label={`Angle ${slotIdx + 1}`}
                          value={variant.images[slotIdx] || ''}
                          onChange={(val) => updateColorImage(variant.id, slotIdx, val)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Size Inventory */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2b1713]">Size Inventory &amp; Stock</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage quantities for available garments.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400 text-[11px] font-medium">Quick Stock:</span>
                <button
                  type="button"
                  onClick={() => handleQuickStock('10')}
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F0E6DC] text-[#2B1713] border border-[#e2d4c7] rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Set All to 10
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {sizes.map((s) => (
                <div key={s.size} className={`p-4 rounded-2xl border transition-all ${s.enabled ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs' : 'bg-[#FAF6F0]/40 border-[#e2d4c7] opacity-60'}`}>
                  <label className="flex items-center gap-2.5 cursor-pointer font-extrabold text-slate-900 text-sm">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => toggleSizeEnabled(s.size)}
                      className="rounded text-[#8f1020] focus:ring-[#8f1020] w-4 h-4 cursor-pointer"
                    />
                    <span>{s.size}</span>
                  </label>

                  {s.enabled && (
                    <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-emerald-800 text-[11px]">Stock Pcs:</span>
                      <input
                        type="number"
                        min={0}
                        value={s.stock}
                        onChange={(e) => updateSizeStock(s.size, e.target.value)}
                        className="w-16 bg-white border border-emerald-400 rounded-lg px-2 py-1 font-extrabold text-center text-slate-900 outline-none focus:ring-1 focus:ring-[#8f1020]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Box 4: Shop Filter Placement & Attribution */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#8F1020]/20 shadow-sm space-y-6 bg-gradient-to-br from-white to-[#FAF6F0]/50">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8F1020] text-white flex items-center justify-center shadow-md">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-serif font-bold text-[#2b1713]">Shop Page Filter &amp; Search Placement</h2>
                    <span className="bg-[#8F1020]/10 text-[#8F1020] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Store Navigation</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Select the exact filter categories and tags where this product should appear when customers use the Shop Page sidebar filters.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Fabric Categories */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  1. Fabric Filter Assignment <span className="text-slate-400 font-normal">(Select all fabrics present in garment)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Silk', 'Chanderi', 'Cotton', 'Mulmul', 'Velvet', 'Georgette', 'Chiffon', 'Pashmina', 'Organza', 'Linen', 'Banarasi', 'Raw Silk'].map((tag) => {
                    const active = selectedFabricTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(selectedFabricTags, tag, setSelectedFabricTags)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                          active
                            ? 'bg-[#8F1020] text-white border-[#8F1020] shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#8F1020] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        {active && <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Style & Silhouette */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  2. Style &amp; Silhouette Filters <span className="text-slate-400 font-normal">(Determines shape and cut filters)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Flared & Anarkali', 'Straight Suit', 'Sharara & Gharara', 'Lehenga Set', 'Co-ord & Tunic', 'Palazzo & Pants', 'Jacket Style', 'Drape Set'].map((tag) => {
                    const active = selectedStyleTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(selectedStyleTags, tag, setSelectedStyleTags)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                          active
                            ? 'bg-[#8F1020] text-white border-[#8F1020] shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#8F1020] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        {active && <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Occasion & Event */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  3. Recommended Occasion &amp; Event <span className="text-slate-400 font-normal">(Helps shoppers find wedding/festive attire)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Wedding & Reception', 'Festive & Puja', 'Haldi & Mehndi', 'Party & Evening', 'Casual & Everyday', 'Summer Resort', 'Winter Wear'].map((tag) => {
                    const active = selectedOccasionTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(selectedOccasionTags, tag, setSelectedOccasionTags)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                          active
                            ? 'bg-[#8F1020] text-white border-[#8F1020] shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#8F1020] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        {active && <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Work & Embroidery */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  4. Embroidery &amp; Craft Work <span className="text-slate-400 font-normal">(Filters by artisan craft techniques)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Zari & Sequin Work', 'Gota Patti & Mirror Work', 'Floral & Botanical Print', 'Handpainted & Craft', 'Chikankari & Thread Work', 'Minimalist & Solid'].map((tag) => {
                    const active = selectedWorkTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(selectedWorkTags, tag, setSelectedWorkTags)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                          active
                            ? 'bg-[#8F1020] text-white border-[#8F1020] shadow-sm scale-[1.02]'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-[#8F1020] hover:bg-[#FAF6F0]'
                        }`}
                      >
                        {active && <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Master Color Family */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  5. Primary Color Family Grouping <span className="text-slate-400 font-normal">(For color sidebar filters)</span>
                </label>
                <select
                  value={selectedColorFamily}
                  onChange={(e) => setSelectedColorFamily(e.target.value)}
                  className="w-full sm:w-80 bg-white border border-[#e2d4c7] rounded-xl px-4 py-2.5 text-xs font-bold text-[#2B1713] outline-none focus:border-[#8F1020] shadow-2xs"
                >
                  <option value="Red, Wine & Maroon">🔴 Red, Wine &amp; Maroon</option>
                  <option value="Blue, Navy & Teal">🔵 Blue, Navy &amp; Teal</option>
                  <option value="Green, Olive & Mint">🟢 Green, Olive &amp; Mint / Pista</option>
                  <option value="Pink & Peach">🌸 Pink, Rose &amp; Peach</option>
                  <option value="Yellow, Mustard & Gold">🟡 Yellow, Mustard &amp; Gold</option>
                  <option value="White, Ivory & Off-White">⚪ White, Ivory &amp; Off-White</option>
                  <option value="Black, Grey & Charcoal">⚫ Black, Grey &amp; Charcoal</option>
                  <option value="Purple, Plum & Lavender">🟣 Purple, Plum &amp; Lavender</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-[11px] flex items-center gap-2.5 font-medium">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Automatic Sync:</strong> When updated, these attributes are indexed immediately by the live store filter engine. Shoppers filtering for any of your selected tags will see this product in their search results!
                </span>
              </div>
            </div>
          </div>

          {/* Box 5: Feature Bullets */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-serif font-bold text-[#2b1713]">Storefront Feature Bullets</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 1</label>
                <input type="text" value={highlight1} onChange={(e) => setHighlight1(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 2</label>
                <input type="text" value={highlight2} onChange={(e) => setHighlight2(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 3</label>
                <input type="text" value={highlight3} onChange={(e) => setHighlight3(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 4</label>
                <input type="text" value={highlight4} onChange={(e) => setHighlight4(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (4) */}
        <div className="lg:col-span-4 space-y-8 sticky top-6">
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Pricing &amp; Margins</span>
              <span className="text-[10px] font-sans font-medium text-slate-400">INR (₹)</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">MRP / Original Price (₹) *</label>
                <input type="number" required value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Selling / Offer Price (₹) *</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-lg font-black text-[#8f1020] outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">Customer Savings Deal</span>
                {discountPercent > 0 ? (
                  <>
                    <div className="text-2xl font-black text-emerald-800">{discountPercent}% OFF</div>
                    <p className="text-[11px] text-emerald-700 font-semibold">Buyer saves ₹{savingsAmount.toLocaleString()} instantly!</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">Standard retail pricing (0% off)</p>
                )}
              </div>
            </div>
          </div>

          {/* Catalog Placement */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3">Catalog Placement</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Primary Collection *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#FAF6F0]/60 border border-[#e2d4c7] rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs transition-colors">
                  {MASTER_CATEGORIES.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Subcategory *</label>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full bg-[#FAF6F0]/60 border border-[#e2d4c7] rounded-2xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs transition-colors">
                  {selectedMasterCat && selectedMasterCat.subcategories.length > 0 ? (
                    selectedMasterCat.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))
                  ) : (
                    <option value="General">General</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8f1020]" /> Dispatch &amp; Shipping Timeline
                </label>
                <select value={dispatchTimeline} onChange={(e) => setDispatchTimeline(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-3.5 py-3 font-semibold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs text-xs">
                  <option value="Ready to Ship (Dispatched within 24-48 Hours)">Ready to Ship (24-48 Hours)</option>
                  <option value="Standard Express (Dispatched in 3-5 Business Days)">Standard Express (3-5 Days)</option>
                  <option value="Made to Order (Hand-Embroidered in 7-10 Days)">Made to Order (7-10 Days)</option>
                  <option value="Bridal Custom Order (14-21 Working Days)">Bridal Custom (14-21 Days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3">Ethnic Specifications</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Set Inclusions *</label>
                <input type="text" value={setInclusions} onChange={(e) => setSetInclusions(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fabric &amp; Lining *</label>
                <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Silhouette / Fit Type *</label>
                <input type="text" value={fit} onChange={(e) => setFit(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Embroidery &amp; Craft Work *</label>
                <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Neckline Styling *</label>
                <input type="text" value={neckline} onChange={(e) => setNeckline(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sleeve Design *</label>
                <input type="text" value={sleeves} onChange={(e) => setSleeves(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recommended Occasion *</label>
                <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Wash Care Recommendation *</label>
                <select value={washCare} onChange={(e) => setWashCare(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 font-medium text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs">
                  <option value="Dry Clean Only (Recommended for Embroidery & Gold Print)">Dry Clean Only (Recommended for Embroidery)</option>
                  <option value="Gentle Hand Wash Separately in Cold Water">Gentle Hand Wash Separately in Cold Water</option>
                  <option value="Machine Wash inside-out on Gentle Cycle">Machine Wash inside-out on Gentle Cycle</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Fitting Note *</label>
                <input type="text" value={modelSizeNote} onChange={(e) => setModelSizeNote(e.target.value)} className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs" />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#e2d4c7] space-y-3">
            <button type="submit" disabled={saving} className="w-full py-3.5 bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide">
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Update & Sync to Shop'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
