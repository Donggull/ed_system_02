import { supabase, getCurrentUser } from './supabase'
import { DesignSystemTheme, ComponentType, ComponentSettings } from '@/contexts/DesignSystemContext'
import { Database } from './database.types'

type DesignSystem = Database['public']['Tables']['design_systems']['Row']
type DesignSystemInsert = Database['public']['Tables']['design_systems']['Insert']
type DesignSystemUpdate = Database['public']['Tables']['design_systems']['Update']

export interface SaveDesignSystemParams {
  name: string
  description?: string
  theme: DesignSystemTheme
  selectedComponents: ComponentType[]
  componentSettings: ComponentSettings
  tags?: string[]
  category?: string
  isPublic?: boolean
}

export interface DesignSystemWithDetails extends DesignSystem {
  themes?: Database['public']['Tables']['themes']['Row'][]
  components?: Database['public']['Tables']['components']['Row'][]
  shared_systems?: Database['public']['Tables']['shared_systems']['Row'][]
  user_favorites?: Database['public']['Tables']['user_favorites']['Row'][]
  system_ratings?: {
    rating: number
    feedback: string
    user_id: string
  }[]
}

export class DesignSystemService {
  
  // Save a new design system
  static async saveDesignSystem(params: SaveDesignSystemParams): Promise<DesignSystem> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    const designSystemData: DesignSystemInsert = {
      user_id: user.id,
      name: params.name,
      description: params.description || null,
      theme_data: params.theme as any,
      selected_components: params.selectedComponents,
      component_settings: params.componentSettings as any,
      tags: params.tags || [],
      category: params.category || null,
      is_public: params.isPublic || false,
      version: 1
    }

    const { data, error } = await supabase
      .from('design_systems')
      .insert(designSystemData)
      .select()
      .single()

    if (error) throw error
    
    // Save initial theme version
    await this.saveThemeVersion(data.id, 1, params.theme, 'Initial version')
    
    // Save component data
    await this.saveComponents(data.id, params.selectedComponents, params.componentSettings)

    return data
  }

  // Update existing design system
  static async updateDesignSystem(
    id: string, 
    updates: Partial<SaveDesignSystemParams>,
    changeDescription?: string
  ): Promise<DesignSystem> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    // First get current version
    const { data: currentSystem, error: fetchError } = await supabase
      .from('design_systems')
      .select('version, user_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (currentSystem.user_id !== user.id) throw new Error('Unauthorized')

    const newVersion = currentSystem.version + 1
    
    const updateData: DesignSystemUpdate = {
      version: newVersion,
      updated_at: new Date().toISOString()
    }

    if (updates.name) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.theme) updateData.theme_data = updates.theme as any
    if (updates.selectedComponents) updateData.selected_components = updates.selectedComponents
    if (updates.componentSettings) updateData.component_settings = updates.componentSettings as any
    if (updates.tags) updateData.tags = updates.tags
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic

    const { data, error } = await supabase
      .from('design_systems')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Save new theme version if theme was updated
    if (updates.theme) {
      await this.saveThemeVersion(id, newVersion, updates.theme, changeDescription)
    }

    // Update components if changed
    if (updates.selectedComponents || updates.componentSettings) {
      await this.updateComponents(
        id, 
        updates.selectedComponents || [], 
        updates.componentSettings || {}
      )
    }

    return data
  }

  // Get user's design systems
  static async getUserDesignSystems(userId?: string): Promise<DesignSystem[]> {
    const user = userId ? { id: userId } : await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    const { data, error } = await supabase
      .from('design_systems')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get public design systems for discovery
  static async getPublicDesignSystems(
    limit = 20,
    offset = 0,
    category?: string,
    tags?: string[],
    sortBy: 'created_at' | 'updated_at' | 'likes_count' | 'downloads_count' = 'updated_at'
  ): Promise<DesignSystem[]> {
    let query = supabase
      .from('design_systems')
      .select('*')
      .eq('is_public', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data, error } = await query
      .order(sortBy, { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  // Get design system with full details
  static async getDesignSystemWithDetails(id: string): Promise<DesignSystemWithDetails | null> {
    const { data, error } = await supabase
      .from('design_systems')
      .select(`
        *,
        themes (*),
        components (*),
        shared_systems (*),
        user_favorites (*),
        system_ratings (rating, feedback, user_id)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Delete design system
  static async deleteDesignSystem(id: string): Promise<void> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    // Verify ownership
    const { data: system, error: fetchError } = await supabase
      .from('design_systems')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (system.user_id !== user.id) throw new Error('Unauthorized')

    const { error } = await supabase
      .from('design_systems')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Save theme version
  private static async saveThemeVersion(
    designSystemId: string,
    version: number,
    themeData: DesignSystemTheme,
    changeDescription?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('themes')
      .insert({
        design_system_id: designSystemId,
        version,
        theme_data: themeData as any,
        change_description: changeDescription || null
      })

    if (error) throw error
  }

  // Save components
  private static async saveComponents(
    designSystemId: string,
    selectedComponents: ComponentType[],
    componentSettings: ComponentSettings
  ): Promise<void> {
    const componentsData = selectedComponents.map(componentType => ({
      design_system_id: designSystemId,
      component_type: componentType,
      component_data: {} as any, // Will be populated with generated component code
      settings: (componentSettings[componentType] || {}) as any
    }))

    if (componentsData.length > 0) {
      const { error } = await supabase
        .from('components')
        .insert(componentsData)

      if (error) throw error
    }
  }

  // Update components
  private static async updateComponents(
    designSystemId: string,
    selectedComponents: ComponentType[],
    componentSettings: ComponentSettings
  ): Promise<void> {
    // Delete existing components
    const { error: deleteError } = await supabase
      .from('components')
      .delete()
      .eq('design_system_id', designSystemId)

    if (deleteError) throw deleteError

    // Insert new components
    await this.saveComponents(designSystemId, selectedComponents, componentSettings)
  }

  // Toggle favorite
  static async toggleFavorite(designSystemId: string): Promise<boolean> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('design_system_id', designSystemId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('design_system_id', designSystemId)

      if (error) throw error
      return false
    } else {
      // Add favorite
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          design_system_id: designSystemId
        })

      if (error) throw error
      return true
    }
  }

  // Add rating and feedback
  static async addRating(
    designSystemId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    const { error } = await supabase
      .from('system_ratings')
      .upsert({
        user_id: user.id,
        design_system_id: designSystemId,
        rating,
        feedback: feedback || null
      })

    if (error) throw error
  }

  // Record download
  static async recordDownload(
    designSystemId: string,
    downloadType: 'full' | 'theme_only' | 'components_only' = 'full'
  ): Promise<void> {
    const user = await getCurrentUser()

    // Increment download count
    const { error: updateError } = await supabase
      .from('design_systems')
      .update({ 
        downloads_count: supabase.sql`downloads_count + 1` 
      })
      .eq('id', designSystemId)

    if (updateError) throw updateError

    // Record download event
    const { error } = await supabase
      .from('system_downloads')
      .insert({
        user_id: user?.id || null,
        design_system_id: designSystemId,
        download_type: downloadType,
        ip_address: null, // Would need server-side implementation
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null
      })

    if (error) throw error
  }

  // Create share link
  static async createShareLink(
    designSystemId: string,
    accessType: 'public' | 'link_only' = 'link_only',
    expiresAt?: Date
  ): Promise<string> {
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated')

    // Verify ownership
    const { data: system, error: fetchError } = await supabase
      .from('design_systems')
      .select('user_id')
      .eq('id', designSystemId)
      .single()

    if (fetchError) throw fetchError
    if (system.user_id !== user.id) throw new Error('Unauthorized')

    const shareToken = crypto.randomUUID()

    const { error } = await supabase
      .from('shared_systems')
      .insert({
        design_system_id: designSystemId,
        share_token: shareToken,
        access_type: accessType,
        expires_at: expiresAt?.toISOString() || null
      })

    if (error) throw error

    return shareToken
  }

  // Get shared design system by token
  static async getSharedDesignSystem(shareToken: string): Promise<DesignSystemWithDetails | null> {
    const { data: sharedSystem, error: shareError } = await supabase
      .from('shared_systems')
      .select('design_system_id, is_active, expires_at')
      .eq('share_token', shareToken)
      .single()

    if (shareError) throw shareError
    if (!sharedSystem.is_active) throw new Error('Share link is no longer active')
    if (sharedSystem.expires_at && new Date(sharedSystem.expires_at) < new Date()) {
      throw new Error('Share link has expired')
    }

    return await this.getDesignSystemWithDetails(sharedSystem.design_system_id)
  }
}