'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Tag } from 'lucide-react'

export interface PriceTier {
  price: string
  label: string
  description: string
  image: string
  badge: string
}

export const priceTiers: PriceTier[] = [
  {
    price: "UNDER ₹999",
    label: "STYLE EDIT",
    description: "Effortless everyday ethnic pieces for quick styling",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    badge: "BUDGET FAVORITES",
  },
  {
    price: "UNDER ₹1,999",
    label: "EVERYDAY EDIT",
    description: "Versatile kurta sets and modern co-ord silhouettes",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    badge: "MOST POPULAR",
  },
  {
    price: "UNDER ₹2,999",
    label: "SIGNATURE EDIT",
    description: "Elevated handcrafted suits with detailed embroidery",
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
    badge: "PREMIUM FINDS",
  },
  {
    price: "UNDER ₹3,999",
    label: "CELEBRATION EDIT",
    description: "Statement festive wear and regal Anarkali sets",
    image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=800&q=80",
    badge: "LUXURY EDIT",
  },
]

export function ShopByPrice() {
  return (
    <section className="priceEditSection">
      <div className="priceEditHeader">
        <div>
          <span className="priceEditEyebrow">POCKET FRIENDLY ELEGANCE</span>
          <h2>Shop by Price</h2>
        </div>
        <p>Curated collections tailored to match your budget without compromising on luxury craft.</p>
      </div>

      <div className="priceEditGrid">
        {priceTiers.map((tier) => (
          <Link href="/shop" key={tier.price} className="priceCard">
            <img src={tier.image} alt={tier.price} loading="lazy" />
            <div className="priceCardTint" />

            <span className="priceCardBadge">
              <Tag className="w-3 h-3 inline mr-1.5" />
              {tier.badge}
            </span>

            <div className="priceCardContent">
              <small>{tier.label}</small>
              <h3>{tier.price}</h3>
              <p>{tier.description}</p>

              <div className="priceCardCTA">
                <span>EXPLORE EDIT</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
