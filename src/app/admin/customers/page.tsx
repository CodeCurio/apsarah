'use client'

import React, { useEffect, useState } from 'react'
import { Users, Search, Loader2, Mail, Phone, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Customer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: string
  created_at: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setCustomers(data as Customer[])
        setLoading(false)
      })
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Customer Directory</h1>
        <p className="text-xs text-slate-500 mt-1">View registered customers and user accounts</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d4c7] shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-96 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#2b1713]"
          />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8f1020]" />
                      <span>Loading customers from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1713]">{c.full_name || 'Anonymous User'}</div>
                      <div className="text-[10px] font-mono text-slate-400">{c.id.slice(0, 8)}...</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{c.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'}`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
