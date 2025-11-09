-- Enhanced AI Crop Recommendation System Schema

-- Add intercropping probability and detailed fields to crops_master
ALTER TABLE crops_master 
ADD COLUMN IF NOT EXISTS intercropping_probability INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS companion_crops TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS spacing_requirement TEXT,
ADD COLUMN IF NOT EXISTS nutrient_demand TEXT,
ADD COLUMN IF NOT EXISTS disease_resistance_rating INTEGER DEFAULT 5;

-- Create intercrop_plans table for detailed intercropping strategies
CREATE TABLE IF NOT EXISTS intercrop_plans (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_plan_id UUID REFERENCES crop_plans(id) ON DELETE CASCADE,
  parent_crop_id UUID REFERENCES crops_master(id),
  intercrop_type TEXT NOT NULL, -- strip, row, relay, mixed
  intercrop_crops UUID[] NOT NULL, -- array of crop IDs
  spacing_ratio TEXT, -- e.g., "2:1" or "3:2"
  row_arrangement TEXT,
  sowing_schedule JSONB, -- detailed day-wise sowing plan
  irrigation_plan JSONB, -- water management for mixed crops
  fertilizer_schedule JSONB, -- nutrient management plan
  expected_yield_increase NUMERIC,
  probability_score INTEGER DEFAULT 70,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create disease_forecasts table for AI-powered disease prediction
CREATE TABLE IF NOT EXISTS disease_forecasts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_plan_id UUID REFERENCES crop_plans(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops_master(id),
  disease_name TEXT NOT NULL,
  disease_type TEXT, -- fungal, bacterial, viral, pest
  risk_level TEXT NOT NULL, -- low, medium, high, critical
  probability_percent INTEGER,
  expected_week INTEGER, -- week number from sowing
  symptoms TEXT[],
  diagnosis_procedure TEXT,
  organic_treatment TEXT[],
  chemical_treatment TEXT[],
  preventive_measures TEXT[],
  treatment_timeline JSONB, -- day-wise treatment schedule
  weather_dependency TEXT,
  reference_images TEXT[], -- URLs to disease images
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance seed_recommendations with yield history
ALTER TABLE seed_recommendations
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Andhra Pradesh',
ADD COLUMN IF NOT EXISTS five_year_avg_yield NUMERIC,
ADD COLUMN IF NOT EXISTS yield_history JSONB, -- year-wise yield data
ADD COLUMN IF NOT EXISTS germination_rate NUMERIC,
ADD COLUMN IF NOT EXISTS maturity_days INTEGER,
ADD COLUMN IF NOT EXISTS soil_suitability TEXT[],
ADD COLUMN IF NOT EXISTS climate_zones TEXT[],
ADD COLUMN IF NOT EXISTS water_efficiency_rating INTEGER DEFAULT 5;

-- Create market_demand_history for 5-year historical analysis
CREATE TABLE IF NOT EXISTS market_demand_history (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_id UUID REFERENCES crops_master(id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  avg_price_per_quintal NUMERIC NOT NULL,
  demand_index NUMERIC, -- 0-100 scale
  supply_volume NUMERIC, -- in quintals
  market_location TEXT,
  peak_demand BOOLEAN DEFAULT FALSE,
  price_trend TEXT, -- rising, stable, falling
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table for cultivation roadmap
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_plan_id UUID REFERENCES crop_plans(id) ON DELETE CASCADE,
  task_day INTEGER NOT NULL, -- day number from sowing
  task_date DATE,
  task_category TEXT NOT NULL, -- irrigation, fertilizer, pesticide, weeding, monitoring
  task_title TEXT NOT NULL,
  task_description TEXT,
  detailed_instructions TEXT,
  organic_alternative TEXT,
  chemical_option TEXT,
  dosage_info TEXT,
  timing_preference TEXT, -- morning, afternoon, evening
  weather_condition TEXT, -- do not perform if rain/wind etc
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  whatsapp_alert_sent BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMP WITH TIME ZONE,
  importance_level TEXT DEFAULT 'medium', -- low, medium, high, critical
  estimated_duration TEXT, -- e.g., "2 hours"
  tools_required TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yield_predictions table for AI yield forecasting
CREATE TABLE IF NOT EXISTS yield_predictions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_plan_id UUID REFERENCES crop_plans(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops_master(id),
  seed_id UUID REFERENCES seed_recommendations(id),
  predicted_yield_per_acre NUMERIC NOT NULL,
  prediction_confidence NUMERIC, -- 0-100
  factors_considered JSONB, -- soil, weather, seed quality, irrigation
  single_crop_yield NUMERIC,
  intercrop_yield NUMERIC,
  yield_improvement_percent NUMERIC,
  optimal_harvest_date DATE,
  predicted_market_price NUMERIC,
  estimated_revenue NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cultivation_tips table for daily advisory
CREATE TABLE IF NOT EXISTS cultivation_tips (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_id UUID REFERENCES crops_master(id),
  tip_category TEXT NOT NULL, -- organic, natural, chemical, irrigation, general
  tip_title TEXT NOT NULL,
  tip_description TEXT NOT NULL,
  application_day_range TEXT, -- e.g., "15-20", "30-45"
  season_specific TEXT,
  cost_effectiveness TEXT, -- low, medium, high
  environmental_impact TEXT, -- positive, neutral, negative
  expected_benefit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_intercrop_plans_crop_plan ON intercrop_plans(crop_plan_id);
CREATE INDEX IF NOT EXISTS idx_disease_forecasts_crop_plan ON disease_forecasts(crop_plan_id);
CREATE INDEX IF NOT EXISTS idx_disease_forecasts_risk ON disease_forecasts(risk_level);
CREATE INDEX IF NOT EXISTS idx_market_demand_crop_year ON market_demand_history(crop_id, year, month);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_crop_plan ON daily_tasks(crop_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_completed ON daily_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_yield_predictions_crop_plan ON yield_predictions(crop_plan_id);

-- Enable RLS on new tables
ALTER TABLE intercrop_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_demand_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE yield_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivation_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for intercrop_plans
CREATE POLICY "Users can view own intercrop plans" 
ON intercrop_plans FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = intercrop_plans.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create own intercrop plans" 
ON intercrop_plans FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = intercrop_plans.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can update own intercrop plans" 
ON intercrop_plans FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = intercrop_plans.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

-- RLS Policies for disease_forecasts
CREATE POLICY "Users can view own disease forecasts" 
ON disease_forecasts FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = disease_forecasts.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create own disease forecasts" 
ON disease_forecasts FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = disease_forecasts.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

-- RLS Policies for market_demand_history (public read)
CREATE POLICY "Anyone can view market demand history" 
ON market_demand_history FOR SELECT 
USING (true);

-- RLS Policies for daily_tasks
CREATE POLICY "Users can view own daily tasks" 
ON daily_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = daily_tasks.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create own daily tasks" 
ON daily_tasks FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = daily_tasks.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can update own daily tasks" 
ON daily_tasks FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = daily_tasks.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

-- RLS Policies for yield_predictions
CREATE POLICY "Users can view own yield predictions" 
ON yield_predictions FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = yield_predictions.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

CREATE POLICY "Users can create own yield predictions" 
ON yield_predictions FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM crop_plans 
  WHERE crop_plans.id = yield_predictions.crop_plan_id 
  AND crop_plans.user_id = auth.uid()
));

-- RLS Policies for cultivation_tips (public read)
CREATE POLICY "Anyone can view cultivation tips" 
ON cultivation_tips FOR SELECT 
USING (true);

-- Create trigger for auto-generating daily tasks when crop plan is created
CREATE OR REPLACE FUNCTION generate_daily_tasks_for_crop()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be populated by AI service, trigger just ensures table is ready
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_daily_tasks
AFTER INSERT ON crop_plans
FOR EACH ROW
EXECUTE FUNCTION generate_daily_tasks_for_crop();