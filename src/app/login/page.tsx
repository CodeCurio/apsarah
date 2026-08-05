import { AuthForm } from '@/components/auth/AuthModal'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}
