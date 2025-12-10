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
          image_url: string | null
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
          image_url?: string | null
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
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
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
      orders: {
        Row: {
          id: string
          merchant_oid: string
          user_id: string
          product_id: string | null
          plan_id: string | null
          application_id: string | null
          amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_oid: string
          user_id: string
          product_id?: string | null
          plan_id?: string | null
          application_id?: string | null
          amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_oid?: string
          user_id?: string
          product_id?: string | null
          plan_id?: string | null
          application_id?: string | null
          amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_application_id_fkey"
            columns: ["application_id"]
            referencedRelation: "applications"
            referencedColumns: ["id"]
          }
        ]
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
