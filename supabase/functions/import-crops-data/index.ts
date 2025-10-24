import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting crop data import...');

    // Read CSV file
    const csvPath = '/home/deno/backend/data/crops_india_1000_intercropping.csv';
    let csvContent: string;
    
    try {
      csvContent = await Deno.readTextFile(csvPath);
    } catch (error: any) {
      console.error('Error reading CSV file:', error);
      return new Response(
        JSON.stringify({ error: 'CSV file not found', details: error?.message || 'Unknown error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse CSV
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('CSV Headers:', headers);
    console.log('Total lines:', lines.length);

    const crops: any[] = [];
    const cultivationInstructions: any[] = [];
    const seedRecommendations: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      if (values.length < headers.length) continue;

      const cropData: any = {};
      headers.forEach((header, idx) => {
        cropData[header] = values[idx] || null;
      });

      // Create crop master entry
      const cropId = crypto.randomUUID();
      crops.push({
        id: cropId,
        name: cropData['Crop Name'] || cropData['name'],
        category: cropData['Category'] || cropData['category'] || 'other',
        duration_days: parseInt(cropData['Duration (days)'] || cropData['duration_days']) || 90,
        season: cropData['Season'] || cropData['season'] || 'year-round',
        water_requirement: cropData['Water Requirement'] || cropData['water_requirement'] || 'medium',
        profit_index: cropData['Profit Index'] || cropData['profit_index'] || 'medium',
        soil_type: cropData['Soil Type'] ? cropData['Soil Type'].split(';').map((s: string) => s.trim()) : ['loamy'],
        daily_market_crop: cropData['Daily Market Crop'] === 'Yes' || cropData['daily_market_crop'] === 'true',
        home_growable: cropData['Home Growable'] === 'Yes' || cropData['home_growable'] === 'true',
        market_demand_index: parseFloat(cropData['Market Demand Index'] || cropData['market_demand_index']) || 50,
        restaurant_usage_index: parseFloat(cropData['Restaurant Usage Index'] || cropData['restaurant_usage_index']) || 30,
        health_benefits: cropData['Health Benefits'] || cropData['health_benefits'],
        medical_benefits: cropData['Medical Benefits'] || cropData['medical_benefits'],
        vitamins: cropData['Vitamins'] || cropData['vitamins'],
        proteins: cropData['Proteins'] || cropData['proteins'],
        intercropping_possibility: cropData['Intercropping Possibility'] || cropData['intercropping_possibility'],
      });

      // Create cultivation instructions if available
      if (cropData['Cultivation Instructions']) {
        const phases = cropData['Cultivation Instructions'].split(';');
        phases.forEach((phase: string, phaseIdx: number) => {
          const [range, details] = phase.split(':');
          if (range && details) {
            cultivationInstructions.push({
              id: crypto.randomUUID(),
              crop_id: cropId,
              day_range: range.trim(),
              cultivation_phase: `Phase ${phaseIdx + 1}`,
              instructions: details.trim(),
              tips: []
            });
          }
        });
      }

      // Create seed recommendations if available
      if (cropData['Seed Varieties']) {
        const varieties = cropData['Seed Varieties'].split(';');
        varieties.forEach((variety: string) => {
          seedRecommendations.push({
            id: crypto.randomUUID(),
            crop_id: cropId,
            seed_variety: variety.trim(),
            best_season: cropData['Season'] || 'All',
            avg_yield_per_acre: parseFloat(cropData['Expected Yield'] || '20'),
            price_per_kg: parseFloat(cropData['Seed Price'] || '500'),
            resistance_to_pests: []
          });
        });
      }
    }

    console.log(`Prepared ${crops.length} crops for import`);

    // Insert in batches
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < crops.length; i += batchSize) {
      const batch = crops.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('crops_master')
        .upsert(batch, { onConflict: 'name' });

      if (error) {
        console.error('Error inserting crop batch:', error);
        continue;
      }
      
      imported += batch.length;
      console.log(`Imported ${imported}/${crops.length} crops`);
    }

    // Insert cultivation instructions
    if (cultivationInstructions.length > 0) {
      for (let i = 0; i < cultivationInstructions.length; i += batchSize) {
        const batch = cultivationInstructions.slice(i, i + batchSize);
        await supabase.from('crop_cultivation_instructions').upsert(batch);
      }
      console.log(`Imported ${cultivationInstructions.length} cultivation instructions`);
    }

    // Insert seed recommendations
    if (seedRecommendations.length > 0) {
      for (let i = 0; i < seedRecommendations.length; i += batchSize) {
        const batch = seedRecommendations.slice(i, i + batchSize);
        await supabase.from('seed_recommendations').upsert(batch);
      }
      console.log(`Imported ${seedRecommendations.length} seed recommendations`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: {
          crops: imported,
          instructions: cultivationInstructions.length,
          seeds: seedRecommendations.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
