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
    const { cropPlanId, cropName, soilType, duration, intercroppingPlan } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = `You are an expert agricultural advisor creating detailed day-by-day cultivation roadmaps for Indian farmers.

Generate daily tasks from Day 1 to harvest covering:
- Land preparation
- Seed treatment and sowing
- Irrigation schedules
- Fertilizer application (organic and chemical with exact quantities)
- Pest management
- Weeding schedules
- Intercrop management (if applicable)
- Disease monitoring
- Harvest preparation

For each task, specify:
- Day number
- Task title
- Detailed instructions
- Materials needed with quantities
- Priority level
- Category (irrigation/fertilizer/pest_control/weeding/monitoring/harvest)`;

    const userPrompt = `Generate daily cultivation tasks for:
Crop: ${cropName}
Duration: ${duration} days
Soil Type: ${soilType}
${intercroppingPlan ? `Intercropping: ${JSON.stringify(intercroppingPlan)}` : ''}

Create a comprehensive day-by-day roadmap.`;

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
            name: "generate_tasks",
            description: "Generate daily cultivation tasks",
            parameters: {
              type: "object",
              properties: {
                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day_number: { type: "number" },
                      title: { type: "string" },
                      description: { type: "string" },
                      category: { 
                        type: "string", 
                        enum: ["irrigation", "fertilizer", "pest_control", "weeding", "monitoring", "harvest", "preparation"]
                      },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      materials_needed: { type: "string" }
                    },
                    required: ["day_number", "title", "description", "category", "priority"]
                  }
                }
              },
              required: ["tasks"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_tasks" } }
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

    const tasksData = JSON.parse(toolCall.function.arguments);

    // Store tasks in database
    const { error: dbError } = await supabase
      .from('daily_tasks')
      .insert(
        tasksData.tasks.map((task: any) => ({
          crop_plan_id: cropPlanId,
          day_number: task.day_number,
          task_title: task.title,
          task_description: task.description,
          task_category: task.category,
          priority: task.priority,
          materials_needed: task.materials_needed,
          status: 'pending'
        }))
      );

    if (dbError) {
      console.error('Error storing tasks:', dbError);
      throw dbError;
    }

    console.log(`Generated ${tasksData.tasks.length} tasks for crop plan ${cropPlanId}`);

    return new Response(JSON.stringify(tasksData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-generate-tasks:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
