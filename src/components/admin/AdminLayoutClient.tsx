'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ShieldAlert, Loader2 } from 'lucide-react'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isAdmin, loading } = useAuth()

  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')

  useEffect(() => {
    // If not on login page, and loading finished, check if user is admin
    if (!isLoginPage && !loading) {
      if (!user || !isAdmin) {
        router.replace('/admin/login')
      }
    }
  }, [isLoginPage, loading, user, isAdmin, router])

  // 1. If viewing the login page, render children directly without admin chrome
  if (isLoginPage) {
    return <>{children}</>
  }

  // 2. Loading state while AuthContext fetches user session & profile
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f0b08] text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#efbd3b] animate-spin" />
          <p className="text-xs text-white/70 tracking-widest uppercase font-medium">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    )
  }

  // 3. Unauthorized access check (not logged in or not an admin)
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#1f0b08] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md text-center space-y-4 backdrop-blur-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8f1020]/30 text-[#8f1020] border border-[#8f1020]/50 mx-auto">
            <ShieldAlert className="w-6 h-6 text-[#ff8080]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Access Denied</h2>
            <p className="text-xs text-white/60">
              Admin privileges are required to access this portal. Redirecting to login...
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#efbd3b]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    )
  }

  // 4. Fully Authenticated & Authorized Admin Layout
  return (
    <div className="flex min-h-screen bg-[#faf5f0] text-[#2b1713]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
