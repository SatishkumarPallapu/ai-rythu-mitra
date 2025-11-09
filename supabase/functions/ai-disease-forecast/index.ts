import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropId, cropName, weatherData, soilData, cropAge } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = `You are an expert plant pathologist and agricultural disease forecasting AI for Indian farming conditions. 

Analyze weather patterns, soil conditions, and crop age to predict disease risks over the next 30 days.

Provide weekly disease forecasts including:
- Disease name
- Probability (0-100%)
- Risk level (low/medium/high)
- Symptoms to watch for
- Preventive measures (organic and chemical)
- Treatment recommendations
- Optimal treatment timing`;

    const userPrompt = `Crop Information:
- Crop: ${cropName}
- Age: ${cropAge} days
- Weather: Temperature ${weatherData.temperature}°C, Humidity ${weatherData.humidity}%, Rainfall ${weatherData.rainfall}mm
- Soil: pH ${soilData.ph}, Moisture ${soilData.moisture}%

Forecast disease risks for the next 4 weeks.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "forecast_diseases",
            description: "Return weekly disease forecasts",
            parameters: {
              type: "object",
              properties: {
                forecasts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      week_number: { type: "number" },
                      disease_name: { type: "string" },
                      probability: { type: "number" },
                      risk_level: { type: "string", enum: ["low", "medium", "high"] },
                      symptoms: { type: "string" },
                      prevention: { type: "string" },
                      treatment: { type: "string" },
                      treatment_timing: { type: "string" }
                    },
                    required: ["week_number", "disease_name", "probability", "risk_level"]
                  }
                }
              },
              required: ["forecasts"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "forecast_diseases" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Lovable AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const forecasts = JSON.parse(toolCall.function.arguments);

    // Store forecasts in database
    if (cropId) {
      const { error: dbError } = await supabase
        .from('disease_forecasts')
        .insert(
          forecasts.forecasts.map((f: any) => ({
            crop_plan_id: cropId,
            week_number: f.week_number,
            disease_name: f.disease_name,
            probability: f.probability,
            risk_level: f.risk_level,
            symptoms: f.symptoms,
            prevention_measures: f.prevention,
            treatment_plan: f.treatment,
            treatment_timing: f.treatment_timing,
            forecast_date: new Date().toISOString()
          }))
        );

      if (dbError) {
        console.error('Error storing forecasts:', dbError);
      }
    }

    console.log("Disease Forecasts:", forecasts);

    return new Response(JSON.stringify(forecasts), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-disease-forecast:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
