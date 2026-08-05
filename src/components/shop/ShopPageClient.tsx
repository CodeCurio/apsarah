'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter, X, Plus, Minus, RotateCcw, Check } from 'lucide-react'
import { Product, fetchProducts, initialProducts } from '@/lib/products-store'
import { ProductCard } from '@/components/shop/ProductCard'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'

// ─── Accordion Filter Section ────────────────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = false,
  badgeCount = 0,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badgeCount?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bibaFilterSection border-b border-[#e2d4c7]/60 last:border-0">
      <button
        type="button"
        className="bibaFilterHeader w-full py-3.5 px-4 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#2B1713] hover:bg-[#FAF6F0] transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2">
          {title}
          {badgeCount > 0 && (
            <span className="bg-[#8f1020] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {badgeCount}
            </span>
          )}
        </span>
        {open ? <Minus className="w-3.5 h-3.5 text-[#8f1020]" /> : <Plus className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      {open && <div className="bibaFilterBody px-4 pb-4 space-y-2 pt-1">{children}</div>}
    </div>
  )
}

// ─── Interactive Checkbox Row ────────────────────────────────────────────────
function CheckRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string
  checked: boolean
  onChange: () => void
  count?: number
}) {
  return (
    <div
      onClick={onChange}
      className="bibaCheckRow flex items-center justify-between py-1.5 cursor-pointer select-none group rounded-md hover:bg-[#F0E6DC]/30 px-1 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            checked
              ? 'bg-[#8f1020] border-[#8f1020] text-white shadow-2xs'
              : 'border-slate-300 bg-white group-hover:border-[#8f1020]'
          }`}
        >
          {checked && (
            <svg viewBox="0 0 10 8" width="10" height="8" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1,4 4,7 9,1" />
            </svg>
          )}
        </div>
        <span className={`text-xs ${checked ? 'font-bold text-[#8f1020]' : 'font-medium text-slate-700 group-hover:text-[#8f1020]'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  )
}

// ─── Filter Tag Definitions & Smart Matching Logic ────────────────────────────
interface FilterOption {
  label: string
  keywords: string[]
}

const COLOR_FAMILIES: FilterOption[] = [
  { label: 'Red, Wine & Maroon', keywords: ['red', 'ruby', 'wine', 'maroon', 'sindoor', 'crimson', 'burgundy', '#8f1020', '#590924', 'rose', 'garnet', 'carmine', 'cherry', 'carmine'] },
  { label: 'Blue, Navy & Teal', keywords: ['blue', 'navy', 'teal', 'azure', 'sapphire', 'indigo', '#0e2b5c', '#004c6d', 'peacock', 'cobalt'] },
  { label: 'Green, Olive & Mint', keywords: ['green', 'olive', 'emerald', 'mint', 'pista', 'sage', 'moss', 'forest', 'firoza', 'sea green', '#056038'] },
  { label: 'Pink & Peach', keywords: ['pink', 'peach', 'blush', 'fuchsia', 'rose', 'coral', 'flamingo', '#e8a59b'] },
  { label: 'Yellow, Mustard & Gold', keywords: ['yellow', 'mustard', 'gold', 'golden', 'amber', 'saffron', 'haldi', '#d49b08'] },
  { label: 'White, Ivory & Off-White', keywords: ['white', 'ivory', 'cream', 'off-white', 'ecru', 'pearl', 'chalk', 'beige', '#ffffff', '#fcfbf9'] },
  { label: 'Black, Grey & Charcoal', keywords: ['black', 'grey', 'charcoal', 'slate', 'ebony', 'noir', 'ash', '#000000', '#222222'] },
  { label: 'Purple, Plum & Lavender', keywords: ['purple', 'plum', 'lavender', 'violet', 'magenta', 'lilac', '#4b0082'] },
]

const FABRICS: FilterOption[] = [
  { label: 'Silk & Chanderi', keywords: ['silk', 'chanderi', 'raw silk', 'cotton silk', 'tussar', 'banarasi', 'spun silk', 'mashroo'] },
  { label: 'Cotton & Mulmul', keywords: ['cotton', 'cambric', 'mulmul', 'voile', 'khadi', 'poplin'] },
  { label: 'Velvet', keywords: ['velvet', 'micro velvet', 'silk velvet'] },
  { label: 'Georgette & Chiffon', keywords: ['georgette', 'chiffon', 'crepe', 'viscose'] },
  { label: 'Pashmina & Wool', keywords: ['pashmina', 'wool', 'kashmiri', 'woolen', 'acrylic'] },
  { label: 'Organza & Tissue', keywords: ['organza', 'tissue', 'net'] },
  { label: 'Linen', keywords: ['linen', 'hemp', 'jute'] },
]

const STYLES_AND_FITS: FilterOption[] = [
  { label: 'Flared & Anarkali', keywords: ['anarkali', 'flared', 'kalidar', 'umbrella', 'gown'] },
  { label: 'Straight Suit Set', keywords: ['straight', 'regular fit', 'kurta pant', 'straight cut', 'column'] },
  { label: 'Sharara & Gharara', keywords: ['sharara', 'gharara', 'divided'] },
  { label: 'Lehenga & Crop Top', keywords: ['lehenga', 'skirt', 'crop top', 'choli', 'drape set'] },
  { label: 'Co-ord & Tunic Set', keywords: ['co-ord', 'coord', 'tunic', 'two-piece', 'modern set'] },
  { label: 'Palazzo & Trousers', keywords: ['palazzo', 'trouser', 'dhoti', 'pant', 'bottom', 'churidar'] },
  { label: 'Jacket & Layered', keywords: ['jacket', 'overlay', 'shrug', 'layered', 'cape', 'angrakha'] },
]

const OCCASIONS: FilterOption[] = [
  { label: 'Wedding & Reception Guest', keywords: ['wedding', 'reception', 'sangeet', 'shaadi', 'bridal', 'trousseau', 'celebration'] },
  { label: 'Festive & Puja Wear', keywords: ['festive', 'puja', 'diwali', 'eid', 'navratri', 'karwa chauth', 'rakhi', 'festivals'] },
  { label: 'Haldi & Mehndi Ceremony', keywords: ['haldi', 'mehndi', 'sangeet', 'ceremony', 'cocktail'] },
  { label: 'Party & Evening Soiree', keywords: ['party', 'evening', 'soiree', 'dinner', 'club', 'formal'] },
  { label: 'Casual & Everyday Luxury', keywords: ['casual', 'daily', 'office', 'workwear', 'everyday', 'brunch', 'daywear'] },
  { label: 'Summer Resort Edit', keywords: ['summer', 'resort', 'vacation', 'holiday', 'beach', 'lightweight', 'breezy'] },
]

const WORK_AND_PATTERNS: FilterOption[] = [
  { label: 'Zari & Sequin Embroidery', keywords: ['zari', 'sequin', 'embroidered', 'zardozi', 'dabka', 'marori'] },
  { label: 'Gota Patti & Mirror Work', keywords: ['gota', 'gota patti', 'mirror', 'sheesh', 'foil', 'tari'] },
  { label: 'Floral & Botanical Print', keywords: ['floral', 'botanical', 'flower', 'block print', 'printed', 'mandala'] },
  { label: 'Handpainted & Craft', keywords: ['handpainted', 'handcrafted', 'hand painted', 'artisanal', 'kalamkari', 'ajrakh'] },
  { label: 'Chikankari & Thread Work', keywords: ['chikankari', 'thread', 'lakhnavi', 'kantha', 'phulkari', 'embroidery'] },
  { label: 'Minimalist & Solid', keywords: ['solid', 'plain', 'minimalist', 'classic', 'pleated', 'structured'] },
]

export function ShopPageClient() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) {
        setProducts(data)
      }
      setLoading(false)
    })
  }, [])

  // ── Filter States ──────────────────────────────────────────────────────────
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams?.get('category')
    if (cat && cat !== 'All' && cat !== 'New In' && cat !== 'NEW IN') {
      const match = MASTER_CATEGORIES.find((m) => m.name.toLowerCase() === cat.toLowerCase())
      return [match ? match.name : cat]
    }
    return []
  })
  const [urlQueryFilter, setUrlQueryFilter] = useState<string>(() => searchParams?.get('q') || searchParams?.get('sub') || '')

  useEffect(() => {
    const cat = searchParams?.get('category') || ''
    if (cat && cat !== 'All' && cat !== 'New In' && cat !== 'NEW IN') {
      const match = MASTER_CATEGORIES.find((m) => m.name.toLowerCase() === cat.toLowerCase())
      setSelectedCategories([match ? match.name : cat])
    }
    const q = searchParams?.get('q') || searchParams?.get('sub') || ''
    setUrlQueryFilter(q)
  }, [searchParams])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColorFamilies, setSelectedColorFamilies] = useState<string[]>([])
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('featured')

  // Categories list
  const allCategories = useMemo(() => {
    const cats = MASTER_CATEGORIES.map((m) => m.name)
    const existing = [...new Set(products.map((p) => p.category))]
    existing.forEach((c) => {
      if (c && !cats.includes(c)) cats.push(c)
    })
    return cats
  }, [products])

  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹2,000', value: 'under-2000' },
    { label: '₹2,000 – ₹3,500', value: '2000-3500' },
    { label: '₹3,500 – ₹5,000', value: '3500-5000' },
    { label: 'Above ₹5,000', value: 'above-5000' },
  ]
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Unstitched']

  // Toggle helpers
  const toggleArr = (arr: string[], val: string, set: React.Dispatch<React.SetStateAction<string[]>>) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])

  // Helper function to check if a product matches any keyword in a list of selected filter option labels
  const matchesFilterGroup = (product: Product, selectedLabels: string[], groupOptions: FilterOption[]): boolean => {
    if (selectedLabels.length === 0) return true
    
    // Combine all fields into a single text haystack for searching
    const haystack = [
      product.name,
      product.category,
      product.subCategory || '',
      product.fabric,
      product.fit,
      product.pattern,
      product.neckline,
      product.sleeves,
      product.occasion,
      product.description,
      ...(product.highlights || []),
      ...(product.colors || []).map((c) => `${c.name} ${c.hex}`),
    ]
      .join(' ')
      .toLowerCase()

    // The product must match at least ONE of the selected labels in this group (OR logic within group)
    return selectedLabels.some((label) => {
      const option = groupOptions.find((opt) => opt.label === label)
      if (!option) return false
      return option.keywords.some((kw) => haystack.includes(kw.toLowerCase()))
    })
  }

  // ── Filter & Sort Logic ────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // 1. Category check
        if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false

        // 2. Price check
        if (selectedPriceRange === 'under-2000' && item.price >= 2000) return false
        if (selectedPriceRange === '2000-3500' && (item.price < 2000 || item.price > 3500)) return false
        if (selectedPriceRange === '3500-5000' && (item.price < 3500 || item.price > 5000)) return false
        if (selectedPriceRange === 'above-5000' && item.price <= 5000) return false

        // 3. Size check
        if (selectedSizes.length > 0) {
          const hasSize = item.sizes?.some((s) => selectedSizes.includes(s.size))
          if (!hasSize) return false
        }

        // 4. Color Family check
        if (!matchesFilterGroup(item, selectedColorFamilies, COLOR_FAMILIES)) return false

        // 5. Fabric check
        if (!matchesFilterGroup(item, selectedFabrics, FABRICS)) return false

        // 6. Style / Silhouette check
        if (!matchesFilterGroup(item, selectedStyles, STYLES_AND_FITS)) return false

        // 7. Occasion check
        if (!matchesFilterGroup(item, selectedOccasions, OCCASIONS)) return false

        // 8. Work & Pattern check
        if (!matchesFilterGroup(item, selectedPatterns, WORK_AND_PATTERNS)) return false

        // 9. URL Keyword / Subcategory match from Navbar & Mega Menu
        if (urlQueryFilter.trim() && !['New Arrivals', 'Bestsellers', 'Trending Now', 'This Week'].includes(urlQueryFilter)) {
          const kw = urlQueryFilter.toLowerCase()
          const itemText = [
            item.name,
            item.category,
            item.subCategory || '',
            item.fabric,
            item.fit,
            item.pattern,
            item.occasion,
            item.description,
            ...(item.highlights || []),
          ].join(' ').toLowerCase()
          if (!itemText.includes(kw)) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent
        return 0
      })
  }, [
    products,
    selectedCategories,
    selectedPriceRange,
    selectedSizes,
    selectedColorFamilies,
    selectedFabrics,
    selectedStyles,
    selectedOccasions,
    selectedPatterns,
    urlQueryFilter,
    sortBy,
  ])

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRange('All')
    setSelectedSizes([])
    setSelectedColorFamilies([])
    setSelectedFabrics([])
    setSelectedStyles([])
    setSelectedOccasions([])
    setSelectedPatterns([])
    setUrlQueryFilter('')
  }

  const activeCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColorFamilies.length +
    selectedFabrics.length +
    selectedStyles.length +
    selectedOccasions.length +
    selectedPatterns.length +
    (selectedPriceRange !== 'All' ? 1 : 0) +
    (urlQueryFilter ? 1 : 0)

  // ── Sidebar Content (shared between desktop + mobile) ─────────────────────
  const filterSidebar = (
    <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-xs overflow-hidden text-[#2B1713]">
      {/* Filters Header */}
      <div className="p-4 bg-[#FAF6F0] border-b border-[#e2d4c7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8f1020]" />
          <span className="font-serif font-bold text-sm tracking-wide">FILTERS & REFINE</span>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-[#8f1020] hover:text-[#590924] underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All ({activeCount})
          </button>
        )}
      </div>

      {/* CATEGORY */}
      <FilterSection title="CATEGORY" defaultOpen badgeCount={selectedCategories.length}>
        {allCategories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length
          if (count === 0 && !selectedCategories.includes(cat)) return null
          return (
            <CheckRow
              key={cat}
              label={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleArr(selectedCategories, cat, setSelectedCategories)}
              count={count}
            />
          )
        })}
      </FilterSection>

      {/* PRICE RANGE */}
      <FilterSection title="PRICE RANGE" defaultOpen badgeCount={selectedPriceRange !== 'All' ? 1 : 0}>
        {priceRanges.map((pr) => (
          <div
            key={pr.value}
            onClick={() => setSelectedPriceRange(pr.value)}
            className="flex items-center justify-between py-1.5 cursor-pointer select-none group rounded-md hover:bg-[#F0E6DC]/30 px-1 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedPriceRange === pr.value
                    ? 'bg-[#8f1020] border-[#8f1020] text-white shadow-2xs'
                    : 'border-slate-300 bg-white group-hover:border-[#8f1020]'
                }`}
              >
                {selectedPriceRange === pr.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span
                className={`text-xs ${
                  selectedPriceRange === pr.value ? 'font-bold text-[#8f1020]' : 'font-medium text-slate-700 group-hover:text-[#8f1020]'
                }`}
              >
                {pr.label}
              </span>
            </div>
          </div>
        ))}
      </FilterSection>

      {/* SIZE */}
      <FilterSection title="SIZE" defaultOpen badgeCount={selectedSizes.length}>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {sizes.map((sz) => {
            const isSelected = selectedSizes.includes(sz)
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleArr(selectedSizes, sz, setSelectedSizes)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#8f1020] border-[#8f1020] text-white shadow-sm scale-105'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#8f1020] hover:bg-[#FAF6F0]'
                }`}
              >
                {sz}
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* COLOR FAMILY */}
      <FilterSection title="COLOR FAMILY" defaultOpen={false} badgeCount={selectedColorFamilies.length}>
        {COLOR_FAMILIES.map((col) => {
          const matches = products.filter((p) => matchesFilterGroup(p, [col.label], COLOR_FAMILIES)).length
          if (matches === 0 && !selectedColorFamilies.includes(col.label)) return null
          return (
            <CheckRow
              key={col.label}
              label={col.label}
              checked={selectedColorFamilies.includes(col.label)}
              onChange={() => toggleArr(selectedColorFamilies, col.label, setSelectedColorFamilies)}
              count={matches}
            />
          )
        })}
      </FilterSection>

      {/* FABRIC */}
      <FilterSection title="FABRIC" defaultOpen={false} badgeCount={selectedFabrics.length}>
        {FABRICS.map((fab) => {
          const matches = products.filter((p) => matchesFilterGroup(p, [fab.label], FABRICS)).length
          if (matches === 0 && !selectedFabrics.includes(fab.label)) return null
          return (
            <CheckRow
              key={fab.label}
              label={fab.label}
              checked={selectedFabrics.includes(fab.label)}
              onChange={() => toggleArr(selectedFabrics, fab.label, setSelectedFabrics)}
              count={matches}
            />
          )
        })}
      </FilterSection>

      {/* STYLE & SILHOUETTE */}
      <FilterSection title="STYLE & SILHOUETTE" defaultOpen={false} badgeCount={selectedStyles.length}>
        {STYLES_AND_FITS.map((style) => {
          const matches = products.filter((p) => matchesFilterGroup(p, [style.label], STYLES_AND_FITS)).length
          if (matches === 0 && !selectedStyles.includes(style.label)) return null
          return (
            <CheckRow
              key={style.label}
              label={style.label}
              checked={selectedStyles.includes(style.label)}
              onChange={() => toggleArr(selectedStyles, style.label, setSelectedStyles)}
              count={matches}
            />
          )
        })}
      </FilterSection>

      {/* OCCASION */}
      <FilterSection title="OCCASION & EVENT" defaultOpen={false} badgeCount={selectedOccasions.length}>
        {OCCASIONS.map((occ) => {
          const matches = products.filter((p) => matchesFilterGroup(p, [occ.label], OCCASIONS)).length
          if (matches === 0 && !selectedOccasions.includes(occ.label)) return null
          return (
            <CheckRow
              key={occ.label}
              label={occ.label}
              checked={selectedOccasions.includes(occ.label)}
              onChange={() => toggleArr(selectedOccasions, occ.label, setSelectedOccasions)}
              count={matches}
            />
          )
        })}
      </FilterSection>

      {/* WORK & EMBROIDERY */}
      <FilterSection title="WORK & EMBROIDERY" defaultOpen={false} badgeCount={selectedPatterns.length}>
        {WORK_AND_PATTERNS.map((pat) => {
          const matches = products.filter((p) => matchesFilterGroup(p, [pat.label], WORK_AND_PATTERNS)).length
          if (matches === 0 && !selectedPatterns.includes(pat.label)) return null
          return (
            <CheckRow
              key={pat.label}
              label={pat.label}
              checked={selectedPatterns.includes(pat.label)}
              onChange={() => toggleArr(selectedPatterns, pat.label, setSelectedPatterns)}
              count={matches}
            />
          )
        })}
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF6F0]/30 text-[#2B1713] pb-20">
      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#e2d4c7] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Title and Count */}
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-serif font-bold text-[#2B1713] tracking-tight">LUXURY COLLECTION</h1>
            <span className="text-xs font-semibold text-slate-500 bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#e2d4c7]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Design Available' : 'Designs Available'}
            </span>
          </div>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF6F0] border border-[#e2d4c7] rounded-xl px-3 py-1.5 font-bold text-xs text-[#2B1713] outline-none focus:border-[#8F1020] cursor-pointer shadow-2xs transition-all"
              >
                <option value="featured">✨ Bestsellers & Featured</option>
                <option value="price-low">💸 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="rating">★ Top Rated Designs</option>
                <option value="discount">🔥 Highest Discount (% OFF)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 bg-[#8F1020] text-white text-xs font-bold rounded-xl shadow-md"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="bg-white text-[#8F1020] rounded-full w-4 h-4 text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeCount > 0 && (
          <div className="bg-[#FAF6F0] border-t border-[#e2d4c7]/50 py-2.5 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8f1020] mr-1">Active Filters:</span>

              {urlQueryFilter && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Filter: <strong className="text-[#8f1020]">{urlQueryFilter}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => setUrlQueryFilter('')} />
                </span>
              )}

              {selectedCategories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Category: <strong className="text-[#8f1020]">{c}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedCategories, c, setSelectedCategories)} />
                </span>
              ))}

              {selectedPriceRange !== 'All' && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Price: <strong className="text-[#8f1020]">{priceRanges.find((p) => p.value === selectedPriceRange)?.label}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => setSelectedPriceRange('All')} />
                </span>
              )}

              {selectedSizes.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Size: <strong className="text-[#8f1020]">{s}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedSizes, s, setSelectedSizes)} />
                </span>
              ))}

              {selectedColorFamilies.map((col) => (
                <span key={col} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Color: <strong className="text-[#8f1020]">{col}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedColorFamilies, col, setSelectedColorFamilies)} />
                </span>
              ))}

              {selectedFabrics.map((fab) => (
                <span key={fab} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Fabric: <strong className="text-[#8f1020]">{fab}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedFabrics, fab, setSelectedFabrics)} />
                </span>
              ))}

              {selectedStyles.map((st) => (
                <span key={st} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Style: <strong className="text-[#8f1020]">{st}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedStyles, st, setSelectedStyles)} />
                </span>
              ))}

              {selectedOccasions.map((occ) => (
                <span key={occ} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Occasion: <strong className="text-[#8f1020]">{occ}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedOccasions, occ, setSelectedOccasions)} />
                </span>
              ))}

              {selectedPatterns.map((pat) => (
                <span key={pat} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white border border-[#e2d4c7] rounded-full text-slate-800 font-semibold shadow-2xs text-xs">
                  Work: <strong className="text-[#8f1020]">{pat}</strong>
                  <X className="w-3.5 h-3.5 hover:text-rose-600 cursor-pointer ml-0.5" onClick={() => toggleArr(selectedPatterns, pat, setSelectedPatterns)} />
                </span>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto text-xs font-bold text-[#8F1020] hover:underline flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-rose-200 shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Layout: Sidebar + Grid ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-start gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-40 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 custom-scrollbar">
          {filterSidebar}
        </aside>

        {/* Product Grid / Results */}
        <main className="flex-1">
          {loading && products.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-3 border-[#8F1020] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading luxury catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 px-4 text-center max-w-md mx-auto space-y-6 bg-white rounded-2xl border border-[#e2d4c7] shadow-xs p-8">
              <div className="w-14 h-14 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6 text-[#8F1020]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[#2B1713]">No matching designer silhouettes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We couldn&apos;t find any products matching your specific combination of filters. Try resetting or adjusting your criteria.
                </p>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#8F1020] hover:bg-[#590924] text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Drawer ───────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-84 max-w-[90vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8f1020]" />
                <span className="font-serif font-bold text-sm">REFINE CATALOG</span>
              </div>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {filterSidebar}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex gap-3 shadow-lg">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Reset ({activeCount})
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-[#8F1020] hover:bg-[#590924] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
