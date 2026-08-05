'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Clock } from 'lucide-react'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'
import { useToast } from '@/context/ToastContext'

export function CategoryShowcase() {
  const { toastInfo } = useToast()

  return (
    <section className="apsCategorySection">
      {/* Section Header */}
      <div className="apsCategoryHeader">
        <div>
          <span>DISCOVER APSARAH</span>
          <h2>Shop by Category</h2>
        </div>
        <p>
          From royal celebration wear to modern everyday essentials, explore our handcrafted collections.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="apsCategoryGrid">
        {MASTER_CATEGORIES.map((cat, idx) => {
          const themes = ['wine', 'sage', 'rose', 'terracotta', 'gold', 'plum', 'terracotta', 'wine']
          const theme = themes[idx % themes.length]

          if (cat.isComingSoon) {
            return (
              <div
                key={cat.id}
                onClick={() => toastInfo(`"${cat.name}" collection is launching very soon! Stay tuned. ✨`)}
                className={`apsCategoryCard ${theme} cursor-pointer group relative overflow-hidden`}
              >
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="apsCategoryTint" />

                {/* Coming Soon Badge Overlay */}
                <div className="absolute top-4 right-4 bg-[#8f1020] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider z-10 border border-white/20">
                  <Clock className="w-3 h-3 text-[#efbd3b]" /> Coming Soon
                </div>

                <span className="apsCategoryIndex">0{idx + 1}</span>

                <div className="apsCategoryInfo">
                  <small className="flex items-center gap-1 text-[#efbd3b]">
                    <Sparkles className="w-3 h-3" /> {cat.subtitle}
                  </small>
                  <div>
                    <h3>{cat.name}</h3>
                    <span className="apsCategoryArrow bg-white/20 text-white">
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`apsCategoryCard ${theme}`}
            >
              <img src={cat.image} alt={cat.name} loading="lazy" />
              <div className="apsCategoryTint" />

              <span className="apsCategoryIndex">0{idx + 1}</span>

              <div className="apsCategoryInfo">
                <small>{cat.subtitle}</small>
                <div>
                  <h3>{cat.name}</h3>
                  <span className="apsCategoryArrow">
                    <ArrowUpRight className="w-[17px] h-[17px]" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

