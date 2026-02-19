import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate that the request includes a valid API key (anon key)
  // This prevents completely unauthenticated requests from external actors
  const authHeader = req.headers.get("Authorization");
  const apiKey = req.headers.get("apikey");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  const providedKey = authHeader?.replace("Bearer ", "") || apiKey;

  if (!providedKey || providedKey !== SUPABASE_ANON_KEY) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid or missing API key" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate image size to prevent abuse (max 10MB of base64 data)
    const MAX_BASE64_LENGTH = 10 * 1024 * 1024 * 1.37; // ~10MB decoded
    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Image too large. Maximum size is 10MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate that the imageBase64 looks like a valid data URL or base64 string
    const isValidDataUrl = /^data:image\/(jpeg|jpg|png|gif|webp|bmp);base64,/.test(imageBase64);
    const isValidBase64 = /^[A-Za-z0-9+/]+=*$/.test(imageBase64);
    if (!isValidDataUrl && !isValidBase64) {
      return new Response(
        JSON.stringify({ error: "Invalid image format. Please provide a valid image." }),
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
  "isHealthy": boolean - true if completely healthy, false if any disease/damage detected,
  "healthStatus": "string - one of: 'Excellent', 'Good', 'Fair', 'Poor', 'Critical'",
  "isEdible": boolean - true if safe to eat, false if not recommended for consumption,
  "edibilityReason": "string - brief explanation of why it is or isn't safe to eat",
  "affectedPercentage": number between 0 and 100 - estimate of how much of the fruit is affected by disease/damage,
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
- ALWAYS provide a clear edibility assessment for consumers

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
      console.error("AI gateway error:", response.status);
      throw new Error("AI service error. Please try again.");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the AI response
    let analysisResult;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON in response");
      }
    } catch (parseError) {
      throw new Error("Failed to parse analysis results");
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
