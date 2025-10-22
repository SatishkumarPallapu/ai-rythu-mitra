export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crop_diagnostics: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          crop_plan_id: string | null
          diagnosis: string | null
          disease_detected: string | null
          id: string
          image_url: string | null
          similar_images: string[] | null
          treatment_recommendations: string[] | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          crop_plan_id?: string | null
          diagnosis?: string | null
          disease_detected?: string | null
          id?: string
          image_url?: string | null
          similar_images?: string[] | null
          treatment_recommendations?: string[] | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          crop_plan_id?: string | null
          diagnosis?: string | null
          disease_detected?: string | null
          id?: string
          image_url?: string | null
          similar_images?: string[] | null
          treatment_recommendations?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_diagnostics_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_plans: {
        Row: {
          actual_harvest_date: string | null
          area_acres: number | null
          companion_crops: string[] | null
          created_at: string | null
          crop_id: string | null
          expected_harvest_date: string
          field_location: string | null
          id: string
          multi_crop_type: string | null
          notes: string | null
          seed_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          area_acres?: number | null
          companion_crops?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          expected_harvest_date: string
          field_location?: string | null
          id?: string
          multi_crop_type?: string | null
          notes?: string | null
          seed_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          area_acres?: number | null
          companion_crops?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          expected_harvest_date?: string
          field_location?: string | null
          id?: string
          multi_crop_type?: string | null
          notes?: string | null
          seed_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_plans_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_plans_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "seed_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_price_history: {
        Row: {
          created_at: string | null
          crop_id: string | null
          id: string
          market_name: string | null
          month: number
          price_per_quintal: number
          region: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          market_name?: string | null
          month: number
          price_per_quintal: number
          region?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          market_name?: string | null
          month?: number
          price_per_quintal?: number
          region?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "crop_price_history_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_roadmap_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          crop_plan_id: string | null
          day_number: number
          id: string
          is_completed: boolean | null
          reminder_sent: boolean | null
          task_description: string | null
          task_title: string
          task_type: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          day_number: number
          id?: string
          is_completed?: boolean | null
          reminder_sent?: boolean | null
          task_description?: string | null
          task_title: string
          task_type?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          day_number?: number
          id?: string
          is_completed?: boolean | null
          reminder_sent?: boolean | null
          task_description?: string | null
          task_title?: string
          task_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_roadmap_tasks_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      crops_master: {
        Row: {
          category: string
          climate_tolerance: string[] | null
          created_at: string | null
          daily_market_crop: boolean | null
          duration_days: number
          id: string
          market_demand_index: number | null
          name: string
          profit_index: string | null
          restaurant_usage_index: number | null
          season: string | null
          soil_type: string[] | null
          water_requirement: string | null
        }
        Insert: {
          category: string
          climate_tolerance?: string[] | null
          created_at?: string | null
          daily_market_crop?: boolean | null
          duration_days: number
          id?: string
          market_demand_index?: number | null
          name: string
          profit_index?: string | null
          restaurant_usage_index?: number | null
          season?: string | null
          soil_type?: string[] | null
          water_requirement?: string | null
        }
        Update: {
          category?: string
          climate_tolerance?: string[] | null
          created_at?: string | null
          daily_market_crop?: boolean | null
          duration_days?: number
          id?: string
          market_demand_index?: number | null
          name?: string
          profit_index?: string | null
          restaurant_usage_index?: number | null
          season?: string | null
          soil_type?: string[] | null
          water_requirement?: string | null
        }
        Relationships: []
      }
      multi_crop_strategies: {
        Row: {
          created_at: string | null
          crops_involved: string[]
          end_date: string | null
          expected_total_profit: number | null
          id: string
          land_utilization_percent: number | null
          notes: string | null
          start_date: string | null
          strategy_name: string
          strategy_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          crops_involved: string[]
          end_date?: string | null
          expected_total_profit?: number | null
          id?: string
          land_utilization_percent?: number | null
          notes?: string | null
          start_date?: string | null
          strategy_name: string
          strategy_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          crops_involved?: string[]
          end_date?: string | null
          expected_total_profit?: number | null
          id?: string
          land_utilization_percent?: number | null
          notes?: string | null
          start_date?: string | null
          strategy_name?: string
          strategy_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pest_prevention_tips: {
        Row: {
          created_at: string | null
          crop_id: string | null
          description: string | null
          effectiveness_rating: number | null
          id: string
          is_natural: boolean | null
          pest_type: string
          prevention_method: string
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_natural?: boolean | null
          pest_type: string
          prevention_method: string
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_natural?: boolean | null
          pest_type?: string
          prevention_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "pest_prevention_tips_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      pesticide_applications: {
        Row: {
          application_date: string
          application_method: string | null
          created_at: string | null
          crop_plan_id: string | null
          id: string
          next_application_date: string | null
          notes: string | null
          pesticide_name: string
          quantity: number
          reason: string | null
          unit: string
        }
        Insert: {
          application_date: string
          application_method?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          id?: string
          next_application_date?: string | null
          notes?: string | null
          pesticide_name: string
          quantity: number
          reason?: string | null
          unit: string
        }
        Update: {
          application_date?: string
          application_method?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          id?: string
          next_application_date?: string | null
          notes?: string | null
          pesticide_name?: string
          quantity?: number
          reason?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesticide_applications_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      price_forecasts: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          crop_id: string | null
          forecast_date: string
          id: string
          predicted_price: number
          trend: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          crop_id?: string | null
          forecast_date: string
          id?: string
          predicted_price: number
          trend?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          crop_id?: string | null
          forecast_date?: string
          id?: string
          predicted_price?: number
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_forecasts_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          farm_size_acres: number | null
          full_name: string | null
          id: string
          language_preference: string | null
          location: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          farm_size_acres?: number | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          farm_size_acres?: number | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seed_recommendations: {
        Row: {
          avg_yield_per_acre: number | null
          best_season: string | null
          created_at: string | null
          crop_id: string | null
          id: string
          price_per_kg: number | null
          resistance_to_pests: string[] | null
          seed_variety: string
          source: string | null
        }
        Insert: {
          avg_yield_per_acre?: number | null
          best_season?: string | null
          created_at?: string | null
          crop_id?: string | null
          id?: string
          price_per_kg?: number | null
          resistance_to_pests?: string[] | null
          seed_variety: string
          source?: string | null
        }
        Update: {
          avg_yield_per_acre?: number | null
          best_season?: string | null
          created_at?: string | null
          crop_id?: string | null
          id?: string
          price_per_kg?: number | null
          resistance_to_pests?: string[] | null
          seed_variety?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seed_recommendations_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          end_date: string | null
          forecast_days: number | null
          id: string
          is_read: boolean | null
          message: string
          severity: string | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          end_date?: string | null
          forecast_days?: number | null
          id?: string
          is_read?: boolean | null
          message: string
          severity?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          end_date?: string | null
          forecast_days?: number | null
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_alerts: {
        Row: {
          id: string
          message_content: string
          message_type: string
          phone_number: string
          sent_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_content: string
          message_type: string
          phone_number: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_content?: string
          message_type?: string
          phone_number?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
