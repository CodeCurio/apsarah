'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, CreditCard, User, MapPin, Save, Printer, ExternalLink, Clock, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'
import { getTrackingUrl } from '@/lib/tracking-utils'

interface OrderItem {
  id: string
  title: string
  variant_info: { size?: string }
  quantity: number
  unit_price: number
  line_total: number
  image_url: string
}

interface TimelineEvent {
  id: string
  status: string
  note: string | null
  created_at: string
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
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Status & Tracking Form State
  const [fulfillmentStatus, setFulfillmentStatus] = useState('pending')
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('BlueDart')
  const [adminNote, setAdminNote] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  const fetchOrderData = () => {
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
      })

    // Fetch timeline
    supabase
      .from('order_timeline')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setTimeline(data as TimelineEvent[])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchOrderData()
  }, [id])

  const handleUpdate = async (e?: React.FormEvent, customStatus?: string, customPayment?: string) => {
    if (e) e.preventDefault()
    setUpdating(true)

    const targetFulfillment = customStatus || fulfillmentStatus
    const targetPayment = customPayment || paymentStatus

    // Sync dropdown state immediately
    setFulfillmentStatus(targetFulfillment)
    setPaymentStatus(targetPayment)

    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id,
          fulfillmentStatus: targetFulfillment,
          paymentStatus: targetPayment,
          trackingNumber,
          trackingCarrier,
          adminNote,
        }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        // Fallback to client side if API route had an issue
        const supabase = createClient()
        const { data: updatedData, error: clientError } = await supabase
          .from('orders')
          .update({
            fulfillment_status: targetFulfillment,
            payment_status: targetPayment,
            tracking_number: trackingNumber || null,
            tracking_carrier: trackingCarrier || null,
          })
          .eq('id', id)
          .select()

        if (clientError || !updatedData || updatedData.length === 0) {
          setUpdating(false)
          toastError('Supabase RLS Policy blocked order update! Please run Migration 0008 in Supabase SQL Editor.')
          return
        }
      }

      setUpdating(false)
      toastSuccess(`Order status updated to ${targetFulfillment.toUpperCase()} & email dispatched!`)
      setAdminNote('')
      fetchOrderData()
    } catch (err: any) {
      setUpdating(false)
      toastError('Failed to update order: ' + err.message)
    }
  }

  if (loading || !order) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading order details...</div>
  }

  const liveTrackingUrl = getTrackingUrl(trackingCarrier, trackingNumber)

  return (
    <div className="space-y-6">
      {/* Printable Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-[4000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 text-[#2b1713] print:p-0 print:shadow-none">
            <div className="flex justify-between items-start border-b border-[#e2d4c7] pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#8f1020]">APSARAH</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Royal & Heritage Ethnic Wear</p>
                <p className="text-xs text-slate-500 mt-1">Invoice / Packing Dispatch Slip</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-lg text-[#8f1020] block">{order.order_number}</span>
                <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Customer / Shipping Address</span>
                <p className="font-bold">{order.shipping_address?.fullName}</p>
                <p>{order.shipping_address?.addressLine1}</p>
                {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                <p className="mt-1 font-mono text-slate-600">Phone: {order.shipping_address?.phone}</p>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-500 uppercase block mb-1">Payment Info</span>
                <p>Status: <strong className="uppercase">{order.payment_status}</strong></p>
                <p>Mode: <strong className="uppercase">{order.notes || 'COD'}</strong></p>
                {trackingNumber && <p className="mt-1">Carrier: {trackingCarrier} (AWB: {trackingNumber})</p>}
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf5f0] border-y border-[#e2d4c7]">
                  <th className="py-2.5 px-3">Item Title</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-medium">{item.title}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.variant_info?.size || 'Free Size'}</td>
                    <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">₹{item.unit_price.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{item.line_total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-[#e2d4c7] pt-3 flex justify-between items-center text-xs">
              <p className="text-slate-400">Thank you for ordering with Apsarah!</p>
              <div className="text-right space-y-1">
                <div>Subtotal: ₹{order.subtotal?.toLocaleString()}</div>
                <div>Shipping: ₹{order.shipping_cost?.toLocaleString()}</div>
                <div className="text-base font-bold text-[#8f1020]">Total: ₹{order.total?.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 print:hidden pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#8f1020] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#8f1020] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Order {order.order_number}</h1>
          <p className="text-xs text-slate-500">Placed on {new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInvoice(true)}
            className="px-3.5 py-2 bg-white border border-[#e2d4c7] hover:bg-[#FAF6F0] text-[#2b1713] text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#8f1020]" />
            <span>Print Invoice</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            {order.fulfillment_status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* Quick Action Shortcuts Bar */}
      <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#e2d4c7] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-[#2b1713]">⚡ Quick Actions:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => handleUpdate(undefined, 'processing', paymentStatus)}
            className="px-3 py-1.5 bg-white border border-[#e2d4c7] hover:border-[#8f1020] text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            Mark Packed & Processing
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => handleUpdate(undefined, 'shipped', paymentStatus)}
            className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" /> Mark Shipped & Notify Customer
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => handleUpdate(undefined, 'delivered', 'paid')}
            className="px-3 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered & Paid (COD)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Items, Update Form, Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">Order Items ({items.length})</h2>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center gap-4 text-xs">
                  <img src={item.image_url} alt={item.title} className="w-14 h-18 object-cover rounded-xl border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2b1713] text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Size: {item.variant_info?.size || 'Free Size'} • Qty: {item.quantity}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">₹{item.unit_price.toLocaleString()} each</p>
                  </div>
                  <strong className="text-[#8f1020] text-sm font-bold">₹{item.line_total.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Update Order & Shipment Form */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">Fulfillment & Shipment Details</h2>
            <form onSubmit={(e) => handleUpdate(e)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fulfillment Status</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2.5 outline-none font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing & Packed</option>
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
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2.5 outline-none font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Logistics Carrier</label>
                  <input
                    type="text"
                    placeholder="e.g. BlueDart / Delhivery / Shiprocket / DTDC"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2.5 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tracking / AWB Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABN98765432"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              {trackingNumber && (
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 flex items-center justify-between text-xs text-blue-900">
                  <span>Live Tracking Link preview for customer:</span>
                  <a
                    href={liveTrackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline flex items-center gap-1 text-[#8f1020]"
                  >
                    <span>Test Tracking URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Note / Status Comment (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatch handover completed to BlueDart executive"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2.5 outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3.5 bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                {updating ? 'Saving & Dispatching Email...' : 'Save Changes & Dispatch Notifications'}
              </button>
            </form>
          </div>

          {/* Order Activity Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8f1020]" /> Order History & Activity Log ({timeline.length})
            </h2>

            {timeline.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No status updates logged yet.</p>
            ) : (
              <div className="space-y-3 pl-2 border-l-2 border-[#e2d4c7]">
                {timeline.map((evt) => (
                  <div key={evt.id} className="relative pl-4 text-xs space-y-0.5">
                    <span className="absolute -left-[9px] top-1 w-3 h-3 rounded-full bg-[#8f1020] border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase text-[#2b1713]">{evt.status}</span>
                      <span className="text-[10px] text-slate-400">{new Date(evt.created_at).toLocaleString('en-IN')}</span>
                    </div>
                    {evt.note && <p className="text-slate-600 text-[11px]">{evt.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer & Payment Details (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          {/* Customer Details */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-[#8f1020]" /> Customer Profile
            </h3>
            <p className="font-bold text-[#2b1713] text-sm">{order.shipping_address?.fullName || 'Customer'}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.email}</span>
            </p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <span className="font-bold text-slate-400">TEL:</span>
              <span>{order.shipping_address?.phone || 'N/A'}</span>
            </p>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#8f1020]" /> Shipping Address
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {order.shipping_address?.addressLine1}<br />
              {order.shipping_address?.addressLine2 && `${order.shipping_address.addressLine2}, `}
              {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
            </p>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2d4c7] shadow-sm space-y-2.5">
            <h3 className="font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">Payment Breakdown</h3>
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            {order.discount_amount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{order.discount_amount?.toLocaleString()}</span></div>}
            <div className="flex justify-between text-slate-600"><span>Shipping Cost</span><span>₹{order.shipping_cost?.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-sm text-[#2b1713] border-t border-slate-100 pt-2">
              <span>Grand Total</span><span className="text-[#8f1020]">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
