'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    q: 'How long does shipping take in India?',
    a: 'Standard delivery takes 3 to 5 business days for major metro cities and 5 to 7 days for other regions. Express shipping options are available at checkout.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes! We offer COD on orders up to ₹10,000 across 18,000+ pincodes in India.',
  },
  {
    q: 'What is your return & exchange policy?',
    a: 'We have a hassle-free 7-day return and exchange policy from the date of delivery. Items must be unworn with original tags attached.',
  },
  {
    q: 'How do I choose the correct size?',
    a: 'Every product page features an interactive Size Guide link with exact bust, waist, and hip measurements in inches.',
  },
  {
    q: 'Are the colors identical to the website images?',
    a: 'We shoot all products under studio lighting. Minor color variations may occur depending on your screen brightness and display settings.',
  },
]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F1020] uppercase">HELP CENTER</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-500">Find answers regarding orders, sizing, delivery, and returns</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div key={idx} className="bg-white rounded-2xl border border-[#E2D4C7] overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-serif font-bold text-sm text-[#2B1713] flex items-center justify-between cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#8F1020]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
