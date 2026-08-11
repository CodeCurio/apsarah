'use client'

import React, { useState } from 'react'
import { signInWithEmail, signUpWithEmail, signInWithOAuth, resendConfirmationEmail } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MailCheck, ArrowLeft, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

interface AuthModalProps {
  onSuccess?: () => void
  defaultMode?: 'signin' | 'signup' | 'unconfirmed'
  initialEmail?: string
  redirectToUrl?: string
}

export function AuthForm({ onSuccess, defaultMode = 'signin', initialEmail = '', redirectToUrl }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'unconfirmed'>(defaultMode)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string>(initialEmail)
  const [resendSent, setResendSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const startCooldown = () => {
    setCooldown(30)
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          // Check if error is due to unconfirmed email
          const isUnconfirmed = error.message?.toLowerCase().includes('email not confirmed') ||
                                error.message?.toLowerCase().includes('email_not_confirmed') ||
                                error.status === 400
          
          if (isUnconfirmed) {
            setUnconfirmedEmail(email)
            setErrorMsg('Your email has not been verified yet. Please check your inbox for the confirmation link.')
          } else {
            setErrorMsg(error.message)
          }
        } else {
          setSuccessMsg('Successfully signed in!')
          onSuccess?.()
        }
      } else {
        const { data, error } = await signUpWithEmail(email, password, fullName, redirectToUrl)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setUnconfirmedEmail(email)
          setMode('unconfirmed')
          // If session was returned immediately (autoconfirm enabled in Supabase), user is logged in
          if (data?.session) {
            setSuccessMsg('Account created successfully!')
            onSuccess?.()
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendLink = async (targetEmail?: string) => {
    const emailToUse = targetEmail || unconfirmedEmail || email
    if (!emailToUse) return
    setResending(true)
    setErrorMsg(null)
    try {
      const { error } = await resendConfirmationEmail(emailToUse)
      if (error) {
        setErrorMsg(error.message || 'Failed to resend confirmation email')
      } else {
        setResendSent(true)
        setSuccessMsg(`Fresh verification link sent to ${emailToUse}!`)
        startCooldown()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend verification email')
    } finally {
      setResending(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setOauthLoading(provider)
    setErrorMsg(null)
    try {
      const { error } = await signInWithOAuth(provider, redirectToUrl)
      if (error) {
        setErrorMsg(error.message)
        setOauthLoading(null)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OAuth sign-in failed')
      setOauthLoading(null)
    }
  }

  // ----------------------------------------------------
  // UNCONFIRMED / VERIFICATION SENT SCREEN
  // ----------------------------------------------------
  if (mode === 'unconfirmed') {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border border-[#E2D4C7] bg-white overflow-hidden text-[#2B1713]">
        <div className="bg-[#8F1020] p-6 text-white text-center space-y-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20 shadow-inner">
            <MailCheck className="w-7 h-7 text-[#efbd3b]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#efbd3b]">Account Created</span>
            <CardTitle className="text-xl font-serif font-bold text-white mt-0.5">Verify Your Email</CardTitle>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E2D4C7] text-center space-y-2">
            <p className="text-xs text-slate-600">
              We&apos;ve sent an email verification link to:
            </p>
            <p className="text-sm font-bold font-mono text-[#8F1020] bg-white py-1.5 px-3 rounded-lg border border-[#E2D4C7] inline-block max-w-full truncate">
              {unconfirmedEmail || 'your email'}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Please click the link inside that email to confirm your account and log in.
            </p>
          </div>

          {/* Success / Error alerts inside confirmation */}
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-xs rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-3 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={resending || cooldown > 0}
              onClick={() => handleResendLink()}
              className="w-full border-[#8F1020] text-[#8F1020] hover:bg-[#8F1020] hover:text-white font-bold text-xs py-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {resending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resending link...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Resend in {cooldown}s</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{resendSent ? 'Resend Link Again' : 'Resend Verification Email'}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setMode('signin')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className="w-full text-slate-500 hover:text-slate-900 text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-100 p-3 text-center">
          <p className="text-[10px] text-slate-400 w-full">
            Did not receive the email? Check your Spam or Junk folder.
          </p>
        </CardFooter>
      </Card>
    )
  }

  // ----------------------------------------------------
  // STANDARD SIGN IN / SIGN UP FORM
  // ----------------------------------------------------
  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border border-[#E2D4C7] bg-white overflow-hidden">
      <CardHeader className="space-y-1 text-center bg-[#FAF6F0] border-b border-[#E2D4C7]/60 pb-5">
        <CardTitle className="text-2xl font-serif font-bold text-[#2B1713] tracking-tight">
          {mode === 'signin' ? 'Welcome Back' : 'Join Apsarah'}
        </CardTitle>
        <CardDescription className="text-xs text-slate-600">
          {mode === 'signin'
            ? 'Sign in to manage your orders & saved favorites'
            : 'Create an account for exclusive offers & smooth checkout'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-[#E2D4C7] hover:bg-[#FAF6F0] text-xs font-semibold"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuth('google')}
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.23v3.15C3.21 21.32 7.3 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.23C.44 8.15 0 9.99 0 12s.44 3.85 1.23 5.42l4.09-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.3 0 3.21 2.68 1.23 6.58l4.09 3.15c.94-2.83 3.57-4.98 6.68-4.98z"
                />
              </svg>
            )}
            <span>Google</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-[#E2D4C7] hover:bg-[#FAF6F0] text-xs font-semibold"
            disabled={loading || oauthLoading !== null}
            onClick={() => handleOAuth('facebook')}
          >
            {oauthLoading === 'facebook' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
            <span>Facebook</span>
          </Button>
        </div>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-[#E2D4C7] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
            Or continue with email
          </span>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="p-3.5 text-xs rounded-xl bg-rose-50 text-rose-800 border border-rose-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>

            {/* If error relates to unconfirmed email, show quick resend action */}
            {unconfirmedEmail && (
              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700">Need a new link?</span>
                <button
                  type="button"
                  disabled={resending || cooldown > 0}
                  onClick={() => handleResendLink(unconfirmedEmail)}
                  className="px-2.5 py-1 bg-rose-700 text-white rounded-lg font-bold text-[10px] hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>{cooldown > 0 ? `Wait ${cooldown}s` : 'Resend Email'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Notification Alert */}
        {successMsg && (
          <div className="p-3.5 text-xs rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-bold text-[#2B1713]">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-[#E2D4C7] focus:border-[#8F1020] text-xs h-10 rounded-lg"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-bold text-[#2B1713]">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#E2D4C7] focus:border-[#8F1020] text-xs h-10 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold text-[#2B1713]">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-[#E2D4C7] focus:border-[#8F1020] text-xs h-10 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#8F1020] hover:bg-[#700c19] text-white font-bold text-xs h-11 rounded-xl shadow-md transition-colors cursor-pointer mt-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-[#E2D4C7]/50 p-4 text-xs text-slate-600 bg-[#FAF6F0]">
        {mode === 'signin' ? (
          <p>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-[#8F1020] font-bold hover:underline cursor-pointer"
              onClick={() => {
                setMode('signup')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="text-[#8F1020] font-bold hover:underline cursor-pointer"
              onClick={() => {
                setMode('signin')
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
            >
              Sign In
            </button>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

