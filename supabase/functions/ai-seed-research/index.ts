import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropName, location, soilType, season } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an agricultural seed specialist with expertise in Indian farming. Provide research-based seed variety recommendations.

For each seed variety, provide:
1. Official variety name and code (e.g., BH-1030, MTU-1010)
2. Developer/Source (ICAR, state agricultural university, private company)
3. Year of release/approval
4. Proven yield data (realistic, research-backed figures)
5. Duration (exact days to maturity)
6. Best characteristics (disease resistance, drought tolerance, etc.)
7. Soil and climate suitability
8. Recommended for which regions/states
9. Seed rate (kg per acre)
10. Approximate seed cost (INR per kg)
11. Where to buy (government seed farms, authorized dealers)
12. Success stories from farmers if known
13. Any government subsidies available

Prioritize:
- High-yielding varieties
- Disease-resistant varieties
- Varieties suitable for the farmer's specific location and soil
- Certified seeds from reliable sources
- Cost-effective options

Base recommendations on real agricultural research, government data, and proven field performance.`;

    const userPrompt = `Recommend the best seed varieties for:
Crop: ${cropName}
Location: ${location}
Soil Type: ${soilType}
Season: ${season}

Provide 5-8 genuine seed variety recommendations ranked by suitability. Include both government-released and popular private hybrid varieties where applicable.`;

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
            name: "recommend_seeds",
            description: "Provide research-based seed variety recommendations",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      variety_name: { type: "string" },
                      variety_code: { type: "string" },
                      source: { type: "string", description: "Developer/organization" },
                      year_released: { type: "string" },
                      avg_yield_per_acre: { type: "string" },
                      maturity_days: { type: "number" },
                      key_features: { type: "array", items: { type: "string" } },
                      disease_resistance: { type: "array", items: { type: "string" } },
                      suitable_regions: { type: "array", items: { type: "string" } },
                      soil_suitability: { type: "array", items: { type: "string" } },
                      climate_requirement: { type: "string" },
                      seed_rate_per_acre: { type: "string" },
                      seed_cost_inr: { type: "string" },
                      where_to_buy: { type: "string" },
                      government_subsidy: { type: "string" },
                      farmer_testimonial: { type: "string" },
                      suitability_score: { type: "number", description: "0-100 based on location match" },
                      why_recommended: { type: "string" }
                    },
                    required: ["variety_name", "source", "avg_yield_per_acre", "maturity_days", "suitability_score"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_seeds" } }
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

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`Generated ${result.recommendations.length} seed recommendations for ${cropName}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-seed-research:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
