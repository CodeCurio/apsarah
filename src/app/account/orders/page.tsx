'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowLeft, Loader2, ChevronRight, Eye } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number: string
  created_at: string
  total: number
  payment_status: string
  fulfillment_status: string
  shipping_address: { fullName?: string; city?: string }
}

export default function UserOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setOrders(data as Order[])
          setLoading(false)
        })
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">My Orders</h1>
            <p className="text-xs text-slate-500">Track and view history of all your placed orders</p>
          </div>
          <Link href="/account" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#8F1020]" />
              <span>Fetching order history...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You haven&apos;t placed any orders yet.</p>
              <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#8F1020] text-white text-xs font-bold rounded-xl shadow-md">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl border border-[#E2D4C7] hover:bg-[#FAF6F0]/60 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#8F1020]">{ord.order_number}</span>
                      <span className="text-[11px] text-slate-400 block sm:inline sm:ml-3">
                        Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.fulfillment_status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {ord.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Deliver to</span>
                      <span className="font-semibold text-slate-700">{ord.shipping_address?.fullName || 'Customer'}, {ord.shipping_address?.city || ''}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Total Amount</span>
                      <strong className="text-base text-[#8F1020]">₹{ord.total.toLocaleString()}</strong>
                    </div>
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
