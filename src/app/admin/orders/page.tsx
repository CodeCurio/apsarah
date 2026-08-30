'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Eye, Loader2, Package, Trash2, AlertTriangle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

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
  const { toastSuccess, toastError } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Deletion Modal State
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchOrders = () => {
    setLoading(true)
    const supabase = createClient()
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data) setOrders(data as Order[])
        if (error) console.error('Error fetching orders:', error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderToDelete.id }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to delete order from database')
      }

      // Optimistically update list
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id))
      toastSuccess(`Order #${orderToDelete.order_number} has been permanently deleted from database.`)
      setOrderToDelete(null)
    } catch (err: any) {
      console.error('Delete order error:', err)
      toastError(err.message || 'Could not delete order.')
    } finally {
      setIsDeleting(false)
    }
  }

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
        <p className="text-xs text-slate-500 mt-1">View, fulfill, track, delete, and manage customer orders</p>
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
            className="bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs font-medium text-[#2b1713] outline-none cursor-pointer"
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
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-[#FAF6F0] text-slate-700 font-medium transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(ord)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 font-medium transition-colors cursor-pointer"
                          title="Delete Order Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Delete Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#2b1713]">Delete Order</h3>
                  <p className="text-xs text-slate-500">Permanent Database Deletion</p>
                </div>
              </div>
              <button
                onClick={() => !isDeleting && setOrderToDelete(null)}
                disabled={isDeleting}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#e2d4c7] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-[#8f1020]">{orderToDelete.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-medium text-[#2b1713]">{orderToDelete.shipping_address?.fullName || orderToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-[#8f1020]">₹{orderToDelete.total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this order? This will permanently erase the order, customer items, and tracking timeline directly from the Supabase database. <strong className="text-red-700">This action cannot be undone.</strong>
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting from Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
