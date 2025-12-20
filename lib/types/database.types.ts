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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          price: number
          compare_price: number | null
          cost_price: number | null
          sku: string | null
          stock_quantity: number
          low_stock_threshold: number
          images: Json
          features: Json
          specifications: Json
          is_featured: boolean
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price: number
          compare_price?: number | null
          cost_price?: number | null
          sku?: string | null
          stock_quantity?: number
          low_stock_threshold?: number
          images?: Json
          features?: Json
          specifications?: Json
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          sku?: string | null
          stock_quantity?: number
          low_stock_threshold?: number
          images?: Json
          features?: Json
          specifications?: Json
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          company_name: string | null
          tax_number: string | null
          tax_office: string | null
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          tax_number?: string | null
          tax_office?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          tax_number?: string | null
          tax_office?: string | null
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: string
          payment_status: string
          payment_method: string | null
          payment_id: string | null
          subtotal: number
          tax_amount: number
          shipping_cost: number
          discount_amount: number
          total_amount: number
          currency: string
          shipping_address: Json | null
          billing_address: Json | null
          customer_note: string | null
          admin_note: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          product_image: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          title: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          district: string | null
          postal_code: string | null
          country: string
          is_default: boolean
          address_type: string
          created_at: string
          updated_at: string
        }
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
      }
    }
  }
}
