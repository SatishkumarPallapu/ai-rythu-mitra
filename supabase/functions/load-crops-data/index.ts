import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";
import { parse } from "https://deno.land/std@0.182.0/encoding/csv.ts";

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

    // Read CSV file from backend/data
    const csvContent = await Deno.readTextFile('/var/task/backend/data/crops_india_1000_intercropping.csv');
    const rows = parse(csvContent, { skipFirstRow: true });

    console.log(`Processing ${rows.length} crops...`);

    const cropsToInsert = [];
    
    for (const row of rows) {
      // CSV parser returns Record<string, unknown>, we need to access by column name or index
      const rowValues = Object.values(row) as string[];
      const cropName = rowValues[0];
      const category = rowValues[1];
      const avgHarvestDays = rowValues[2];
      const marketDemand = rowValues[3];
      const homeGrowable = rowValues[4];
      const healthBenefit = rowValues[5];
      const intercroppingPossibility = rowValues[6];
      
      // Map health benefits to structured data
      const healthData = {
        health_benefits: healthBenefit || 'Nutritious food source',
        medical_benefits: getMedialBenefits(category, cropName),
        vitamins: getVitamins(category),
        proteins: getProteins(category)
      };

      cropsToInsert.push({
        name: cropName,
        category: category.toLowerCase(),
        duration_days: parseInt(avgHarvestDays) || 90,
        market_demand_index: marketDemand === 'High' ? 90 : marketDemand === 'Medium' ? 60 : 30,
        home_growable: homeGrowable === 'Yes',
        health_benefits: healthData.health_benefits,
        medical_benefits: healthData.medical_benefits,
        vitamins: healthData.vitamins,
        proteins: healthData.proteins,
        intercropping_possibility: intercroppingPossibility,
        soil_type: ['loamy', 'clay'],
        climate_tolerance: ['temperate', 'tropical'],
        water_requirement: 'medium',
        season: 'year-round',
        profit_index: marketDemand === 'High' ? 'high' : 'medium',
        daily_market_crop: ['Vegetable', 'Fruit'].includes(category)
      });
    }

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < cropsToInsert.length; i += batchSize) {
      const batch = cropsToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('crops_master')
        .upsert(batch, { onConflict: 'name' });

      if (error) {
        console.error(`Batch ${i / batchSize} error:`, error);
      } else {
        inserted += batch.length;
      }
    }

    console.log(`Successfully inserted ${inserted} crops`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Loaded ${inserted} crops into database`,
        total: cropsToInsert.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error loading crops:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getMedialBenefits(category: string, cropName: string): string {
  const benefits: Record<string, string> = {
    'Vegetable': 'Supports digestive health, boosts immunity, anti-inflammatory properties',
    'Fruit': 'Rich in antioxidants, improves heart health, enhances skin health',
    'Grain': 'Provides sustained energy, supports heart health, aids digestion',
    'Pulse': 'High in protein and fiber, regulates blood sugar, supports muscle growth',
    'Spice': 'Anti-inflammatory, aids digestion, boosts metabolism',
    'Oilseed': 'Heart-healthy fats, improves brain function, supports hormone production',
    'Cash/Plantation': 'Varied health benefits depending on crop'
  };
  return benefits[category] || 'General nutritional benefits';
}

function getVitamins(category: string): string {
  const vitamins: Record<string, string> = {
    'Vegetable': 'Vitamin A, C, K, B6, Folate',
    'Fruit': 'Vitamin C, A, E, K, B-complex',
    'Grain': 'Vitamin B1, B2, B3, B6, Folate',
    'Pulse': 'Vitamin B1, B6, B9, K',
    'Spice': 'Vitamin C, A, K, E',
    'Oilseed': 'Vitamin E, K, B-complex'
  };
  return vitamins[category] || 'Various vitamins';
}

function getProteins(category: string): string {
  const proteins: Record<string, string> = {
    'Vegetable': '1-3g per 100g',
    'Fruit': '0.5-2g per 100g',
    'Grain': '7-13g per 100g',
    'Pulse': '20-25g per 100g',
    'Spice': '2-5g per 100g',
    'Oilseed': '15-25g per 100g'
  };
  return proteins[category] || '1-5g per 100g';
}
