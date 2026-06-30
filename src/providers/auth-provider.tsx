'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { setupNewUser } from '@/lib/supabase/new-user-setup'

interface AuthState {
  user: User | null
  isLoading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      setIsDemoMode(true)
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode: accept any credentials
      setUser({ id: 'demo-user', email } as User)
      return {}
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
  }, [isDemoMode])

  const signUp = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      setUser({ id: 'demo-user', email } as User)
      return {}
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }

    // Set up new user profile, preferences, and default tags
    if (data.user) {
      await setupNewUser(data.user.id, email)
    }

    return {}
  }, [isDemoMode])

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setUser(null)
      return
    }

    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }, [isDemoMode])

  const resetPassword = useCallback(async (email: string) => {
    if (isDemoMode) {
      return {}
    }

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) return { error: error.message }
    return {}
  }, [isDemoMode])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isDemoMode, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}
