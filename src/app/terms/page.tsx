import React from 'react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-6">
        <h1 className="text-3xl font-serif font-bold">Terms of Service</h1>
        <div className="bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>By accessing or using the Apsarah website, you agree to comply with our terms and conditions. All content, imagery, and product designs are the intellectual property of Apsarah.</p>
          <h2 className="font-bold text-sm text-[#2B1713]">Pricing & Availability</h2>
          <p>Prices and stock availability are subject to change without prior notice. In the event of a pricing error, we reserve the right to cancel affected orders.</p>
        </div>
      </div>
    </div>
  )
}
