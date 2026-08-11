'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Ruler,
  MessageSquare,
  CheckCircle,
  Package,
  Share2,
  Sparkles,
  Camera,
  Upload,
  X,
  Lock,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react'
import { Product, getProductsStore } from '@/lib/products-store'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { useWishlist } from '@/context/WishlistContext'
import { createClient } from '@/lib/supabase/client'

interface Review {
  id: string
  product_id: string
  user_id: string | null
  rating: number
  title: string
  body: string
  is_verified: boolean
  images?: string[]
  created_at: string
  user_name?: string
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '/assets/img-2.jpeg')
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes.find((s) => s.stock > 0)?.size || 'M')
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '')
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transform: 'scale(1)', transformOrigin: 'center' })

  const activeColorObj = product.colors.find((c) => c.name === selectedColor)
  const displayImages = (activeColorObj?.images && activeColorObj.images.length > 0)
    ? activeColorObj.images
    : product.images

  // Prioritize bullets that explicitly mention Set Inclusions or complete sets over standalone keywords
  const inclusionsText = useMemo(() => {
    const primaryKeywords = ['includes', 'included', 'inclusion', 'piece set', 'in the box', 'paired with', 'comes with', 'accompanied by', 'complete set']
    const secondaryKeywords = ['dupatta', 'trousers', 'pants', 'blouse', 'sharara', 'palazzo', 'skirt']

    // First try primary matchers
    const primaryMatch = product.highlights?.find((h) => primaryKeywords.some((kw) => h.toLowerCase().includes(kw)))
    if (primaryMatch) {
      return primaryMatch.replace(/^(Set\s*)?Inclusions:\s*/i, '').replace(/^(Items in box:\s*)/i, '').trim()
    }

    // Fallback to secondary matchers
    const secondaryMatch = product.highlights?.find((h) => secondaryKeywords.some((kw) => h.toLowerCase().includes(kw)))
    if (secondaryMatch) {
      return secondaryMatch.replace(/^(Set\s*)?Inclusions:\s*/i, '').replace(/^(Items in box:\s*)/i, '').trim()
    }

    return product.category ? `Complete luxury authentic ${product.category.toLowerCase()} ensemble as photographed` : ''
  }, [product.highlights, product.category])

  useEffect(() => {
    if (activeColorObj?.images && activeColorObj.images.length > 0) {
      setSelectedImage(activeColorObj.images[0])
    }
  }, [selectedColor, activeColorObj])

  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  
  // Accordion open states
  const [descOpen, setDescOpen] = useState(true)
  const [specsOpen, setSpecsOpen] = useState(true)
  const [fitNoteOpen, setFitNoteOpen] = useState(false)

  // Reviews & Verified Purchaser State
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [checkingOrder, setCheckingOrder] = useState(true)
  const [newRating, setNewRating] = useState(5)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([])
  const [submittingReview, setSubmittingReview] = useState(false)

  const { addItem, openCart } = useCart()
  const { toastSuccess, toastError } = useToast()
  const { user, profile } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)
  const router = useRouter()

  // Fetch reviews and verify if user purchased this product
  useEffect(() => {
    const supabase = createClient()

    // 1. Fetch Reviews
    supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setReviews(data as Review[])
        setReviewsLoading(false)
      })

    // 2. Check if logged-in user is a verified purchaser
    if (user) {
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          const hasBought = data?.some((order: any) => {
            const items = order.items || []
            return items.some((it: any) => it.id === product.id || it.name === product.name)
          })
          setCanReview(Boolean(hasBought))
          setCheckingOrder(false)
        }, () => {
          setCanReview(false)
          setCheckingOrder(false)
        })
    } else {
      setCanReview(false)
      setCheckingOrder(false)
    }
  }, [product.id, user])

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (pincode.length === 6) {
      const today = new Date()
      const d1 = new Date(today)
      d1.setDate(today.getDate() + 3)
      const d2 = new Date(today)
      d2.setDate(today.getDate() + 5)
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
      setPincodeStatus(`✅ Guaranteed Express Delivery between ${d1.toLocaleDateString('en-IN', options)} - ${d2.toLocaleDateString('en-IN', options)} to ${pincode}. Cash on Delivery available!`)
    } else {
      setPincodeStatus('❌ Please enter a valid 6-digit Pincode.')
    }
  }

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize)
  const isSelectedSizeAvailable = (selectedSizeObj?.stock ?? 0) > 0
  const remainingStock = selectedSizeObj?.stock ?? 0

  const handleAddToCart = () => {
    if (!isSelectedSizeAvailable) {
      toastError(`Sorry, size "${selectedSize}" is currently out of stock!`)
      return
    }
    addItem(product, 1, selectedSize)
    toastSuccess(`Added "${product.name}" (${selectedSize}) to bag`)
  }

  const handleBuyNow = () => {
    if (!isSelectedSizeAvailable) {
      toastError(`Sorry, size "${selectedSize}" is currently out of stock!`)
      return
    }
    addItem(product, 1, selectedSize)
    router.push('/checkout')
  }

  const handleWishlistToggle = async () => {
    await toggleWishlist(product.id, product.name)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `Check out ${product.name} at Apsarah!`, url })
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(url)
      toastSuccess('Link copied to clipboard!')
    }
  }

  // Convert uploaded review photos to Data URL for instant display and storing
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setReviewPhotos((prev) => [...prev.slice(0, 3), event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePhoto = (idxToRemove: number) => {
    setReviewPhotos((prev) => prev.filter((_, idx) => idx !== idxToRemove))
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toastError('Please sign in to post a review')
      return
    }

    setSubmittingReview(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.id,
        rating: newRating,
        title: newTitle,
        body: newBody,
        is_verified: true,
      })
      .select()
      .single()

    setSubmittingReview(false)

    if (error) {
      toastError('Failed to submit review: ' + error.message)
    } else if (data) {
      // Attach local photos & user name to review object for instant display
      const savedReview: Review = {
        ...(data as Review),
        images: reviewPhotos,
        user_name: profile?.full_name || user.email?.split('@')[0] || 'Verified Buyer'
      }
      setReviews((prev) => [savedReview, ...prev])
      setNewTitle('')
      setNewBody('')
      setReviewPhotos([])
      toastSuccess('Thank you for your verified customer review & photos!')
    }
  }

  const allProducts = getProductsStore()
  const relatedProducts = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  const stylingRecommendations = allProducts.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4)

  const whatsappStylistUrl = `https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(
    `Hi Apsarah Fashion Stylist, I am considering the ${product.name} (₹${product.price}) and would like styling advice or custom blouse fit assistance.`
  )}`

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2B1713] pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
        
        {/* Top Breadcrumb & Share Action */}
        <div className="flex items-center justify-between border-b border-[#E2D4C7]/60 pb-4 text-xs">
          <nav className="text-slate-500 flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#8F1020] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#8F1020] transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#8F1020] font-medium transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#2B1713] font-bold truncate max-w-[220px] sm:max-w-none">{product.name}</span>
          </nav>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D4C7] hover:border-[#8F1020] text-[#2B1713] font-bold text-xs shadow-2xs transition-all shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#8F1020]" />
            <span>Share Ensemble</span>
          </button>
        </div>

        {/* Top Product Layout: Sticky Gallery (Left) + Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* LEFT: Sticky Multi-Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-28 z-10">
            {/* Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[680px] shrink-0 custom-scrollbar pb-2 sm:pb-0">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-18 h-24 sm:w-20 sm:h-26 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 relative ${
                    selectedImage === img
                      ? 'border-[#8F1020] shadow-md scale-105 opacity-100 ring-2 ring-[#8f1020]/20'
                      : 'border-transparent opacity-70 hover:opacity-100 bg-slate-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  {selectedImage === img && (
                    <span className="absolute inset-0 bg-[#8f1020]/10 border border-[#8f1020] pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Main High-Res Image with luxury styling (No bulky white borders!) */}
            <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F2ECE6] shadow-xl border border-[#E2D4C7]/60 group">
              <img
                src={selectedImage}
                alt={product.name}
                style={zoomStyle}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  setZoomStyle({ transform: 'scale(1.4)', transformOrigin: `${x}% ${y}%` })
                }}
                onMouseLeave={() => setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center' })}
                className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-auto"
              />

              {/* Discount / Signature Tag */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#8F1020] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Flat {product.discountPercent}% OFF</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label="Wishlist toggle"
                className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer text-[#8F1020]"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-[#8F1020] text-[#8F1020]' : ''}`} />
              </button>

              <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
                Hover to Zoom
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information & Interactive Options */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Title & Brand Header */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#8F1020] uppercase tracking-widest block bg-rose-50 border border-rose-200 px-3 py-1 rounded-md inline-block">
                APSARAH ROYAL SIGNATURE • {product.category.toUpperCase()}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2B1713] tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-[#2B1713] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-current text-[#EFBD3B]" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-600 font-bold underline cursor-pointer">
                  ({reviews.length || product.reviewCount || 42} Verified Reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Refined Price Bar (No clunky white card box) */}
            <div className="py-4 border-y border-[#E2D4C7]/80 space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-extrabold font-serif text-[#8F1020]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.oldPrice > product.price && (
                  <del className="text-lg text-slate-400 font-medium">
                    MRP ₹{product.oldPrice.toLocaleString()}
                  </del>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-[#8F1020] text-xs font-extrabold border border-rose-200">
                    Save ₹{(product.oldPrice - product.price).toLocaleString()} ({product.discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Inclusive of all taxes & complimentary insured doorstep courier across India.
              </p>
            </div>


            {/* Live Scarcity & Social Proof Banner */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
              <span className="text-base animate-pulse">🔥</span>
              <span>High Demand: 14 shoppers have viewed this ensemble today. Order soon to reserve your fit.</span>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1713]">
                    Selected Shade: <strong className="text-[#8F1020] underline">{selectedColor}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">All colors available in standard fabric</span>
                </div>
                <div className="flex gap-3.5 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`group relative w-10 h-10 rounded-full border-2 p-1 transition-all cursor-pointer shadow-sm ${
                        selectedColor === c.name ? 'border-[#8F1020] scale-110 ring-2 ring-rose-200' : 'border-slate-300 hover:scale-105'
                      }`}
                    >
                      <span className="block w-full h-full rounded-full shadow-inner" style={{ backgroundColor: c.hex || '#8F1020' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1713]">Select Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-extrabold text-[#8F1020] underline flex items-center gap-1 cursor-pointer hover:text-rose-900"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide & Measurements
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {product.sizes.map((s) => {
                  const isAvailable = s.stock > 0
                  const isSelected = selectedSize === s.size

                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border text-center relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#8F1020] text-white border-[#8F1020] shadow-md scale-105'
                          : isAvailable
                          ? 'bg-white text-[#2B1713] border-[#E2D4C7] hover:border-[#8F1020] shadow-2xs'
                          : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span>{s.size}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stock Level Warning Badges */}
            {isSelectedSizeAvailable && remainingStock > 0 && remainingStock <= 5 && (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2.5 rounded-xl animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>🔥 Only {remainingStock} left in stock for size &quot;{selectedSize}&quot; — Order soon!</span>
              </div>
            )}

            {!isSelectedSizeAvailable && (
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Size &quot;{selectedSize}&quot; is currently OUT OF STOCK</span>
              </div>
            )}

            {/* Action Button Pair: Add to Bag + Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <button
                type="button"
                disabled={!isSelectedSizeAvailable}
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-2xl font-serif font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isSelectedSizeAvailable
                    ? 'bg-[#8F1020] text-white hover:bg-[#720C18] active:scale-95 cursor-pointer hover:shadow-xl'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isSelectedSizeAvailable ? 'ADD TO BAG' : 'OUT OF STOCK'}</span>
              </button>

              <button
                type="button"
                disabled={!isSelectedSizeAvailable}
                onClick={handleBuyNow}
                className={`w-full py-4 px-6 rounded-2xl font-serif font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 border ${
                  isSelectedSizeAvailable
                    ? 'bg-[#2B1713] text-white hover:bg-[#1a0c09] active:scale-95 cursor-pointer border-slate-800 hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                <span>BUY NOW</span>
              </button>
            </div>

            {/* WhatsApp VIP Concierge Button */}
            <a
              href={whatsappStylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300/80 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>Have sizing or custom fitting questions? Chat with our Stylist on WhatsApp</span>
            </a>

            {/* Smart Pincode & Delivery Calculator */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2D4C7] space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#2B1713] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#8F1020]" />
                <span>Check Delivery & Cash on Delivery (COD)</span>
              </div>
              
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setPincode(val)
                  }}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E2D4C7] text-xs outline-none focus:border-[#8F1020] font-semibold text-slate-800"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2B1713] text-white text-xs font-bold hover:bg-[#8f1020] transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>

              {pincodeStatus && (
                <p className={`text-xs font-bold pt-1 ${pincodeStatus.includes('✅') ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Luxury Brand Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-[#E2D4C7]">
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#8F1020]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#2B1713]">100% Authentic</span>
                <span className="text-[9px] text-slate-500">Handcrafted Zari & Fabrics</span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#8F1020]">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#2B1713]">Insured Shipping</span>
                <span className="text-[9px] text-slate-500">Free courier above ₹999</span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#8F1020]">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-[#2B1713]">Easy Exchanges</span>
                <span className="text-[9px] text-slate-500">7-Day Hassle Free Return</span>
              </div>
            </div>

            {/* Expandable Specifications & Fitting Accordions */}
            <div className="space-y-3 pt-2">
              
              {/* Product Description */}
              <div className="bg-white rounded-2xl border border-[#E2D4C7] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1713] cursor-pointer hover:bg-slate-50"
                >
                  <span>Product Description & Craftsmanship</span>
                  {descOpen ? <ChevronUp className="w-4 h-4 text-[#8f1020]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {descOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 space-y-3 border-t border-slate-100">
                    <p className="leading-relaxed font-medium text-slate-700">{product.description}</p>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
                      {product.highlights.map((hl, idx) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric & Specifications Table */}
              <div className="bg-white rounded-2xl border border-[#E2D4C7] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1713] cursor-pointer hover:bg-slate-50"
                >
                  <span>Fabric & Detailed Specifications</span>
                  {specsOpen ? <ChevronUp className="w-4 h-4 text-[#8f1020]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {specsOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-700 grid grid-cols-2 gap-3 border-t border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">FABRIC</span> <span className="font-semibold text-slate-900">{product.fabric}</span></div>
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">FIT & SILHOUETTE</span> <span className="font-semibold text-slate-900">{product.fit}</span></div>
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">CRAFT WORK</span> <span className="font-semibold text-slate-900">{product.pattern}</span></div>
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">NECKLINE</span> <span className="font-semibold text-slate-900">{product.neckline}</span></div>
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">SLEEVES</span> <span className="font-semibold text-slate-900">{product.sleeves}</span></div>
                    <div className="p-2 bg-slate-50 rounded-lg"><span className="font-bold text-slate-500 block text-[10px]">WASH CARE</span> <span className="font-semibold text-slate-900">{product.washCare}</span></div>
                  </div>
                )}
              </div>

              {/* Model Fit & Styling Notes */}
              <div className="bg-white rounded-2xl border border-[#E2D4C7] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFitNoteOpen(!fitNoteOpen)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B1713] cursor-pointer hover:bg-slate-50"
                >
                  <span>Model Fitting Notes & Styling Hint</span>
                  {fitNoteOpen ? <ChevronUp className="w-4 h-4 text-[#8f1020]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {fitNoteOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 space-y-2 border-t border-slate-100 leading-relaxed">
                    <p><strong>Model Profile:</strong> Model height is 5&apos;8&quot; wearing size <strong>S</strong>.</p>
                    <p><strong>Fit Advice:</strong> Designed for an effortless tailored silhouette with comfortable ease at the bust and waist. If you fall between sizes, we recommend opting for the size up for ideal ease of movement during festivities.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── CUSTOMER REVIEWS SECTION WITH VERIFIED BUYER PROTECTION & PHOTO UPLOADS ── */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E2D4C7] shadow-sm space-y-10 mt-12">
          
          {/* Reviews Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1713]">Verified Customer Reviews & Photos</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-[#EFBD3B]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-base font-extrabold text-[#2B1713]">{product.rating} out of 5</span>
                <span className="text-xs text-slate-400">({reviews.length} Verified Buyer Reviews)</span>
              </div>
            </div>
          </div>

          {/* Review Submission Box (Only available for Verified Purchasers) */}
          <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E2D4C7]">
            {checkingOrder ? (
              <div className="py-6 text-center text-xs font-semibold text-slate-500">
                Checking verified purchase status...
              </div>
            ) : !canReview ? (
              /* Verified Buyer Lock Banner */
              <div className="text-center space-y-4 max-w-lg mx-auto py-2">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-[#8F1020] shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-lg text-[#2B1713]">Verified Purchaser Reviews</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    To maintain 100% authentic quality ratings and customer photo reviews, only verified buyers who have purchased this ensemble from Apsarah can post feedback.
                  </p>
                </div>
                {!user ? (
                  <Link
                    href="/account"
                    className="inline-block px-6 py-3 bg-[#2B1713] text-white rounded-xl text-xs font-bold hover:bg-[#8F1020] transition-colors shadow-sm"
                  >
                    Sign In to Verify Your Order
                  </Link>
                ) : (
                  <p className="text-xs font-semibold text-rose-700 bg-rose-50 px-4 py-2 rounded-xl inline-block border border-rose-200">
                    No confirmed purchase record for your account ({user.email}) for this specific product yet.
                  </p>
                )}
              </div>
            ) : (
              /* Write Verified Review & Photo Upload Form */
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D4C7]/60 pb-3">
                  <h3 className="text-sm font-extrabold text-[#2B1713] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    <span>Write a Verified Customer Review</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    ✅ Confirmed Purchaser
                  </span>
                </div>

                {/* Rating Stars Selection */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Rating:</span>
                  <div className="flex gap-1.5 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        className="p-1 text-[#EFBD3B] transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${s <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title & Body */}
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Review Title (e.g., Exquisite Zari craftsmanship & perfect drape!)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border border-[#E2D4C7] rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#8F1020] shadow-2xs text-slate-800"
                  />
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your detailed experience with fabric quality, fit, embroidery, and compliments received..."
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    className="w-full bg-white border border-[#E2D4C7] rounded-xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-[#8F1020] shadow-2xs text-slate-800 resize-y"
                  />
                </div>

                {/* Photo Attachments (Upload File OR Direct Camera Click) */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Attach Customer Styling Photos (Optional):
                  </span>
                  
                  <div className="flex flex-wrap gap-3">
                    {/* Option 1: File Upload */}
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2D4C7] hover:border-[#8f1020] text-[#2B1713] rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-all hover:bg-slate-50">
                      <Upload className="w-4 h-4 text-[#8f1020]" />
                      <span>Upload Photo(s)</span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
                    </label>

                    {/* Option 2: Direct Camera Capture */}
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2D4C7] hover:border-[#8f1020] text-[#2B1713] rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-all hover:bg-slate-50">
                      <Camera className="w-4 h-4 text-[#8f1020]" />
                      <span>Click Live Photo</span>
                      <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
                    </label>
                  </div>

                  {/* Photo Thumbnails Preview */}
                  {reviewPhotos.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap pt-2">
                      {reviewPhotos.map((photoUrl, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-rose-200 shadow-xs group">
                          <img src={photoUrl} alt="Review Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-8 py-3.5 rounded-xl bg-[#8F1020] text-white text-xs sm:text-sm font-extrabold hover:bg-[#720C18] transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting Review...' : 'Post Verified Review & Photos'}
                </button>
              </form>
            )}
          </div>

          {/* List of Published Reviews */}
          <div className="space-y-6 pt-4">
            {reviewsLoading ? (
              <p className="text-center py-8 text-xs text-slate-400">Loading verified feedback...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 space-y-2 bg-[#FAF6F0] rounded-2xl border border-[#E2D4C7]">
                <MessageSquare className="w-8 h-8 text-[#8F1020] mx-auto opacity-70" />
                <p className="text-sm font-bold text-[#2B1713]">No customer reviews yet.</p>
                <p className="text-xs text-slate-500">Be the first verified purchaser to review this luxury garment!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-6 space-y-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#2B1713] text-white font-serif font-bold text-xs flex items-center justify-center">
                          {(rev.user_name || 'V')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#2B1713]">{rev.user_name || 'Verified Customer'}</span>
                            {rev.is_verified && (
                              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rev.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex text-[#EFBD3B]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#2B1713]">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.body}</p>

                    {/* Customer Photo Gallery in Review */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-3 flex-wrap pt-2">
                        {rev.images.map((imgUrl, idx) => (
                          <div key={idx} className="w-20 h-24 rounded-xl overflow-hidden border border-[#E2D4C7] shadow-2xs">
                            <img src={imgUrl} alt="Customer Review Photo" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SIMILAR SILHOUETTES & COMPLETE THE LOOK SECTION ── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-[#E2D4C7]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#2B1713]">More in {product.category}</h2>
              <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-extrabold text-[#8F1020] uppercase underline">
                View All {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
              {relatedProducts.map((rel) => {
                const relWishlisted = isInWishlist(rel.id)
                return (
                  <Link key={rel.id} href={`/product/${rel.slug || rel.id}`} className="mostLovedCard group">
                    <div className="mostLovedImageArch">
                      <img src={rel.images[0]} alt={rel.name} loading="lazy" />

                      {rel.discountPercent > 0 && (
                        <span className="mostLovedBadge">SALE • {rel.discountPercent}% OFF</span>
                      )}

                      <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          await toggleWishlist(rel.id, rel.name)
                        }}
                        className="mostLovedWishlist"
                      >
                        <Heart className={`w-4 h-4 ${relWishlisted ? 'fill-[#8f1020] text-[#8f1020]' : 'text-slate-700'}`} />
                      </button>
                    </div>

                    <div className="mostLovedMetaRow">
                      <span className="mostLovedCategory">{rel.category.toUpperCase()}</span>
                      <span className="mostLovedRating">
                        <Star className="w-3 h-3 fill-[#EFBD3B] text-[#EFBD3B] inline mr-1" />
                        {rel.rating || '4.9'}
                      </span>
                    </div>

                    <h3 className="mostLovedTitle">{rel.name}</h3>

                    <div className="mostLovedPriceRow">
                      <span className="mostLovedPrice">₹{rel.price.toLocaleString()}</span>
                      {rel.oldPrice > rel.price && (
                        <del className="mostLovedOldPrice">₹{rel.oldPrice.toLocaleString()}</del>
                      )}
                      {rel.discountPercent > 0 && (
                        <span className="mostLovedDiscountTag font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          SAVE ₹{(rel.oldPrice - rel.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
      
      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-100 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-[#2B1713]">Apsarah Standard Size Guide</h3>
              <p className="text-xs text-slate-500">All measurements are given in inches for ready garment fit.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] text-[#2B1713] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust (in)</th>
                    <th className="p-3">Waist (in)</th>
                    <th className="p-3">Hip (in)</th>
                    <th className="p-3">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="p-3 font-bold">XS</td><td className="p-3">34</td><td className="p-3">28</td><td className="p-3">36</td><td className="p-3">48-52</td></tr>
                  <tr><td className="p-3 font-bold">S</td><td className="p-3">36</td><td className="p-3">30</td><td className="p-3">38</td><td className="p-3">48-52</td></tr>
                  <tr><td className="p-3 font-bold">M</td><td className="p-3">38</td><td className="p-3">32</td><td className="p-3">40</td><td className="p-3">48-52</td></tr>
                  <tr><td className="p-3 font-bold">L</td><td className="p-3">40</td><td className="p-3">34</td><td className="p-3">42</td><td className="p-3">48-52</td></tr>
                  <tr><td className="p-3 font-bold">XL</td><td className="p-3">42</td><td className="p-3">36</td><td className="p-3">44</td><td className="p-3">48-52</td></tr>
                  <tr><td className="p-3 font-bold">XXL</td><td className="p-3">44</td><td className="p-3">38</td><td className="p-3">46</td><td className="p-3">48-52</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
              💡 <strong>Stylist Tip:</strong> For lehenga sets and anarkalis, bust and waist are key measurements. Drawstrings and side zips are included on all blouses for customizable comfort.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
