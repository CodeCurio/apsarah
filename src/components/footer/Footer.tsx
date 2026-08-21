'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronUp,
} from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="apsFooter">
      {/* 1. Value Propositions Banner */}
      <div className="apsTrustBanner">
        <div className="apsTrustInner">
          <div className="apsTrustItem">
            <ShieldCheck className="w-5 h-5 text-[#efbd3b]" />
            <div>
              <strong>100% AUTHENTIC CRAFT</strong>
              <span>Handcrafted by master artisans</span>
            </div>
          </div>

          <div className="apsTrustItem">
            <Truck className="w-5 h-5 text-[#efbd3b]" />
            <div>
              <strong>COMPLIMENTARY SHIPPING</strong>
              <span>On all prepaid orders across India</span>
            </div>
          </div>

          <div className="apsTrustItem">
            <RotateCcw className="w-5 h-5 text-[#efbd3b]" />
            <div>
              <strong>HASSLE-FREE RETURNS</strong>
              <span>7-day easy exchange & refund policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Section */}
      <div className="apsNewsletter">
        <div className="apsNewsletterInner">
          <div className="apsNewsletterText">
            <span className="apsEyebrow">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#efbd3b]" />
              THE APSARAH CIRCLE
            </span>
            <h2>Subscribe to Receive Special Invitations & First Access</h2>
          </div>

          <form onSubmit={handleSubscribe} className="apsNewsletterForm">
            {subscribed ? (
              <p className="text-[#efbd3b] font-medium text-xs">
                Welcome to the Apsarah Circle! Thank you for subscribing.
              </p>
            ) : (
              <div className="apsInputWrapper">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  JOIN CIRCLE
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 3. Main Footer Links Grid */}
      <div className="apsFooterMain">
        <div className="apsFooterGrid">
          {/* Brand Info */}
          <div className="apsFooterBrand">
            <Link href="/" className="apsFooterLogo">
              <img src="/assets/logo.png" alt="Apsarah Logo" className="h-10 w-auto" />
            </Link>
            <p>
              Contemporary Indian fashion shaped by heritage, craftsmanship and effortless elegance. Crafted for the modern woman who honors tradition.
            </p>
            <div className="apsSocials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="apsFooterCol">
            <h4>COLLECTIONS</h4>
            <ul>
              <li><Link href="/shop?category=Suit%20Sets&sub=Straight%20Suit%20Sets">Straight Suit Sets</Link></li>
              <li><Link href="/shop?category=Suit%20Sets">Classic Kurtas</Link></li>
              <li><Link href="/shop?category=Sarees">Festive Sarees</Link></li>
              <li><Link href="/shop?category=Co-ord%20Sets">Co-ord Sets</Link></li>
              <li><Link href="/shop?category=Suit%20Sets&sub=Anarkali%20Sets">Anarkali Sets</Link></li>
              <li><Link href="/shop?bestseller=true">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="apsFooterCol">
            <h4>CUSTOMER CARE</h4>
            <ul>
              <li><Link href="/account">Track Your Order</Link></li>
              <li><Link href="/shipping-policy">Shipping & Delivery</Link></li>
              <li><Link href="/returns-policy">Returns & Exchanges</Link></li>
              <li><Link href="/faq">Frequently Asked Questions</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div className="apsFooterCol">
            <h4>ABOUT APSARAH</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/about">Our Story & Heritage</Link></li>
              <li><Link href="/about">Artisans & Craftsmanship</Link></li>
              <li><Link href="/about">Sustainable Luxury</Link></li>
              <li><Link href="/contact">Design Studio</Link></li>
            </ul>
          </div>
        </div>

        {/* 4. Footer Bottom Bar */}
        <div className="apsFooterBottom">
          <span>&copy; {new Date().getFullYear()} Apsarah. All Rights Reserved.</span>
          <div className="apsLegalLinks">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
          <button type="button" onClick={scrollToTop} className="apsScrollTop" aria-label="Scroll to top">
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
