import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Leaf,
  Award,
  Users,
  MapPin,
  ArrowRight,
  Quote,
  CheckCircle2,
  Scissors,
  Gem,
  Palette,
  Compass,
} from 'lucide-react'

export const metadata = {
  title: 'About Us | Apsarah - Royal Silhouettes & Heritage Indian Fashion',
  description:
    'Discover the story of Apsarah. Crafting royal silhouettes and contemporary Indian wear using centuries-old weaving, embroidery, and handblock techniques.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2B1713]">
      {/* 1. HERO EDITORIAL HEADER */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#F3EBE1] to-[#FAF6F0]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8F1020]/10 border border-[#8F1020]/20 text-[#8F1020] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#EFBD3B]" />
            OUR HERITAGE & LEGACY
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#2B1713] leading-tight">
            The Tale of <span className="text-[#8F1020] italic font-serif">Apsarah</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Crafting royal silhouettes and contemporary Indian wear shaped by centuries-old weaving, artisan handblock printing, and intricate Zari embroidery.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#E2D4C7]" />
            <Gem className="w-4 h-4 text-[#EFBD3B]" />
            <span className="h-px w-12 bg-[#E2D4C7]" />
          </div>
        </div>
      </section>

      {/* 2. ORIGIN & BRAND STORY SECTION */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image Grid / Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-[#E2D4C7] shadow-xl aspect-[4/5] bg-[#EAE0D5]">
              <img
                src="/assets/banner design 2.webp"
                alt="Apsarah Craftsmanship Heritage"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-[#EFBD3B] uppercase mb-1">
                  NEW DELHI DESIGN STUDIO
                </span>
                <p className="text-sm font-serif italic text-white/90">
                  “Honoring royal heritage while dressing the modern woman in effortless grace.”
                </p>
              </div>
            </div>
            {/* Decorative Offset Badge */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 z-20 bg-[#8F1020] text-white p-5 rounded-2xl shadow-2xl items-center gap-4 max-w-xs border border-[#EFBD3B]/30">
              <Award className="w-8 h-8 text-[#EFBD3B] shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white uppercase tracking-wider">100% Authentic</p>
                <p className="text-white/80 text-[11px]">Direct artisan weaving clusters</p>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#8F1020] uppercase block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2B1713]">
                Where Centuries-Old Weaves Meet Contemporary Elegance
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Founded in the vibrant heart of New Delhi, <strong>Apsarah</strong> represents a seamless bridge between ancient Indian textile traditions and modern tailored silhouettes. We believe fashion is an expression of culture, memory, and personal grace.
            </p>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Every garment in our collection tells the story of master weavers, handblock printers, and embroidery artisans across Rajasthan, Madhya Pradesh, and Uttar Pradesh. By blending royal Chanderi silks, breathable cotton mulmul, Bagru handblocks, and delicate Zari borders, we create ensembles designed for timeless moments.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E2D4C7] shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#8F1020]">500+</div>
                <div className="text-[11px] text-slate-600 font-medium">Master Artisans Empowered</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E2D4C7] shadow-sm">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#8F1020]">15+</div>
                <div className="text-[11px] text-slate-600 font-medium">Weaver Clusters Across India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E2D4C7]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase">
              OUR FOUNDATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2B1713]">
              The 4 Pillars of Apsarah
            </h2>
            <p className="text-xs text-slate-500">
              Our pledge to quality, tradition, and ethical fashion in every stitch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E2D4C7]/80 hover:border-[#8F1020]/40 transition-all duration-300 shadow-sm hover:shadow-md space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#8F1020] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6 text-[#EFBD3B]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2B1713]">Artisanal Heritage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We preserve centuries-old handloom weaving, Bagru printing, and Zari work, honoring generational craft masters.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E2D4C7]/80 hover:border-[#8F1020]/40 transition-all duration-300 shadow-sm hover:shadow-md space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#8F1020] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6 text-[#EFBD3B]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2B1713]">Ethical Fair Wages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By bypassing intermediaries, we work directly with weaver collectives ensuring fair livelihood and dignified wages.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E2D4C7]/80 hover:border-[#8F1020]/40 transition-all duration-300 shadow-sm hover:shadow-md space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#8F1020] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#EFBD3B]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2B1713]">Royal Comfort & Fit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern tailored cuts engineered for fluid movement, breathability, and royal elegance for day or festive wear.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E2D4C7]/80 hover:border-[#8F1020]/40 transition-all duration-300 shadow-sm hover:shadow-md space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#8F1020] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-[#EFBD3B]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2B1713]">Sustainable Luxury</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Natural organic fibers, plant-based dyes, and zero-waste production practices to safeguard our planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CRAFTSMANSHIP & TECHNIQUES SHOWCASE */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase">
            MASTER TECHNIQUES
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2B1713]">
            Signature Crafts of Apsarah
          </h2>
          <p className="text-xs text-slate-500">
            A closer look into the authentic handmade processes behind our suit sets, kurtas, and lehengas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Technique 1 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2D4C7] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#EAE0D5]">
              <img
                src="/assets/black-silk-floral-embroidered-kurta-set-1.webp"
                alt="Chanderi Silk & Zari Embroidery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#2B1713]/80 backdrop-blur-md text-[#EFBD3B] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#EFBD3B]/30">
                ROYAL TEXTILE
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1713] mb-1">
                  Pure Chanderi & Mulberry Silk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Woven with lightweight sheer texture and golden Zari threads. Chanderi silk carries an opulent sheen crafted for grand celebrations.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-[#8F1020]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Handloomed in Madhya Pradesh
              </div>
            </div>
          </div>

          {/* Technique 2 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2D4C7] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#EAE0D5]">
              <img
                src="/assets/mustard-yellow-geometric-printed-kurta-set-1.webp"
                alt="Bagru & Sanganeri Handblock Prints"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#2B1713]/80 backdrop-blur-md text-[#EFBD3B] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#EFBD3B]/30">
                ARTISANAL PRINTING
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1713] mb-1">
                  Bagru & Dabu Handblock Prints
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Carved wooden blocks dipped in natural botanical dyes pressed by hand onto organic cottons, producing rhythmic geometric and floral motifs.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-[#8F1020]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hand-stamped in Rajasthan
              </div>
            </div>
          </div>

          {/* Technique 3 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E2D4C7] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="h-56 overflow-hidden relative bg-[#EAE0D5]">
              <img
                src="/assets/navy-blue-embroidered-zari-lehenga-set-1.webp"
                alt="Fine Chikankari & Zardozi Needlework"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#2B1713]/80 backdrop-blur-md text-[#EFBD3B] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-[#EFBD3B]/30">
                NEEDLEWORK ART
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1713] mb-1">
                  Intricate Zari & Chikankari Work
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Meticulous shadow work, delicate floral threadwork, and metallic sequin highlights handcrafted by master embroiderers over hundreds of hours.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-[#8F1020]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Crafted in Lucknow & Delhi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER'S NOTE / VISION QUOTE SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white via-[#FAF6F0] to-[#F3EBE1] rounded-3xl p-8 md:p-14 border border-[#E2D4C7] shadow-lg relative overflow-hidden">
          <Quote className="absolute top-6 right-6 w-24 h-24 text-[#8F1020]/5 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase block">
              FOUNDER&apos;S NOTE
            </span>

            <blockquote className="text-base sm:text-xl font-serif text-[#2B1713] italic leading-relaxed">
              “Apsarah was born out of a deep romance with India’s textile treasury. We wanted to create clothes that feel weightless yet feel undeniably royal — garments that make every woman feel connected to her roots without giving up modern comfort.”
            </blockquote>

            <div className="pt-4 border-t border-[#E2D4C7]/60 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8F1020] text-[#EFBD3B] flex items-center justify-center font-serif font-bold text-lg border border-[#EFBD3B]/30">
                A
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#2B1713]">The Creative Atelier</h4>
                <p className="text-xs text-slate-500">Apsarah Design Studio, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#8F1020] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EFBD3B] text-[10px] font-bold tracking-widest uppercase border border-white/20">
            <Sparkles className="w-3 h-3" /> EXPLORE THE HERITAGE COLLECTION
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Step Into Timeless Royal Grace
          </h2>

          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Discover our latest collection of straight suit sets, Anarkalis, festive sarees, and handcrafted co-ords made with love across India.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#EFBD3B] hover:bg-[#e7b22a] text-[#2B1713] text-xs font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 text-white text-xs font-bold rounded-2xl border border-white/30 transition-all flex items-center justify-center cursor-pointer"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
