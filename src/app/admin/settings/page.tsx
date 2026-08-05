'use client'

import React, { useEffect, useState } from 'react'
import { Settings, Save, Globe, Mail, Phone, MapPin, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

export default function AdminSettingsPage() {
  const { toastSuccess, toastError } = useToast()

  const [siteName, setSiteName] = useState('Apsarah')
  const [tagline, setTagline] = useState('Luxury Ethnic Wear')
  const [contactEmail, setContactEmail] = useState('hello@apsarah.in')
  const [contactPhone, setContactPhone] = useState('+91 98765 43210')
  const [businessAddress, setBusinessAddress] = useState('South Extension Part II, New Delhi, 110049')

  const [announcementActive, setAnnouncementActive] = useState(true)
  const [announcementText, setAnnouncementText] = useState('END OF SEASON SALE — FLAT 40% OFF ON ALL ANARKALI SETS')

  const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/apsarah_in')
  const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/apsarahin')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSiteName(data.site_name || 'Apsarah')
          setTagline(data.tagline || 'Luxury Ethnic Wear')
          setContactEmail(data.contact_email || 'hello@apsarah.in')
          setContactPhone(data.contact_phone || '+91 98765 43210')
          setBusinessAddress(data.business_address || 'New Delhi, India')
          setAnnouncementActive(data.announcement_bar_active ?? true)
          setAnnouncementText(data.announcement_bar_text || '')
          setSocialInstagram(data.social_instagram || '')
          setSocialFacebook(data.social_facebook || '')
        }
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        site_name: siteName,
        tagline,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        business_address: businessAddress,
        announcement_bar_active: announcementActive,
        announcement_bar_text: announcementText,
        social_instagram: socialInstagram,
        social_facebook: socialFacebook,
      })

    setSaving(false)
    if (error) {
      toastError('Failed to save settings: ' + error.message)
    } else {
      toastSuccess('Site settings updated live!')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Brand & Site Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure brand assets, business details, contact information, and store options</p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6 text-xs">
        {/* Brand & Store Identity */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#8f1020]" /> Store Identity
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Site Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#8f1020]" /> Contact Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Support Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Business Physical Address</label>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#8f1020]" /> Announcement Bar
          </h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="accent-[#8f1020] w-4 h-4"
            />
            <span className="font-bold text-slate-700">Enable Announcement Bar at top of Storefront</span>
          </label>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2d4c7] shadow-sm space-y-4">
          <h2 className="font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#8f1020]" /> Social Media Profiles
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                className="w-full bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8f1020]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-[#8f1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  )
}
