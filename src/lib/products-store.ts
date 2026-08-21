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
const CACHE_KEY = 'apsarah_products_cache_v2'

function readCache(): Product[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {}
  return null
}

function writeCache(products: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products))
  } catch {}
}

// ─── Fallback seed data (shown before Supabase responds) ─────────────────────
export const initialProducts: Product[] = [
  {
    id: 'prod-bl054942',
    name: 'Royal Navy Zari Embroidered Lehenga Set',
    slug: 'royal-navy-zari-embroidered-lehenga-set',
    category: 'Lehengas',
    subCategory: 'Festive Crop Top Lehengas',
    price: 7499, oldPrice: 14999, discountPercent: 50,
    rating: 4.9, reviewCount: 84,
    images: [
      '/assets/navy-blue-embroidered-zari-lehenga-set-2.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-1.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-3.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 3 }, { size: 'XXL', stock: 2 }],
    colors: [{ name: 'Navy Blue', hex: '#1C2833', images: ['/assets/navy-blue-embroidered-zari-lehenga-set-2.webp', '/assets/navy-blue-embroidered-zari-lehenga-set-1.webp', '/assets/navy-blue-embroidered-zari-lehenga-set-3.webp', '/assets/navy-blue-embroidered-zari-lehenga-set-4.webp'] }],
    fabric: 'Pure Chanderi Silk & Georgette', fit: 'Voluminous Flared Fit', pattern: 'Intricate Zari & Sequin Embroidery',
    neckline: 'Sweetheart V-Neck', sleeves: 'Sleeveless', occasion: 'Sangeet, Wedding & Festive Reception', washCare: 'Dry Clean Only',
    description: 'Command regal elegance with this breathtaking Navy Blue embroidered lehenga set, adorned with glittering zari motifs and detailed artisan lacework.',
    highlights: ['Pure Silk & lightweight Georgette blend', 'Heavy handcrafted zari and sequin blouse', 'Includes voluminous skirt, tailored blouse & embroidered sheer dupatta'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl773615',
    name: 'Sindoor Red Embroidered Silk Kurta Set',
    slug: 'sindoor-red-embroidered-silk-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 3599, oldPrice: 5999, discountPercent: 40,
    rating: 4.8, reviewCount: 62,
    images: [
      '/assets/red-embroidered-silk-kurta-set-2.webp',
      '/assets/red-embroidered-silk-kurta-set-3.webp',
      '/assets/red-embroidered-silk-kurta-set-1.webp',
      '/assets/red-embroidered-silk-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Sindoor Red', hex: '#A93226', images: ['/assets/red-embroidered-silk-kurta-set-2.webp', '/assets/red-embroidered-silk-kurta-set-3.webp', '/assets/red-embroidered-silk-kurta-set-1.webp', '/assets/red-embroidered-silk-kurta-set-4.webp'] }],
    fabric: 'Chanderi Silk & Cotton Mulmul', fit: 'Straight Tailored Fit', pattern: 'Hand-Embroidered Zari Floral Yoke',
    neckline: 'Round Neck with Keyhole Details', sleeves: 'Three-Quarter Sleeves', occasion: 'Puja, Festivals & Family Gatherings', washCare: 'Dry Clean Recommended',
    description: 'Radiate timeless festive grandeur in this Sindoor Red Chanderi silk kurta set, featuring intricate resham and gold embroidery on the neckline.',
    highlights: ['Rich texture Chanderi silk with breathable lining', 'Intricate floral resham and sequin yoke work', 'Paired with matching solid trousers and gold-bordered silk dupatta'],
    isBestseller: true,
  },
  {
    id: 'prod-bl248546',
    name: 'Imperial Wine Silk Kurta & Zari Dupatta Set',
    slug: 'imperial-wine-silk-kurta-zari-dupatta-set',
    category: 'Suit Sets',
    subCategory: 'Silk Suit Sets',
    price: 3899, oldPrice: 6499, discountPercent: 40,
    rating: 4.9, reviewCount: 96,
    images: [
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-2.webp',
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-1.webp',
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-3.webp'
    ],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 4 }, { size: 'XXL', stock: 2 }],
    colors: [{ name: 'Imperial Wine', hex: '#5B2C6F', images: ['/assets/wine-purple-silk-kurta-set-pink-dupatta-2.webp', '/assets/wine-purple-silk-kurta-set-pink-dupatta-1.webp', '/assets/wine-purple-silk-kurta-set-pink-dupatta-3.webp'] }],
    fabric: 'Raw Silk with Banarasi Zari Dupatta', fit: 'Relaxed Straight Fit', pattern: 'Gotta Patti & Mirror Embroidery',
    neckline: 'Sweetheart Notch Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Evening Soirees & Festive Celebrations', washCare: 'Dry Clean Only',
    description: 'A match made in heaven—deep imperial wine raw silk paired with a stunning pastel pink handloom zari woven dupatta.',
    highlights: ['Premium luminous silk body with handcrafted mirror yoke', 'Contrasting pastel blush pink Banarasi dupatta', 'Matching wine pants with comfortable elasticity'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl550109',
    name: 'Gul-e-Plum Floral Printed Pashmina Set',
    slug: 'gul-e-plum-floral-printed-pashmina-set',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2899, oldPrice: 4832, discountPercent: 40,
    rating: 4.7, reviewCount: 45,
    images: [
      '/assets/plum-wine-floral-printed-kurta-set-2.webp',
      '/assets/plum-wine-floral-printed-kurta-set-1.webp',
      '/assets/plum-wine-floral-printed-kurta-set-3.webp',
      '/assets/plum-wine-floral-printed-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 9 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 2 }],
    colors: [{ name: 'Plum Wine', hex: '#4A235A', images: ['/assets/plum-wine-floral-printed-kurta-set-2.webp', '/assets/plum-wine-floral-printed-kurta-set-1.webp', '/assets/plum-wine-floral-printed-kurta-set-3.webp', '/assets/plum-wine-floral-printed-kurta-set-4.webp'] }],
    fabric: 'Premium Pashmina Silk Blend', fit: 'Straight Fit with Tapered Trousers', pattern: 'Royal Persian Floral Screen Print',
    neckline: 'Round Neck', sleeves: 'Full Length Sleeves', occasion: 'Casual Luxury & Day Gatherings', washCare: 'Hand Wash separately in Cold Water',
    description: 'Featuring sophisticated Persian garden florals printed over super-soft silk fabric, offering everyday opulence with matched trousers.',
    highlights: ['Ultra-soft Pashmina feel fabric', 'Digitally printed heritage Persian florals', 'Comes with complimentary matching soft dupatta & trousers'],
  },
  {
    id: 'prod-bl528117',
    name: 'Rosé Blush Embroidered Silk Suit Set',
    slug: 'rose-blush-embroidered-silk-suit-set',
    category: 'Suit Sets',
    subCategory: 'Silk Suit Sets',
    price: 3999, oldPrice: 6665, discountPercent: 40,
    rating: 4.9, reviewCount: 118,
    images: [
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-2.webp',
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-1.webp',
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-3.webp'
    ],
    sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }],
    colors: [{ name: 'Rose Pink', hex: '#D98880', images: ['/assets/pastel-pink-silk-kurta-set-zari-dupatta-2.webp', '/assets/pastel-pink-silk-kurta-set-zari-dupatta-1.webp', '/assets/pastel-pink-silk-kurta-set-zari-dupatta-3.webp'] }],
    fabric: 'Tussar Silk Blend & Brocade Dupatta', fit: 'A-Line Relaxed Fit', pattern: 'Intricate Pearl & Zari Yoke Work',
    neckline: 'Sweetheart Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Engagement & Day Weddings', washCare: 'Dry Clean Only',
    description: 'Immaculately crafted in rosé blush Tussar silk with opulent handcrafted pearl and zari beadings along the neckline.',
    highlights: ['Real pearl beadings and French knot floral embroidery', 'Accompanied by contrasting wine trousers for striking aesthetic', 'Sheer silk brocade border dupatta'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl779021',
    name: 'Midnight Noir Floral Embroidered Kurta Set',
    slug: 'midnight-noir-floral-embroidered-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2699, oldPrice: 4498, discountPercent: 40,
    rating: 4.8, reviewCount: 73,
    images: [
      '/assets/black-floral-embroidered-kurta-set-2.webp',
      '/assets/black-floral-embroidered-kurta-set-1.webp',
      '/assets/black-floral-embroidered-kurta-set-3.webp',
      '/assets/black-floral-embroidered-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 18 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 8 }],
    colors: [{ name: 'Midnight Black', hex: '#17202A', images: ['/assets/black-floral-embroidered-kurta-set-2.webp', '/assets/black-floral-embroidered-kurta-set-1.webp', '/assets/black-floral-embroidered-kurta-set-3.webp', '/assets/black-floral-embroidered-kurta-set-4.webp'] }],
    fabric: '100% Premium Cotton Mulmul', fit: 'Straight Comfort Fit', pattern: 'Contrast Ivory Resham Floral Embroidery',
    neckline: 'V-Neck with Scalloped Flower Trim', sleeves: 'Three-Quarter Sleeves', occasion: 'Office Luxury & Casual Evenings', washCare: 'Gentle Machine Wash in Cold Water',
    description: 'An evergreen statement piece in jet black premium cotton, highlighted with boldly stitched ivory resham roses and floral bootis.',
    highlights: ['100% Breathable cotton mulmul suitable for all-day comfort', 'Intricate contrast white rose machine embroidery', 'Complete set with tailored pants and soft mul dupatta'],
    isBestseller: true,
  },
  {
    id: 'prod-bl881874',
    name: 'Sifa Olive Green Pleated Anarkali Set',
    slug: 'sifa-olive-green-pleated-anarkali-set',
    category: 'Suit Sets',
    subCategory: 'Anarkali Sets',
    price: 4299, oldPrice: 7165, discountPercent: 40,
    rating: 5.0, reviewCount: 142,
    images: [
      '/assets/olive-green-pleated-anarkali-kurta-set-2.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-1.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-3.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 9 }, { size: 'M', stock: 14 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 5 }, { size: 'XXL', stock: 3 }],
    colors: [{ name: 'Olive Green', hex: '#556B2F', images: ['/assets/olive-green-pleated-anarkali-kurta-set-2.webp', '/assets/olive-green-pleated-anarkali-kurta-set-1.webp', '/assets/olive-green-pleated-anarkali-kurta-set-3.webp', '/assets/olive-green-pleated-anarkali-kurta-set-4.webp'] }],
    fabric: 'Chanderi Cotton with Organza Dupatta', fit: 'Flared Pleated Anarkali Fit', pattern: 'Delicate Resham Pink Blossom Embroidery',
    neckline: 'Mandarin Collar with Notch', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Celebrations & Mehndi Ceremonies', washCare: 'Dry Clean Recommended',
    description: 'Step out in poetic grace with this luscious olive green pleated Anarkali, accentuated with soft pink lotus resham embroidery along the flair and dupatta.',
    highlights: ['Finely structured pleats for flattering twirling silhouettes', 'Delicate pastel pink bloom motifs embroidered along skirt', 'Includes matching green pants and lightweight floral dupatta'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl214784',
    name: 'Saffron Sunset Embroidered Anarkali Dress Set',
    slug: 'saffron-sunset-embroidered-anarkali-dress-set',
    category: 'Dresses',
    subCategory: 'Anarkali Dresses',
    price: 3799, oldPrice: 6332, discountPercent: 40,
    rating: 4.7, reviewCount: 51,
    images: [
      '/assets/rust-orange-floral-embroidered-anarkali-set-2.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-1.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-3.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 8 }, { size: 'L', stock: 5 }, { size: 'XL', stock: 2 }],
    colors: [{ name: 'Rust Orange', hex: '#D35400', images: ['/assets/rust-orange-floral-embroidered-anarkali-set-2.webp', '/assets/rust-orange-floral-embroidered-anarkali-set-1.webp', '/assets/rust-orange-floral-embroidered-anarkali-set-3.webp', '/assets/rust-orange-floral-embroidered-anarkali-set-4.webp'] }],
    fabric: 'Handloom Cotton Silk', fit: 'Voluminous Gathered Anarkali Dress', pattern: 'Multi-Color Resham & Sequin Floral Embroidery',
    neckline: 'Keyhole V-Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi Ceremonies, Day Festivals & Brunches', washCare: 'Dry Clean Only',
    description: 'Capturing the golden warmth of sunset, this voluminous rust orange Anarkali fusion dress features rich botanical resham bouquets.',
    highlights: ['Can be styled as a solo statement maxi dress or traditional suit', 'Artisanal pink and brown botanical floral embroidery on chest and hem', 'Includes matching trousers and cotton silk drape'],
    isNewArrival: true,
  },
  {
    id: 'prod-bl771470',
    name: 'Firoza Sea Green Floral Zari Lehenga Set',
    slug: 'firoza-sea-green-floral-zari-lehenga-set',
    category: 'Lehengas',
    subCategory: 'Festive Crop Top Lehengas',
    price: 8999, oldPrice: 17999, discountPercent: 50,
    rating: 4.9, reviewCount: 105,
    images: [
      '/assets/pastel-sea-green-embroidered-lehenga-set-2.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-1.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-3.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 10 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 3 }],
    colors: [{ name: 'Sea Green', hex: '#76D7C4', images: ['/assets/pastel-sea-green-embroidered-lehenga-set-2.webp', '/assets/pastel-sea-green-embroidered-lehenga-set-1.webp', '/assets/pastel-sea-green-embroidered-lehenga-set-3.webp', '/assets/pastel-sea-green-embroidered-lehenga-set-4.webp'] }],
    fabric: 'Georgette & Chanderi Silk', fit: 'Full Flared Lehenga with Crop Top', pattern: 'Floral Pastel Embroidery with Pearl Fringe',
    neckline: 'V-Neck with Pearl Drops', sleeves: 'Sleeveless', occasion: 'Bridesmaid, Reception & Sangeet', washCare: 'Dry Clean Only',
    description: 'Exude ethereal fairytale magic with this soothing sea green lehenga set, featuring pearl bead fringes and vibrant pastel garden embroidery.',
    highlights: ['Hand-stitched faux pearl droplet hem along crop top blouse', 'Multi-hued peach, pink and gold floral garden embroidered along skirt hem', 'Lightweight pleated texture for effortless dancing and movement'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl387204',
    name: 'Maharani Pink Embroidered Jacket & Lehenga Set',
    slug: 'maharani-pink-embroidered-jacket-lehenga-set',
    category: 'Lehengas',
    subCategory: 'Jacket Lehengas',
    price: 9599, oldPrice: 19198, discountPercent: 50,
    rating: 4.9, reviewCount: 88,
    images: [
      '/assets/rani-pink-embroidered-jacket-lehenga-set-2.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-1.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-3.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 2 }],
    colors: [{ name: 'Rani Pink', hex: '#C2185B', images: ['/assets/rani-pink-embroidered-jacket-lehenga-set-2.webp', '/assets/rani-pink-embroidered-jacket-lehenga-set-1.webp', '/assets/rani-pink-embroidered-jacket-lehenga-set-3.webp', '/assets/rani-pink-embroidered-jacket-lehenga-set-4.webp'] }],
    fabric: 'Pure Raw Silk & Pleated Georgette', fit: 'Structured Jacket over Flared Skirt', pattern: 'Heavy Silver Zari & Sequin Royal Armor Embroidery',
    neckline: 'V-Neck Jacket Front', sleeves: 'Three-Quarter Sleeves', occasion: 'Wedding Gala & Royal Receptions', washCare: 'Dry Clean Only',
    description: 'A sovereign royal silhouette combining a heavily embellished silver zari jacket with a flowing pleated Rani Pink lehenga skirt.',
    highlights: ['Architectural Rajasthani jali and floral silver sequin embroidery on jacket', 'Versatile layering piece—jacket can be worn independently', 'Matching heavy embroidered hem skirt with matching dupatta'],
    isBestseller: true,
  },
  {
    id: 'prod-bl936281',
    name: 'Shaam-e-Oudh Black Silk Floral Kurta Set',
    slug: 'shaam-e-oudh-black-silk-floral-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Silk Suit Sets',
    price: 3699, oldPrice: 6165, discountPercent: 40,
    rating: 4.8, reviewCount: 67,
    images: [
      '/assets/black-silk-floral-embroidered-kurta-set-2.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-1.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-3.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 11 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Noir Black', hex: '#0E1111', images: ['/assets/black-silk-floral-embroidered-kurta-set-2.webp', '/assets/black-silk-floral-embroidered-kurta-set-1.webp', '/assets/black-silk-floral-embroidered-kurta-set-3.webp', '/assets/black-silk-floral-embroidered-kurta-set-4.webp'] }],
    fabric: 'Raw Chanderi Silk Blend', fit: 'Straight Fit', pattern: 'Vibrant Pink & Lilac Resham Embroidery',
    neckline: 'V-Neck Notch', sleeves: 'Three-Quarter Sleeves', occasion: 'Evening Dinner & Cocktails', washCare: 'Dry Clean Only',
    description: 'Like flowering nocturnal blossoms against a velvet night sky, this black silk suit shines with vibrant pink and lavender resham embroidery.',
    highlights: ['Lustrous black silk fabric with natural sheen', 'Multi-color resham thread floral climbing vines', 'Includes matching solid black silk trousers & embroidered chiffon dupatta'],
    isNewArrival: true,
  },
  {
    id: 'prod-bl130854',
    name: 'Mayur Teal Zari Border Anarkali Set',
    slug: 'mayur-teal-zari-border-anarkali-set',
    category: 'Suit Sets',
    subCategory: 'Anarkali Sets',
    price: 4199, oldPrice: 6998, discountPercent: 40,
    rating: 4.9, reviewCount: 132,
    images: [
      '/assets/teal-blue-zari-border-anarkali-kurta-set-2.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-1.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-3.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 14 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 6 }],
    colors: [{ name: 'Teal Peacock', hex: '#008080', images: ['/assets/teal-blue-zari-border-anarkali-kurta-set-2.webp', '/assets/teal-blue-zari-border-anarkali-kurta-set-1.webp', '/assets/teal-blue-zari-border-anarkali-kurta-set-3.webp', '/assets/teal-blue-zari-border-anarkali-kurta-set-4.webp'] }],
    fabric: 'Pure Cotton Silk Blend', fit: 'Flared Anarkali', pattern: 'Zari Patchwork & Mirror Embroidery',
    neckline: 'Round Neck with Patch Border', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Puja & Weddings', washCare: 'Dry Clean Only',
    description: 'Inspired by the regal plumage of the royal peacock, this teal blue Anarkali features stunning red and gold zari traditional borders.',
    highlights: ['Rich teal peacock hue paired with bold maroon silk dupatta', 'Intricate zari and mirror patchwork along neckline and skirt hem', 'Includes matching teal trousers'],
    isBestseller: true,
  },
  {
    id: 'prod-bl942874',
    name: 'Patti Ivory & Copper Handpainted Co-ord Set',
    slug: 'patti-ivory-copper-handpainted-coord-set',
    category: 'Co-ord Sets',
    subCategory: 'Indo-Western Tunic Sets',
    price: 3299, oldPrice: 5498, discountPercent: 40,
    rating: 4.8, reviewCount: 79,
    images: [
      '/assets/off-white-copper-leaf-handpainted-coord-set-2.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-1.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-3.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Ivory & Copper', hex: '#F8F9F9', images: ['/assets/off-white-copper-leaf-handpainted-coord-set-2.webp', '/assets/off-white-copper-leaf-handpainted-coord-set-1.webp', '/assets/off-white-copper-leaf-handpainted-coord-set-3.webp', '/assets/off-white-copper-leaf-handpainted-coord-set-4.webp'] }],
    fabric: 'Pure Linen Silk Blend', fit: 'Modern Tailored Tunic & Pants', pattern: 'Artisanal Copper Brown & Green Botanical Leaf Print',
    neckline: 'Shirt Collar V-Neck', sleeves: 'Full Length Sleeves', occasion: 'Resort Wear, Art Galleries & High Tea', washCare: 'Dry Clean / Gentle Hand Wash',
    description: 'Effortless luxury meets resort sophistication in this ivory linen co-ord set, featuring striking oversized copper-leaf painted motifs running down the tunic and trousers.',
    highlights: ['Modern high-fashion architectural leaf placement printing', 'Breathable natural linen-silk blend with structured finish', 'Includes collared tunic shirt and perfectly tailored matching motif trousers'],
    isNewArrival: true,
  },
  {
    id: 'prod-bl810670',
    name: 'Kashmiri Beige & Navy Paisley Printed Suit',
    slug: 'kashmiri-beige-navy-paisley-printed-suit',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2499, oldPrice: 4165, discountPercent: 40,
    rating: 4.6, reviewCount: 38,
    images: ['/assets/beige-navy-paisley-printed-suit-set-1.webp'],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 3 }],
    colors: [{ name: 'Beige & Navy', hex: '#E5E7E9', images: ['/assets/beige-navy-paisley-printed-suit-set-1.webp'] }],
    fabric: 'Winter Pashmina Cotton', fit: 'Straight Relaxed Fit', pattern: 'Traditional Kashmiri Paisley Border Print',
    neckline: 'Round Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Daily Office & Casual Lunches', washCare: 'Machine Washable in Gentle Cycle',
    description: 'Classic Kashmiri inspired paisley printed borders elevate this comfortable everyday beige and navy blue cotton suit set.',
    highlights: ['Soft skin-friendly daily wear cotton pashmina feel', 'Intricate navy blue paisley patterned border along hem and cuffs', 'Paired with dark solid navy blue trousers'],
  },
  {
    id: 'prod-bl507286',
    name: 'Pista Green Silk Mirror & Floral Kurta Set',
    slug: 'pista-green-silk-mirror-floral-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Silk Suit Sets',
    price: 4499, oldPrice: 7498, discountPercent: 40,
    rating: 4.9, reviewCount: 91,
    images: [
      '/assets/pistachio-gold-silk-floral-embroidered-set-1.webp',
      '/assets/pistachio-gold-silk-floral-embroidered-set-2.webp',
      '/assets/pistachio-gold-silk-floral-embroidered-set-3.webp'
    ],
    sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 12 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 4 }],
    colors: [{ name: 'Pistachio Gold', hex: '#A9DFBF', images: ['/assets/pistachio-gold-silk-floral-embroidered-set-1.webp', '/assets/pistachio-gold-silk-floral-embroidered-set-2.webp', '/assets/pistachio-gold-silk-floral-embroidered-set-3.webp'] }],
    fabric: 'Raw Tussar Silk with Tissue Dupatta', fit: 'Straight Fit', pattern: 'Geometric Mirror Chokor Yoke & Large Lotus Embroidery',
    neckline: 'Round Neck with Mirror Triangles', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Celebrations & Mehndi', washCare: 'Dry Clean Only',
    description: 'A luminous pistachio gold silk suit featuring authentic geometrical triangular mirror-work along the neckline and oversized embroidered garden water lilies.',
    highlights: ['Authentic geometrical glass mirror embroidery around neck', 'Large romantic pastel lotus resham embroidery across skirt', 'Includes matching pista green silk trousers and sheer gossamer tissue dupatta'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl765571',
    name: 'Haldi Mustard Aztec Printed Kurta Set',
    slug: 'haldi-mustard-aztec-printed-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2599, oldPrice: 4332, discountPercent: 40,
    rating: 4.8, reviewCount: 54,
    images: [
      '/assets/mustard-yellow-geometric-printed-kurta-set-2.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-1.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-4.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-3.webp'
    ],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 16 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Mustard Yellow', hex: '#D4AC0D', images: ['/assets/mustard-yellow-geometric-printed-kurta-set-2.webp', '/assets/mustard-yellow-geometric-printed-kurta-set-1.webp', '/assets/mustard-yellow-geometric-printed-kurta-set-4.webp', '/assets/mustard-yellow-geometric-printed-kurta-set-3.webp'] }],
    fabric: '100% Pure Cambric Cotton', fit: 'Straight Tailored Fit', pattern: 'Aztec Chevron Print with Central Mirror Diamond',
    neckline: 'Round Neck with Mirror Motif', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi Function, Day Outings & Workwear', washCare: 'Hand Wash separately in Cold Water',
    description: 'Bring bright sunshine vibes to your wardrobe with this mustard yellow cotton set, accented with geometric Aztec prints and a handcrafted central mirror diamond.',
    highlights: ['100% Pure breathable summer cotton', 'Hand-stitched central mirror and red bead medallion work', 'Includes matching mustard printed trousers and dupatta'],
  },
  {
    id: 'prod-bl325039',
    name: 'Panna Emerald Green Birdcage Embroidered Kurta',
    slug: 'panna-emerald-green-birdcage-embroidered-kurta',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2399, oldPrice: 3998, discountPercent: 40,
    rating: 4.7, reviewCount: 42,
    images: [
      '/assets/emerald-green-silk-birdcage-embroidered-set-1.webp',
      '/assets/emerald-green-silk-birdcage-embroidered-set-2.webp'
    ],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 4 }],
    colors: [{ name: 'Emerald Green', hex: '#117A65', images: ['/assets/emerald-green-silk-birdcage-embroidered-set-1.webp', '/assets/emerald-green-silk-birdcage-embroidered-set-2.webp'] }],
    fabric: 'Chanderi Cotton Silk', fit: 'Straight Relaxed Fit', pattern: 'Unique Heritage Birdcage & Garden Motif Embroidery',
    neckline: 'V-Neck with Sequin Lace', sleeves: 'Three-Quarter Sleeves', occasion: 'Casual Chic & Festive Dinners', washCare: 'Gentle Machine Wash',
    description: 'An exquisite jewel-toned emerald green kurta set highlighted with charming architectural birdcage and flower embroidery motifs.',
    highlights: ['Unique designer statement birdcage resham embroidery', 'Delicate sequin studded lace trim along neckline and placket', 'Comes paired with matching emerald green silk trousers'],
    isNewArrival: true,
  },
  {
    id: 'prod-bl566787',
    name: 'Royal Wine Velvet Crop Top & Flared Palazzo Set',
    slug: 'royal-wine-velvet-crop-top-flared-palazzo-set',
    category: 'Co-ord Sets',
    subCategory: 'Velvet Co-ords',
    price: 4899, oldPrice: 8165, discountPercent: 40,
    rating: 4.9, reviewCount: 115,
    images: [
      '/assets/wine-purple-velvet-crop-top-palazzo-set-1.webp',
      '/assets/wine-purple-velvet-crop-top-palazzo-set-2.webp',
      '/assets/wine-purple-velvet-crop-top-palazzo-set-3.webp'
    ],
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 3 }],
    colors: [{ name: 'Deep Wine', hex: '#4A235A', images: ['/assets/wine-purple-velvet-crop-top-palazzo-set-1.webp', '/assets/wine-purple-velvet-crop-top-palazzo-set-2.webp', '/assets/wine-purple-velvet-crop-top-palazzo-set-3.webp'] }],
    fabric: 'Micro-Velvet & Flared Georgette Chiffon', fit: 'Structured Jacket over Flared Palazzos', pattern: 'Heavy Gold Zari & Pearl Droplet Edge Work',
    neckline: 'Open Jacket over Bustier', sleeves: 'Sleeveless / Cape effect', occasion: 'Cocktail Parties, Sangeet & Reception', washCare: 'Dry Clean Only',
    description: 'Ultra-luxurious evening ensemble featuring an intricately zari-embroidered velvet jacket crop top cascading over liquid-flow georgette palazzos.',
    highlights: ['Rich regal velvet jacket top with pearl droplet fringe along hem', 'Ultra-wide flared chiffon georgette palazzos with effortless drape', 'High-fashion modern fusion cut ideal for celebrations'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl257927',
    name: 'Gul-e-Peach Strappy Embroidered Sharara Set',
    slug: 'gul-e-peach-strappy-embroidered-sharara-set',
    category: 'Suit Sets',
    subCategory: 'Sharara & Gharara Sets',
    price: 4599, oldPrice: 7665, discountPercent: 40,
    rating: 5.0, reviewCount: 168,
    images: [
      '/assets/peach-floral-embroidered-strappy-sharara-set-2.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-1.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-3.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-4.webp'
    ],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 16 }, { size: 'L', stock: 9 }, { size: 'XL', stock: 5 }],
    colors: [{ name: 'Pastel Peach', hex: '#F5B7B1', images: ['/assets/peach-floral-embroidered-strappy-sharara-set-2.webp', '/assets/peach-floral-embroidered-strappy-sharara-set-1.webp', '/assets/peach-floral-embroidered-strappy-sharara-set-3.webp', '/assets/peach-floral-embroidered-strappy-sharara-set-4.webp'] }],
    fabric: 'Georgette Silk Blend with Satin Lining', fit: 'Fitted Strap Tunic with Flared Sharara Skirt', pattern: 'Heavy Multi-Color Botanical Flower & Sequin Embroidery',
    neckline: 'Square Strappy Neckline', sleeves: 'Sleeveless Strappy', occasion: 'Haldi, Mehndi, Poolside Weddings & Parties', washCare: 'Dry Clean Recommended',
    description: 'The ultimate bridesmaid & celebration centerpiece! A breathtaking pastel peach strappy tunic drenched in multi-color flower field embroidery, paired with flowing sharara pants.',
    highlights: ['Youthful square neckline with gold sequin strap detailing', 'Vibrant botanical floral garden embroidery over whole tunic', 'Includes high-waisted flowing sharara bottoms and chiffon dupatta'],
    isBestseller: true, isNewArrival: true,
  },
  {
    id: 'prod-bl38536',
    name: 'Chandan White & Pink Paisley Embroidered Kurta',
    slug: 'chandan-white-pink-paisley-embroidered-kurta',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2199, oldPrice: 3665, discountPercent: 40,
    rating: 4.8, reviewCount: 29,
    images: ['/assets/off-white-pink-paisley-embroidered-kurta-set-1.webp'],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 9 }, { size: 'L', stock: 7 }, { size: 'XL', stock: 3 }],
    colors: [{ name: 'Chandan Ivory', hex: '#FDFEFE', images: ['/assets/off-white-pink-paisley-embroidered-kurta-set-1.webp'] }],
    fabric: 'Pure Chanderi Cotton Silk', fit: 'Straight Comfort Fit', pattern: 'Oversized Pastel Pink Paisley Hem Embroidery',
    neckline: 'Round Neck with Embroidery', sleeves: 'Three-Quarter Sleeves', occasion: 'Day Outings & Temple Visits', washCare: 'Hand Wash separately in Cold Water',
    description: 'Pristine sandalwood ivory cotton silk tunic showcasing majestic pastel pink hand-embroidered paisley motifs across the hemline.',
    highlights: ['Lustrous ivory cotton silk fabric with smooth drape', 'Statement artisanal oversized pink paisley embroidery along skirt hem', 'Includes comfortable matching white straight trousers'],
  },
  {
    id: 'prod-bl880816',
    name: 'Basanti Sunflower Printed Cotton Kurta Set',
    slug: 'basanti-sunflower-printed-cotton-kurta-set',
    category: 'Suit Sets',
    subCategory: 'Straight Suit Sets',
    price: 2799, oldPrice: 4665, discountPercent: 40,
    rating: 4.9, reviewCount: 83,
    images: [
      '/assets/olive-green-sunflower-printed-kurta-set-2.webp',
      '/assets/olive-green-sunflower-printed-kurta-set-1.webp',
      '/assets/olive-green-sunflower-printed-kurta-set-3.webp'
    ],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 14 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }],
    colors: [{ name: 'Olive & Sunflower', hex: '#7D6608', images: ['/assets/olive-green-sunflower-printed-kurta-set-2.webp', '/assets/olive-green-sunflower-printed-kurta-set-1.webp', '/assets/olive-green-sunflower-printed-kurta-set-3.webp'] }],
    fabric: '100% Pure Cotton', fit: 'Straight Relaxed Fit', pattern: 'Large Blooming Sunflower Print with Silver Zari Yoke',
    neckline: 'Round Neck with Zari Frame', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi, Summer Lunches & Casual Festive', washCare: 'Gentle Machine Wash',
    description: 'Infuse boundless joy into your look with this vibrant olive green cotton suit, bursting with large sunflower watercolor blooms and a silver zari embroidered chest frame.',
    highlights: ['100% Ultra-soft summer cambric cotton', 'Silver zari and thread embroidered traditional framing around yoke', 'Paired with complimentary olive green trousers'],
    isBestseller: true,
  },
  {
    id: 'prod-bl942874-bottoms',
    name: 'Patti Copper-Leaf Architectural Palazzos & Trousers',
    slug: 'patti-copper-leaf-architectural-palazzos',
    category: 'Bottoms',
    subCategory: 'Pants & Trousers',
    price: 1499, oldPrice: 2499, discountPercent: 40,
    rating: 4.9, reviewCount: 34,
    images: [
      '/assets/off-white-copper-leaf-handpainted-coord-set-4.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-2.webp'
    ],
    sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 8 }],
    colors: [{ name: 'Ivory & Copper', hex: '#F8F9F9', images: ['/assets/off-white-copper-leaf-handpainted-coord-set-4.webp', '/assets/off-white-copper-leaf-handpainted-coord-set-2.webp'] }],
    fabric: 'Pure Linen Silk Blend', fit: 'Tailored Straight Fit Trousers', pattern: 'Handpainted Copper Brown Leaf Side Seam Motif',
    neckline: 'High Waist Elasticated', sleeves: 'Ankle Length', occasion: 'Resort Wear & Fusion Styling', washCare: 'Hand Wash separately in Cold Water',
    description: 'Elevate any solid tunic or short kurti with these designer architectural trousers, featuring artisanal oversized copper-leaf motifs along the outer legs.',
    highlights: ['Elasticated back waistband with clean flat-front tailoring', 'Hand-painted style copper and moss green climbing leaf motifs', 'Made from structured breathable linen silk blend'],
    isNewArrival: true,
  },
]

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

  const cached = readCache() ?? initialProducts
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

  const cached = readCache() ?? initialProducts
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

  const cached = readCache() ?? initialProducts
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
    // Fallback to cache / seed
    const cached = readCache() ?? initialProducts
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
    const cached = readCache() ?? initialProducts
    writeCache([product, ...cached.filter((p) => p.id !== product.id)])
    return product
  }

  const createdProduct = rowToProduct(resData.product)

  // Update local cache with saved product from server
  const cached = readCache() ?? initialProducts
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
    const cached = readCache() ?? initialProducts
    writeCache(cached.map((p) => (p.id === id ? updated : p)))
    return updated
  }

  const updatedProduct = rowToProduct(resData.product)
  const cached = readCache() ?? initialProducts
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

  const cached = readCache() ?? initialProducts
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
  return readCache() ?? initialProducts
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductsStore().find((p) => p.slug === slug || p.id === slug)
}
