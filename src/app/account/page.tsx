'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Heart, MapPin, UserRound, LogOut, ChevronRight, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface RecentOrder {
  id: string
  order_number: string
  created_at: string
  total: number
  payment_status: string
  fulfillment_status: string
}

export default function AccountDashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      const supabase = createClient()
      // Fetch recent 3 orders
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
        .then(({ data }) => {
          if (data) setRecentOrders(data as RecentOrder[])
        })

      // Fetch wishlist count
      supabase
        .from('wishlist')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .then(({ count }) => {
          setWishlistCount(count || 0)
        })
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen bg-[#FAF6F0] pt-28 text-center text-xs text-slate-400">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E2D4C7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#8F1020] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold">Welcome, {profile?.full_name || 'Valued Customer'}</h1>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => { await signOut(); router.push('/') }}
            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/account/orders" className="bg-white p-5 rounded-2xl border border-[#E2D4C7] shadow-sm hover:border-[#8F1020] transition-all group">
            <Package className="w-6 h-6 text-[#8F1020] mb-2" />
            <h3 className="font-bold text-xs text-[#2B1713] group-hover:text-[#8F1020]">My Orders</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Track & view past orders</p>
          </Link>

          <Link href="/account/wishlist" className="bg-white p-5 rounded-2xl border border-[#E2D4C7] shadow-sm hover:border-[#8F1020] transition-all group">
            <Heart className="w-6 h-6 text-[#8F1020] mb-2" />
            <h3 className="font-bold text-xs text-[#2B1713] group-hover:text-[#8F1020]">Wishlist ({wishlistCount})</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Saved favorite outfits</p>
          </Link>

          <Link href="/account/addresses" className="bg-white p-5 rounded-2xl border border-[#E2D4C7] shadow-sm hover:border-[#8F1020] transition-all group">
            <MapPin className="w-6 h-6 text-[#8F1020] mb-2" />
            <h3 className="font-bold text-xs text-[#2B1713] group-hover:text-[#8F1020]">Addresses</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Manage delivery addresses</p>
          </Link>

          <Link href="/account/profile" className="bg-white p-5 rounded-2xl border border-[#E2D4C7] shadow-sm hover:border-[#8F1020] transition-all group">
            <UserRound className="w-6 h-6 text-[#8F1020] mb-2" />
            <h3 className="font-bold text-xs text-[#2B1713] group-hover:text-[#8F1020]">Profile Settings</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Update personal details</p>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-serif font-bold text-[#2B1713] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8F1020]" /> Recent Orders
            </h2>
            <Link href="/account/orders" className="text-xs font-bold text-[#8F1020] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <p>You haven&apos;t placed any orders yet.</p>
              <Link href="/shop" className="inline-block px-4 py-2 bg-[#8F1020] text-white text-xs font-bold rounded-xl">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between p-4 rounded-2xl border border-[#E2D4C7] hover:bg-[#FAF6F0] transition-colors text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#8F1020] text-sm block">{ord.order_number}</span>
                    <span className="text-[10px] text-slate-400">{new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="text-right">
                    <strong className="block text-[#2B1713]">₹{ord.total.toLocaleString()}</strong>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                      {ord.fulfillment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
