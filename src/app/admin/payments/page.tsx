'use client'

import React from 'react'
import { CreditCard, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react'

const paymentLogs = [
  { id: 'PAY-1082', orderId: 'ORD-9842', customer: 'Priya Sharma', amount: '₹3,300', gateway: 'Razorpay UPI', status: 'Success', date: '30 July 2026' },
  { id: 'PAY-1081', orderId: 'ORD-9841', customer: 'Ananya Verma', amount: '₹2,759', gateway: 'Razorpay Card', status: 'Success', date: '30 July 2026' },
  { id: 'PAY-1080', orderId: 'ORD-9840', customer: 'Ritu Kapoor', amount: '₹2,000', gateway: 'Razorpay NetBanking', status: 'Success', date: '29 July 2026' },
]

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Payments & Revenue Logs</h1>
        <p className="text-xs text-slate-500 mt-1">Razorpay transaction records and payment settlements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Gross Revenue</span>
          <div className="text-2xl font-bold text-[#8f1020] mt-2">₹1,84,500</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">100% Settled</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Payment Gateway</span>
          <div className="text-2xl font-bold text-[#2b1713] mt-2 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" /> Razorpay
          </div>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">Live Production Mode</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Success Rate</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">99.4%</div>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">0 Refund Requests</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2d4c7]">
          <h2 className="text-sm font-bold text-[#2b1713] uppercase tracking-wider">Transaction Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Txn ID</th>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paymentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2b1713]">{log.id}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.orderId}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2b1713]">{log.customer}</td>
                  <td className="py-3.5 px-4 font-bold text-[#8f1020]">{log.amount}</td>
                  <td className="py-3.5 px-4 text-slate-600">{log.gateway}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
