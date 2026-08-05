import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] pt-28 pb-24 text-[#2B1713]">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-6">
        <h1 className="text-3xl font-serif font-bold">Privacy Policy</h1>
        <div className="bg-white rounded-3xl p-8 border border-[#E2D4C7] shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>Apsarah is committed to protecting your privacy. We collect personal information such as name, email, phone number, and address strictly for order processing and improving your shopping experience.</p>
          <h2 className="font-bold text-sm text-[#2B1713]">Data Security</h2>
          <p>Your payment data is processed securely through SSL encrypted gateways (Razorpay). We never store your full credit card or bank account credentials on our servers.</p>
        </div>
      </div>
    </div>
  )
}
