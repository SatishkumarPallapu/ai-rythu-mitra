-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (additional farmer info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  farm_size_acres DECIMAL,
  language_preference TEXT DEFAULT 'english',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop master data with all details
CREATE TABLE IF NOT EXISTS public.crops_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- vegetables, fruits, pulses, flowers, etc.
  duration_days INTEGER NOT NULL,
  season TEXT,
  daily_market_crop BOOLEAN DEFAULT FALSE,
  market_demand_index DECIMAL DEFAULT 0,
  restaurant_usage_index DECIMAL DEFAULT 0,
  profit_index TEXT,
  water_requirement TEXT,
  soil_type TEXT[],
  climate_tolerance TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop historical price data (10 years)
CREATE TABLE IF NOT EXISTS public.crop_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES public.crops_master(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  price_per_quintal DECIMAL NOT NULL,
  market_name TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price forecasts (AI predictions)
CREATE TABLE IF NOT EXISTS public.price_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES public.crops_master(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  predicted_price DECIMAL NOT NULL,
  confidence_score DECIMAL,
  trend TEXT, -- rising, falling, stable
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed recommendations
CREATE TABLE IF NOT EXISTS public.seed_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES public.crops_master(id) ON DELETE CASCADE,
  seed_variety TEXT NOT NULL,
  avg_yield_per_acre DECIMAL,
  resistance_to_pests TEXT[],
  best_season TEXT,
  source TEXT,
  price_per_kg DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farmer's active crop plans (selected crops with roadmap)
CREATE TABLE IF NOT EXISTS public.crop_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops_master(id) ON DELETE CASCADE,
  seed_id UUID REFERENCES public.seed_recommendations(id),
  start_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  actual_harvest_date DATE,
  status TEXT DEFAULT 'active', -- active, harvested, cancelled
  field_location TEXT,
  area_acres DECIMAL,
  multi_crop_type TEXT, -- sequential, inter, mixed, relay, single
  companion_crops UUID[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily roadmap tasks (day-by-day guidance)
CREATE TABLE IF NOT EXISTS public.crop_roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_plan_id UUID REFERENCES public.crop_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_type TEXT, -- sowing, irrigation, fertilizer, pesticide, monitoring, harvesting
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop health diagnostics (image-based AI analysis)
CREATE TABLE IF NOT EXISTS public.crop_diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_plan_id UUID REFERENCES public.crop_plans(id),
  image_url TEXT,
  diagnosis TEXT,
  disease_detected TEXT,
  confidence_score DECIMAL,
  treatment_recommendations TEXT[],
  similar_images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pesticide application tracking
CREATE TABLE IF NOT EXISTS public.pesticide_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_plan_id UUID REFERENCES public.crop_plans(id) ON DELETE CASCADE,
  pesticide_name TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  application_method TEXT,
  application_date DATE NOT NULL,
  reason TEXT,
  next_application_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather alerts and forecasts
CREATE TABLE IF NOT EXISTS public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- rain, temperature, drought, flood
  severity TEXT, -- low, medium, high
  message TEXT NOT NULL,
  forecast_days INTEGER,
  start_date DATE,
  end_date DATE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp alert logs
CREATE TABLE IF NOT EXISTS public.whatsapp_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL, -- weather, moisture, diagnosis, health
  message_content TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'sent' -- sent, failed, pending
);

-- Multi-cropping strategies
CREATE TABLE IF NOT EXISTS public.multi_crop_strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_name TEXT NOT NULL,
  strategy_type TEXT NOT NULL, -- sequential, inter, mixed, relay
  crops_involved UUID[] NOT NULL,
  expected_total_profit DECIMAL,
  land_utilization_percent DECIMAL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Natural pest prevention tips
CREATE TABLE IF NOT EXISTS public.pest_prevention_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES public.crops_master(id),
  pest_type TEXT NOT NULL, -- monkeys, rats, snakes, pigs, insects
  prevention_method TEXT NOT NULL,
  is_natural BOOLEAN DEFAULT TRUE,
  effectiveness_rating DECIMAL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seed_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesticide_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_crop_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_prevention_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for crops_master (public read)
CREATE POLICY "Anyone can view crops master data" ON public.crops_master FOR SELECT USING (true);

-- RLS Policies for crop_price_history (public read)
CREATE POLICY "Anyone can view price history" ON public.crop_price_history FOR SELECT USING (true);

-- RLS Policies for price_forecasts (public read)
CREATE POLICY "Anyone can view price forecasts" ON public.price_forecasts FOR SELECT USING (true);

-- RLS Policies for seed_recommendations (public read)
CREATE POLICY "Anyone can view seed recommendations" ON public.seed_recommendations FOR SELECT USING (true);

-- RLS Policies for crop_plans (user-specific)
CREATE POLICY "Users can view own crop plans" ON public.crop_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own crop plans" ON public.crop_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crop plans" ON public.crop_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own crop plans" ON public.crop_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for crop_roadmap_tasks
CREATE POLICY "Users can view own roadmap tasks" ON public.crop_roadmap_tasks FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.crop_plans WHERE crop_plans.id = crop_roadmap_tasks.crop_plan_id AND crop_plans.user_id = auth.uid()));
CREATE POLICY "Users can create own roadmap tasks" ON public.crop_roadmap_tasks FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.crop_plans WHERE crop_plans.id = crop_roadmap_tasks.crop_plan_id AND crop_plans.user_id = auth.uid()));
CREATE POLICY "Users can update own roadmap tasks" ON public.crop_roadmap_tasks FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.crop_plans WHERE crop_plans.id = crop_roadmap_tasks.crop_plan_id AND crop_plans.user_id = auth.uid()));

-- RLS Policies for crop_diagnostics
CREATE POLICY "Users can view own diagnostics" ON public.crop_diagnostics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own diagnostics" ON public.crop_diagnostics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for pesticide_applications
CREATE POLICY "Users can view own pesticide records" ON public.pesticide_applications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.crop_plans WHERE crop_plans.id = pesticide_applications.crop_plan_id AND crop_plans.user_id = auth.uid()));
CREATE POLICY "Users can create own pesticide records" ON public.pesticide_applications FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.crop_plans WHERE crop_plans.id = pesticide_applications.crop_plan_id AND crop_plans.user_id = auth.uid()));

-- RLS Policies for weather_alerts
CREATE POLICY "Users can view own weather alerts" ON public.weather_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own weather alerts" ON public.weather_alerts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for whatsapp_alerts
CREATE POLICY "Users can view own whatsapp alerts" ON public.whatsapp_alerts FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for multi_crop_strategies
CREATE POLICY "Users can view own strategies" ON public.multi_crop_strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own strategies" ON public.multi_crop_strategies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own strategies" ON public.multi_crop_strategies FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for pest_prevention_tips (public read)
CREATE POLICY "Anyone can view pest prevention tips" ON public.pest_prevention_tips FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_crop_plans_user_id ON public.crop_plans(user_id);
CREATE INDEX idx_crop_plans_status ON public.crop_plans(status);
CREATE INDEX idx_crop_price_history_crop_id ON public.crop_price_history(crop_id);
CREATE INDEX idx_price_forecasts_crop_id ON public.price_forecasts(crop_id);
CREATE INDEX idx_roadmap_tasks_crop_plan_id ON public.crop_roadmap_tasks(crop_plan_id);
CREATE INDEX idx_diagnostics_user_id ON public.crop_diagnostics(user_id);
CREATE INDEX idx_weather_alerts_user_id ON public.weather_alerts(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for crop_plans
CREATE TRIGGER update_crop_plans_updated_at BEFORE UPDATE ON public.crop_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();