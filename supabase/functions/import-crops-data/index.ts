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

    // Parse CSV - handle quoted fields properly
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('CSV Headers:', headers);
    console.log('Total lines:', lines.length);

    const crops: any[] = [];

    // Parse CSV with proper handling of quoted fields
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length < headers.length) continue;

      // Map CSV columns to database schema
      const cropName = values[0];
      const category = values[1] || 'other';
      const durationDays = parseInt(values[2]) || 90;
      const marketDemand = values[3];
      const homeGrowable = values[4] === 'Yes';
      const healthBenefit = values[5];
      const intercroppingPossibility = values[6];

      crops.push({
        id: crypto.randomUUID(),
        name: cropName,
        category: category.toLowerCase(),
        duration_days: durationDays,
        season: 'all-season',
        water_requirement: 'medium',
        profit_index: 'medium',
        soil_type: ['loamy', 'clay'],
        climate_tolerance: ['tropical', 'subtropical'],
        daily_market_crop: marketDemand === 'High',
        home_growable: homeGrowable,
        market_demand_index: marketDemand === 'High' ? 80 : marketDemand === 'Medium' ? 50 : 30,
        restaurant_usage_index: 50,
        health_benefits: healthBenefit,
        medical_benefits: healthBenefit,
        vitamins: 'Rich in vitamins A, C, and minerals',
        proteins: 'Good source of plant protein',
        intercropping_possibility: intercroppingPossibility
      });
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

    return new Response(
      JSON.stringify({
        success: true,
        imported: {
          crops: imported
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
