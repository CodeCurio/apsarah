'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowLeft, Check, CreditCard, Truck, MapPin } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PromoCouponWidget } from '@/components/cart/PromoCouponWidget'

export default function CheckoutPage() {
  const { items, itemCount, subtotal, discount, shippingCost, total, appliedCoupon, clearCart } = useCart()
  const { toastError } = useToast()
  const { user, profile } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')

  // Shipping Form State
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Delhi')
  const [pincode, setPincode] = useState('')

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'upi'>('cod')
  const [processing, setProcessing] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-20 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-slate-500 text-sm">Your bag is empty. Please add items before checkout.</p>
          <Link href="/shop" className="inline-block px-6 py-2.5 bg-[#8F1020] text-white text-xs font-bold rounded-xl">
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !phone || !addressLine1 || !city || !pincode) {
      toastError('Please fill in all required shipping fields')
      return
    }
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    try {
      const supabase = createClient()

      const shippingAddress = {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        country: 'India',
      }

      // 1. Insert order into Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          email,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          shipping_method: 'Standard Delivery',
          shipping_cost: shippingCost,
          subtotal,
          discount_amount: discount,
          tax_amount: 0,
          total,
          coupon_code: appliedCoupon?.code || null,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
          fulfillment_status: 'pending',
          payment_id: paymentMethod === 'cod' ? 'COD-' + Date.now() : 'PAY-' + Date.now(),
          notes: `Payment method: ${paymentMethod.toUpperCase()}`,
        })
        .select()
        .single()

      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to create order')
      }

      // 2. Insert order items
      const orderItemsData = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        title: item.product.name,
        variant_info: { size: item.selectedSize },
        quantity: item.quantity,
        unit_price: item.product.price,
        line_total: item.product.price * item.quantity,
        image_url: item.product.images[0],
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)
      if (itemsError) console.error('Order items error:', itemsError)

      // 3. Clear cart & redirect to confirmation
      clearCart()
      router.push(`/checkout/success?order=${order.order_number || order.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toastError(`Order creation failed: ${msg}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2D4C7] pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Checkout</h1>
            <p className="text-xs text-slate-500">Secure 256-bit SSL encrypted checkout</p>
          </div>
          <Link href="/cart" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
          </Link>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#8F1020]' : 'text-emerald-700'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 'shipping' ? 'bg-[#8F1020] text-white' : 'bg-emerald-600 text-white'}`}>
              {step === 'payment' ? '✓' : '1'}
            </span>
            <span>1. Shipping Address</span>
          </div>
          <span className="text-slate-300">──</span>
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#8F1020]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-[#8F1020] text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            <span>2. Payment & Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Column (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[#E2D4C7] shadow-sm space-y-6">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <h2 className="text-base font-serif font-bold text-[#2B1713] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8F1020]" /> Contact & Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Flat / House No. / Building / Street *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat 402, Royal Residency, Green Park"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Locality / Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="Near Metro Station"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="110016"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#8F1020] hover:bg-[#a61528] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  Continue to Payment →
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#2B1713] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#8F1020]" /> Select Payment Method
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Shipping to: {fullName}, {addressLine1}, {city} - {pincode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-xs font-bold text-[#8F1020] underline"
                  >
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#8F1020] bg-rose-50/50' : 'border-[#E2D4C7] hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#8F1020]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#2B1713] block">Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-slate-500">Pay cash upon delivery at your doorstep</span>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-slate-400" />
                  </label>

                  {/* Online UPI / Cards / Razorpay */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#8F1020] bg-rose-50/50' : 'border-[#E2D4C7] hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[#8F1020]"
                      />
                      <div>
                        <span className="font-bold text-xs text-[#2B1713] block">Online Payment (UPI / GPay / PhonePe / Credit & Debit Cards)</span>
                        <span className="text-[10px] text-slate-500">Instant confirmation via Razorpay secure gateway</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </label>
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-[#8F1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer"
                >
                  {processing ? 'Processing Order...' : `Place Order (Total: ₹${total.toLocaleString()})`}
                </button>
              </div>
            )}
          </div>

          {/* Right Summary & Coupons (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <PromoCouponWidget compact={true} />

            <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#2B1713] border-b border-slate-100 pb-3">Items in Order ({itemCount})</h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="pt-3 first:pt-0 flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-[#2B1713] truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                    <p className="text-[#8F1020] font-bold mt-0.5">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
              <div className="flex justify-between font-bold text-sm text-[#2B1713] border-t border-slate-100 pt-2">
                <span>Total</span><span className="text-[#8F1020]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
