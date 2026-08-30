'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { navItems, NavItem } from './nav-data'
import { Search, X, ArrowRight } from 'lucide-react'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  items?: NavItem[]
}

export function MobileDrawer({ isOpen, onClose, items = navItems }: MobileDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onClose()
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <div className={`premiumMobileDrawer ${isOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div className="mobileDrawerHeader">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <img src="/assets/logo.png" alt="Apsarah Logo" className="h-8 w-auto object-contain" />
          </Link>
          <button onClick={onClose} aria-label="Close menu">
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Drawer Search */}
        <form onSubmit={handleSearch} className="mobileDrawerSearch w-full mb-4">
          <label className="flex items-center gap-2 w-full bg-white border border-[#E2D4C7] rounded-xl px-3 py-2 text-xs text-slate-800 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search kurtas, dresses & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none border-none font-medium placeholder:text-slate-400"
            />
          </label>
        </form>

        {/* Navigation Links */}
        <div className="mobileNav space-y-1">
          {items.map((item) => (
            <Link
              key={item.label}
              href={`/shop?category=${encodeURIComponent(item.mega?.title || item.label)}`}
              onClick={onClose}
              className="flex items-center justify-between py-3 border-b border-[#E2D4C7]/40 font-bold text-xs uppercase tracking-wide text-[#2B1713] hover:text-[#8f1020]"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
          <Link
            href="/shop?sale=true"
            className="mobileSaleLink flex items-center justify-between py-3.5 font-black text-xs uppercase tracking-wide text-[#8f1020]"
            onClick={onClose}
          >
            <span>SALE — UP TO 40% OFF</span>
            <ArrowRight className="w-4 h-4 text-[#8f1020]" />
          </Link>
        </div>
      </div>

      {/* Overlay Backdrop */}
      {isOpen && <button className="mobileDrawerOverlay" onClick={onClose} aria-label="Close overlay" />}
    </>
  )
}
