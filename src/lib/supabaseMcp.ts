// MCP 서버를 통한 Supabase 연동
export class SupabaseMcpClient {
  async executeSQL(query: string): Promise<any> {
    try {
      console.info('🔍 MCP를 통한 SQL 실행:', query.substring(0, 100) + '...')
      
      // 브라우저에서는 직접 MCP 호출이 불가능하므로
      // API 라우트를 통해 서버에서 MCP를 호출해야 합니다
      const response = await fetch('/api/supabase-mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }
      
      const result = await response.json()
      console.info('✅ MCP SQL 실행 성공')
      return result
    } catch (error) {
      console.error('❌ MCP SQL 실행 실패:', error)
      throw error
    }
  }

  async saveDesignSystem(data: any): Promise<string> {
    const query = `
      INSERT INTO design_systems (user_id, name, description, category, tags) 
      VALUES (${data.user_id ? `'${data.user_id}'` : 'NULL'}, '${data.name}', '${data.description || ''}', '${data.category || ''}', ARRAY[${data.tags ? data.tags.map((tag: string) => `'${tag}'`).join(',') : ''}]) 
      RETURNING id;
    `
    
    const result = await this.executeSQL(query)
    return result[0].id
  }

  async saveComponent(data: any): Promise<void> {
    const query = `
      INSERT INTO components (design_system_id, name, type, props, styles, order_index) 
      VALUES ('${data.design_system_id}', '${data.name}', '${data.type}', '${JSON.stringify(data.props)}'::jsonb, '${JSON.stringify(data.styles)}'::jsonb, ${data.order_index});
    `
    
    await this.executeSQL(query)
  }

  async saveTheme(data: any): Promise<void> {
    const query = `
      INSERT INTO themes (design_system_id, name, colors, typography, spacing, is_default) 
      VALUES ('${data.design_system_id}', '${data.name}', '${JSON.stringify(data.colors)}'::jsonb, '${JSON.stringify(data.typography || {})}'::jsonb, '${JSON.stringify(data.spacing || {})}'::jsonb, ${data.is_default});
    `
    
    await this.executeSQL(query)
  }

  async saveVersion(data: any): Promise<void> {
    const query = `
      INSERT INTO design_system_versions (design_system_id, version, data, changelog) 
      VALUES ('${data.design_system_id}', ${data.version}, '${JSON.stringify(data.data)}'::jsonb, '${data.changelog || ''}');
    `
    
    await this.executeSQL(query)
  }

  async getDesignSystem(id: string): Promise<any> {
    const query = `
      SELECT ds.*, 
             COALESCE(json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as components,
             COALESCE(json_agg(DISTINCT t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as themes
      FROM design_systems ds
      LEFT JOIN components c ON ds.id = c.design_system_id
      LEFT JOIN themes t ON ds.id = t.design_system_id
      WHERE ds.id = '${id}'
      GROUP BY ds.id;
    `
    
    const result = await this.executeSQL(query)
    return result[0] || null
  }
}

export const supabaseMcp = new SupabaseMcpClient()