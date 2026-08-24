export interface SubCategory {
  id: string
  name: string
  slug: string
}

export interface PrimaryCategory {
  id: string
  name: string
  slug: string
  image: string
  isComingSoon?: boolean
  subtitle?: string
  description?: string
  subcategories: string[]
}

export const MASTER_CATEGORIES: PrimaryCategory[] = [
  {
    id: 'cat-suit-sets',
    name: 'Suit Sets',
    slug: 'suit-sets',
    image: '/assets/red-embroidered-silk-kurta-set-2.webp',
    subtitle: 'ROYALTY & HERITAGE',
    description: 'Intricately embroidered Anarkalis, Shararas, and Straight Suit Sets handcrafted for celebrations.',
    subcategories: [
      'Anarkali Sets',
      'Straight Suit Sets',
      'Sharara & Gharara Sets',
      'Angrakha Sets',
      'Velvet Sets',
      'Silk Suit Sets',
      'Palazzo Sets',
    ],
  },
  {
    id: 'cat-kurtas-tops',
    name: 'Kurtas & Tops',
    slug: 'kurtas-tops',
    image: '/assets/mustard-yellow-geometric-printed-kurta-set-1.webp',
    subtitle: 'TIMELESS & VERSATILE',
    description: 'Everyday straight kurtas, festive embellished kurtis, A-line tunics, and contemporary tops.',
    subcategories: [
      'Straight Kurtas',
      'A-Line Kurtis',
      'Short Kurtis & Tunics',
      'Embroidered Tops',
      'Printed Daily Kurtas',
      'Anarkali Kurtis',
      'Silk Kurtas',
    ],
  },
  {
    id: 'cat-sarees',
    name: 'Sarees',
    slug: 'sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=88',
    subtitle: 'TIMELESS DRAPES',
    description: 'Handcrafted Banarasi, Kanjivaram, and contemporary sarees woven with heritage artistry.',
    subcategories: [
      'Banarasi Silk Sarees',
      'Kanjivaram Sarees',
      'Chiffon Sarees',
      'Organza Sarees',
      'Cotton Sarees',
      'Georgette Sarees',
      'Tussar Silk Sarees',
    ],
  },
  {
    id: 'cat-lehengas',
    name: 'Lehengas',
    slug: 'lehengas',
    image: '/assets/navy-blue-embroidered-zari-lehenga-set-2.webp',
    subtitle: 'CELEBRATION OPULENCE',
    description: 'Heritage bridal lehengas, crop top skirts, and drape sets embellished with zari and gota patti.',
    subcategories: [
      'Bridal Lehengas',
      'Festive Crop Top Lehengas',
      'Printed Silk Lehengas',
      'Drape & Pre-Stitched Lehengas',
      'Jacket Lehengas',
    ],
  },
  {
    id: 'cat-coord-sets',
    name: 'Co-ord Sets',
    slug: 'co-ord-sets',
    image: '/assets/wine-purple-velvet-crop-top-palazzo-set-2.webp',
    subtitle: 'MATCHED PERFECTION',
    description: 'Effortless printed tunic sets, velvet co-ords, and modern Indian two-piece outfits.',
    subcategories: [
      'Festive Co-ords',
      'Velvet Co-ords',
      'Printed Cotton Co-ords',
      'Indo-Western Tunic Sets',
      'Crop Top & Pants',
    ],
  },
  {
    id: 'cat-dresses',
    name: 'Dresses',
    slug: 'dresses',
    image: '/assets/rust-orange-floral-embroidered-anarkali-set-2.webp',
    subtitle: 'FESTIVE & FUSION',
    description: 'Statement gowns, printed slip dresses, and flared fusion silhouettes designed for memorable moments.',
    subcategories: [
      'Festive Dresses',
      'Indo-Western Gowns',
      'Anarkali Dresses',
      'Maxi Dresses',
      'Printed Slip Dresses',
      'Tiered Dresses',
    ],
  },
  {
    id: 'cat-fragrance',
    name: 'Fragrance',
    slug: 'fragrance',
    isComingSoon: true,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=88',
    subtitle: 'ROYAL SCENTS',
    description: 'Artisanal royal Indian attars, luxury eau de parfums, and scented body mists. Launching soon.',
    subcategories: [
      'Luxury Perfumes',
      'Royal Attars',
      'Body Mists',
      'Scented Oils',
    ],
  },
  {
    id: 'cat-jewellery',
    name: 'Jewellery',
    slug: 'jewellery',
    isComingSoon: true,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=88',
    subtitle: 'ROYAL FINISHING TOUCH',
    description: 'Artisanal Kundan necklaces, chandelier earrings, and heritage bangles. Launching soon.',
    subcategories: [
      'Earrings',
      'Necklaces',
      'Bangles & Kadas',
      'Kundan Sets',
      'Maang Tikkas',
    ],
  },
]

// Navbar-specific categories: excludes Jewellery and Fragrance
export const NAVBAR_CATEGORIES = MASTER_CATEGORIES.filter(
  (cat) => cat.slug !== 'jewellery' && cat.slug !== 'fragrance'
)

/** Returns array of equivalent category name aliases for flexible matching */
export function getCategoryAliases(categoryName: string): string[] {
  if (!categoryName) return []
  const lower = categoryName.trim().toLowerCase()

  if (
    lower === 'kurtas & tops' ||
    lower === 'kurtas and tops' ||
    lower === 'kurtis & tops' ||
    lower === 'kurtis and tops' ||
    lower === 'kurtas-tops' ||
    lower === 'kurtas' ||
    lower === 'kurta' ||
    lower === 'kurtis' ||
    lower === 'kurti' ||
    lower === 'tops' ||
    lower === 'top' ||
    lower === 'tunics' ||
    lower === 'tunic'
  ) {
    return [
      'Kurtas & Tops',
      'Kurtas and Tops',
      'Kurtis & Tops',
      'Kurtis and Tops',
      'Kurtas',
      'Kurta',
      'Kurtis',
      'Kurti',
      'Tops',
      'Top',
      'Tunics',
      'Tunic',
    ]
  }

  if (
    lower === 'suits & kurta sets' ||
    lower === 'suit & kurta sets' ||
    lower === 'suits & kurtas' ||
    lower === 'suit sets' ||
    lower === 'suit set' ||
    lower === 'suits' ||
    lower === 'suit' ||
    lower === 'kurta sets' ||
    lower === 'kurta set'
  ) {
    return [
      'Suit Sets',
      'Suit Set',
      'Suits',
      'Suit',
      'Kurta Sets',
      'Kurta Set',
      'Suits & Kurta Sets',
      'Suits & Kurtas',
      'Suit & Kurta Sets',
    ]
  }
  if (
    lower === 'co-ord sets' ||
    lower === 'co-ords' ||
    lower === 'co-ord' ||
    lower === 'coord sets' ||
    lower === 'coords' ||
    lower === 'coord'
  ) {
    return ['Co-ord Sets', 'Co-ords', 'Co-ord', 'Coord Sets', 'Coords', 'Coord']
  }
  if (lower === 'lehengas' || lower === 'lehenga' || lower === 'lehenga choli' || lower === 'lehengas & cholis') {
    return ['Lehengas', 'Lehenga', 'Lehenga Choli', 'Lehengas & Cholis']
  }
  if (lower === 'sarees' || lower === 'saree' || lower === 'saris' || lower === 'sari') {
    return ['Sarees', 'Saree', 'Saris', 'Sari']
  }
  if (lower === 'dresses' || lower === 'dress' || lower === 'gowns' || lower === 'gown') {
    return ['Dresses', 'Dress', 'Gowns', 'Gown']
  }
  if (lower === 'bottoms' || lower === 'pants' || lower === 'palazzos' || lower === 'trousers') {
    return ['Bottoms', 'Pants', 'Palazzos', 'Trousers']
  }

  return [categoryName]
}

