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
    const { soilData, weatherData, farmSize, location } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get available crops from database
    const { data: crops } = await supabase
      .from('crops_master')
      .select('*');

    // Get historical market data
    const { data: marketHistory } = await supabase
      .from('market_demand_history')
      .select('*')
      .order('harvest_month', { ascending: false })
      .limit(100);

    const systemPrompt = `You are an expert agricultural AI advisor for Indian farmers. Analyze the provided data and recommend the top 3-5 crops for maximum profitability.

Consider:
- Soil type, pH, nutrients (N, P, K)
- Current weather and seasonal patterns
- Farm size and location
- Short-term crops (30-180 days) for quick ROI
- Intercropping opportunities
- Historical market demand
- Disease resistance

For each recommended crop, provide:
1. Crop name
2. Expected yield per acre
3. Duration (days)
4. Intercropping probability (0-100%)
5. Companion crops for intercropping
6. Expected profit per acre
7. Key cultivation tips
8. Disease risk assessment`;

    const userPrompt = `Farm Details:
- Location: ${location}
- Farm Size: ${farmSize} acres
- Soil: pH ${soilData.ph}, N:${soilData.nitrogen}%, P:${soilData.phosphorus}%, K:${soilData.potassium}%
- Soil Type: ${soilData.soilType}
- Weather: ${JSON.stringify(weatherData)}

Available Crops Database: ${JSON.stringify(crops?.slice(0, 20))}
Market History: ${JSON.stringify(marketHistory?.slice(0, 10))}

Recommend the best crops for maximum profit in the next 6 months.`;

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
            name: "recommend_crops",
            description: "Return crop recommendations with detailed information",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      crop_name: { type: "string" },
                      expected_yield: { type: "number" },
                      duration_days: { type: "number" },
                      intercropping_probability: { type: "number" },
                      companion_crops: { type: "array", items: { type: "string" } },
                      expected_profit_per_acre: { type: "number" },
                      cultivation_tips: { type: "string" },
                      disease_risk: { type: "string", enum: ["low", "medium", "high"] }
                    },
                    required: ["crop_name", "expected_yield", "duration_days", "intercropping_probability"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_crops" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Lovable AI credits exhausted. Please add credits." }), {
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

    const recommendations = JSON.parse(toolCall.function.arguments);

    console.log("AI Crop Recommendations:", recommendations);

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-crop-recommendation:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
