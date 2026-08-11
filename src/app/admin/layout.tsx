import React from 'react'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export const metadata = {
  title: 'Admin Dashboard | Apsarah',
  description: 'Manage store products, orders, inventory and revenue',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
