'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { navItems } from './nav-data'
import { MegaMenu } from './MegaMenu'
import { MobileDrawer } from './MobileDrawer'
import { AuthForm } from '@/components/auth/AuthModal'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useWishlist } from '@/context/WishlistContext'
import {
  Menu,
  ChevronDown,
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  X,
  LogOut,
  Package,
  Settings,
} from 'lucide-react'

export function Navbar() {
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { itemCount, openCart } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, profile, isAdmin, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
      setActiveMega(null)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMega(null)
        setMobileDrawerOpen(false)
        setAuthModalOpen(false)
        setAccountMenuOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        router.push('/search')
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const currentMegaData = navItems.find((item) => item.label === activeMega)?.mega

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="premiumAnnouncement">
        <div className="announcementTrack">
          <span>END OF SEASON SALE</span>
          <i />
          <strong>ENJOY FLAT 40% OFF</strong>
          <i />
          <span>LIMITED TIME ONLY</span>
        </div>
      </div>

      {/* 2. Main Header Container */}
      <header
        className={`premiumHeader ${isScrolled ? 'isScrolled' : ''}`}
        onMouseLeave={() => setActiveMega(null)}
      >
        {/* Top Header Row */}
        <div className="premiumHeaderTop">
          {/* Mobile Menu Hamburger */}
          <button
            className="premiumMobileButton"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="premiumLogo">
            <img
              src="/assets/logo.png"
              alt="Apsarah Logo"
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Search Bar */}
          <form className={`premiumSearch ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
            <Search className="w-4 h-4 opacity-70 shrink-0" />
            <input
              type="text"
              placeholder="Search kurtas, suits, dresses and more"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd>⌘ K</kbd>
          </form>

          {/* Action Icons Cluster */}
          <div className="premiumActions">
            {/* Wishlist */}
            <Link href="/account/wishlist" aria-label="Wishlist" className="wishlistAction relative">
              <Heart className={`w-4 h-4 transition-colors ${wishlistCount > 0 ? 'text-[#8f1020] fill-[#8f1020]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="actionBadge">{wishlistCount}</span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative">
                <button
                  aria-label="Account"
                  type="button"
                  onClick={() => setAccountMenuOpen(v => !v)}
                  className="flex items-center gap-1"
                >
                  <UserRound className="w-4 h-4" />
                  <span className="hidden md:inline text-xs font-medium max-w-[80px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 hidden md:inline" />
                </button>

                {accountMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAccountMenuOpen(false)} />
                    <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 text-sm">
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-[#8f1020] font-semibold">
                          <Settings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                        <UserRound className="w-4 h-4" /> My Account
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      <div className="border-t border-slate-100 mt-1" />
                      <button
                        type="button"
                        onClick={async () => { await signOut(); setAccountMenuOpen(false) }}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-rose-600 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                aria-label="Account"
                type="button"
                onClick={() => setAuthModalOpen(true)}
              >
                <UserRound className="w-4 h-4" />
              </button>
            )}

            {/* Shopping Bag with live count */}
            <button
              className="cartAction relative"
              aria-label="Shopping bag"
              type="button"
              onClick={openCart}
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="actionBadge">{itemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Navigation Links Row */}
        <div className="premiumNavigation">
          <nav className="premiumNavInner">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={`/shop?category=${encodeURIComponent(item.mega?.title || item.label)}`}
                className={activeMega === item.label ? 'active' : ''}
                onMouseEnter={() => setActiveMega(item.label)}
              >
                <span className="flex items-center gap-1">
                  {item.label}
                  {item.isComingSoon && (
                    <span className="text-[7px] font-bold bg-[#8f1020] text-white px-1 py-0.2 rounded-full uppercase tracking-wider leading-none">
                      SOON
                    </span>
                  )}
                </span>
                {item.mega && <ChevronDown className="w-2.5 h-2.5 opacity-60" />}
              </Link>
            ))}
            <Link
              href="/shop"
              className="premiumSaleLink"
              onMouseEnter={() => setActiveMega(null)}
            >
              SALE
              <span>40%</span>
            </Link>
          </nav>
        </div>

        {/* 4. Mega Menu Stage Dropdown */}
        <div className={`megaMenuStage ${currentMegaData ? 'open' : ''}`}>
          {currentMegaData && <MegaMenu data={currentMegaData} />}
        </div>
      </header>

      {/* 5. Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* 6. Auth Modal Popup */}
      {authModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close auth modal"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthForm onSuccess={() => setAuthModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
