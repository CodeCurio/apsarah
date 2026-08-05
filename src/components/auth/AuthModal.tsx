'use client'

import React, { useState } from 'react'
import { signInWithEmail, signUpWithEmail, signInWithOAuth } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface AuthModalProps {
  onSuccess?: () => void
}

export function AuthForm({ onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg('Successfully signed in!')
          onSuccess?.()
        }
      } else {
        const { error } = await signUpWithEmail(email, password, fullName)
        if (error) {
          setErrorMsg(error.message)
        } else {
          setSuccessMsg('Check your email for the confirmation link!')
          onSuccess?.()
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setOauthLoading(provider)
    setErrorMsg(null)
    try {
      const { error } = await signInWithOAuth(provider)
      if (error) {
        setErrorMsg(error.message)
        setOauthLoading(null)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OAuth sign-in failed')
      setOauthLoading(null)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-slate-200 dark:border-slate-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin'
            ? 'Sign in to access your orders and saved items'
            : 'Sign up to start shopping with Apsarah'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
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
            className="w-full flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
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

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-background px-3 text-xs uppercase text-slate-500 font-medium absolute">
            Or continue with email
          </span>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 text-sm rounded-md bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 text-sm rounded-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            {successMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === 'signup' && (
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t p-4 text-xs text-slate-600 dark:text-slate-400">
        {mode === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={() => {
                setMode('signup')
                setErrorMsg(null)
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
              className="text-primary font-semibold hover:underline"
              onClick={() => {
                setMode('signin')
                setErrorMsg(null)
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
