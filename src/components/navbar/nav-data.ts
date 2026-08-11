import { NAVBAR_CATEGORIES } from '@/lib/constants/categories'

export interface MegaColumn {
  heading: string
  links: string[]
}

export interface MegaData {
  title: string
  columns: MegaColumn[]
  image: string
  imageLabel: string
  imageTitle: string
  isComingSoon?: boolean
}

export interface NavItem {
  label: string
  isComingSoon?: boolean
  mega?: MegaData
}

export const navItems: NavItem[] = [
  {
    label: "NEW IN",
    mega: {
      title: "New In",
      columns: [
        {
          heading: "LATEST DROPS",
          links: ["New Arrivals", "This Week", "Trending Now", "Bestsellers"],
        },
        {
          heading: "POPULAR CATEGORIES",
          links: ["Suit Sets", "Sarees", "Lehengas", "Co-ord Sets", "Dresses", "Kurtis & Tops"],
        },
        {
          heading: "CURATED EDITS",
          links: ["Festive '26", "Summer Breeze", "Celebration Wear", "Everyday Luxury"],
        },
      ],
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=88",
      imageLabel: "JUST DROPPED",
      imageTitle: "The New Season Edit",
    },
  },
  ...NAVBAR_CATEGORIES.map((cat) => ({
    label: cat.name.toUpperCase(),
    isComingSoon: cat.isComingSoon,
    mega: {
      title: cat.name,
      isComingSoon: cat.isComingSoon,
      columns: [
        {
          heading: "SUB-CATEGORIES",
          links: cat.subcategories,
        },
        {
          heading: "SHOP BY OCCASION",
          links: cat.isComingSoon
            ? ["Coming Soon", "Preview Collection"]
            : ["Festive Wear", "Wedding Guest", "Puja & Gatherings", "Office Wear", "Everyday Wear"],
        },
        {
          heading: "TRENDING",
          links: cat.isComingSoon
            ? ["Early Access", "Notify Me"]
            : ["New Arrivals", "Bestsellers", "Embroidered Edit", "Printed Essentials"],
        },
      ],
      image: cat.image,
      imageLabel: cat.isComingSoon ? "LAUNCHING SOON" : (cat.subtitle || "FEATURED"),
      imageTitle: cat.isComingSoon ? `${cat.name} Collection Coming Soon` : cat.description || cat.name,
    },
  })),
]
