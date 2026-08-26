'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const heroBanners = [
  {
    desktopImage: '/assets/banner design 2.png',
    mobileImage: '/assets/Mobile-banner-1.png',
    alt: 'Apsarah Festive Collection Banner 1',
  },
  {
    desktopImage: '/assets/banner design 3.png',
    mobileImage: '/assets/Mobile-banner-2.png',
    alt: 'Apsarah Festive Collection Banner 2',
  },
  {
    desktopImage: '/assets/banner design 4.png',
    mobileImage: '/assets/Mobile-banner-3.png',
    alt: 'Apsarah Festive Collection Banner 3',
  },
]

export function HeroEditorial() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#25100c]">
      {/* Responsive Aspect Ratio: 1024/1536 (2:3) on mobile, 2087/753 on desktop */}
      <div className="relative w-full aspect-[1024/1536] md:aspect-[2087/753]">
        {heroBanners.map((banner, idx) => (
          <div
            key={banner.desktopImage}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <picture className="w-full h-full block">
              <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
              <img
                src={banner.desktopImage}
                alt={banner.alt}
                className="w-full h-full object-cover select-none"
              />
            </picture>
          </div>
        ))}

        {/* Minimal Navigation Arrows */}
        <button
          type="button"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-white text-white hover:text-[#2b1713] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all shadow-xl cursor-pointer"
          onClick={prevSlide}
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        <button
          type="button"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-white text-white hover:text-[#2b1713] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all shadow-xl cursor-pointer"
          onClick={nextSlide}
          aria-label="Next banner"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* Minimal Navigation Dots */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-6 sm:w-8 bg-[#efbd3b]'
                  : 'w-1.5 sm:w-2 bg-white/60 hover:bg-white'
              }`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
