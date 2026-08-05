'use client'

import React from 'react'
import Link from 'next/link'
import { MegaData } from './nav-data'
import { Sparkles, ArrowRight } from 'lucide-react'

interface MegaMenuProps {
  data: MegaData
}

export function MegaMenu({ data }: MegaMenuProps) {
  return (
    <div className="megaMenu">
      <div className="megaMenuInner">
        {/* Top Eyebrow & Title */}
        <div className="megaMenuTop">
          <span className="megaEyebrow">
            <Sparkles className="w-3.5 h-3.5" />
            EXPLORE APSARAH
          </span>
          <span className="megaTitle">{data.title}</span>
        </div>

        {/* Grid Section */}
        <div className="megaMenuGrid">
          {/* Columns */}
          <div className="megaColumns">
            {data.columns.map((col, idx) => (
              <div
                key={col.heading}
                className="megaColumn"
                style={{ '--column-delay': `${idx * 55}ms` } as React.CSSProperties}
              >
                <h4>{col.heading}</h4>
                <div className="megaLinks">
                  {col.links.map((linkText) => (
                    <Link key={linkText} href={`/shop?category=${encodeURIComponent(data.title === 'New In' ? 'All' : data.title)}&q=${encodeURIComponent(linkText)}`}>
                      <span>{linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Campaign Card */}
          <Link href={`/shop?category=${encodeURIComponent(data.title === 'New In' ? 'All' : data.title)}`} className="megaCampaign">
            <div className="megaCampaignImage">
              <img src={data.image} alt={data.imageTitle} loading="lazy" />
              <div className="megaCampaignOverlay" />
              <div className="megaCampaignContent">
                <small>{data.imageLabel}</small>
                <h3>{data.imageTitle}</h3>
                <span>
                  SHOP COLLECTION
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Bar */}
        <div className="megaFooter">
          <span>Complimentary shipping on orders above ₹999</span>
          <Link href={`/shop?category=${encodeURIComponent(data.title === 'New In' ? 'All' : data.title)}`}>
            VIEW ALL {data.title.toUpperCase()}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
