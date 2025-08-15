export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      design_systems: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          theme_data: Json
          selected_components: string[]
          component_settings: Json
          is_public: boolean
          is_favorite: boolean
          tags: string[]
          category: string | null
          version: number
          likes_count: number
          downloads_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          theme_data: Json
          selected_components?: string[]
          component_settings?: Json
          is_public?: boolean
          is_favorite?: boolean
          tags?: string[]
          category?: string | null
          version?: number
          likes_count?: number
          downloads_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          theme_data?: Json
          selected_components?: string[]
          component_settings?: Json
          is_public?: boolean
          is_favorite?: boolean
          tags?: string[]
          category?: string | null
          version?: number
          likes_count?: number
          downloads_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          design_system_id: string
          component_type: string
          component_data: Json
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          component_type: string
          component_data: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          component_type?: string
          component_data?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          design_system_id: string
          version: number
          theme_data: Json
          change_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          version: number
          theme_data: Json
          change_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          version?: number
          theme_data?: Json
          change_description?: string | null
          created_at?: string
        }
      }
      shared_systems: {
        Row: {
          id: string
          design_system_id: string
          share_token: string
          is_active: boolean
          access_type: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_system_id: string
          share_token: string
          is_active?: boolean
          access_type?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_system_id?: string
          share_token?: string
          is_active?: boolean
          access_type?: string
          expires_at?: string | null
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
      system_ratings: {
        Row: {
          id: string
          user_id: string
          design_system_id: string
          rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_system_id: string
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          design_system_id?: string
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      system_downloads: {
        Row: {
          id: string
          user_id: string | null
          design_system_id: string
          download_type: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          design_system_id: string
          download_type?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          design_system_id?: string
          download_type?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}