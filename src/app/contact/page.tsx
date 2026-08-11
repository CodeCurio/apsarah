'use client'

import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
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
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }
  }

  const openingHours = [
    { day: 'Monday', time: '10:00 AM – 10:00 PM' },
    { day: 'Tuesday', time: '10:00 AM – 10:00 PM' },
    { day: 'Wednesday', time: '10:00 AM – 10:00 PM' },
    { day: 'Thursday', time: '10:00 AM – 10:00 PM' },
    { day: 'Friday', time: '10:00 AM – 10:00 PM' },
    { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 10:00 PM' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2B1713]">
      {/* 1. HERO HEADER */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F3EBE1] to-[#FAF6F0] text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8F1020]/10 border border-[#8F1020]/20 text-[#8F1020] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#EFBD3B]" />
          VISIT OUR BOUTIQUE &amp; STUDIO
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2B1713]">
          We Would Love to Hear From You
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-light">
          Visit our flagship store in Lucknow or send us a message for sizing assistance, custom orders, or styling advice.
        </p>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Contact Details & Store Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Store Information Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D4C7] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-serif font-bold text-[#2B1713]">
                  Store &amp; Studio Details
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open 7 Days
                </span>
              </div>

              <div className="space-y-5 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#8F1020]/10 border border-[#8F1020]/20 flex items-center justify-center text-[#8F1020] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#2B1713] block text-xs uppercase tracking-wider">
                      Boutique Address
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Sultanpur Rd, Arjunganj, Lucknow, Uttar Pradesh 226002
                    </p>
                    <a
                      href="https://maps.google.com/?q=Apsarah+Trends+Sultanpur+Rd+Arjunganj+Lucknow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8F1020] hover:underline pt-1"
                    >
                      Get Directions <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#8F1020]/10 border border-[#8F1020]/20 flex items-center justify-center text-[#8F1020] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#2B1713] block text-xs uppercase tracking-wider">
                      Contact Hotline &amp; WhatsApp
                    </span>
                    <a
                      href="tel:8052147879"
                      className="text-base font-bold text-[#8F1020] hover:underline block"
                    >
                      +91 80521 47879
                    </a>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="https://wa.me/918052147879"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#8F1020]/10 border border-[#8F1020]/20 flex items-center justify-center text-[#8F1020] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[#2B1713] block text-xs uppercase tracking-wider">
                      Email Inquiry
                    </span>
                    <a
                      href="mailto:hello@apsarah.in"
                      className="text-slate-700 font-medium hover:text-[#8F1020]"
                    >
                      hello@apsarah.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D4C7] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-4 h-4 text-[#8F1020]" />
                <h3 className="text-sm font-serif font-bold text-[#2B1713] uppercase tracking-wider">
                  Boutique Opening Hours
                </h3>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {openingHours.map((item) => (
                  <div
                    key={item.day}
                    className="py-2 flex items-center justify-between font-medium text-slate-700"
                  >
                    <span className="text-slate-900 font-semibold">{item.day}</span>
                    <span className="text-[#8F1020] font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D4C7] shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-serif font-bold text-[#2B1713]">
                Send Us a Direct Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out the form below and our styling team will get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-4 py-3 outline-none focus:border-[#8F1020] focus:ring-1 focus:ring-[#8F1020] text-xs transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-4 py-3 outline-none focus:border-[#8F1020] focus:ring-1 focus:ring-[#8F1020] text-xs transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="Order Inquiry / Sizing Assistance / Custom Outfit"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-4 py-3 outline-none focus:border-[#8F1020] focus:ring-1 focus:ring-[#8F1020] text-xs transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we assist you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#E2D4C7] rounded-xl px-4 py-3 outline-none focus:border-[#8F1020] focus:ring-1 focus:ring-[#8F1020] text-xs transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#8F1020] hover:bg-[#a61528] disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* 3. GOOGLE MAP EMBED SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D4C7] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#8F1020] uppercase block">
                LOCATION MAP
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2B1713]">
                Find Apsarah Trends on Google Maps
              </h3>
            </div>
            <a
              href="https://maps.google.com/?q=Apsarah+Trends+Sultanpur+Rd+Arjunganj+Lucknow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8F1020] hover:underline"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Google Maps Frame */}
          <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#E2D4C7] relative bg-[#EAE0D5]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28485.364297440137!2d80.96777287048072!3d26.818617208899127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3d2ed38bdb7%3A0xe7de4a0a226641b4!2sApsarah%20Trends!5e0!3m2!1sen!2sin!4v1786430578424!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Apsarah Trends Location Map"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
