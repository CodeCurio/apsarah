import React from 'react'

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-6">
        <h1 className="text-3xl font-serif font-bold">Returns & Exchange Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>We want you to love your Apsarah garments. If you are not completely satisfied with your purchase, you can return or exchange within 7 days of delivery.</p>
          <h2 className="font-bold text-sm text-[#2B1713]">Return Conditions</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Items must be unused, unwashed, and undamaged.</li>
            <li>Original tags and packaging must be intact.</li>
          </ul>
          <h2 className="font-bold text-sm text-[#2B1713]">Refund Process</h2>
          <p>Once inspected at our warehouse, refunds for prepaid orders will be processed within 5-7 business days to your original payment method. COD refunds will be issued as store credit or bank transfer.</p>
        </div>
      </div>
    </div>
  )
}
