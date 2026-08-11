'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowLeft, Check, CreditCard, Truck, MapPin, X, Lock, Smartphone, Wallet } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PromoCouponWidget } from '@/components/cart/PromoCouponWidget'
import { AuthForm } from '@/components/auth/AuthModal'
import { saveUserAddress } from '@/lib/address-utils'

export default function CheckoutPage() {
  const { items, itemCount, subtotal, discount, shippingCost, total, appliedCoupon, clearCart } = useCart()
  const { toastError, toastSuccess } = useToast()
  const { user, profile } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')

  // Auth modal state for mid-checkout authentication
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Shipping Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Delhi')
  const [pincode, setPincode] = useState('')

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('razorpay')
  const [processing, setProcessing] = useState(false)

  // Inject Razorpay checkout script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Initial pre-fill & restore pending address from localStorage or user profile
  useEffect(() => {
    // Priority A: Pending checkout address saved in localStorage (from before auth redirect/login)
    const pendingRaw = localStorage.getItem('pending_checkout_address')
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw)
        if (pending.fullName) setFullName(pending.fullName)
        if (pending.email) setEmail(pending.email)
        if (pending.phone) setPhone(pending.phone)
        if (pending.addressLine1) setAddressLine1(pending.addressLine1)
        if (pending.addressLine2) setAddressLine2(pending.addressLine2)
        if (pending.city) setCity(pending.city)
        if (pending.state) setState(pending.state)
        if (pending.pincode) setPincode(pending.pincode)

        // If user is now logged in, save the pending address to user panel & move to payment step
        if (user) {
          saveUserAddress(user.id, pending)
          localStorage.removeItem('pending_checkout_address')
          setStep('payment')
          toastSuccess('Account linked & shipping address saved to your profile!')
        }
        return
      } catch (err) {
        console.error('Error parsing pending address:', err)
      }
    }

    // Priority B: If logged in and form fields are empty, load user's profile info and default saved address
    if (user) {
      if (profile?.full_name && !fullName) setFullName(profile.full_name)
      if (user.email && !email) setEmail(user.email)
      if (profile?.phone && !phone) setPhone(profile.phone)

      // Fetch user's default saved address from Supabase
      const supabase = createClient()
      supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            const addr = data[0]
            setFullName((prev) => prev || addr.full_name || '')
            setPhone((prev) => prev || addr.phone || '')
            setAddressLine1(addr.address_line1 || '')
            setAddressLine2(addr.address_line2 || '')
            setCity(addr.city || '')
            setState(addr.state || 'Delhi')
            setPincode(addr.pincode || '')
          }
        })
    }
  }, [user, profile])

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

  // Handle shipping step submission
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !phone || !addressLine1 || !city || !pincode) {
      toastError('Please fill in all required shipping fields')
      return
    }

    const currentAddress = {
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    }

    // Save draft address to localStorage so it survives auth modal / OAuth redirects
    localStorage.setItem('pending_checkout_address', JSON.stringify(currentAddress))

    // Require user to be logged in
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // User is logged in -> Save address to profile & proceed to payment
    await saveUserAddress(user.id, currentAddress)
    localStorage.removeItem('pending_checkout_address')
    setStep('payment')
  }

  // Called when Auth succeeds via modal
  const handleAuthSuccess = async () => {
    setShowAuthModal(false)

    const pendingRaw = localStorage.getItem('pending_checkout_address')
    let currentAddress = {
      fullName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    }

    if (pendingRaw) {
      try {
        currentAddress = JSON.parse(pendingRaw)
      } catch (e) {}
    }

    const supabase = createClient()
    const { data: sessionData } = await supabase.auth.getSession()
    const currentUserId = sessionData?.session?.user?.id || user?.id

    if (currentUserId) {
      await saveUserAddress(currentUserId, currentAddress)
      localStorage.removeItem('pending_checkout_address')
      toastSuccess('Account authenticated & address saved to your profile!')
    }

    setStep('payment')
  }

  // Create & Save Order in Supabase
  const saveOrderToDatabase = async (paymentStatus: 'pending' | 'paid', paymentId: string, method: string) => {
    if (!user) throw new Error('User authentication required')

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

    // Ensure address is saved in user's profile address book
    await saveUserAddress(user.id, shippingAddress)

    // 1. Insert order into Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        email,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        shipping_method: 'Standard Delivery',
        shipping_cost: shippingCost,
        shipping_amount: shippingCost,
        subtotal,
        discount_amount: discount,
        tax_amount: 0,
        total,
        total_amount: total,
        coupon_code: appliedCoupon?.code || null,
        payment_status: paymentStatus,
        fulfillment_status: 'pending',
        payment_id: paymentId,
        notes: `Payment method: ${method.toUpperCase()}`,
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error(orderError?.message || 'Failed to create order in database')
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
      total_price: item.product.price * item.quantity,
      image_url: item.product.images[0],
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)
    if (itemsError) console.error('Order items insert error:', itemsError)

    // 3. Trigger Order Confirmation Emails via Resend
    fetch('/api/emails/send-order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: order.order_number || order.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items: orderItemsData,
        shippingAddress,
        subtotal,
        discount,
        shippingCost,
        total,
        paymentMethod: method,
      }),
    }).catch((emailErr) => console.error('Failed to trigger order confirmation email:', emailErr))

    // 4. Clear cart & redirect to confirmation
    clearCart()
    router.push(`/checkout/success?order=${order.order_number || order.id}`)
  }

  // Handle Order Placement (COD vs Razorpay)
  const handlePlaceOrder = async () => {
    if (!user) {
      toastError('Please log in or create an account to place your order')
      setShowAuthModal(true)
      return
    }

    setProcessing(true)

    try {
      if (paymentMethod === 'cod') {
        // COD Order
        await saveOrderToDatabase('pending', 'COD-' + Date.now(), 'cod')
      } else {
        // Razorpay Online Payment Flow
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            receipt: `rcpt_${Date.now()}`,
            notes: { customer_email: email, customer_phone: phone },
          }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          toastError(data.error || 'Razorpay keys not set. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local')
          setProcessing(false)
          return
        }

        // Open Razorpay Popup
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'Apsarah',
          description: `Order Payment - Royal Heritage Couture`,
          image: '/assets/logo.png',
          order_id: data.orderId,
          theme: { color: '#8F1020' },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          handler: async function (response: any) {
            try {
              // Verify signature
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyRes.json()

              if (verifyData.success) {
                toastSuccess('Payment successful! Processing your order...')
                await saveOrderToDatabase('paid', response.razorpay_payment_id, 'razorpay')
              } else {
                toastError('Payment verification failed!')
              }
            } catch (vErr: any) {
              toastError('Payment verification error: ' + vErr.message)
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false)
              toastError('Payment cancelled')
            },
          },
        }

        if (typeof (window as any).Razorpay !== 'undefined') {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        } else {
          toastError('Razorpay SDK script loading. Please try again in a moment.')
          setProcessing(false)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toastError(`Order creation failed: ${msg}`)
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      {/* Auth Modal Overlay during checkout */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-md my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-3 top-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-700 shadow-md transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-[#8F1020] text-white p-4 rounded-t-2xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[#efbd3b] font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>Account Required to Order</span>
              </div>
              <p className="text-[11px] text-white/90">
                Log in or create an account to place your order. Your entered shipping address will be automatically saved to your profile!
              </p>
            </div>
            <AuthForm
              onSuccess={handleAuthSuccess}
              defaultMode="signup"
              initialEmail={email}
              redirectToUrl={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/checkout` : undefined}
            />
          </div>
        </div>
      )}

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

        {/* Steps Breadcrumb */}
        <div className="flex items-center gap-3 text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 'shipping' ? 'text-[#8F1020]' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'shipping' ? 'bg-[#8F1020] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Shipping Address</span>
          </div>
          <span className="text-slate-300">/</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'payment' ? 'text-[#8F1020]' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-[#8F1020] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Payment & Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Section (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#E2D4C7] shadow-sm space-y-6">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <h2 className="text-base font-serif font-bold text-[#2B1713] flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MapPin className="w-4 h-4 text-[#8F1020]" /> Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 110001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building, Street Name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Landmark, Area name"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
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
                  {/* Razorpay Online */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-[#8F1020] bg-rose-50/50' : 'border-[#E2D4C7] hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-[#8F1020]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2B1713]">Online Payment (Razorpay)</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8F1020] text-white">Recommended</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Instant checkout via UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Smartphone className="w-4 h-4 text-[#8F1020]" />
                      <CreditCard className="w-4 h-4 text-[#8F1020]" />
                    </div>
                  </label>

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
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E2D4C7] space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Order Total:</span>
                    <span className="text-[#8F1020] text-base">₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    By placing your order, you agree to Apsarah&apos;s Terms of Service and Returns Policy.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full py-4 bg-[#8F1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {processing ? 'Processing Order...' : paymentMethod === 'razorpay' ? `Pay ₹${total.toLocaleString()} via Razorpay` : 'Place Order (COD)'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">Order Summary ({itemCount})</h2>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="py-3 first:pt-0 flex items-center gap-3 text-xs">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover rounded-xl border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#2B1713] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                      <p className="font-bold text-[#8F1020] mt-0.5">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Widget */}
              <div className="pt-2 border-t border-slate-100">
                <PromoCouponWidget />
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">FREE</strong> : `₹${shippingCost}`}</span>
                </div>

                <div className="flex justify-between font-bold text-sm text-[#2B1713] border-t border-slate-100 pt-3">
                  <span>Total Payable</span>
                  <span className="text-[#8F1020] text-base">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/60 flex items-center gap-3 text-xs text-rose-900">
              <ShieldCheck className="w-6 h-6 text-[#8F1020] shrink-0" />
              <p className="text-[11px] leading-relaxed">
                100% Authentic Handcrafted Heritage Wear. Guaranteed safe and encrypted transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
