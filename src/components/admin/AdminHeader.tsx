'use client'

import React from 'react'
import { Bell, Search, UserCheck, ShieldAlert, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const adminName = profile?.full_name || user?.user_metadata?.full_name || 'Store Admin'
  const adminEmail = user?.email || 'admin@apsarah.in'

  return (
    <header className="h-16 bg-[#fffaf5] border-b border-[#e2d4c7] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-3 w-80 bg-white border border-[#e2d4c7] rounded-full px-4 py-2 text-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full bg-transparent outline-none text-[#2b1713] placeholder:text-slate-400"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Environment / Role Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fce8e8] text-[#8f1020] text-[10px] font-bold tracking-wider uppercase border border-[#8f1020]/20">
          <ShieldAlert className="w-3 h-3" />
          ADMIN MODE
        </span>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-white border border-[#e2d4c7] flex items-center justify-center text-[#2b1713] hover:bg-[#F0E6DC] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8f1020]" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#e2d4c7]">
          <div className="w-8 h-8 rounded-full bg-[#8f1020] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#2b1713] truncate max-w-[140px]">
              {adminName}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
              {adminEmail}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign Out of Admin"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8f1020]/10 hover:bg-[#8f1020] text-[#8f1020] hover:text-white text-xs font-medium border border-[#8f1020]/20 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
