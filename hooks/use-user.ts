'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthError } from '@supabase/supabase-js'

interface UseUserReturn {
  user: User | null
  isLoading: boolean
  error: AuthError | null
}

/**
 * Client-side hook to get the current authenticated user
 * Automatically subscribes to auth state changes
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setUser(data.user)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err)
        setIsLoading(false)
      })

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
      setError(null)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, isLoading, error }
}
