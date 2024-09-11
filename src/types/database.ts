export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  address_schema: {
    Tables: {
      barangay_table: {
        Row: {
          barangay: string
          barangay_city_id: string
          barangay_id: string
          barangay_is_available: boolean
          barangay_is_disabled: boolean
          barangay_zip_code: string
        }
        Insert: {
          barangay: string
          barangay_city_id: string
          barangay_id?: string
          barangay_is_available?: boolean
          barangay_is_disabled?: boolean
          barangay_zip_code: string
        }
        Update: {
          barangay?: string
          barangay_city_id?: string
          barangay_id?: string
          barangay_is_available?: boolean
          barangay_is_disabled?: boolean
          barangay_zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "barangay_table_barangay_city_id_fkey"
            columns: ["barangay_city_id"]
            isOneToOne: false
            referencedRelation: "city_table"
            referencedColumns: ["city_id"]
          },
        ]
      }
      city_table: {
        Row: {
          city: string
          city_id: string
          city_is_available: boolean
          city_is_disabled: boolean
          city_province_id: string
        }
        Insert: {
          city: string
          city_id?: string
          city_is_available?: boolean
          city_is_disabled?: boolean
          city_province_id: string
        }
        Update: {
          city?: string
          city_id?: string
          city_is_available?: boolean
          city_is_disabled?: boolean
          city_province_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_table_city_province_id_fkey"
            columns: ["city_province_id"]
            isOneToOne: false
            referencedRelation: "province_table"
            referencedColumns: ["province_id"]
          },
        ]
      }
      province_table: {
        Row: {
          province: string
          province_id: string
          province_is_available: boolean
          province_is_disabled: boolean
          province_region_id: string
        }
        Insert: {
          province: string
          province_id?: string
          province_is_available?: boolean
          province_is_disabled?: boolean
          province_region_id: string
        }
        Update: {
          province?: string
          province_id?: string
          province_is_available?: boolean
          province_is_disabled?: boolean
          province_region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "province_table_province_region_id_fkey"
            columns: ["province_region_id"]
            isOneToOne: false
            referencedRelation: "region_table"
            referencedColumns: ["region_id"]
          },
        ]
      }
      region_table: {
        Row: {
          region: string
          region_id: string
          region_is_available: boolean
          region_is_disabled: boolean
        }
        Insert: {
          region: string
          region_id?: string
          region_is_available?: boolean
          region_is_disabled?: boolean
        }
        Update: {
          region?: string
          region_id?: string
          region_is_available?: boolean
          region_is_disabled?: boolean
        }
        Relationships: []
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
  payment_schema: {
    Tables: {
      customer_card_table: {
        Row: {
          customer_card_customer_id: string
          customer_card_id: string
          customer_card_provider_id: string
          customer_card_provider_name: string
          customer_card_token: string
        }
        Insert: {
          customer_card_customer_id: string
          customer_card_id?: string
          customer_card_provider_id: string
          customer_card_provider_name: string
          customer_card_token: string
        }
        Update: {
          customer_card_customer_id?: string
          customer_card_id?: string
          customer_card_provider_id?: string
          customer_card_provider_name?: string
          customer_card_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_card_table_customer_card_customer_id_fkey"
            columns: ["customer_card_customer_id"]
            isOneToOne: false
            referencedRelation: "customer_table"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      customer_table: {
        Row: {
          customer_id: string
          customer_provider_id: string
          customer_provider_name: string
          customer_user_id: string
        }
        Insert: {
          customer_id?: string
          customer_provider_id: string
          customer_provider_name: string
          customer_user_id: string
        }
        Update: {
          customer_id?: string
          customer_provider_id?: string
          customer_provider_name?: string
          customer_user_id?: string
        }
        Relationships: []
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
  public: {
    Tables: {
      app_source_table: {
        Row: {
          app_source_date_created: string
          app_source_id: string
          app_source_name: string
        }
        Insert: {
          app_source_date_created?: string
          app_source_id?: string
          app_source_name: string
        }
        Update: {
          app_source_date_created?: string
          app_source_id?: string
          app_source_name?: string
        }
        Relationships: []
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
  transaction_schema: {
    Tables: {
      transaction_table: {
        Row: {
          transaction_app_source: string
          transaction_app_source_user_id: string
          transaction_date: string
          transaction_id: string
          transaction_payment_channel: string | null
          transaction_reference_id: string
          transaction_service_id: string
          transaction_service_name: string
          transaction_status: string
          transaction_total_amount: number
        }
        Insert: {
          transaction_app_source: string
          transaction_app_source_user_id: string
          transaction_date?: string
          transaction_id?: string
          transaction_payment_channel?: string | null
          transaction_reference_id: string
          transaction_service_id: string
          transaction_service_name: string
          transaction_status?: string
          transaction_total_amount: number
        }
        Update: {
          transaction_app_source?: string
          transaction_app_source_user_id?: string
          transaction_date?: string
          transaction_id?: string
          transaction_payment_channel?: string | null
          transaction_reference_id?: string
          transaction_service_id?: string
          transaction_service_name?: string
          transaction_status?: string
          transaction_total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_table_transaction_app_source_fkey"
            columns: ["transaction_app_source"]
            isOneToOne: false
            referencedRelation: "app_source_table"
            referencedColumns: ["app_source_id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
