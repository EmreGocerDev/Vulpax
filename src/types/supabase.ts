export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type AnyTable = {
  Row: any
  Insert: any
  Update: any
  Relationships: any[]
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          features: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          features?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          features?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      demos: AnyTable
      applications: AnyTable
      comments: AnyTable
      downloads: AnyTable
      categories: AnyTable
      references: AnyTable
      reference_images: AnyTable
      saved_cards: AnyTable
      profiles: AnyTable
      music: AnyTable
      music_library: AnyTable
      contact_messages: AnyTable
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
  }
}
