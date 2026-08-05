'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Check,
  Loader2,
} from 'lucide-react'
import { fetchProducts, deleteProduct, Product } from '@/lib/products-store'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert('Failed to delete: ' + (e instanceof Error ? e.message : 'Unknown error'))
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2b1713]">Products & Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage catalog items, pricing, stock, images, and specifications</p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8f1020] hover:bg-[#a61528] text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2d4c7] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-96 bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by product title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#2b1713]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#faf5f0] border border-[#e2d4c7] rounded-xl px-3 py-2 text-xs font-medium text-[#2b1713] outline-none"
          >
            <option value="All">All Categories</option>
            {MASTER_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#e2d4c7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5f0] border-b border-[#e2d4c7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8f1020]" />
                      <span className="text-sm">Loading products from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                    No products found. <Link href="/admin/products/new" className="text-[#8f1020] font-bold underline">Add your first product →</Link>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-lg border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-[#2b1713]">{p.name}</div>
                            <div className="text-[10px] text-slate-400">
                              ★ {p.rating} • {p.reviewCount} reviews
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{p.category}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">{p.slug}</td>
                      <td className="py-3.5 px-4">
                        <strong className="text-[#8f1020]">₹{p.price.toLocaleString()}</strong>
                        <del className="text-[10px] text-slate-400 ml-1.5">₹{p.oldPrice.toLocaleString()}</del>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{totalStock} units</td>
                      <td className="py-3.5 px-4">
                        {totalStock > 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            <Check className="w-3 h-3" /> In Stock
                          </span>
                        ) : totalStock > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                            Low ({totalStock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${p.slug}`} target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-[#F0E6DC] text-slate-600 transition-colors" title="View Live">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/admin/products/edit/${p.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-[#F0E6DC] text-slate-600 transition-colors" title="Edit">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button type="button" onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
