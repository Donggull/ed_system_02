import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

// Supabase가 설정되지 않은 경우 null을 반환하는 더미 클라이언트 생성
export const supabase = (function() {
  try {
    if (supabaseUrl === 'https://placeholder.supabase.co') {
      // 더미 클라이언트 반환
      return {
        from: () => ({
          insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
          update: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
          delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
          upsert: () => Promise.resolve({ error: new Error('Supabase not configured') })
        }),
        rpc: () => Promise.resolve({ error: new Error('Supabase not configured') })
      } as unknown as ReturnType<typeof createClient>
    }
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Supabase client initialization failed, using dummy client')
    return {
      from: () => ({
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
        upsert: () => Promise.resolve({ error: new Error('Supabase not configured') })
      }),
      rpc: () => Promise.resolve({ error: new Error('Supabase not configured') })
    } as unknown as ReturnType<typeof createClient>
  }
})()

export type Database = {
  public: {
    Tables: {
      design_systems: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          share_token: string
          thumbnail_url: string | null
          tags: string[] | null
          category: string | null
          favorite_count: number
          download_count: number
          rating_average: number
          rating_count: number
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          share_token?: string
          thumbnail_url?: string | null
          tags?: string[] | null
          category?: string | null
          favorite_count?: number
          download_count?: number
          rating_average?: number
          rating_count?: number
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          share_token?: string
          thumbnail_url?: string | null
          tags?: string[] | null
          category?: string | null
          favorite_count?: number
          download_count?: number
          rating_average?: number
          rating_count?: number
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          design_system_id: string
          name: string
          type: string
          props: any
          styles: any
          code: string | null
          preview_url: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          name: string
          type: string
          props?: any
          styles?: any
          code?: string | null
          preview_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          name?: string
          type?: string
          props?: any
          styles?: any
          code?: string | null
          preview_url?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          design_system_id: string
          name: string
          colors: any
          typography: any | null
          spacing: any | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          name: string
          colors: any
          typography?: any | null
          spacing?: any | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          name?: string
          colors?: any
          typography?: any | null
          spacing?: any | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          design_system_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_system_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          design_system_id?: string
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          design_system_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_system_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          design_system_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      design_system_versions: {
        Row: {
          id: string
          design_system_id: string
          version: number
          data: any
          changelog: string | null
          created_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          version: number
          data: any
          changelog?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          version?: number
          data?: any
          changelog?: string | null
          created_at?: string
        }
      }
    }
  }
}