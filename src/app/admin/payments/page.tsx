'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  IndianRupee,
  ShieldCheck,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export interface PaymentTxn {
  id: string
  orderId: string
  orderDbId?: string
  customer: string
  email: string
  amount: number
  gateway: string
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded'
  createdAt: string
  rawDate?: Date
}

export default function AdminPaymentsPage() {
  const [dbOrders, setDbOrders] = useState<any[]>([])
  const [razorpayData, setRazorpayData] = useState<{ configured: boolean; mode?: string; payments: any[] }>({
    configured: false,
    payments: [],
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')

  const fetchData = async () => {
    setRefreshing(true)
    try {
      // 1. Fetch live orders from Supabase DB
      const supabase = createClient()
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (orders) {
        setDbOrders(orders)
      }

      // 2. Fetch live Razorpay transactions API
      const rzpRes = await fetch('/api/admin/payments')
      const rzpJson = await rzpRes.json()
      if (rzpJson) {
        setRazorpayData(rzpJson)
      }
    } catch (err) {
      console.error('Error loading payments data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Build unified transaction logs by merging Supabase orders & Razorpay API items
  const transactionLogs = useMemo<PaymentTxn[]>(() => {
    const list: PaymentTxn[] = []
    const seenTxnIds = new Set<string>()

    // 1. Map DB Orders first
    dbOrders.forEach((o) => {
      const pId = o.payment_id || `PAY-${o.order_number || o.id.slice(0, 8)}`
      seenTxnIds.add(pId)

      let rawStatus: PaymentTxn['status'] = 'Pending'
      const statusLower = (o.payment_status || '').toLowerCase()
      if (statusLower === 'paid' || statusLower === 'captured' || statusLower === 'completed' || statusLower === 'success') {
        rawStatus = 'Success'
      } else if (statusLower === 'failed') {
        rawStatus = 'Failed'
      } else if (statusLower === 'refunded') {
        rawStatus = 'Refunded'
      } else {
        rawStatus = 'Pending'
      }

      let gatewayStr = 'Razorpay Online'
      const notesLower = (o.notes || '').toLowerCase()
      if (notesLower.includes('cod') || (o.payment_id && o.payment_id.startsWith('COD-'))) {
        gatewayStr = 'Cash on Delivery (COD)'
      } else if (notesLower.includes('upi')) {
        gatewayStr = 'Razorpay UPI'
      } else if (notesLower.includes('card')) {
        gatewayStr = 'Razorpay Card'
      } else if (notesLower.includes('netbanking')) {
        gatewayStr = 'Razorpay NetBanking'
      }

      list.push({
        id: pId,
        orderId: o.order_number || `ORD-${o.id.slice(0, 8)}`,
        orderDbId: o.id,
        customer: o.shipping_address?.fullName || o.email || 'Guest Customer',
        email: o.email || '',
        amount: Number(o.total || o.total_amount || 0),
        gateway: gatewayStr,
        status: rawStatus,
        createdAt: o.created_at || new Date().toISOString(),
        rawDate: new Date(o.created_at || Date.now()),
      })
    })

    // 2. Append standalone Razorpay API transactions if not already linked
    if (razorpayData.payments && razorpayData.payments.length > 0) {
      razorpayData.payments.forEach((rp: any) => {
        if (!seenTxnIds.has(rp.id)) {
          let rpStatus: PaymentTxn['status'] = 'Pending'
          if (rp.status === 'captured') rpStatus = 'Success'
          else if (rp.status === 'failed') rpStatus = 'Failed'
          else if (rp.status === 'refunded') rpStatus = 'Refunded'

          let methodLabel = `Razorpay ${rp.method ? rp.method.toUpperCase() : 'Online'}`

          list.push({
            id: rp.id,
            orderId: rp.orderId !== 'N/A' ? rp.orderId : 'Direct Online',
            customer: rp.email ? rp.email.split('@')[0] : 'Online Customer',
            email: rp.email || '',
            amount: rp.amount,
            gateway: methodLabel,
            status: rpStatus,
            createdAt: rp.createdAt,
            rawDate: new Date(rp.createdAt),
          })
        }
      })
    }

    // Sort newest transactions first
    return list.sort((a, b) => b.rawDate!.getTime() - a.rawDate!.getTime())
  }, [dbOrders, razorpayData])

  // Revenue & Metrics Calculations
  const metrics = useMemo(() => {
    const successfulTxns = transactionLogs.filter((t) => t.status === 'Success')
    const grossRevenue = successfulTxns.reduce((sum, t) => sum + t.amount, 0)

    const totalTxns = transactionLogs.length
    const successRate = totalTxns > 0 ? ((successfulTxns.length / totalTxns) * 100).toFixed(1) : '100.0'

    const razorpayCount = transactionLogs.filter((t) => t.gateway.toLowerCase().includes('razorpay')).length
    const codCount = transactionLogs.filter((t) => t.gateway.toLowerCase().includes('cod')).length

    return {
      grossRevenue,
      successRate,
      totalTxns,
      successfulCount: successfulTxns.length,
      razorpayCount,
      codCount,
    }
  }, [transactionLogs])

  // Filtered Transaction Logs
  const filteredLogs = useMemo(() => {
    return transactionLogs.filter((log) => {
      const matchesSearch =
        log.id.toLowerCase().includes(search.toLowerCase()) ||
        log.orderId.toLowerCase().includes(search.toLowerCase()) ||
        log.customer.toLowerCase().includes(search.toLowerCase()) ||
        log.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'All' || log.status === statusFilter

      let matchesMethod = true
      if (methodFilter === 'razorpay') {
        matchesMethod = log.gateway.toLowerCase().includes('razorpay')
      } else if (methodFilter === 'cod') {
        matchesMethod = log.gateway.toLowerCase().includes('cod')
      }

      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [transactionLogs, search, statusFilter, methodFilter])

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Payments & Revenue Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transaction records from Supabase Orders & Razorpay API
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e2d4c7] hover:bg-[#faf5f0] text-[#2b1713] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8f1020] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Payments'}</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Gross Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#8f1020]">
            ₹{metrics.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {metrics.successfulCount} Settled Orders
            </span>
            <span className="text-slate-400 font-medium">Total: {metrics.totalTxns}</span>
          </div>
        </div>

        {/* Payment Gateway Mode Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payment Gateway</span>
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-[#2b1713] flex items-center gap-2">
            <span>Razorpay + COD</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span>{razorpayData.mode || 'Razorpay Live Production & COD Enabled'}</span>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payment Success Rate</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-700">
            {metrics.successRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Razorpay: {metrics.razorpayCount}</span>
            <span>COD: {metrics.codCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d4c7] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-96 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3.5 py-2.5 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Txn ID, Order #, Customer or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#2b1713] font-medium placeholder:text-slate-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 text-xs">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#8f1020]" />
            <span>Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2b1713] outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success / Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs font-semibold text-[#2b1713] outline-none cursor-pointer"
          >
            <option value="All">All Gateways</option>
            <option value="razorpay">Razorpay Online</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>
        </div>
      </div>

      {/* Transaction Logs Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2d4c7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#2b1713] uppercase tracking-wider">Transaction Logs</h2>
            <span className="bg-[#faf5f0] border border-[#e2d4c7] text-[#8f1020] font-bold text-[10px] px-2 py-0.5 rounded-full">
              {filteredLogs.length} Records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#8f1020] animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Fetching real-time transaction logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#faf5f0] border border-[#e2d4c7] text-slate-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#2b1713]">No Payments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || statusFilter !== 'All' || methodFilter !== 'All'
                ? 'No transactions matched your search or filter parameters.'
                : 'Customer transactions will appear here automatically when orders are placed.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4">Txn ID</th>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method / Gateway</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#faf5f0]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2b1713] text-[11px]">
                      {log.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {log.orderDbId ? (
                        <Link
                          href="/admin/orders"
                          className="text-[#8f1020] hover:underline font-bold flex items-center gap-1 inline-flex"
                        >
                          <span>{log.orderId}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span>{log.orderId}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1713]">{log.customer}</div>
                      {log.email && <div className="text-[10px] text-slate-400">{log.email}</div>}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[#8f1020]">
                      ₹{log.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {log.gateway}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {log.status === 'Success' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
                        </span>
                      )}
                      {log.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      )}
                      {log.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[10px] font-bold border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" /> Failed
                        </span>
                      )}
                      {log.status === 'Refunded' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-300">
                          <RotateCcwIcon className="w-3 h-3 text-slate-500" /> Refunded
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {log.rawDate
                        ? log.rawDate.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : log.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function RotateCcwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
