-- Add columns to crops_master for health benefits and intercropping
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS health_benefits TEXT;
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS medical_benefits TEXT;
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS vitamins TEXT;
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS proteins TEXT;
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS intercropping_possibility TEXT;
ALTER TABLE crops_master ADD COLUMN IF NOT EXISTS home_growable BOOLEAN DEFAULT false;

-- Create table for crop cultivation instructions (global database for reuse)
CREATE TABLE IF NOT EXISTS crop_cultivation_instructions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_id UUID REFERENCES crops_master(id),
  cultivation_phase TEXT NOT NULL,
  day_range TEXT NOT NULL,
  instructions TEXT NOT NULL,
  tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE crop_cultivation_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cultivation instructions"
ON crop_cultivation_instructions FOR SELECT
USING (true);

-- Create table for weather forecasts
CREATE TABLE IF NOT EXISTS weather_forecasts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  location TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  temperature_high NUMERIC,
  temperature_low NUMERIC,
  condition TEXT,
  precipitation_chance NUMERIC,
  humidity NUMERIC,
  wind_speed NUMERIC,
  farming_precautions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE weather_forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weather forecasts"
ON weather_forecasts FOR SELECT
USING (true);

-- Create table for marketplace crop prices (admin managed)
CREATE TABLE IF NOT EXISTS marketplace_crop_prices (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  crop_id UUID REFERENCES crops_master(id),
  region TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE marketplace_crop_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace prices"
ON marketplace_crop_prices FOR SELECT
USING (true);

-- Update existing crops_master with enhanced data
UPDATE crops_master 
SET 
  health_benefits = 'Rich in vitamins and minerals',
  medical_benefits = 'Supports immune system and heart health',
  vitamins = 'Vitamin A, C, K, B6',
  proteins = '1-2g per 100g',
  intercropping_possibility = 'Yes - compatible with legumes and leafy greens'
WHERE category = 'Vegetable';

-- Add trigger for cultivation instructions updates
CREATE TRIGGER update_cultivation_instructions_updated_at
BEFORE UPDATE ON crop_cultivation_instructions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();