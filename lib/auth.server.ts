import { createClient } from '@/lib/supabase/server'

/**
 * Get the current user (server-side)
 * Use this in Server Components and Route Handlers
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser()
}
