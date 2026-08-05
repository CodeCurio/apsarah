'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CreditCard, User, MapPin, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

interface OrderItem {
  id: string
  title: string
  variant_info: { size?: string }
  quantity: number
  unit_price: number
  line_total: number
  image_url: string
}

interface OrderDetail {
  id: string
  order_number: string
  created_at: string
  email: string
  total: number
  subtotal: number
  discount_amount: number
  shipping_cost: number
  payment_status: string
  fulfillment_status: string
  payment_id: string
  tracking_number: string | null
  tracking_carrier: string | null
  notes: string | null
  shipping_address: {
    fullName?: string
    phone?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    pincode?: string
  }
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toastSuccess, toastError } = useToast()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  // Status & Tracking Form State
  const [fulfillmentStatus, setFulfillmentStatus] = useState('pending')
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('BlueDart')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    // Fetch order
    supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          const ord = data as OrderDetail
          setOrder(ord)
          setFulfillmentStatus(ord.fulfillment_status)
          setPaymentStatus(ord.payment_status)
          setTrackingNumber(ord.tracking_number || '')
          setTrackingCarrier(ord.tracking_carrier || 'BlueDart')
        }
      })

    // Fetch order items
    supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id)
      .then(({ data }) => {
        if (data) setItems(data as OrderItem[])
        setLoading(false)
      })
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('orders')
      .update({
        fulfillment_status: fulfillmentStatus,
        payment_status: paymentStatus,
        tracking_number: trackingNumber || null,
        tracking_carrier: trackingCarrier || null,
      })
      .eq('id', id)

    setUpdating(false)
    if (error) {
      toastError('Failed to update order: ' + error.message)
    } else {
      toastSuccess('Order updated successfully!')
    }
  }

  if (loading || !order) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading order details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#8f1020] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Order {order.order_number}</h1>
          <p className="text-xs text-slate-500">Placed on {new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            {order.fulfillment_status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
            {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Items & Update Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">Order Items</h2>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 flex items-center gap-4 text-xs">
                  <img src={item.image_url} alt={item.title} className="w-12 h-16 object-cover rounded-lg border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2b1713]">{item.title}</p>
                    <p className="text-[10px] text-slate-400">Size: {item.variant_info?.size || 'N/A'} • Qty: {item.quantity}</p>
                  </div>
                  <strong className="text-[#8f1020]">₹{item.line_total.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Update Fulfillment & Tracking Form */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">Update Order Status & Shipping</h2>
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fulfillment Status</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 outline-none font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 outline-none font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Carrier</label>
                  <input
                    type="text"
                    placeholder="BlueDart / Delhivery / DTDC"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABN1098234"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 outline-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {updating ? 'Saving...' : 'Save Order Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Customer & Shipping Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-[#8f1020]" /> Customer Info
            </h3>
            <p className="font-bold text-[#2b1713]">{order.shipping_address?.fullName || 'Customer'}</p>
            <p className="text-slate-600">{order.email}</p>
            <p className="text-slate-600">Phone: {order.shipping_address?.phone || 'N/A'}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#8f1020]" /> Shipping Address
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {order.shipping_address?.addressLine1}<br />
              {order.shipping_address?.addressLine2 && `${order.shipping_address.addressLine2}, `}
              {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
            </p>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">Payment Breakdown</h3>
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            {order.discount_amount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{order.discount_amount?.toLocaleString()}</span></div>}
            <div className="flex justify-between text-slate-600"><span>Shipping</span><span>₹{order.shipping_cost?.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-sm text-[#2b1713] border-t border-slate-100 pt-2">
              <span>Total</span><span className="text-[#8f1020]">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
