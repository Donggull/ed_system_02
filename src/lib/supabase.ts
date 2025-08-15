import { createClient } from '@supabase/supabase-js'

// 임시 해결책: 환경 변수가 없을 때 실제 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nktjoldoylvwtkzboyaf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGpvbGRveWx2d3RremJveWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDcyMzgsImV4cCI6MjA1MDE4MzIzOH0.vnG_0qGVYl2cdfCg2YbH4QKX6CGXqJz__8QAb6VVYjM'

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
      error: { 
        message: '🚨 Supabase 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.', 
        code: 'SUPABASE_NOT_CONFIGURED' 
      }
    }),
    signInWithPassword: (options: any) => Promise.resolve({
      data: null,
      error: { 
        message: '🚨 Supabase 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 환경 변수를 설정해주세요.', 
        code: 'SUPABASE_NOT_CONFIGURED' 
      }
    }),
    signOut: () => Promise.resolve({
      error: { 
        message: '🚨 Supabase 환경 변수가 설정되지 않았습니다.', 
        code: 'SUPABASE_NOT_CONFIGURED' 
      }
    }),
    resetPasswordForEmail: (email: string, options?: any) => Promise.resolve({
      data: null,
      error: { 
        message: '🚨 Supabase 환경 변수가 설정되지 않았습니다.', 
        code: 'SUPABASE_NOT_CONFIGURED' 
      }
    }),
    updateUser: (attributes: any) => Promise.resolve({
      data: null,
      error: { 
        message: '🚨 Supabase 환경 변수가 설정되지 않았습니다.', 
        code: 'SUPABASE_NOT_CONFIGURED' 
      }
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
    // 환경 변수 상세 로깅
    const debugInfo = {
      url: supabaseUrl,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseAnonKey?.length || 0,
      hasValidUrl: supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
      hasValidKey: supabaseAnonKey && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
      isPlaceholderUrl: supabaseUrl === 'https://placeholder.supabase.co',
      isPlaceholderKey: supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
    }

    // 브라우저 환경에서만 로그 출력
    if (typeof window !== 'undefined') {
      console.group('🔍 Supabase 초기화 디버깅')
      console.log('환경 변수 상태:', debugInfo)
      console.log('실제 URL:', supabaseUrl)
      console.log('실제 Key 앞 20자:', supabaseAnonKey?.substring(0, 20) + '...')
      console.groupEnd()
    }
    
    // 환경 변수 유효성 검사
    if (!supabaseUrl || !supabaseAnonKey) {
      if (typeof window !== 'undefined') {
        console.error('❌ Supabase 환경 변수가 설정되지 않았습니다!')
        console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 미설정')
        console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 설정됨' : '❌ 미설정')
      }
      return createDummyClient() as unknown as ReturnType<typeof createClient>
    }
    
    // 플레이스홀더 값 확인
    if (supabaseUrl === 'https://placeholder.supabase.co' || 
        supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder') {
      if (typeof window !== 'undefined') {
        console.warn('🔄 Supabase 플레이스홀더 값 감지, 더미 클라이언트 사용')
      }
      return createDummyClient() as unknown as ReturnType<typeof createClient>
    }

    // 실제 Supabase 클라이언트 생성
    if (typeof window !== 'undefined') {
      console.info('✅ 실제 Supabase 클라이언트 생성 중...')
    }
    
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'ed-system-claude'
        }
      }
    })

    if (typeof window !== 'undefined') {
      console.info('🎉 Supabase 클라이언트 초기화 완료!')
    }

    return client
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error('💥 Supabase 클라이언트 초기화 실패:', error)
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