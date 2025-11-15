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
    const { imageUrl, cropName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an expert plant pathologist specializing in Indian agriculture. Analyze crop images to identify:

1. Pest/Disease Identification
   - Exact name of the pest or disease
   - Scientific name
   - Severity level (mild/moderate/severe/critical)
   - Affected parts of the plant

2. Symptoms Analysis
   - Visible symptoms in the image
   - Stage of infection/infestation
   - Potential spread risk

3. Immediate Actions
   - What to do TODAY to prevent spread
   - Emergency measures if critical

4. Treatment Plan
   - Organic treatment options (detailed steps, ingredients, preparation method)
   - Chemical treatment options (exact product names available in India, dosage per liter, application method)
   - Treatment frequency and duration
   - Expected recovery timeline

5. Prevention for Future
   - How this happened (likely causes)
   - Preventive measures for next season
   - Monitoring tips to catch early

6. Cost Estimate
   - Approximate treatment cost in INR
   - Cost comparison: organic vs chemical

Provide practical, actionable advice that Indian farmers can implement immediately.`;

    const userPrompt = `Analyze this ${cropName || 'crop'} image for pest or disease problems. Provide detailed diagnosis and treatment recommendations.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: systemPrompt 
          },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "diagnose_pest_disease",
            description: "Provide detailed pest/disease diagnosis and treatment plan",
            parameters: {
              type: "object",
              properties: {
                diagnosis: {
                  type: "object",
                  properties: {
                    pest_or_disease: { type: "string" },
                    scientific_name: { type: "string" },
                    severity: { type: "string", enum: ["mild", "moderate", "severe", "critical"] },
                    affected_parts: { type: "array", items: { type: "string" } },
                    symptoms: { type: "array", items: { type: "string" } },
                    infection_stage: { type: "string" },
                    spread_risk: { type: "string", enum: ["low", "medium", "high"] }
                  }
                },
                immediate_actions: {
                  type: "array",
                  items: { type: "string" }
                },
                organic_treatment: {
                  type: "object",
                  properties: {
                    method: { type: "string" },
                    ingredients: { type: "array", items: { type: "string" } },
                    preparation: { type: "string" },
                    application: { type: "string" },
                    frequency: { type: "string" },
                    duration: { type: "string" },
                    cost_estimate_inr: { type: "string" }
                  }
                },
                chemical_treatment: {
                  type: "object",
                  properties: {
                    products: { type: "array", items: { type: "string" } },
                    dosage: { type: "string" },
                    application: { type: "string" },
                    frequency: { type: "string" },
                    duration: { type: "string" },
                    safety_precautions: { type: "array", items: { type: "string" } },
                    cost_estimate_inr: { type: "string" }
                  }
                },
                prevention: {
                  type: "object",
                  properties: {
                    causes: { type: "array", items: { type: "string" } },
                    preventive_measures: { type: "array", items: { type: "string" } },
                    monitoring_tips: { type: "array", items: { type: "string" } }
                  }
                },
                expected_recovery: { type: "string" },
                confidence_score: { type: "number", description: "0-100% confidence in diagnosis" }
              },
              required: ["diagnosis", "immediate_actions", "organic_treatment", "chemical_treatment", "prevention"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "diagnose_pest_disease" } }
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

    console.log("Pest detection completed:", result.diagnosis.pest_or_disease);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-pest-detection:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
