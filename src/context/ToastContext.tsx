'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toasts: Toast[]
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
  toastSuccess: (msg: string) => void
  toastError: (msg: string) => void
  toastInfo: (msg: string) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((msg: string) => addToast('success', msg), [addToast])
  const error = useCallback((msg: string) => addToast('error', msg), [addToast])
  const info = useCallback((msg: string) => addToast('info', msg), [addToast])

  const colors: Record<ToastType, string> = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-slate-800',
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        success,
        error,
        info,
        toastSuccess: success,
        toastError: error,
        toastInfo: info,
        dismiss,
      }}
    >
      {children}
      {/* Toast Container - positioned below sticky navbar so notifications are fully visible */}
      <div className="fixed top-28 sm:top-32 right-4 sm:right-6 z-[4000] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-xs font-semibold tracking-wide transition-all animate-in slide-in-from-top-3 duration-200 ${colors[toast.type]}`}
          >
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="opacity-80 hover:opacity-100 p-0.5 hover:bg-white/20 rounded shrink-0 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
