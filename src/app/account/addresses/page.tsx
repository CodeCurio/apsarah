'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

interface Address {
  id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export default function AddressBookPage() {
  const { user } = useAuth()
  const { toastSuccess, toastError } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Delhi')
  const [pincode, setPincode] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setAddresses(data as Address[])
          setLoading(false)
        })
    }
  }, [user])

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        full_name: fullName,
        phone,
        address_line1: line1,
        address_line2: line2,
        city,
        state,
        pincode,
        is_default: addresses.length === 0,
      })
      .select()
      .single()

    setSaving(false)
    if (error) {
      toastError('Failed to add address: ' + error.message)
    } else if (data) {
      setAddresses((prev) => [data as Address, ...prev])
      setShowAddModal(false)
      toastSuccess('Address added successfully!')
      setFullName(''); setPhone(''); setLine1(''); setLine2(''); setCity(''); setPincode('')
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('addresses').delete().eq('id', id)
    if (!error) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toastSuccess('Address removed')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#8F1020]" /> Saved Delivery Addresses
            </h1>
            <p className="text-xs text-slate-500">Manage your shipping destinations for faster checkout</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#8F1020] hover:bg-[#a61528] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
            <Link href="/account" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center py-12 text-xs text-slate-400">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="col-span-2 bg-white rounded-3xl p-8 text-center border border-[#E2D4C7] space-y-3">
              <p className="text-xs text-slate-500">No saved addresses yet.</p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#8F1020] text-white text-xs font-bold rounded-xl"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-3xl p-6 border border-[#E2D4C7] shadow-sm relative space-y-2 text-xs">
                {addr.is_default && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Default Address
                  </span>
                )}
                <h3 className="font-bold text-sm text-[#2B1713]">{addr.full_name}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {addr.address_line1} {addr.address_line2 && `, ${addr.address_line2}`}<br />
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-[#8F1020] font-semibold pt-1">Phone: {addr.phone}</p>

                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D4C7] pb-3">
              <h3 className="text-base font-serif font-bold text-[#2B1713]">Add New Address</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" required placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
                <input type="tel" required placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
              </div>
              <input type="text" required placeholder="Flat / Building / Street *" value={line1} onChange={(e) => setLine1(e.target.value)} className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
              <input type="text" placeholder="Locality / Landmark (Optional)" value={line2} onChange={(e) => setLine2(e.target.value)} className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" required placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} className="bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
                <input type="text" required placeholder="State *" value={state} onChange={(e) => setState(e.target.value)} className="bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
                <input type="text" required maxLength={6} placeholder="Pincode *" value={pincode} onChange={(e) => setPincode(e.target.value)} className="bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2 text-xs outline-none" />
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-[#8F1020] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
