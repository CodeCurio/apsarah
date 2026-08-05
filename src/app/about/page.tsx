import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase">OUR HERITAGE</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">About Apsarah</h1>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Crafting royal silhouettes and contemporary Indian wear using centuries-old weaving, embroidery, and handblock techniques.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#E2D4C7] shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            Founded in the heart of New Delhi, <strong>Apsarah</strong> represents the harmony between centuries-old Indian textile heritage and modern tailored silhouettes. Every piece in our collection is crafted by master artisans using authentic Chanderi silks, pure cotton mulmul, Bagru handblock prints, and intricate Zari embroidery.
          </p>

          <h2 className="text-xl font-serif font-bold text-[#2B1713]">Artisanal Craftsmanship</h2>
          <p>
            We work directly with traditional weaver clusters across Rajasthan, Madhya Pradesh, and Uttar Pradesh. By bypassing intermediaries, we preserve rare artisanal traditions while ensuring ethical wages for our craftsmen.
          </p>

          <h2 className="text-xl font-serif font-bold text-[#2B1713]">Effortless Elegance</h2>
          <p>
            Our garments are designed for the modern woman who cherishes tradition without compromising on comfort. From breathable everyday Chikankari kurtas to opulent festive Anarkali suit sets, Apsarah offers timeless luxury for every occasion.
          </p>

          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <Link href="/shop" className="px-8 py-3 bg-[#8F1020] text-white text-xs font-bold rounded-xl shadow-md">
              Explore Our Collection →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
