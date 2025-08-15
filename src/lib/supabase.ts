import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

// 더미 클라이언트 생성 함수
const createDummyClient = () => ({
  from: (table: string) => ({
    insert: (data: any) => ({
      select: (columns?: string) => ({
        single: () => Promise.resolve({ 
          data: null, 
          error: { message: `Supabase not configured - attempted to insert into ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
        }),
        // 배열 반환을 위한 체이닝
        eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' } }) })
      }),
      // select 없이 바로 single
      single: () => Promise.resolve({ 
        data: null, 
        error: { message: `Supabase not configured - attempted to insert into ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
      })
    }),
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ 
          data: null, 
          error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
        }),
        // 배열 반환
        limit: (count: number) => Promise.resolve({ 
          data: [], 
          error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ 
            data: [], 
            error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
          })
        })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => Promise.resolve({ 
          data: [], 
          error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
        })
      }),
      limit: (count: number) => Promise.resolve({ 
        data: [], 
        error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
      }),
      single: () => Promise.resolve({ 
        data: null, 
        error: { message: `Supabase not configured - attempted to select from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: null, 
        error: { message: `Supabase not configured - attempted to update ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ 
        data: null, 
        error: { message: `Supabase not configured - attempted to delete from ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
      })
    }),
    upsert: (data: any) => Promise.resolve({ 
      data: null, 
      error: { message: `Supabase not configured - attempted to upsert into ${table}`, code: 'SUPABASE_NOT_CONFIGURED' }
    })
  }),
  auth: {
    getSession: () => Promise.resolve({ 
      data: { session: null }, 
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    }),
    onAuthStateChange: (callback: any) => ({
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }),
    signUp: (options: any) => Promise.resolve({
      data: null,
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    }),
    signInWithPassword: (options: any) => Promise.resolve({
      data: null,
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    }),
    signOut: () => Promise.resolve({
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    }),
    resetPasswordForEmail: (email: string, options?: any) => Promise.resolve({
      data: null,
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    }),
    updateUser: (attributes: any) => Promise.resolve({
      data: null,
      error: { message: 'Supabase not configured', code: 'SUPABASE_NOT_CONFIGURED' }
    })
  },
  rpc: (fn: string, params?: any) => Promise.resolve({ 
    data: null, 
    error: { message: `Supabase not configured - attempted to call function ${fn}`, code: 'SUPABASE_NOT_CONFIGURED' }
  })
})

// Supabase 클라이언트 초기화
export const supabase = (function() {
  try {
    // 브라우저 환경에서만 로그 출력
    if (typeof window !== 'undefined') {
      console.info('🔍 Supabase 설정 확인:', {
        url: supabaseUrl,
        hasValidKey: supabaseAnonKey.length > 50,
        isPlaceholder: supabaseUrl === 'https://placeholder.supabase.co'
      });
    }
    
    // 실제 Supabase URL이 설정되었는지 확인
    if (supabaseUrl === 'https://placeholder.supabase.co' || 
        supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder') {
      if (typeof window !== 'undefined') {
        console.info('🔄 Supabase not configured, using dummy client for development')
      }
      return createDummyClient() as unknown as ReturnType<typeof createClient>
    }

    // 실제 Supabase 클라이언트 생성
    if (typeof window !== 'undefined') {
      console.info('✅ Supabase client initialized successfully')
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Supabase client initialization failed, using dummy client:', error)
    }
    return createDummyClient() as unknown as ReturnType<typeof createClient>
  }
})()

// Supabase 연결 상태 확인 함수
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
}

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