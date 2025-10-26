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
      crop_cultivation_instructions: {
        Row: {
          created_at: string | null
          crop_id: string | null
          cultivation_phase: string
          day_range: string
          id: string
          instructions: string
          tips: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          cultivation_phase: string
          day_range: string
          id?: string
          instructions: string
          tips?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          cultivation_phase?: string
          day_range?: string
          id?: string
          instructions?: string
          tips?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_cultivation_instructions_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
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
          companion_crops: string[] | null
          created_at: string | null
          daily_market_crop: boolean | null
          disease_resistance_rating: number | null
          duration_days: number
          health_benefits: string | null
          home_growable: boolean | null
          id: string
          intercropping_possibility: string | null
          intercropping_probability: number | null
          market_demand_index: number | null
          medical_benefits: string | null
          name: string
          nutrient_demand: string | null
          profit_index: string | null
          proteins: string | null
          restaurant_usage_index: number | null
          season: string | null
          soil_type: string[] | null
          spacing_requirement: string | null
          vitamins: string | null
          water_requirement: string | null
        }
        Insert: {
          category: string
          climate_tolerance?: string[] | null
          companion_crops?: string[] | null
          created_at?: string | null
          daily_market_crop?: boolean | null
          disease_resistance_rating?: number | null
          duration_days: number
          health_benefits?: string | null
          home_growable?: boolean | null
          id?: string
          intercropping_possibility?: string | null
          intercropping_probability?: number | null
          market_demand_index?: number | null
          medical_benefits?: string | null
          name: string
          nutrient_demand?: string | null
          profit_index?: string | null
          proteins?: string | null
          restaurant_usage_index?: number | null
          season?: string | null
          soil_type?: string[] | null
          spacing_requirement?: string | null
          vitamins?: string | null
          water_requirement?: string | null
        }
        Update: {
          category?: string
          climate_tolerance?: string[] | null
          companion_crops?: string[] | null
          created_at?: string | null
          daily_market_crop?: boolean | null
          disease_resistance_rating?: number | null
          duration_days?: number
          health_benefits?: string | null
          home_growable?: boolean | null
          id?: string
          intercropping_possibility?: string | null
          intercropping_probability?: number | null
          market_demand_index?: number | null
          medical_benefits?: string | null
          name?: string
          nutrient_demand?: string | null
          profit_index?: string | null
          proteins?: string | null
          restaurant_usage_index?: number | null
          season?: string | null
          soil_type?: string[] | null
          spacing_requirement?: string | null
          vitamins?: string | null
          water_requirement?: string | null
        }
        Relationships: []
      }
      cultivation_tips: {
        Row: {
          application_day_range: string | null
          cost_effectiveness: string | null
          created_at: string | null
          crop_id: string | null
          environmental_impact: string | null
          expected_benefit: string | null
          id: string
          season_specific: string | null
          tip_category: string
          tip_description: string
          tip_title: string
        }
        Insert: {
          application_day_range?: string | null
          cost_effectiveness?: string | null
          created_at?: string | null
          crop_id?: string | null
          environmental_impact?: string | null
          expected_benefit?: string | null
          id?: string
          season_specific?: string | null
          tip_category: string
          tip_description: string
          tip_title: string
        }
        Update: {
          application_day_range?: string | null
          cost_effectiveness?: string | null
          created_at?: string | null
          crop_id?: string | null
          environmental_impact?: string | null
          expected_benefit?: string | null
          id?: string
          season_specific?: string | null
          tip_category?: string
          tip_description?: string
          tip_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cultivation_tips_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_tasks: {
        Row: {
          alert_sent_at: string | null
          chemical_option: string | null
          completed_at: string | null
          created_at: string | null
          crop_plan_id: string | null
          detailed_instructions: string | null
          dosage_info: string | null
          estimated_duration: string | null
          id: string
          importance_level: string | null
          is_completed: boolean | null
          organic_alternative: string | null
          task_category: string
          task_date: string | null
          task_day: number
          task_description: string | null
          task_title: string
          timing_preference: string | null
          tools_required: string[] | null
          weather_condition: string | null
          whatsapp_alert_sent: boolean | null
        }
        Insert: {
          alert_sent_at?: string | null
          chemical_option?: string | null
          completed_at?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          detailed_instructions?: string | null
          dosage_info?: string | null
          estimated_duration?: string | null
          id?: string
          importance_level?: string | null
          is_completed?: boolean | null
          organic_alternative?: string | null
          task_category: string
          task_date?: string | null
          task_day: number
          task_description?: string | null
          task_title: string
          timing_preference?: string | null
          tools_required?: string[] | null
          weather_condition?: string | null
          whatsapp_alert_sent?: boolean | null
        }
        Update: {
          alert_sent_at?: string | null
          chemical_option?: string | null
          completed_at?: string | null
          created_at?: string | null
          crop_plan_id?: string | null
          detailed_instructions?: string | null
          dosage_info?: string | null
          estimated_duration?: string | null
          id?: string
          importance_level?: string | null
          is_completed?: boolean | null
          organic_alternative?: string | null
          task_category?: string
          task_date?: string | null
          task_day?: number
          task_description?: string | null
          task_title?: string
          timing_preference?: string | null
          tools_required?: string[] | null
          weather_condition?: string | null
          whatsapp_alert_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_forecasts: {
        Row: {
          chemical_treatment: string[] | null
          created_at: string | null
          crop_id: string | null
          crop_plan_id: string | null
          diagnosis_procedure: string | null
          disease_name: string
          disease_type: string | null
          expected_week: number | null
          id: string
          organic_treatment: string[] | null
          preventive_measures: string[] | null
          probability_percent: number | null
          reference_images: string[] | null
          risk_level: string
          symptoms: string[] | null
          treatment_timeline: Json | null
          weather_dependency: string | null
        }
        Insert: {
          chemical_treatment?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          crop_plan_id?: string | null
          diagnosis_procedure?: string | null
          disease_name: string
          disease_type?: string | null
          expected_week?: number | null
          id?: string
          organic_treatment?: string[] | null
          preventive_measures?: string[] | null
          probability_percent?: number | null
          reference_images?: string[] | null
          risk_level: string
          symptoms?: string[] | null
          treatment_timeline?: Json | null
          weather_dependency?: string | null
        }
        Update: {
          chemical_treatment?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          crop_plan_id?: string | null
          diagnosis_procedure?: string | null
          disease_name?: string
          disease_type?: string | null
          expected_week?: number | null
          id?: string
          organic_treatment?: string[] | null
          preventive_measures?: string[] | null
          probability_percent?: number | null
          reference_images?: string[] | null
          risk_level?: string
          symptoms?: string[] | null
          treatment_timeline?: Json | null
          weather_dependency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disease_forecasts_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disease_forecasts_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      intercrop_plans: {
        Row: {
          created_at: string | null
          crop_plan_id: string | null
          expected_yield_increase: number | null
          fertilizer_schedule: Json | null
          id: string
          instructions: string | null
          intercrop_crops: string[]
          intercrop_type: string
          irrigation_plan: Json | null
          parent_crop_id: string | null
          probability_score: number | null
          row_arrangement: string | null
          sowing_schedule: Json | null
          spacing_ratio: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crop_plan_id?: string | null
          expected_yield_increase?: number | null
          fertilizer_schedule?: Json | null
          id?: string
          instructions?: string | null
          intercrop_crops: string[]
          intercrop_type: string
          irrigation_plan?: Json | null
          parent_crop_id?: string | null
          probability_score?: number | null
          row_arrangement?: string | null
          sowing_schedule?: Json | null
          spacing_ratio?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crop_plan_id?: string | null
          expected_yield_increase?: number | null
          fertilizer_schedule?: Json | null
          id?: string
          instructions?: string | null
          intercrop_crops?: string[]
          intercrop_type?: string
          irrigation_plan?: Json | null
          parent_crop_id?: string | null
          probability_score?: number | null
          row_arrangement?: string | null
          sowing_schedule?: Json | null
          spacing_ratio?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intercrop_plans_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intercrop_plans_parent_crop_id_fkey"
            columns: ["parent_crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      market_demand_history: {
        Row: {
          avg_price_per_quintal: number
          created_at: string | null
          crop_id: string | null
          demand_index: number | null
          id: string
          market_location: string | null
          month: number
          peak_demand: boolean | null
          price_trend: string | null
          supply_volume: number | null
          year: number
        }
        Insert: {
          avg_price_per_quintal: number
          created_at?: string | null
          crop_id?: string | null
          demand_index?: number | null
          id?: string
          market_location?: string | null
          month: number
          peak_demand?: boolean | null
          price_trend?: string | null
          supply_volume?: number | null
          year: number
        }
        Update: {
          avg_price_per_quintal?: number
          created_at?: string | null
          crop_id?: string | null
          demand_index?: number | null
          id?: string
          market_location?: string | null
          month?: number
          peak_demand?: boolean | null
          price_trend?: string | null
          supply_volume?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "market_demand_history_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_crop_prices: {
        Row: {
          created_at: string | null
          crop_id: string | null
          id: string
          price_per_kg: number
          region: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          price_per_kg: number
          region: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          price_per_kg?: number
          region?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_crop_prices_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
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
          climate_zones: string[] | null
          created_at: string | null
          crop_id: string | null
          district: string | null
          five_year_avg_yield: number | null
          germination_rate: number | null
          id: string
          maturity_days: number | null
          price_per_kg: number | null
          resistance_to_pests: string[] | null
          seed_variety: string
          soil_suitability: string[] | null
          source: string | null
          state: string | null
          water_efficiency_rating: number | null
          yield_history: Json | null
        }
        Insert: {
          avg_yield_per_acre?: number | null
          best_season?: string | null
          climate_zones?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          district?: string | null
          five_year_avg_yield?: number | null
          germination_rate?: number | null
          id?: string
          maturity_days?: number | null
          price_per_kg?: number | null
          resistance_to_pests?: string[] | null
          seed_variety: string
          soil_suitability?: string[] | null
          source?: string | null
          state?: string | null
          water_efficiency_rating?: number | null
          yield_history?: Json | null
        }
        Update: {
          avg_yield_per_acre?: number | null
          best_season?: string | null
          climate_zones?: string[] | null
          created_at?: string | null
          crop_id?: string | null
          district?: string | null
          five_year_avg_yield?: number | null
          germination_rate?: number | null
          id?: string
          maturity_days?: number | null
          price_per_kg?: number | null
          resistance_to_pests?: string[] | null
          seed_variety?: string
          soil_suitability?: string[] | null
          source?: string | null
          state?: string | null
          water_efficiency_rating?: number | null
          yield_history?: Json | null
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
      weather_forecasts: {
        Row: {
          condition: string | null
          created_at: string | null
          farming_precautions: string[] | null
          forecast_date: string
          humidity: number | null
          id: string
          location: string
          precipitation_chance: number | null
          temperature_high: number | null
          temperature_low: number | null
          wind_speed: number | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          farming_precautions?: string[] | null
          forecast_date: string
          humidity?: number | null
          id?: string
          location: string
          precipitation_chance?: number | null
          temperature_high?: number | null
          temperature_low?: number | null
          wind_speed?: number | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          farming_precautions?: string[] | null
          forecast_date?: string
          humidity?: number | null
          id?: string
          location?: string
          precipitation_chance?: number | null
          temperature_high?: number | null
          temperature_low?: number | null
          wind_speed?: number | null
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
      yield_predictions: {
        Row: {
          created_at: string | null
          crop_id: string | null
          crop_plan_id: string | null
          estimated_revenue: number | null
          factors_considered: Json | null
          id: string
          intercrop_yield: number | null
          optimal_harvest_date: string | null
          predicted_market_price: number | null
          predicted_yield_per_acre: number
          prediction_confidence: number | null
          seed_id: string | null
          single_crop_yield: number | null
          updated_at: string | null
          yield_improvement_percent: number | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          crop_plan_id?: string | null
          estimated_revenue?: number | null
          factors_considered?: Json | null
          id?: string
          intercrop_yield?: number | null
          optimal_harvest_date?: string | null
          predicted_market_price?: number | null
          predicted_yield_per_acre: number
          prediction_confidence?: number | null
          seed_id?: string | null
          single_crop_yield?: number | null
          updated_at?: string | null
          yield_improvement_percent?: number | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          crop_plan_id?: string | null
          estimated_revenue?: number | null
          factors_considered?: Json | null
          id?: string
          intercrop_yield?: number | null
          optimal_harvest_date?: string | null
          predicted_market_price?: number | null
          predicted_yield_per_acre?: number
          prediction_confidence?: number | null
          seed_id?: string | null
          single_crop_yield?: number | null
          updated_at?: string | null
          yield_improvement_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "yield_predictions_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_predictions_crop_plan_id_fkey"
            columns: ["crop_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_predictions_seed_id_fkey"
            columns: ["seed_id"]
            isOneToOne: false
            referencedRelation: "seed_recommendations"
            referencedColumns: ["id"]
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
