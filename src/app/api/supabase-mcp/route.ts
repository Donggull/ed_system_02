import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.info('🔍 API 라우트에서 MCP SQL 실행:', query.substring(0, 100) + '...')

    // 서버 환경에서 직접 MCP 호출은 복잡하므로
    // 단순화된 접근: 직접 Supabase REST API 호출
    const SUPABASE_URL = 'https://nktjoldoylvwtkzboyaf.supabase.co'
    
    // Service Role Key 사용 (서버에서만 사용 가능)
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGpvbGRveWx2d3RremJveWFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDYwNzIzOCwiZXhwIjoyMDUwMTgzMjM4fQ.KJ8nHHZA-Xb-fMjq4n7vdCG4X8SXLhGRiYx3X1nXOA8'
    
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }

    // SQL을 REST API 호출로 변환
    if (query.includes('INSERT INTO design_systems')) {
      // INSERT 쿼리 파싱 및 REST API 호출로 변환
      const values = query.match(/VALUES\s*\(([^)]+)\)/)?.[1]
      if (values) {
        const [user_id, name, description, category, tags] = values.split(',').map(v => v.trim().replace(/'/g, ''))
        
        const data = {
          user_id: user_id === 'NULL' ? null : user_id,
          name: name,
          description: description || null,
          category: category || null,
          tags: tags ? [tags] : []
        }

        const response = await fetch(`${SUPABASE_URL}/rest/v1/design_systems`, {
          method: 'POST',
          headers: {
            ...headers,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          throw new Error(`Supabase API error: ${response.status}`)
        }

        const result = await response.json()
        return NextResponse.json(result)
      }
    }

    // 기본적으로 쿼리 실행은 지원하지 않음 (보안상 이유)
    return NextResponse.json({ error: 'Query type not supported' }, { status: 400 })

  } catch (error) {
    console.error('❌ API 라우트 오류:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}