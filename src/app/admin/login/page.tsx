'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2, KeyRound } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingInitialAuth, setCheckingInitialAuth] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // If user is already logged in as Admin, redirect straight to /admin
  useEffect(() => {
    async function checkCurrentAdmin() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role === 'admin') {
            router.replace('/admin')
            return
          }
        }
      } catch (err) {
        console.error('Error checking existing admin session:', err)
      } finally {
        setCheckingInitialAuth(false)
      }
    }

    checkCurrentAdmin()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg('Please enter both Email and Password.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.')
        setLoading(false)
        return
      }

      if (!data.user) {
        setErrorMsg('Authentication failed. User not found.')
        setLoading(false)
        return
      }

      // Check if user has admin role in profiles table
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileErr || profile?.role !== 'admin') {
        // Sign out user immediately since they are not an admin
        await supabase.auth.signOut()
        setErrorMsg('Access Denied: Your account does not have Admin privileges.')
        setLoading(false)
        return
      }

      // User authenticated & verified as Admin
      router.push('/admin')
    } catch (err: any) {
      console.error('Admin login error:', err)
      setErrorMsg(err.message || 'An unexpected error occurred during login.')
      setLoading(false)
    }
  }

  if (checkingInitialAuth) {
    return (
      <div className="min-h-screen bg-[#1f0b08] text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#efbd3b] animate-spin" />
          <p className="text-xs text-white/60 tracking-widest uppercase">Checking Admin Session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1f0b08] text-[#faf5f0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8f1020]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#efbd3b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#efbd3b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Store</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8f1020]/30 border border-[#8f1020]/50 text-[#efbd3b] mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif tracking-wide text-white">Apsarah Admin Portal</h1>
            <p className="text-xs text-white/60">Enter your administrator credentials to continue</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#8f1020]/20 border border-[#8f1020]/50 text-[#ff8080] text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium tracking-wider text-white/80 uppercase">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apsarah.in"
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#efbd3b] focus:ring-1 focus:ring-[#efbd3b] transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium tracking-wider text-white/80 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#efbd3b] focus:ring-1 focus:ring-[#efbd3b] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8f1020] to-[#b31428] hover:from-[#a31224] hover:to-[#c4162c] text-white font-medium py-3 px-4 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-[#8f1020]/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Panel</span>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">
            Protected by Supabase Auth & Role-Based Access Control
          </p>
        </div>
      </div>
    </div>
  )
}
