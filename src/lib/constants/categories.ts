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
    id: 'cat-kurta-sets',
    name: 'Suit Sets',
    slug: 'kurta-sets',
    image: '/assets/red-embroidered-silk-kurta-set-2.webp',
    subtitle: 'ROYALTY & HERITAGE',
    description: 'Intricately embroidered Anarkalis, Shararas, and Straight Suit Sets handcrafted for celebrations.',
    subcategories: [
      'Anarkali Sets',
      'Straight Suit Sets',
      'Sharara & Gharara Sets',
      'Angrakha Sets',
      'Velvet Sets',
      'Silk Kurta Sets',
      'Palazzo Sets',
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
    id: 'cat-kurtas-tops',
    name: 'Kurtis & Tops',
    slug: 'kurtas-tops',
    image: '/assets/emerald-green-silk-birdcage-embroidered-set-1.webp',
    subtitle: 'EVERYDAY LUXURY',
    description: 'Breathable Chikankari kurtas, short kurtis, and contemporary ethnic tunics for daily chic.',
    subcategories: [
      'Short Kurtis',
      'Long Straight Kurtas',
      'Ethnic Tunics',
      'Peplum Tops',
      'Printed Tops',
      'Chikankari Kurtas',
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
