'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowLeft, Loader2, Truck, ExternalLink, Printer, CheckCircle2, Clock, MapPin, Eye, FileText } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
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

interface OrderTimeline {
  id: string
  status: string
  note: string | null
  created_at: string
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total: number
  subtotal: number
  discount_amount: number
  shipping_cost: number
  payment_status: string
  fulfillment_status: string
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
  order_items?: OrderItem[]
  order_timeline?: OrderTimeline[]
}

export default function UserOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      // Fetch user's orders along with order_items and order_timeline
      supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_timeline (*)
        `)
        .or(`user_id.eq.${user.id}${user.email ? `,email.eq.${user.email}` : ''}`)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) console.error('Error fetching orders:', error)
          if (data) setOrders(data as Order[])
          setLoading(false)
        })
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  // Helper to render 4-stage visual progress bar
  const renderProgressBar = (status: string) => {
    const cleanStatus = status?.toLowerCase() || 'pending'
    let currentStep = 1

    if (cleanStatus === 'processing' || cleanStatus === 'packed') currentStep = 2
    else if (cleanStatus === 'shipped' || cleanStatus === 'out_for_delivery') currentStep = 3
    else if (cleanStatus === 'delivered') currentStep = 4
    else if (cleanStatus === 'cancelled') currentStep = -1

    if (currentStep === -1) {
      return (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
          <span>❌ Order Cancelled</span>
        </div>
      )
    }

    const steps = [
      { label: 'Placed', step: 1 },
      { label: 'Packed', step: 2 },
      { label: 'Shipped', step: 3 },
      { label: 'Delivered', step: 4 },
    ]

    return (
      <div className="space-y-2 py-2">
        <div className="flex items-center justify-between text-[11px] font-bold">
          {steps.map((s) => (
            <span
              key={s.step}
              className={`${s.step <= currentStep ? 'text-[#8F1020]' : 'text-slate-400'}`}
            >
              {s.label}
            </span>
          ))}
        </div>

        {/* Bar */}
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8F1020] to-[#efbd3b] transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-[4000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 text-[#2b1713] print:p-0 print:shadow-none">
            <div className="flex justify-between items-start border-b border-[#e2d4c7] pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#8f1020]">APSARAH</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Royal & Heritage Ethnic Wear</p>
                <p className="text-xs text-slate-500 mt-1">Official Order Receipt</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-lg text-[#8f1020] block">{selectedInvoiceOrder.order_number}</span>
                <span className="text-xs text-slate-500">{new Date(selectedInvoiceOrder.created_at).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Delivery Destination</span>
                <p className="font-bold">{selectedInvoiceOrder.shipping_address?.fullName}</p>
                <p>{selectedInvoiceOrder.shipping_address?.addressLine1}</p>
                {selectedInvoiceOrder.shipping_address?.addressLine2 && <p>{selectedInvoiceOrder.shipping_address.addressLine2}</p>}
                <p>{selectedInvoiceOrder.shipping_address?.city}, {selectedInvoiceOrder.shipping_address?.state} - {selectedInvoiceOrder.shipping_address?.pincode}</p>
                <p className="mt-1 font-mono text-slate-600">Phone: {selectedInvoiceOrder.shipping_address?.phone}</p>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-500 uppercase block mb-1">Order Details</span>
                <p>Status: <strong className="uppercase">{selectedInvoiceOrder.fulfillment_status}</strong></p>
                <p>Payment: <strong className="uppercase">{selectedInvoiceOrder.payment_status} ({selectedInvoiceOrder.notes || 'COD'})</strong></p>
                {selectedInvoiceOrder.tracking_number && (
                  <p className="mt-1">Carrier: {selectedInvoiceOrder.tracking_carrier} (AWB: {selectedInvoiceOrder.tracking_number})</p>
                )}
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf5f0] border-y border-[#e2d4c7]">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(selectedInvoiceOrder.order_items || []).map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-medium">{item.title}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.variant_info?.size || 'Free Size'}</td>
                    <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">₹{item.unit_price?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{item.line_total?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-[#e2d4c7] pt-3 flex justify-between items-center text-xs">
              <p className="text-slate-400">Thank you for shopping with Apsarah!</p>
              <div className="text-right space-y-1">
                <div>Subtotal: ₹{selectedInvoiceOrder.subtotal?.toLocaleString()}</div>
                <div>Shipping: ₹{selectedInvoiceOrder.shipping_cost?.toLocaleString()}</div>
                <div className="text-base font-bold text-[#8f1020]">Total: ₹{selectedInvoiceOrder.total?.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 print:hidden pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#8f1020] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2D4C7] pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">My Orders</h1>
            <p className="text-xs text-slate-500">Live order tracking and purchase history</p>
          </div>
          <Link href="/account" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#8F1020]" />
              <span>Fetching your orders...</span>
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
            <div className="space-y-6">
              {orders.map((ord) => {
                const liveTrackingUrl = getTrackingUrl(ord.tracking_carrier || '', ord.tracking_number || '')
                return (
                  <div key={ord.id} className="p-6 rounded-2xl border border-[#E2D4C7] hover:border-[#8F1020]/40 transition-all space-y-5 bg-[#FAF6F0]/40">
                    {/* Header: Order # & Status Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-[#8F1020]">{ord.order_number}</span>
                          <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-md border border-[#E2D4C7] text-slate-600 font-medium uppercase">
                            {ord.notes || 'COD'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-1 bg-white hover:bg-slate-50 text-[#2B1713] text-xs font-bold rounded-xl border border-[#E2D4C7] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#8F1020]" />
                          <span>Receipt</span>
                        </button>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.fulfillment_status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {ord.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {renderProgressBar(ord.fulfillment_status)}

                    {/* Live Tracking Banner (If Shipped) */}
                    {ord.tracking_number && (
                      <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-[#2B1713] block">Carrier: {ord.tracking_carrier || 'Standard Courier'}</span>
                            <span className="text-[11px] text-slate-500 font-mono">AWB Tracking #: {ord.tracking_number}</span>
                          </div>
                        </div>

                        <a
                          href={liveTrackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#8F1020] hover:bg-[#a61528] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <span>Track Package Live</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Order Items Breakdown */}
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2D4C7]/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Items in Shipment</span>
                      <div className="divide-y divide-slate-100">
                        {(ord.order_items || []).map((item) => (
                          <div key={item.id} className="py-2.5 first:pt-0 flex items-center gap-3 text-xs">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.title} className="w-11 h-14 object-cover rounded-lg border border-slate-200 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#2B1713] truncate">{item.title}</p>
                              <p className="text-[10px] text-slate-500">Size: {item.variant_info?.size || 'Free Size'} • Qty: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-[#8F1020]">₹{item.line_total?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Address & Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1 border-t border-slate-100">
                      <div className="text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8F1020] shrink-0" />
                        <span>Deliver to: <strong>{ord.shipping_address?.fullName}</strong> ({ord.shipping_address?.city}, {ord.shipping_address?.pincode})</span>
                      </div>

                      <div className="text-right font-bold text-sm text-[#2B1713]">
                        Total Amount: <span className="text-[#8F1020] text-base">₹{ord.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
