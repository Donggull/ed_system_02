'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { userService, UserProfile } from '@/lib/userService'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<{ data: any; error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error)
          } else {
            setSession(session)
            setUser(session?.user ?? null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error during session initialization:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const { data: userProfile } = await userService.ensureUserProfile(session.user)
            setProfile(userProfile)
          } else {
            setProfile(null)
          }
          
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {}
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { data, error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    try {
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } }
      }

      const { data: profileData, error: profileError } = await userService.updateUserProfile(user.id, updates)
      
      if (profileError) {
        return { data: null, error: profileError }
      }

      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: updates
      })

      if (profileData) {
        setProfile(profileData)
      }

      return { data: authData, error: authError }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    
    const { data: userProfile } = await userService.getUserProfile(user.id)
    setProfile(userProfile)
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}