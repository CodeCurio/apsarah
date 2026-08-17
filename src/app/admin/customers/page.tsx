'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Loader2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  UserCheck,
  UserX,
  ShieldAlert,
  Sparkles,
  Filter,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export interface UnifiedCustomer {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  isRegistered: boolean
  created_at: string
  orderCount: number
  totalSpent: number
  lastOrderDate: string | null
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UnifiedCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'registered' | 'guest' | 'vip'>('all')

  const fetchCustomerDirectory = async () => {
    setRefreshing(true)
    try {
      const supabase = createClient()

      const [profilesRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ])

      const rawProfiles = profilesRes.data || []
      const rawOrders = ordersRes.data || []

      const customerMap = new Map<string, UnifiedCustomer>()

      // 1. Index Registered Profiles
      rawProfiles.forEach((p: any) => {
        const emailKey = (p.email || '').toLowerCase().trim()
        if (!emailKey) return

        customerMap.set(emailKey, {
          id: p.id,
          email: p.email,
          name: p.full_name || null,
          phone: p.phone || null,
          role: p.role || 'customer',
          isRegistered: true,
          created_at: p.created_at || new Date().toISOString(),
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: null,
        })
      })

      // 2. Index & Aggregate Orders (Guest Checkout + Registered Orders)
      rawOrders.forEach((o: any) => {
        const emailKey = (o.email || '').toLowerCase().trim()
        if (!emailKey) return

        let cust = customerMap.get(emailKey)

        if (!cust) {
          // Create entry for Guest Buyer
          cust = {
            id: `gst_${o.id.slice(0, 8)}`,
            email: o.email,
            name: o.shipping_address?.fullName || null,
            phone: o.shipping_address?.phone || null,
            role: 'customer',
            isRegistered: false,
            created_at: o.created_at || new Date().toISOString(),
            orderCount: 0,
            totalSpent: 0,
            lastOrderDate: o.created_at,
          }
          customerMap.set(emailKey, cust)
        }

        // Fill missing name or phone from shipping address
        if (!cust.name && o.shipping_address?.fullName) {
          cust.name = o.shipping_address.fullName
        }
        if (!cust.phone && o.shipping_address?.phone) {
          cust.phone = o.shipping_address.phone
        }

        // Aggregate orders & total spent
        cust.orderCount += 1
        const amt = Number(o.total || o.total_amount || 0)
        cust.totalSpent += amt

        if (!cust.lastOrderDate || new Date(o.created_at) > new Date(cust.lastOrderDate)) {
          cust.lastOrderDate = o.created_at
        }
      })

      const customerList = Array.from(customerMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setCustomers(customerList)
    } catch (err) {
      console.error('Failed to load customer directory:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCustomerDirectory()
  }, [])

  // Metrics summary
  const metrics = useMemo(() => {
    const totalCount = customers.length
    const registeredCount = customers.filter((c) => c.isRegistered).length
    const guestCount = customers.filter((c) => !c.isRegistered).length
    const vipCount = customers.filter((c) => c.totalSpent >= 5000).length

    return { totalCount, registeredCount, guestCount, vipCount }
  }, [customers])

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        c.id.toLowerCase().includes(q)

      let matchesType = true
      if (typeFilter === 'registered') matchesType = c.isRegistered
      else if (typeFilter === 'guest') matchesType = !c.isRegistered
      else if (typeFilter === 'vip') matchesType = c.totalSpent >= 5000

      return matchesSearch && matchesType
    })
  }, [customers, search, typeFilter])

  return (
    <div className="space-y-6">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified view of registered accounts and guest checkout buyers
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomerDirectory}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e2d4c7] hover:bg-[#faf5f0] text-[#2b1713] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8f1020] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Directory'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setTypeFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            typeFilter === 'all'
              ? 'bg-[#2b1713] text-white border-[#2b1713] shadow-md'
              : 'bg-white border-[#e2d4c7] hover:border-[#8f1020] text-[#2b1713]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-80">Total Buyers</span>
            <Users className="w-4 h-4 text-[#8f1020]" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.totalCount}</div>
          <span className="text-[10px] opacity-70">All Customer Profiles</span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter('registered')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            typeFilter === 'registered'
              ? 'bg-[#8f1020] text-white border-[#8f1020] shadow-md'
              : 'bg-white border-[#e2d4c7] hover:border-[#8f1020] text-[#2b1713]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-80">Registered</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.registeredCount}</div>
          <span className="text-[10px] opacity-70">Account Holders</span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter('guest')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            typeFilter === 'guest'
              ? 'bg-[#8f1020] text-white border-[#8f1020] shadow-md'
              : 'bg-white border-[#e2d4c7] hover:border-[#8f1020] text-[#2b1713]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-80">Guest Buyers</span>
            <UserX className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.guestCount}</div>
          <span className="text-[10px] opacity-70">Checkout Without Account</span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter('vip')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            typeFilter === 'vip'
              ? 'bg-[#8f1020] text-white border-[#8f1020] shadow-md'
              : 'bg-white border-[#e2d4c7] hover:border-[#8f1020] text-[#2b1713]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold opacity-80">VIP Buyers</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold mt-2">{metrics.vipCount}</div>
          <span className="text-[10px] opacity-70">Spent &gt; ₹5,000</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d4c7] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-96 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#2b1713] placeholder:text-slate-400 font-medium"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 text-xs">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#8f1020]" /> Type:
          </span>
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              typeFilter === 'all' ? 'bg-[#8f1020] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({metrics.totalCount})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('registered')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              typeFilter === 'registered' ? 'bg-[#8f1020] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Registered ({metrics.registeredCount})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('guest')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              typeFilter === 'guest' ? 'bg-[#8f1020] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Guest ({metrics.guestCount})
          </button>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2d4c7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#2b1713] uppercase tracking-wider">Customer Records</h2>
            <span className="bg-[#faf5f0] border border-[#e2d4c7] text-[#8f1020] font-bold text-[10px] px-2 py-0.5 rounded-full">
              {filteredCustomers.length} Users
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Customer Name & ID</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4 text-right">First Joined / Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8f1020]" />
                      <span>Aggregating customer database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No customer records matched your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#faf5f0]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1713] flex items-center gap-1.5">
                        <span>{c.name || 'Anonymous Customer'}</span>
                        {c.totalSpent >= 5000 && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{c.id}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.email}</td>

                    <td className="py-3.5 px-4 text-slate-600">{c.phone || 'N/A'}</td>

                    <td className="py-3.5 px-4">
                      {c.role === 'admin' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          Admin
                        </span>
                      ) : c.isRegistered ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 inline-flex">
                          <UserCheck className="w-3 h-3 text-emerald-600" /> Account
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 inline-flex">
                          <UserX className="w-3 h-3 text-amber-600" /> Guest Buyer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.orderCount > 0 ? (
                        <Link
                          href="/admin/orders"
                          className="font-bold text-[#8f1020] hover:underline flex items-center gap-1 inline-flex"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{c.orderCount} Orders</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400">0 Orders</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[#8f1020]">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
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
