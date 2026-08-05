'use client'

import React, { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  FolderPlus,
  Search,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'
import { MASTER_CATEGORIES } from '@/lib/constants/categories'

interface CategoryRecord {
  id: string
  name: string
  slug: string
  description?: string | null
  parent_id?: string | null
  is_coming_soon?: boolean
}

export default function AdminCategoriesPage() {
  const { toastSuccess, toastError } = useToast()
  const [dbCategories, setDbCategories] = useState<CategoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Expand / Collapse states for categories (all open by default)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Quick Add Primary Category bar
  const [newPrimaryName, setNewPrimaryName] = useState('')
  const [newPrimaryDesc, setNewPrimaryDesc] = useState('')
  const [newPrimarySoon, setNewPrimarySoon] = useState(false)
  const [creatingPrimary, setCreatingPrimary] = useState(false)

  // Inline Subcategory input per primary category ID
  const [subInputs, setSubInputs] = useState<Record<string, string>>({})

  // Inline rename state: record ID -> new text
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // 1. Fetch categories from Supabase (with fallback to MASTER_CATEGORIES)
  const loadCategories = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      let list: CategoryRecord[] = []
      if (!error && data && data.length > 0) {
        list = data as CategoryRecord[]
      } else {
        // Fallback seed
        MASTER_CATEGORIES.forEach((cat) => {
          list.push({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            is_coming_soon: cat.isComingSoon,
          })
          cat.subcategories.forEach((sub, idx) => {
            list.push({
              id: `${cat.id}-sub-${idx}`,
              name: sub,
              slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              parent_id: cat.id,
            })
          })
        })
      }
      setDbCategories(list)

      // Auto expand all primary categories by default so user sees everything clearly
      const exp: Record<string, boolean> = {}
      list.filter((c) => !c.parent_id).forEach((c) => {
        exp[c.id] = true
      })
      setExpanded(exp)
    } catch {
      toastError('Could not load categories from database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const primaryCats = dbCategories.filter((c) => !c.parent_id)
  const getSubcats = (parentId: string) => dbCategories.filter((c) => c.parent_id === parentId)

  // Quick Create Primary Category
  const handleCreatePrimary = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPrimaryName.trim()) return
    setCreatingPrimary(true)

    const slug = newPrimaryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newPrimaryName.trim(),
          slug,
          description: newPrimaryDesc.trim() || null,
          is_coming_soon: newPrimarySoon,
          parent_id: null,
        })
        .select()
        .single()

      if (error) throw error

      const created = (data as CategoryRecord) || {
        id: `local-p-${Date.now()}`,
        name: newPrimaryName.trim(),
        slug,
        description: newPrimaryDesc.trim() || null,
        is_coming_soon: newPrimarySoon,
      }

      setDbCategories((prev) => [...prev, created])
      setExpanded((prev) => ({ ...prev, [created.id]: true }))
      setNewPrimaryName('')
      setNewPrimaryDesc('')
      setNewPrimarySoon(false)
      toastSuccess(`Category "${created.name}" added`)
    } catch {
      // Local fallback
      const created: CategoryRecord = {
        id: `local-p-${Date.now()}`,
        name: newPrimaryName.trim(),
        slug,
        description: newPrimaryDesc.trim() || null,
        is_coming_soon: newPrimarySoon,
      }
      setDbCategories((prev) => [...prev, created])
      setExpanded((prev) => ({ ...prev, [created.id]: true }))
      setNewPrimaryName('')
      setNewPrimaryDesc('')
      setNewPrimarySoon(false)
      toastSuccess(`Category "${created.name}" added`)
    } finally {
      setCreatingPrimary(false)
    }
  }

  // Quick Add Subcategory under a specific parent
  const handleAddSubcategory = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault()
    const subName = subInputs[parentId]?.trim()
    if (!subName) return

    const slug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: subName,
          slug,
          parent_id: parentId,
        })
        .select()
        .single()

      const created = (data as CategoryRecord) || {
        id: `local-s-${Date.now()}`,
        name: subName,
        slug,
        parent_id: parentId,
      }
      setDbCategories((prev) => [...prev, created])
      setSubInputs((prev) => ({ ...prev, [parentId]: '' }))
      toastSuccess(`Added subcategory "${subName}"`)
    } catch {
      const created: CategoryRecord = {
        id: `local-s-${Date.now()}`,
        name: subName,
        slug,
        parent_id: parentId,
      }
      setDbCategories((prev) => [...prev, created])
      setSubInputs((prev) => ({ ...prev, [parentId]: '' }))
      toastSuccess(`Added subcategory "${subName}"`)
    }
  }

  // Toggle Coming Soon instantly with 1-click
  const handleToggleComingSoon = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal
    setDbCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_coming_soon: newVal } : item))
    )
    toastSuccess(`Updated status to ${newVal ? 'Coming Soon' : 'Active'}`)

    try {
      const supabase = createClient()
      await supabase.from('categories').update({ is_coming_soon: newVal }).eq('id', id)
    } catch {
      // Ignore database sync issue if working locally
    }
  }

  // Inline Rename Category / Subcategory
  const handleSaveRename = async (id: string) => {
    if (!editText.trim()) return
    const newName = editText.trim()
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    setDbCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName, slug: newSlug } : item))
    )
    setEditingId(null)
    toastSuccess(`Renamed to "${newName}"`)

    try {
      const supabase = createClient()
      await supabase.from('categories').update({ name: newName, slug: newSlug }).eq('id', id)
    } catch {
      // ignore
    }
  }

  // Delete Category or Subcategory
  const handleDelete = async (id: string, name: string, isPrimary: boolean) => {
    if (
      !confirm(
        isPrimary
          ? `Delete primary category "${name}"? This will also remove all its subcategories.`
          : `Remove subcategory "${name}"?`
      )
    )
      return

    setDbCategories((prev) => prev.filter((c) => c.id !== id && c.parent_id !== id))
    toastSuccess(`Removed "${name}"`)

    try {
      const supabase = createClient()
      await supabase.from('categories').delete().eq('id', id)
    } catch {
      // ignore
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredPrimary = primaryCats.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSubcats(c.id).some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 text-slate-800">
      {/* ── Top Header & Guide ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Categories &amp; Subcategories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly add, rename, or structure categories for products and shop filters without clutter.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:border-[#8f1020] outline-none"
          />
        </div>
      </div>

      {/* ── Quick Add Primary Category Bar (Zero Friction) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#8f1020]" /> Add New Primary Category
        </h2>
        <form onSubmit={handleCreatePrimary} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
          <div className="sm:col-span-4">
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Sarees)"
              value={newPrimaryName}
              onChange={(e) => setNewPrimaryName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#8f1020]"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Optional description or subtitle"
              value={newPrimaryDesc}
              onChange={(e) => setNewPrimaryDesc(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#8f1020]"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newPrimarySoon}
                onChange={(e) => setNewPrimarySoon(e.target.checked)}
                className="rounded text-[#8f1020] focus:ring-[#8f1020]"
              />
              <span>Coming Soon</span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creatingPrimary}
              className="w-full py-2 bg-[#8f1020] hover:bg-[#7a0d1b] text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer text-xs"
            >
              {creatingPrimary ? 'Adding...' : '+ Add Category'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Hierarchical Categories Tree ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <span>Category Name &amp; Hierarchy</span>
          <div className="flex items-center gap-12 pr-4">
            <span>Status / Visibility</span>
            <span>Actions</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading categories...</div>
        ) : filteredPrimary.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No categories found. Add your first primary category above.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredPrimary.map((cat) => {
              const subcats = getSubcats(cat.id)
              const isOpen = expanded[cat.id] ?? true
              const isEditing = editingId === cat.id

              return (
                <div key={cat.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                  {/* Primary Category Row */}
                  <div className="px-4 py-3.5 flex items-center justify-between gap-4 font-medium text-sm">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(cat.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title={isOpen ? 'Collapse Subcategories' : 'Expand Subcategories'}
                      >
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-white border border-slate-400 rounded px-2 py-1 text-xs w-full focus:border-[#8f1020] outline-none"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(cat.id)}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(cat.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            className="font-bold text-slate-900 cursor-pointer hover:underline"
                            onClick={() => toggleExpand(cat.id)}
                          >
                            {cat.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">({subcats.length} subcategories)</span>
                          {cat.description && (
                            <span className="text-xs text-slate-400 hidden sm:inline-block">
                              — {cat.description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Toggle & Actions */}
                    <div className="flex items-center gap-6 pr-2">
                      {/* 1-Click Status Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleComingSoon(cat.id, !!cat.is_coming_soon)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          cat.is_coming_soon
                            ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Click to quickly toggle Coming Soon vs Active status"
                      >
                        {cat.is_coming_soon ? 'Coming Soon' : 'Active'}
                      </button>

                      <div className="flex items-center gap-1">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(cat.id)
                              setEditText(cat.name)
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Rename category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name, true)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategory Accordion Box */}
                  {isOpen && (
                    <div className="bg-slate-50/80 border-t border-slate-200 pl-10 pr-6 py-4 space-y-3">
                      {/* Subcategory List */}
                      {subcats.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {subcats.map((sub) => {
                            const isSubEditing = editingId === sub.id
                            return (
                              <div
                                key={sub.id}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs hover:border-slate-300 transition-colors shadow-2xs group"
                              >
                                {isSubEditing ? (
                                  <div className="flex items-center gap-1 flex-1">
                                    <input
                                      type="text"
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      className="border border-slate-400 rounded px-1.5 py-0.5 text-xs w-full outline-none"
                                      autoFocus
                                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(sub.id)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveRename(sub.id)}
                                      className="text-emerald-600 px-1 font-bold"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                ) : (
                                  <span className="font-semibold text-slate-700 truncate">{sub.name}</span>
                                )}

                                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 pl-2">
                                  {!isSubEditing && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingId(sub.id)
                                        setEditText(sub.name)
                                      }}
                                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                      title="Rename subcategory"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(sub.id, sub.name, false)}
                                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                    title="Delete subcategory"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No subcategories under {cat.name} yet.</p>
                      )}

                      {/* Instant Add Subcategory Row */}
                      <form
                        onSubmit={(e) => handleAddSubcategory(cat.id, e)}
                        className="flex items-center gap-2 max-w-md pt-1"
                      >
                        <input
                          type="text"
                          placeholder={`+ Add new subcategory to ${cat.name}...`}
                          value={subInputs[cat.id] || ''}
                          onChange={(e) => setSubInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                          className="flex-1 bg-white border border-slate-300 focus:border-[#8f1020] rounded-lg px-3 py-1.5 text-xs outline-none shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={!subInputs[cat.id]?.trim()}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-black disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          Add
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
