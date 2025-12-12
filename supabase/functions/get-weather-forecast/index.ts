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
    const { location, includeHourly = false, includeCurrent = false } = await req.json();
    
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

    // Build the prompt based on what data is requested
    let forecastPrompt = `Generate realistic 7-day weather forecast for ${location}, India. ${activePlans ? `Farmer is growing ${activePlans.crops_master.name}.` : ''} 
            
            Return ONLY this JSON structure (no markdown formatting):
            {"forecast":[{"date":"YYYY-MM-DD","temperature_high":32,"temperature_low":22,"condition":"Sunny","precipitation_chance":10,"humidity":65,"wind_speed":15,"farming_precautions":["Ensure irrigation","Monitor pests"]}]}`;

    let currentWeatherPrompt = '';
    let hourlyPrompt = '';

    if (includeCurrent) {
      currentWeatherPrompt = `, "current":{"temperature":28,"feels_like":30,"condition":"Partly Cloudy","humidity":70,"wind_speed":12,"wind_direction":"NW","visibility":8,"pressure":1013,"uv_index":5,"location":"${location}","last_updated":"2024-01-01T12:00:00Z"}`;
    }

    if (includeHourly) {
      hourlyPrompt = `, "hourly":[{"time":"2024-01-01T13:00:00Z","temperature":29,"condition":"Sunny","precipitation_chance":5}]`;
    }

    // Use AI to generate weather forecast and precautions
    const response = await fetch('https://api.lovable.app/v1/chat/completions', {
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
            content: 'You are a JSON API. Return ONLY pure JSON with no markdown, no code blocks, no backticks, and no explanatory text.'
          },
          {
            role: 'user',
            content: forecastPrompt
          }
        ],
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if AI adds them
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const forecastData = JSON.parse(content);

    // If current weather or hourly data is requested, generate those separately
    let currentWeatherData = null;
    let hourlyData = [];

    if (includeCurrent) {
      const currentResponse = await fetch('https://api.lovable.app/v1/chat/completions', {
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
              content: 'You are a JSON API for weather data. Return ONLY pure JSON.'
            },
            {
              role: 'user',
              content: `Generate current weather conditions for ${location}, India with realistic values. Return ONLY JSON:
              {"temperature":28,"feels_like":30,"condition":"Partly Cloudy","humidity":70,"wind_speed":12,"wind_direction":"NW","visibility":8,"pressure":1013,"uv_index":5,"location":"${location}","last_updated":"${new Date().toISOString()}"}`
            }
          ],
          max_tokens: 500
        }),
      });

      const currentData = await currentResponse.json();
      let currentContent = currentData.choices[0].message.content.trim();
      currentContent = currentContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      currentWeatherData = JSON.parse(currentContent);
    }

    if (includeHourly) {
      const hourlyResponse = await fetch('https://api.lovable.app/v1/chat/completions', {
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
              content: 'You are a JSON API for hourly weather data. Return ONLY pure JSON array.'
            },
            {
              role: 'user',
              content: `Generate 12-hour ahead hourly weather forecast for ${location}, India. Return ONLY JSON array:
              [{"time":"${new Date().toISOString()}","temperature":28,"condition":"Sunny","precipitation_chance":10}]`
            }
          ],
          max_tokens: 1000
        }),
      });

      const hourlyDataResp = await hourlyResponse.json();
      let hourlyContent = hourlyDataResp.choices[0].message.content.trim();
      hourlyContent = hourlyContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      hourlyData = JSON.parse(hourlyContent);
    }

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

    // Generate weather alerts if conditions are severe
    const alerts = [];
    if (forecastData.forecast.some((day: any) => day.precipitation_chance > 80)) {
      alerts.push({
        type: 'rain',
        severity: 'high',
        message: 'Heavy rainfall expected. Ensure proper drainage in fields.',
        forecast_days: 3
      });
    }
    if (forecastData.forecast.some((day: any) => day.temperature_high > 35)) {
      alerts.push({
        type: 'temperature',
        severity: 'medium',
        message: 'High temperatures expected. Increase irrigation frequency.',
        forecast_days: 2
      });
    }

    const response_body: any = { 
      forecast: forecastData.forecast,
      current_crop: activePlans?.crops_master?.name,
      alerts
    };

    if (currentWeatherData) {
      response_body.current = currentWeatherData;
    }
    if (hourlyData.length > 0) {
      response_body.hourly = hourlyData;
    }

    return new Response(
      JSON.stringify(response_body),
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
