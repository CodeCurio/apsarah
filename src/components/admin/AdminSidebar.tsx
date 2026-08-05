'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  Users,
  ExternalLink,
  Store,
  Tag,
} from 'lucide-react'

export const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Inventory', href: '/admin/products', icon: ShoppingBag },
  { label: 'Orders & Shipping', href: '/admin/orders', icon: Package },
  { label: 'Promotions & Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Customers', href: '/admin/customers', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1f0b08] text-white flex flex-col min-h-screen border-r border-white/10 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Apsarah Logo" className="h-8 w-auto invert brightness-200" />
          <span className="text-[10px] tracking-[0.2em] font-bold text-[#efbd3b] uppercase">ADMIN</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#8f1020] text-white font-semibold shadow-lg shadow-[#8f1020]/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Link to Store */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#efbd3b]" />
            <span>View Live Store</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </Link>
      </div>
    </aside>
  )
}
