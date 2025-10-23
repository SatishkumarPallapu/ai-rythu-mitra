import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current crop from user's active plans
    const { data: activePlans } = await supabase
      .from('crop_plans')
      .select('*, crops_master!inner(name)')
      .eq('status', 'active')
      .limit(1)
      .single();

    // Use AI to generate weather forecast and precautions
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural weather advisor. Provide realistic weather forecasts and farming precautions.'
          },
          {
            role: 'user',
            content: `Generate a 7-day weather forecast for ${location}, India. ${activePlans ? `The farmer is currently growing ${activePlans.crops_master.name}.` : ''} 
            
            Return JSON format:
            {
              "forecast": [
                {
                  "date": "YYYY-MM-DD",
                  "temperature_high": 32,
                  "temperature_low": 22,
                  "condition": "Sunny",
                  "precipitation_chance": 10,
                  "humidity": 65,
                  "wind_speed": 15,
                  "farming_precautions": ["Ensure adequate irrigation", "Monitor for pests in warm weather"]
                }
              ]
            }`
          }
        ]
      }),
    });

    const data = await response.json();
    const forecastData = JSON.parse(data.choices[0].message.content);

    // Store forecast in database
    const forecastRecords = forecastData.forecast.map((day: any) => ({
      location,
      forecast_date: day.date,
      temperature_high: day.temperature_high,
      temperature_low: day.temperature_low,
      condition: day.condition,
      precipitation_chance: day.precipitation_chance,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
      farming_precautions: day.farming_precautions
    }));

    await supabase.from('weather_forecasts').upsert(forecastRecords, {
      onConflict: 'location,forecast_date'
    });

    return new Response(
      JSON.stringify({ 
        forecast: forecastData.forecast,
        current_crop: activePlans?.crops_master?.name
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Weather forecast error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
