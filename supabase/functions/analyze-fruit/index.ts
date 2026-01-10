import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural pathologist and botanist specializing in fruit disease detection. Analyze the provided fruit image and provide a detailed assessment.

Your response MUST be valid JSON with this exact structure:
{
  "fruitType": "string - the type of fruit detected (e.g., Apple, Orange, Banana, etc.)",
  "isHealthy": boolean,
  "disease": {
    "name": "string - name of the disease if detected, or 'None' if healthy",
    "severity": "string - one of: 'Healthy', 'Mild', 'Moderate', 'Severe'",
    "confidence": number between 0 and 100,
    "description": "string - brief description of the disease and visible symptoms"
  },
  "treatment": {
    "immediate": ["array of immediate actions to take"],
    "prevention": ["array of prevention measures for future"],
    "chemicals": ["array of recommended treatments or chemicals if applicable"]
  },
  "additionalNotes": "string - any additional observations about the fruit condition, whether it's a whole fruit or sliced, internal vs external disease, etc."
}

Be specific about:
- Whether the image shows whole fruit (surface/external disease) or sliced fruit (internal disease)
- Visual symptoms you can identify
- Confidence level in your diagnosis
- Practical, actionable treatment advice suitable for farmers

If the image doesn't contain a recognizable fruit, return:
{
  "error": "Unable to identify fruit in the image. Please upload a clear image of a fruit."
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this fruit image for diseases. Identify the fruit type, detect any visible diseases (surface or internal if sliced), assess severity, and provide treatment recommendations.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the AI response
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis results");
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing fruit:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
