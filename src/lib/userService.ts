import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  user_id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserProfileData {
  name?: string
  avatar_url?: string
  bio?: string
  website?: string
}

export interface UpdateUserProfileData {
  name?: string
  avatar_url?: string
  bio?: string
  website?: string
}

export const userService = {
  async createUserProfile(userId: string, data: CreateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          ...data
        })
        .select()
        .single()

      return { data: profile, error }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return { data: null, error }
    }
  },

  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      return { data: profile, error }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return { data: null, error }
    }
  },

  async updateUserProfile(userId: string, updates: UpdateUserProfileData): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      return { data: profile, error }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { data: null, error }
    }
  },

  async deleteUserProfile(userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId)

      return { error }
    } catch (error) {
      console.error('Error deleting user profile:', error)
      return { error }
    }
  },

  async ensureUserProfile(user: User): Promise<{ data: UserProfile | null; error: any }> {
    if (!user) {
      return { data: null, error: { message: 'User not provided' } }
    }

    const { data: existingProfile, error: fetchError } = await this.getUserProfile(user.id)
    
    if (existingProfile && !fetchError) {
      return { data: existingProfile, error: null }
    }

    const profileData: CreateUserProfileData = {
      name: user.user_metadata?.name || user.email?.split('@')[0] || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    }

    return await this.createUserProfile(user.id, profileData)
  }
}