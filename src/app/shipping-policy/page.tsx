import React from 'react'

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-6">
        <h1 className="text-3xl font-serif font-bold">Shipping & Delivery Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>We deliver nationwide across 18,000+ pincodes in India via BlueDart, Delhivery, and Express logistics partners.</p>
          <h2 className="font-bold text-sm text-[#2B1713]">Delivery Timelines</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Metro Cities: 3 to 5 business days</li>
            <li>Rest of India: 5 to 7 business days</li>
          </ul>
          <h2 className="font-bold text-sm text-[#2B1713]">Shipping Charges</h2>
          <p>We offer FREE shipping on all orders above ₹999. A flat nominal shipping fee of ₹99 applies to orders below ₹999.</p>
        </div>
      </div>
    </div>
  )
}
