'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export interface CampaignOffer {
  id: number
  eyebrow: string
  title: string
  accent: string
  description: string
  offer: string
  button: string
  image: string
  theme: string
}

export const campaignOffers: CampaignOffer[] = [
  {
    id: 1,
    eyebrow: "APSARAH BESTSELLERS",
    title: "Made To Be",
    accent: "Admired.",
    description: "Elegant Indian silhouettes designed to make every entrance feel extraordinary.",
    offer: "SIGNATURE COLLECTION",
    button: "DISCOVER NOW",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    theme: "wine",
  },
  {
    id: 2,
    eyebrow: "THE FESTIVE EDIT",
    title: "Celebrate In",
    accent: "Style.",
    description: "Rich colours, graceful silhouettes and timeless details made for celebration.",
    offer: "FESTIVE COLLECTION",
    button: "SHOP FESTIVE",
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=85",
    theme: "emerald",
  },
  {
    id: 3,
    eyebrow: "NEW SEASON • NEW MOOD",
    title: "Tradition,",
    accent: "Reimagined.",
    description: "Heritage-inspired dressing created for modern confidence and effortless elegance.",
    offer: "JUST LANDED",
    button: "SHOP NEW IN",
    image: "/assets/img-3.jpeg",
    theme: "plum",
  },
  {
    id: 4,
    eyebrow: "APSARAH SIGNATURE",
    title: "Elegance That",
    accent: "Stays.",
    description: "Statement sarees and occasion wear crafted for moments worth remembering.",
    offer: "THE SAREE EDIT",
    button: "EXPLORE NOW",
    image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=900&q=85",
    theme: "espresso",
  },
]

export function OfferCarousel() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % campaignOffers.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % campaignOffers.length)
  }

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? campaignOffers.length - 1 : prev - 1))
  }

  return (
    <div
      className="offerCarousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="offerCarouselViewport">
        {campaignOffers.map((item, idx) => {
          const isActive = idx === activeIdx
          return (
            <article
              key={item.id}
              className={`offerSlide offerTheme-${item.theme} ${isActive ? 'offerSlideActive' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Visual Side */}
              <div className="offerVisual">
                <img
                  src={item.image}
                  alt={`${item.title} ${item.accent}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="offerImageShade" />
                <span className="offerImageLabel">
                  APSARAH • EDIT 0{idx + 1}
                </span>
              </div>

              {/* Content Side */}
              <div className="offerContent">
                <div className="offerWatermark">APSARAH</div>
                <div className="offerContentInner">
                  <span className="offerEyebrow">
                    <Sparkles className="w-3.5 h-3.5" />
                    {item.eyebrow}
                  </span>
                  <h2>
                    {item.title} <em>{item.accent}</em>
                  </h2>
                  <p>{item.description}</p>
                  <div className="offerDeal">{item.offer}</div>
                  <Link href="#shop" className="offerCTA">
                    <span>{item.button}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}

        {/* Navigation Arrows */}
        <button
          type="button"
          className="offerArrow offerArrowLeft"
          onClick={prevSlide}
          aria-label="Previous campaign"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="offerArrow offerArrowRight"
          onClick={nextSlide}
          aria-label="Next campaign"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots & Counter */}
        <div className="offerNavigation">
          <span className="offerCounter">0{activeIdx + 1}</span>
          <div className="offerDots">
            {campaignOffers.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`offerDot ${idx === activeIdx ? 'offerDotActive' : ''}`}
                aria-label={`Go to campaign ${idx + 1}`}
              >
                <span />
              </button>
            ))}
          </div>
          <span className="offerCounter">0{campaignOffers.length}</span>
        </div>
      </div>
    </div>
  )
}
