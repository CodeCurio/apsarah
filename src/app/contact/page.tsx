'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'

export default function ContactPage() {
  const { toastSuccess, toastError } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, subject, message })

    setSubmitting(false)
    if (error) {
      toastError('Failed to send message: ' + error.message)
    } else {
      toastSuccess('Thank you! Your message has been sent. We will get back to you shortly.')
      setName(''); setEmail(''); setSubject(''); setMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase">GET IN TOUCH</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">We Would Love to Hear From You</h1>
          <p className="text-xs text-slate-500">Have questions about sizing, fabric care, or custom orders? Reach out to our heritage styling team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details (4 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-6 text-xs">
            <h2 className="text-base font-serif font-bold border-b border-slate-100 pb-3">Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E2D4C7] flex items-center justify-center text-[#8F1020] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#2B1713] block">Email Us</span>
                  <span className="text-slate-500">hello@apsarah.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E2D4C7] flex items-center justify-center text-[#8F1020] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#2B1713] block">Call / WhatsApp</span>
                  <span className="text-slate-500">+91 98765 43210 (Mon-Sat, 10am - 7pm IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E2D4C7] flex items-center justify-center text-[#8F1020] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#2B1713] block">Design Studio</span>
                  <span className="text-slate-500">South Extension Part II, New Delhi, 110049, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-4">
            <h2 className="text-base font-serif font-bold border-b border-slate-100 pb-3">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8F1020]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8F1020]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Order Inquiry / Sizing Assistance"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8F1020]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your query here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#8F1020]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#8F1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
