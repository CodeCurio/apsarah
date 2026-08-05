'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { UserRound, ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const { toastSuccess, toastError } = useToast()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      toastError('Failed to update profile: ' + error.message)
    } else {
      await refreshProfile()
      toastSuccess('Profile updated successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <UserRound className="w-6 h-6 text-[#8F1020]" /> Profile Settings
            </h1>
            <p className="text-xs text-slate-500">Update your personal profile information</p>
          </div>
          <Link href="/account" className="text-xs font-bold text-[#8F1020] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E2D4C7] shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#8F1020]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-[#8F1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
