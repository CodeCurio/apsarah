'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Eye, Loader2, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  order_number: string
  created_at: string
  email: string
  total: number
  payment_status: string
  fulfillment_status: string
  shipping_address: { fullName?: string }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[])
        setLoading(false)
      })
  }, [])

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address?.fullName?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || o.fulfillment_status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Order Management</h1>
        <p className="text-xs text-slate-500 mt-1">View, fulfill, track, and manage customer orders</p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d4c7] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-96 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search order #, customer email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#2b1713]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Fulfillment:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs font-medium text-[#2b1713] outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8f1020]" />
                      <span>Loading orders from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#8f1020]">{ord.order_number}</td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(ord.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1713]">{ord.shipping_address?.fullName || 'Customer'}</div>
                      <div className="text-[10px] text-slate-400">{ord.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#8f1020]">₹{ord.total.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ord.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ord.fulfillment_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : ord.fulfillment_status === 'shipped' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {ord.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 hover:bg-[#FAF6F0] text-slate-700 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
