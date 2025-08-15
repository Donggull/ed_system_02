import { supabase, isSupabaseConfigured, type Database } from './supabase'

export type DesignSystem = Database['public']['Tables']['design_systems']['Row']
export type Component = Database['public']['Tables']['components']['Row']
export type Theme = Database['public']['Tables']['themes']['Row']
export type Rating = Database['public']['Tables']['ratings']['Row']
export type DesignSystemVersion = Database['public']['Tables']['design_system_versions']['Row']

export interface DesignSystemData {
  name: string
  description?: string
  components: Omit<Component, 'id' | 'design_system_id' | 'created_at' | 'updated_at'>[]
  themes: Omit<Theme, 'id' | 'design_system_id' | 'created_at' | 'updated_at'>[]
  tags?: string[]
  category?: string
}

export interface DesignSystemWithDetails extends DesignSystem {
  components: Component[]
  themes: Theme[]
  is_favorited?: boolean
  user_rating?: number
}

class DesignSystemService {
  async saveDesignSystem(data: DesignSystemData, userId: string): Promise<string> {
    try {
      // Supabase가 설정되지 않은 경우 시뮬레이션
      if (!isSupabaseConfigured()) {
        console.info('📝 Simulating design system save (Supabase not configured):', {
          name: data.name,
          userId,
          componentsCount: data.components.length,
          themesCount: data.themes.length
        })
        return 'sim-ds-' + Date.now()
      }

      // 디자인 시스템 생성
      const { data: designSystem, error: dsError } = await supabase
        .from('design_systems')
        .insert({
          user_id: userId,
          name: data.name,
          description: data.description,
          tags: data.tags,
          category: data.category,
        })
        .select()
        .single()

      if (dsError) throw dsError

      const designSystemId = designSystem.id

      // 컴포넌트 저장
      if (data.components.length > 0) {
        const { error: componentsError } = await supabase
          .from('components')
          .insert(
            data.components.map((component, index) => ({
              design_system_id: designSystemId,
              ...component,
              order_index: index,
            }))
          )

        if (componentsError) throw componentsError
      }

      // 테마 저장
      if (data.themes.length > 0) {
        const { error: themesError } = await supabase
          .from('themes')
          .insert(
            data.themes.map((theme, index) => ({
              design_system_id: designSystemId,
              ...theme,
              is_default: index === 0, // 첫 번째 테마를 기본값으로 설정
            }))
          )

        if (themesError) throw themesError
      }

      // 버전 히스토리 저장
      await this.saveVersion(designSystemId, 1, data, 'Initial version')

      return designSystemId
    } catch (error) {
      console.error('Error saving design system:', error)
      throw error
    }
  }

  async updateDesignSystem(
    designSystemId: string,
    data: Partial<DesignSystemData>,
    userId: string,
    changelog?: string
  ): Promise<void> {
    try {
      // 기존 디자인 시스템 정보 가져오기
      const { data: existingSystem, error: fetchError } = await supabase
        .from('design_systems')
        .select('version, user_id')
        .eq('id', designSystemId)
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      const newVersion = existingSystem.version + 1

      // 디자인 시스템 메타데이터 업데이트
      const { error: updateError } = await supabase
        .from('design_systems')
        .update({
          name: data.name,
          description: data.description,
          tags: data.tags,
          category: data.category,
          version: newVersion,
        })
        .eq('id', designSystemId)
        .eq('user_id', userId)

      if (updateError) throw updateError

      // 컴포넌트 업데이트 (기존 삭제 후 재생성)
      if (data.components) {
        await supabase
          .from('components')
          .delete()
          .eq('design_system_id', designSystemId)

        if (data.components.length > 0) {
          const { error: componentsError } = await supabase
            .from('components')
            .insert(
              data.components.map((component, index) => ({
                design_system_id: designSystemId,
                ...component,
                order_index: index,
              }))
            )

          if (componentsError) throw componentsError
        }
      }

      // 테마 업데이트 (기존 삭제 후 재생성)
      if (data.themes) {
        await supabase
          .from('themes')
          .delete()
          .eq('design_system_id', designSystemId)

        if (data.themes.length > 0) {
          const { error: themesError } = await supabase
            .from('themes')
            .insert(
              data.themes.map((theme, index) => ({
                design_system_id: designSystemId,
                ...theme,
                is_default: index === 0,
              }))
            )

          if (themesError) throw themesError
        }
      }

      // 버전 히스토리 저장
      await this.saveVersion(designSystemId, newVersion, data as DesignSystemData, changelog)
    } catch (error) {
      console.error('Error updating design system:', error)
      throw error
    }
  }

  private async saveVersion(
    designSystemId: string,
    version: number,
    data: DesignSystemData,
    changelog?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('design_system_versions')
      .insert({
        design_system_id: designSystemId,
        version,
        data,
        changelog,
      })

    if (error) throw error
  }

  async getDesignSystem(id: string, userId?: string): Promise<DesignSystemWithDetails | null> {
    try {
      // Supabase가 설정되지 않은 경우 시뮬레이션
      if (!isSupabaseConfigured()) {
        return {
          id,
          user_id: userId || 'temp-user-id',
          name: 'Sample Design System',
          description: 'This is a sample design system',
          is_public: false,
          share_token: 'sample-token',
          thumbnail_url: null,
          tags: ['sample', 'demo'],
          category: 'Web App',
          favorite_count: 0,
          download_count: 0,
          rating_average: 0,
          rating_count: 0,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          components: [],
          themes: [],
          is_favorited: false,
          user_rating: undefined
        }
      }

      const { data: designSystem, error: dsError } = await supabase
        .from('design_systems')
        .select('*')
        .eq('id', id)
        .single()

      if (dsError) throw dsError

      // 공개되지 않은 시스템의 경우 소유자만 접근 가능
      if (!designSystem.is_public && designSystem.user_id !== userId) {
        throw new Error('Access denied')
      }

      // 컴포넌트 가져오기
      const { data: components, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .eq('design_system_id', id)
        .order('order_index')

      if (componentsError) throw componentsError

      // 테마 가져오기
      const { data: themes, error: themesError } = await supabase
        .from('themes')
        .select('*')
        .eq('design_system_id', id)

      if (themesError) throw themesError

      // 즐겨찾기 상태 확인
      let is_favorited = false
      if (userId) {
        const { data: favorite } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('design_system_id', id)
          .single()

        is_favorited = !!favorite
      }

      // 사용자 평점 확인
      let user_rating = undefined
      if (userId) {
        const { data: rating } = await supabase
          .from('ratings')
          .select('rating')
          .eq('user_id', userId)
          .eq('design_system_id', id)
          .single()

        user_rating = rating?.rating
      }

      return {
        ...designSystem,
        components: components || [],
        themes: themes || [],
        is_favorited,
        user_rating,
      }
    } catch (error) {
      console.error('Error getting design system:', error)
      return null
    }
  }

  async getUserDesignSystems(userId: string): Promise<DesignSystem[]> {
    try {
      // Supabase가 설정되지 않은 경우 시뮬레이션
      if (!isSupabaseConfigured()) {
        console.info('📋 Simulating user design systems fetch (Supabase not configured)')
        return []
      }

      const { data, error } = await supabase
        .from('design_systems')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error getting user design systems:', error)
      return []
    }
  }

  async getPublicDesignSystems(
    page: number = 1,
    limit: number = 12,
    category?: string,
    tags?: string[],
    searchQuery?: string,
    sortBy: 'created_at' | 'updated_at' | 'rating_average' | 'download_count' = 'updated_at'
  ): Promise<{ systems: DesignSystem[]; total: number }> {
    try {
      // Supabase가 설정되지 않은 경우 시뮬레이션 데이터 반환
      if (!isSupabaseConfigured()) {
        console.info('🌐 Simulating public design systems fetch (Supabase not configured)')
        
        // 시뮬레이션 데이터
        const sampleSystems: DesignSystem[] = [
          {
            id: 'sample-1',
            user_id: 'user-1',
            name: 'Modern E-commerce UI',
            description: '현대적인 이커머스 사이트를 위한 완전한 디자인 시스템입니다.',
            is_public: true,
            share_token: 'sample-token-1',
            thumbnail_url: null,
            tags: ['e-commerce', 'modern', 'responsive'],
            category: 'E-commerce',
            favorite_count: 24,
            download_count: 156,
            rating_average: 4.8,
            rating_count: 12,
            version: 1,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'sample-2',
            user_id: 'user-2',
            name: 'Dashboard Pro',
            description: '관리자 대시보드를 위한 프로페셔널 컴포넌트 라이브러리',
            is_public: true,
            share_token: 'sample-token-2',
            thumbnail_url: null,
            tags: ['dashboard', 'admin', 'charts'],
            category: 'Dashboard',
            favorite_count: 18,
            download_count: 89,
            rating_average: 4.5,
            rating_count: 8,
            version: 2,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'sample-3',
            user_id: 'user-3',
            name: 'Mobile First Components',
            description: '모바일 우선 접근 방식으로 설계된 반응형 컴포넌트',
            is_public: true,
            share_token: 'sample-token-3',
            thumbnail_url: null,
            tags: ['mobile', 'responsive', 'touch'],
            category: 'Mobile App',
            favorite_count: 31,
            download_count: 203,
            rating_average: 4.9,
            rating_count: 15,
            version: 1,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]

        // 필터링 적용
        let filteredSystems = sampleSystems

        if (category && category !== 'All') {
          filteredSystems = filteredSystems.filter(system => system.category === category)
        }

        if (tags && tags.length > 0) {
          filteredSystems = filteredSystems.filter(system => 
            system.tags && tags.some(tag => system.tags!.includes(tag))
          )
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredSystems = filteredSystems.filter(system =>
            system.name.toLowerCase().includes(query) ||
            (system.description && system.description.toLowerCase().includes(query))
          )
        }

        // 정렬 적용
        filteredSystems.sort((a, b) => {
          switch (sortBy) {
            case 'created_at':
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'updated_at':
              return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            case 'rating_average':
              return b.rating_average - a.rating_average
            case 'download_count':
              return b.download_count - a.download_count
            default:
              return 0
          }
        })

        // 페이징 적용
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedSystems = filteredSystems.slice(startIndex, endIndex)

        return {
          systems: paginatedSystems,
          total: filteredSystems.length
        }
      }

      let query = supabase
        .from('design_systems')
        .select('*', { count: 'exact' })
        .eq('is_public', true)

      if (category) {
        query = query.eq('category', category)
      }

      if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags)
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data, error, count } = await query
        .order(sortBy, { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return {
        systems: data || [],
        total: count || 0,
      }
    } catch (error) {
      console.error('Error getting public design systems:', error)
      return { systems: [], total: 0 }
    }
  }

  async togglePublic(designSystemId: string, userId: string, isPublic: boolean): Promise<void> {
    try {
      // 임시 처리: 실제 Supabase 연결 없이 시뮬레이션
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
        console.log('Simulating toggle public:', { designSystemId, userId, isPublic })
        return
      }

      const { error } = await supabase
        .from('design_systems')
        .update({ is_public: isPublic })
        .eq('id', designSystemId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error toggling public status:', error)
      throw error
    }
  }

  async deleteDesignSystem(designSystemId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('design_systems')
        .delete()
        .eq('id', designSystemId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting design system:', error)
      throw error
    }
  }

  async toggleFavorite(designSystemId: string, userId: string): Promise<boolean> {
    try {
      // 현재 즐겨찾기 상태 확인
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('design_system_id', designSystemId)
        .single()

      if (existing) {
        // 즐겨찾기 제거
        await supabase
          .from('user_favorites')
          .delete()
          .eq('id', existing.id)

        // favorite_count 감소
        await supabase.rpc('decrement_favorite_count', { system_id: designSystemId })
        
        return false
      } else {
        // 즐겨찾기 추가
        await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            design_system_id: designSystemId,
          })

        // favorite_count 증가
        await supabase.rpc('increment_favorite_count', { system_id: designSystemId })
        
        return true
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  async rateDesignSystem(
    designSystemId: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: userId,
          design_system_id: designSystemId,
          rating,
          comment,
        })

      if (error) throw error
    } catch (error) {
      console.error('Error rating design system:', error)
      throw error
    }
  }

  async getDesignSystemByShareToken(shareToken: string): Promise<DesignSystemWithDetails | null> {
    try {
      // Supabase가 설정되지 않은 경우 시뮬레이션
      if (!isSupabaseConfigured()) {
        console.info('🔗 Simulating shared design system fetch (Supabase not configured)')
        
        // 시뮬레이션 데이터 반환
        if (shareToken.startsWith('sample-token')) {
          const sampleSystem: DesignSystemWithDetails = {
            id: 'sample-1',
            user_id: 'user-1',
            name: 'Modern E-commerce UI',
            description: '현대적인 이커머스 사이트를 위한 완전한 디자인 시스템입니다. 반응형 디자인과 접근성을 고려하여 설계되었습니다.',
            is_public: true,
            share_token: shareToken,
            thumbnail_url: null,
            tags: ['e-commerce', 'modern', 'responsive', 'accessible'],
            category: 'E-commerce',
            favorite_count: 24,
            download_count: 156,
            rating_average: 4.8,
            rating_count: 12,
            version: 1,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            components: [
              {
                id: 'comp-1',
                design_system_id: 'sample-1',
                name: 'Primary Button',
                type: 'button',
                props: { variant: 'primary', size: 'medium' },
                styles: { backgroundColor: '#3B82F6', color: '#FFFFFF' },
                code: null,
                preview_url: null,
                order_index: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 'comp-2',
                design_system_id: 'sample-1',
                name: 'Product Card',
                type: 'card',
                props: { elevation: 2, rounded: true },
                styles: { padding: '1rem', borderRadius: '0.5rem' },
                code: null,
                preview_url: null,
                order_index: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ],
            themes: [
              {
                id: 'theme-1',
                design_system_id: 'sample-1',
                name: 'Default Theme',
                colors: {
                  primary: '#3B82F6',
                  secondary: '#64748B',
                  background: '#FFFFFF',
                  foreground: '#0F172A',
                  muted: '#F1F5F9',
                  accent: '#8B5CF6'
                },
                typography: {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: { base: '1rem', lg: '1.125rem' }
                },
                spacing: {
                  sm: '0.5rem',
                  md: '1rem',
                  lg: '1.5rem'
                },
                is_default: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]
          }
          return sampleSystem
        }
        return null
      }
      const { data: designSystem, error: dsError } = await supabase
        .from('design_systems')
        .select('*')
        .eq('share_token', shareToken)
        .single()

      if (dsError) throw dsError

      // 컴포넌트와 테마 가져오기
      const [componentsResult, themesResult] = await Promise.all([
        supabase
          .from('components')
          .select('*')
          .eq('design_system_id', designSystem.id)
          .order('order_index'),
        supabase
          .from('themes')
          .select('*')
          .eq('design_system_id', designSystem.id),
      ])

      if (componentsResult.error) throw componentsResult.error
      if (themesResult.error) throw themesResult.error

      // 다운로드 카운트 증가
      await supabase.rpc('increment_download_count', { system_id: designSystem.id })

      return {
        ...designSystem,
        components: componentsResult.data || [],
        themes: themesResult.data || [],
      }
    } catch (error) {
      console.error('Error getting design system by share token:', error)
      return null
    }
  }

  async getVersionHistory(designSystemId: string, userId?: string): Promise<DesignSystemVersion[]> {
    try {
      // 접근 권한 확인
      const { data: designSystem } = await supabase
        .from('design_systems')
        .select('user_id, is_public')
        .eq('id', designSystemId)
        .single()

      if (!designSystem) throw new Error('Design system not found')
      
      if (!designSystem.is_public && designSystem.user_id !== userId) {
        throw new Error('Access denied')
      }

      const { data, error } = await supabase
        .from('design_system_versions')
        .select('*')
        .eq('design_system_id', designSystemId)
        .order('version', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error getting version history:', error)
      return []
    }
  }
}

export const designSystemService = new DesignSystemService()