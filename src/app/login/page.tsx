'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthModal'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const modeParam = searchParams.get('mode') as 'signin' | 'signup' | 'unconfirmed' | null
  const emailParam = searchParams.get('email') || ''

  return (
    <AuthForm
      defaultMode={modeParam || 'signin'}
      initialEmail={emailParam}
      onSuccess={() => {
        router.push('/account')
      }}
    />
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 pb-12 bg-[#FAF6F0]">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img src="/assets/logo.png" alt="Apsarah Logo" className="h-10 w-auto mx-auto object-contain" />
          </Link>
        </div>

        <Suspense fallback={
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-[#E2D4C7]">
            Loading...
          </div>
        }>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  )
}
