'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  ImageIcon,
  Plus,
  Palette,
  Ruler,
  Layers,
  Sparkles,
  CheckCircle,
  Trash2,
  Tag,
  Clock,
  Info,
  ChevronRight,
  HelpCircle,
} from 'lucide-react'
import { addProduct } from '@/lib/products-store'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'

// ─── Single Image Slot Component (Refined & Compact) ──────────────────────────
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

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-1.5 flex flex-col">
      <span className="block text-[11px] font-bold text-slate-700 truncate">{label}</span>

      {/* Preview / Drop Zone */}
      <div
        className="relative w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-[#e2d4c7] bg-[#FAF6F0]/40 overflow-hidden cursor-pointer group hover:border-[#8f1020] hover:bg-[#FAF6F0]/80 transition-all shadow-2xs flex-1 flex flex-col justify-center"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover object-top absolute inset-0"
            />
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
              <p className="text-[11px] font-bold text-slate-700">Click to add photo</p>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">or drag &amp; drop file</p>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {/* URL fallback input */}
      <input
        type="text"
        placeholder="Or paste image URL..."
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#e2d4c7] rounded-xl px-2.5 py-1.5 text-[11px] outline-none focus:border-[#8f1020] text-slate-700 placeholder:text-slate-400 font-mono shadow-2xs transition-colors"
      />
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
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

export default function AddProductPage() {
  const router = useRouter()

  // 1. Basic Details
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState(
    'Experience the grace of authentic Indian craftsmanship with this exquisitely hand-embroidered ensemble. Tailored for pure festive opulence and day-long comfort.'
  )

  // 2. Organization & Pricing
  const [category, setCategory] = useState<string>(MASTER_CATEGORIES[0].name)
  const [subCategory, setSubCategory] = useState<string>(MASTER_CATEGORIES[0].subcategories[0] || '')
  const [dispatchTimeline, setDispatchTimeline] = useState('Ready to Ship (Dispatched within 24-48 Hours)')
  const [price, setPrice] = useState('3300')
  const [oldPrice, setOldPrice] = useState('5500')

  // 3. Color Variants
  const [colorVariants, setColorVariants] = useState<ColorVariantForm[]>([
    {
      id: 'color-1',
      name: 'Ruby Red',
      hex: '#8f1020',
      images: ['', '', '', ''],
    },
  ])

  // 4. Size Inventory
  const [sizes, setSizes] = useState<SizeItem[]>(DEFAULT_SIZES)

  // 5. Specifications & Highlights
  const [setInclusions, setSetInclusions] = useState('3-Piece Set: 1 Embroidered Kurta, 1 Churidar Pant, 1 Organza Dupatta')
  const [fabric, setFabric] = useState('Pure Chanderi Silk with Soft Cotton Lining')
  const [fit, setFit] = useState('Flared Anarkali Silhouette')
  const [pattern, setPattern] = useState('Intricate Zari, Sequin & Gota Patti Work')
  const [neckline, setNeckline] = useState('Sweetheart Neckline')
  const [sleeves, setSleeves] = useState('Three-Quarter Sleeves with Embroidered Cuffs')
  const [occasion, setOccasion] = useState('Festive, Wedding Guest & Celebrations')
  const [washCare, setWashCare] = useState('Dry Clean Only (Recommended for Embroidery Protection)')
  const [modelSizeNote, setModelSizeNote] = useState('Model is 5\'8" wearing Size S (Kurta Length: 46 inches)')

  const [highlight1, setHighlight1] = useState('Crafted in rich, breathable pure silk with skin-friendly lining')
  const [highlight2, setHighlight2] = useState('Hand-finished zari and sequin motifs across bodice and borders')
  const [highlight3, setHighlight3] = useState('Includes styled pants with comfortable elasticated waist')
  const [highlight4, setHighlight4] = useState('Easy 7-Day Exchange & Returns Guaranteed')

  // 6. Shop Filter Attribution & Search Tags
  const [selectedFabricTags, setSelectedFabricTags] = useState<string[]>(['Silk', 'Chanderi'])
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>(['Flared & Anarkali'])
  const [selectedOccasionTags, setSelectedOccasionTags] = useState<string[]>(['Wedding & Reception', 'Festive & Puja'])
  const [selectedWorkTags, setSelectedWorkTags] = useState<string[]>(['Zari & Sequin Work'])
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('Red, Wine & Maroon')

  const toggleTag = (arr: string[], val: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn(arr.includes(val) ? arr.filter((t) => t !== val) : [...arr, val])
  }

  const [saving, setSaving] = useState(false)

  // Auto-update slug when product name changes
  const handleNameChange = (val: string) => {
    setName(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleCategoryChange = (catName: string) => {
    setCategory(catName)
    const found = MASTER_CATEGORIES.find((m) => m.name === catName)
    if (found && found.subcategories.length > 0) {
      setSubCategory(found.subcategories[0])
    } else {
      setSubCategory('')
    }
  }

  // Color Variants Handlers
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
      {
        id: `color-${Date.now()}`,
        name: next.name,
        hex: next.hex,
        images: ['', '', '', ''],
      },
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
    setColorVariants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const updateColorImage = (colorId: string, imgIdx: number, val: string) => {
    setColorVariants((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c
        const newImgs = [...c.images]
        newImgs[imgIdx] = val
        return { ...c, images: newImgs }
      })
    )
  }

  // Size Actions
  const handleQuickStock = (val: string) => {
    setSizes((prev) => prev.map((s) => (s.enabled ? { ...s, stock: val } : s)))
  }

  const toggleSizeEnabled = (sizeName: string) => {
    setSizes((prev) =>
      prev.map((s) => (s.size === sizeName ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const updateSizeStock = (sizeName: string, stockVal: string) => {
    setSizes((prev) =>
      prev.map((s) => (s.size === sizeName ? { ...s, stock: stockVal } : s))
    )
  }

  // Price Calculations
  const sellingPriceNum = Number(price) || 0
  const originalPriceNum = Number(oldPrice) || sellingPriceNum
  const discountPercent =
    originalPriceNum > sellingPriceNum
      ? Math.round(((originalPriceNum - sellingPriceNum) / originalPriceNum) * 100)
      : 0
  const savingsAmount = originalPriceNum - sellingPriceNum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a Product Title')
      return
    }

    const allImages: string[] = []
    colorVariants.forEach((variant) => {
      variant.images.forEach((imgUrl) => {
        if (imgUrl.trim()) allImages.push(imgUrl.trim())
      })
    })

    if (allImages.length === 0) {
      alert('Please add at least one product photo in your Color Variants gallery.')
      return
    }

    const activeSizes = sizes
      .filter((s) => s.enabled)
      .map((s) => ({ size: s.size, stock: Number(s.stock) || 0 }))

    if (activeSizes.length === 0) {
      alert('Please enable at least one available size (e.g. S, M, L or Unstitched).')
      return
    }

    const processedColors = colorVariants.map((c) => ({
      name: c.name.trim() || 'Standard',
      hex: c.hex || '#000000',
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
      const created = await addProduct({
        name: name.trim(),
        slug: slug || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        subCategory,
        price: sellingPriceNum,
        oldPrice: originalPriceNum,
        discountPercent,
        rating: 4.9,
        reviewCount: 5,
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

      alert(`✅ Product "${created.name}" published successfully with ${colorVariants.length} Color Variant(s)! Now live on /shop!`)
      router.push('/admin/products')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred'
      alert(`❌ Failed to publish product: ${msg}\n\nPlease check your Supabase table schema.`)
    } finally {
      setSaving(false)
    }
  }

  const selectedMasterCat = MASTER_CATEGORIES.find((m) => m.name === category)

  return (
    <div className="max-w-[1380px] mx-auto pb-24 text-slate-800 space-y-8 px-2">
      {/* ── Page Title & Action Header (Non-sticky to prevent any overlap!) ── */}
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
              Store Catalog Management
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2b1713] tracking-tight mt-1.5">
              Create Ethnic &amp; Fashion Product
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure color galleries, sizing inventory, and rich garment specifications in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <Link
            href="/admin/products"
            className="px-5 py-3 rounded-2xl border border-[#e2d4c7] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-7 py-3 rounded-2xl bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-50 text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish Product to Live Store'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN (8 COLS): CORE PRODUCT STORY & MEDIA GALLERIES ── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Box 1: Basic Information & Copy */}
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
                  placeholder="e.g. Royal Maroon Zari Embroidered Anarkali Kurta Set"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-slate-900 text-sm font-bold outline-none focus:border-[#8f1020] transition-colors placeholder:font-normal placeholder:text-slate-400 shadow-2xs"
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
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-white px-4 py-3 text-slate-800 font-mono text-xs outline-none focus:border-[#8f1020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Garment Silhouette Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the fabric drape, artisanal embroidery motifs, elegance, and comfort of the ensemble..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl p-4 text-slate-800 text-xs font-medium outline-none focus:border-[#8f1020] leading-relaxed resize-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Box 2: Color Variants & Photo Galleries (CORE FEATURE) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2b1713]">Color Variants &amp; Photo Galleries</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shoppers see each color&apos;s exact photo gallery when switching shades on the product page.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addColorVariant}
                className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#EFBD3B]" /> + Add New Color Shade
              </button>
            </div>

            <div className="space-y-6">
              {colorVariants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="p-6 rounded-2xl bg-[#FAF6F0]/50 border border-[#E2D4C7] space-y-5 shadow-2xs"
                >
                  {/* Variant Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#e2d4c7] shadow-2xs">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-[#2b1713] text-white font-mono font-bold text-xs uppercase tracking-wider">
                        Shade #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700">Color Name:</label>
                        <input
                          type="text"
                          placeholder="e.g. Ruby Red / Emerald Green"
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

                  {/* 4 Photo Upload Slots for THIS Color */}
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-3.5 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8f1020]" /> Dedicated Photo Gallery for &ldquo;{variant.name || 'Shade'}&rdquo; (Up to 4 Angles)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((slotIdx) => (
                        <ImageSlot
                          key={slotIdx}
                          label={
                            slotIdx === 0
                              ? `1. Main Front View`
                              : slotIdx === 1
                              ? `2. Side / Back View`
                              : slotIdx === 2
                              ? `3. Dupatta / Work Zoom`
                              : `4. Full Silhouette`
                          }
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

          {/* Box 3: Sizes & Stock Inventory */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#2b1713]">Size Inventory &amp; Stock Availability</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enable standard fashion sizes or unstitched dress materials.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400 text-[11px] font-medium">Quick Stock Action:</span>
                <button
                  type="button"
                  onClick={() => handleQuickStock('10')}
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F0E6DC] text-[#2B1713] border border-[#e2d4c7] rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Set All to 10
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStock('25')}
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F0E6DC] text-[#2B1713] border border-[#e2d4c7] rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Set All to 25
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {sizes.map((s) => (
                <div
                  key={s.size}
                  className={`p-4 rounded-2xl border transition-all ${
                    s.enabled
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                      : 'bg-[#FAF6F0]/40 border-[#e2d4c7] opacity-60'
                  }`}
                >
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
                  <strong>Automatic Sync:</strong> When published, these attributes are indexed immediately by the live store filter engine. Shoppers filtering for any of your selected tags will see this product in their search results!
                </span>
              </div>
            </div>
          </div>

          {/* Box 5: Key Feature Bullet Points */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2d4c7] shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8f1020]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#2b1713]">Storefront Feature Bullets</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Displayed cleanly inside the expandable accordion on the Product Detail Page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 1</label>
                <input
                  type="text"
                  value={highlight1}
                  onChange={(e) => setHighlight1(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 2</label>
                <input
                  type="text"
                  value={highlight2}
                  onChange={(e) => setHighlight2(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 3</label>
                <input
                  type="text"
                  value={highlight3}
                  onChange={(e) => setHighlight3(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Feature Bullet 4</label>
                <input
                  type="text"
                  value={highlight4}
                  onChange={(e) => setHighlight4(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (4 COLS): CATEGORIZATION, PRICING & SPECIFICATIONS ── */}
        <div className="lg:col-span-4 space-y-8 sticky top-6">
          {/* Panel 1: Pricing & Deal Margin */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Pricing &amp; Margins</span>
              <span className="text-[10px] font-sans font-medium text-slate-400">INR (₹)</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">MRP / Original Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-[#8f1020] shadow-2xs"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Strikethrough reference price</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Selling / Offer Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-4 py-3 text-lg font-black text-[#8f1020] outline-none focus:border-[#8f1020] shadow-2xs"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Final payable checkout price</span>
              </div>

              {/* Deal Card */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                  Customer Savings Deal
                </span>
                {discountPercent > 0 ? (
                  <>
                    <div className="text-2xl font-black text-emerald-800">{discountPercent}% OFF</div>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Buyer saves ₹{savingsAmount.toLocaleString()} instantly!
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic py-1">Standard retail pricing (0% off)</p>
                )}
              </div>
            </div>
          </div>

          {/* Panel 2: Catalog Placement & Dispatch */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3">
              Catalog Placement
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Primary Collection *</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-[#FAF6F0]/60 border border-[#e2d4c7] rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs transition-colors"
                >
                  {MASTER_CATEGORIES.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} {m.isComingSoon ? '(Coming Soon)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Subcategory / Garment Type *</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-[#FAF6F0]/60 border border-[#e2d4c7] rounded-2xl px-4 py-3 font-semibold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs transition-colors"
                >
                  {selectedMasterCat && selectedMasterCat.subcategories.length > 0 ? (
                    selectedMasterCat.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
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
                <select
                  value={dispatchTimeline}
                  onChange={(e) => setDispatchTimeline(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-2xl px-3.5 py-3 font-semibold text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs text-xs"
                >
                  <option value="Ready to Ship (Dispatched within 24-48 Hours)">Ready to Ship (24-48 Hours)</option>
                  <option value="Standard Express (Dispatched in 3-5 Business Days)">Standard Express (3-5 Days)</option>
                  <option value="Made to Order (Hand-Embroidered in 7-10 Days)">Made to Order (7-10 Days)</option>
                  <option value="Bridal Custom Order (14-21 Working Days)">Bridal Custom (14-21 Days)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Panel 3: Ethnic Specifications & Craftsmanship */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2d4c7] shadow-xs space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider border-b border-slate-100 pb-3">
              Ethnic Specifications
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Set Inclusions (Items in Box) *</label>
                <input
                  type="text"
                  value={setInclusions}
                  onChange={(e) => setSetInclusions(e.target.value)}
                  placeholder="e.g. 1 Kurta, 1 Pant, 1 Dupatta"
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fabric &amp; Lining *</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Silhouette / Fit Type *</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Embroidery &amp; Craft Work *</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Neckline Styling *</label>
                <input
                  type="text"
                  value={neckline}
                  onChange={(e) => setNeckline(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sleeve Design *</label>
                <input
                  type="text"
                  value={sleeves}
                  onChange={(e) => setSleeves(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recommended Occasion *</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wash Care Recommendation *</label>
                <select
                  value={washCare}
                  onChange={(e) => setWashCare(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 font-medium text-slate-800 outline-none focus:border-[#8f1020] shadow-2xs"
                >
                  <option value="Dry Clean Only (Recommended for Embroidery & Gold Print)">Dry Clean Only (Recommended for Embroidery)</option>
                  <option value="Gentle Hand Wash Separately in Cold Water">Gentle Hand Wash Separately in Cold Water</option>
                  <option value="Machine Wash inside-out on Gentle Cycle">Machine Wash inside-out on Gentle Cycle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Fitting Note *</label>
                <input
                  type="text"
                  value={modelSizeNote}
                  onChange={(e) => setModelSizeNote(e.target.value)}
                  className="w-full bg-white border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:border-[#8f1020] shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Publish Sticky Bottom Card for Right Bar */}
          <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#e2d4c7] space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#2B1713]">
              <CheckCircle className="w-4 h-4 text-[#8f1020]" />
              <span>Instant Catalog Sync</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-normal">
              Publishing will make this product live across your shop, category filters, and checkout instantly.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Publishing...' : 'Publish to Store'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
