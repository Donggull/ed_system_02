// HTTP 직접 요청을 통한 Supabase 연동
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nktjoldoylvwtkzboyaf.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGpvbGRveWx2d3RremJveWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDcyMzgsImV4cCI6MjA1MDE4MzIzOH0.vnG_0qGVYl2cdfCg2YbH4QKX6CGXqJz__8QAb6VVYjM'

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation'
}

export class SupabaseHttpClient {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = `${SUPABASE_URL}/rest/v1`
    console.info('🔗 Supabase HTTP 클라이언트 초기화:', {
      url: SUPABASE_URL,
      hasKey: !!SUPABASE_ANON_KEY
    })
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/design_systems?select=count&count=exact&head=true`, {
        method: 'HEAD',
        headers
      })
      
      console.info('🔍 연결 테스트 결과:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
      
      return response.ok
    } catch (error) {
      console.error('❌ 연결 테스트 실패:', error)
      return false
    }
  }

  async insertDesignSystem(data: any): Promise<any> {
    try {
      console.info('💾 HTTP로 디자인 시스템 저장 시작:', data.name)
      
      const response = await fetch(`${this.baseUrl}/design_systems`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      console.info('📡 HTTP 응답:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ HTTP 요청 실패:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.info('✅ HTTP 저장 성공:', result)
      return result[0] // Supabase는 배열로 반환
    } catch (error) {
      console.error('❌ insertDesignSystem 실패:', error)
      throw error
    }
  }

  async insertComponent(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/components`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()
      return result[0]
    } catch (error) {
      console.error('❌ insertComponent 실패:', error)
      throw error
    }
  }

  async insertTheme(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/themes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()
      return result[0]
    } catch (error) {
      console.error('❌ insertTheme 실패:', error)
      throw error
    }
  }

  async insertVersion(data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/design_system_versions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()
      return result[0]
    } catch (error) {
      console.error('❌ insertVersion 실패:', error)
      throw error
    }
  }

  async getDesignSystem(id: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/design_systems?select=*,components(*),themes(*)&id=eq.${id}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()
      return result[0] || null
    } catch (error) {
      console.error('❌ getDesignSystem 실패:', error)
      return null
    }
  }
}

export const supabaseHttp = new SupabaseHttpClient()