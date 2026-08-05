'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Truck,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
}

interface RecentOrder {
  id: string
  order_number: string
  email: string
  total: number
  fulfillment_status: string
  created_at: string
  shipping_address: { fullName?: string }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 1. Fetch Orders KPI & Recent Orders
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          const orders = data as RecentOrder[]
          const rev = orders.reduce((sum, o) => sum + (o.total || 0), 0)
          setStats((prev) => ({
            ...prev,
            totalRevenue: rev,
            totalOrders: orders.length,
          }))
          setRecentOrders(orders.slice(0, 5))
        }
      })

    // 2. Fetch Products Count
    supabase
      .from('apsarah_products')
      .select('id', { count: 'exact' })
      .then(({ count }) => {
        setStats((prev) => ({ ...prev, totalProducts: count || 0 }))
      })

    // 3. Fetch Customers Count
    supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .then(({ count }) => {
        setStats((prev) => ({ ...prev, totalCustomers: count || 0 }))
        setLoading(false)
      })
  }, [])

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: 'Live from Supabase orders',
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: 'Lifetime completed & pending',
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toString(),
      change: 'Catalog inventory',
      icon: ShoppingBag,
      color: 'bg-[#faf5f0] text-[#8f1020] border-[#e2d4c7]',
    },
    {
      title: 'Registered Customers',
      value: stats.totalCustomers.toString(),
      change: 'User profile accounts',
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1f0b08] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#efbd3b]">APSARAH STORE MANAGER</span>
          <h1 className="text-2xl md:text-3xl font-serif mt-1">Welcome back, Admin</h1>
          <p className="text-xs text-white/70 mt-1">Real-time overview of orders, inventory, customers, and revenue.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#8f1020] hover:bg-[#a61528] text-white text-xs font-semibold shadow-lg transition-all"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/coupons"
            className="px-4 py-2.5 rounded-xl bg-[#efbd3b] text-[#1f0b08] hover:bg-[#ffcf4d] font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>🏷️ Manage Coupons</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.title} className="bg-white p-5 rounded-2xl border border-[#e2d4c7] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2b1713]">{kpi.value}</div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600 inline" />
                  {kpi.change}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-[#2b1713]">Recent Orders</h2>
            <p className="text-xs text-slate-500">Live order queue from Supabase</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#8f1020] hover:underline flex items-center gap-1">
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading live data...</td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No orders placed yet.</td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#8f1020]">{ord.order_number}</td>
                    <td className="py-3.5">
                      <div className="font-semibold text-[#2b1713]">{ord.shipping_address?.fullName || 'Customer'}</div>
                      <div className="text-[10px] text-slate-400">{ord.email}</div>
                    </td>
                    <td className="py-3.5 font-bold text-[#8f1020]">₹{ord.total.toLocaleString()}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase">
                        {ord.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400 text-[11px]">{new Date(ord.created_at).toLocaleDateString('en-IN')}</td>
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
