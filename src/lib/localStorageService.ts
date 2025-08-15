// 로컬 스토리지 기반 임시 저장 서비스
export interface StoredDesignSystem {
  id: string
  user_id: string | null
  name: string
  description: string | null
  category: string | null
  tags: string[] | null
  components: any[]
  themes: any[]
  created_at: string
  updated_at: string
}

export class LocalStorageService {
  private storageKey = 'design_systems'

  constructor() {
    console.info('📱 LocalStorage 서비스 초기화')
  }

  async saveDesignSystem(data: any, userId: string | null): Promise<string> {
    try {
      console.info('💾 LocalStorage에 디자인 시스템 저장:', data.name)
      
      const id = 'ds-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      const now = new Date().toISOString()
      
      const designSystem: StoredDesignSystem = {
        id,
        user_id: userId,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        tags: data.tags || null,
        components: data.components || [],
        themes: data.themes || [],
        created_at: now,
        updated_at: now
      }

      const existing = this.getAllDesignSystems()
      existing.push(designSystem)
      
      localStorage.setItem(this.storageKey, JSON.stringify(existing))
      
      console.info('✅ LocalStorage 저장 완료:', id)
      return id
    } catch (error) {
      console.error('❌ LocalStorage 저장 실패:', error)
      throw error
    }
  }

  async getDesignSystem(id: string): Promise<any> {
    try {
      console.info('📋 LocalStorage에서 디자인 시스템 조회:', id)
      
      const designSystems = this.getAllDesignSystems()
      const found = designSystems.find(ds => ds.id === id)
      
      if (!found) {
        console.info('❌ 디자인 시스템을 찾을 수 없음:', id)
        return null
      }

      console.info('✅ LocalStorage 조회 완료:', found.name)
      return found
    } catch (error) {
      console.error('❌ LocalStorage 조회 실패:', error)
      return null
    }
  }

  private getAllDesignSystems(): StoredDesignSystem[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('❌ LocalStorage 읽기 실패:', error)
      return []
    }
  }

  async getUserDesignSystems(userId: string | null): Promise<StoredDesignSystem[]> {
    try {
      const all = this.getAllDesignSystems()
      const filtered = all.filter(ds => ds.user_id === userId)
      
      console.info('📋 사용자 디자인 시스템 조회:', {
        userId,
        count: filtered.length
      })
      
      return filtered.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    } catch (error) {
      console.error('❌ 사용자 디자인 시스템 조회 실패:', error)
      return []
    }
  }

  async testConnection(): Promise<boolean> {
    // LocalStorage는 항상 사용 가능
    return true
  }
}

export const localStorageService = new LocalStorageService()