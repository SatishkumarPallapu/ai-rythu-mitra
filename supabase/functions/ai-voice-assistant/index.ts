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
    const { message, language = 'te' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = language === 'te' 
      ? `మీరు భారతీయ రైతులకు సహాయం చేసే AI వ్యవసాయ సలహాదారు. తెలుగులో స్పష్టమైన, సరళమైన, ఆచరణాత్మక సలహాలు ఇవ్వండి.

సహాయం చేయగల అంశాలు:
- పంట సిఫార్సులు (ఏ పంట పెంచాలి, ఎప్పుడు)
- నేల విశ్లేషణ మరియు నేల సంరక్షణ
- నీటి నిర్వహణ మరియు నీటిపారుదల పద్ధతులు
- విత్తనాల ఎంపిక (మంచి విత్తనాలు ఎక్కడ దొరుకుతాయి)
- ఎరువుల వినియోగం (సేంద్రీయ మరియు రసాయనిక)
- చీడపురుగుల నివారణ మరియు నియంత్రణ
- పంట వ్యాధుల నిర్ధారణ మరియు చికిత్స
- వాతావరణ సమాచారం
- మార్కెట్ ధరలు మరియు అమ్మకాల సలహాలు
- సర్కారు పథకాలు మరియు రుణాలు

సలహాలు:
- సరళమైన తెలుగులో వివరించండి
- నిజమైన, ఆచరణాత్మక సలహాలు ఇవ్వండి
- స్థానిక సమాచారం (భారత వాతావరణం, మార్కెట్లు) ప్రాతిపదిక గా ఇవ్వండి
- ఖర్చు మరియు లాభదాయకత గురించి తెలియజేయండి`
      : `You are an AI agricultural advisor helping Indian farmers. Provide clear, practical advice in simple language.

Topics you can help with:
- Crop recommendations
- Soil analysis and management
- Irrigation and water management
- Seed selection
- Fertilizer usage
- Pest control
- Disease diagnosis and treatment
- Weather information
- Market prices
- Government schemes

Provide practical, actionable advice based on Indian agricultural context.`;

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
          { role: "user", content: message }
        ]
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: language === 'te' 
            ? "చాలా అభ్యర్థనలు. దయచేసి కొంత సమయం తర్వాత ప్రయత్నించండి." 
            : "Rate limit exceeded. Please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: language === 'te'
            ? "AI క్రెడిట్స్ అయిపోయాయి. దయచేసి మద్దతు బృందాన్ని సంప్రదించండి."
            : "AI credits exhausted. Please contact support."
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0]?.message?.content || "";

    console.log("Voice assistant response generated");

    return new Response(JSON.stringify({ response }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-voice-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
