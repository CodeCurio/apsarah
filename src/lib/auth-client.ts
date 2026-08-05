import { createClient } from '@/lib/supabase/client'

/**
 * Initiates OAuth sign-in flow for Google or Facebook
 */
export async function signInWithOAuth(provider: 'google' | 'facebook') {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

/**
 * Signs in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/**
 * Signs up a new user with email and password
 */
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

/**
 * Signs out the current user
 */
export async function signOutUser() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}
