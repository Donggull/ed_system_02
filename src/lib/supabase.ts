import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signInWithProvider = async (provider: 'github' | 'google') => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}`
    }
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}