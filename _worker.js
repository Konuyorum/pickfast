/**
 * PickFast - AI-Powered Smart Shopping Assistant Worker
 * Powered by Anthropic Claude 3.5 Haiku & Cloudflare Pages Edge Runtime
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);

    if (url.pathname === "/api/search" && request.method === "POST") {
      try {
        const body = await request.json();
        const query = (body.query || "").trim();
        const query2 = (body.query2 || "").trim();
        const isVS = Boolean(body.isVS);

        if (!query) {
          return new Response(JSON.stringify({ type: "error", message: "Please enter a product or category." }), {
            status: 400,
            headers: corsHeaders
          });
        }

        let prompt = "";
        
        if (isVS) {
          prompt = `You are a senior product review editor for 'Pickfast'. Compare "${query}" and "${query2}".
          
CRITICAL CONTROL:
If one input is a general category (e.g., "Phone") and the other is specific (e.g., "iPhone 15"), or if they are completely unrelated, DO NOT compare them.
In that case, ONLY return this JSON:
{ "type": "error", "message": "We cannot compare apples and oranges. Please enter two similar specific models (e.g., iPhone 15 vs Galaxy S24)." }

IF THEY ARE COMPARABLE (e.g., two phones, two laptops, two headphones), return this JSON:
{
  "type": "comparison",
  "p1_name": "${query}",
  "p2_name": "${query2}",
  "summary": "A clear, 2-sentence expert verdict on the difference between the two products.",
  "table": [
    {"feature": "Feature Name", "val1": "Product 1 Value", "val2": "Product 2 Value", "winner": 1}
  ]
}`;
        } else {
          prompt = `You are the smart shopping assistant for the 'Pickfast' platform. Query: "${query}"
          
USA & AMAZON.COM CONDITION (CRITICAL):
All brands, models, and products you recommend MUST be globally recognized, highly rated, and actively sold on Amazon.com (USA).

SMART ROUTING:
1. IF the query is a GENERAL CATEGORY (e.g., "Sweater", "Smartphone", "Air Fryer"):
   Return ONLY a "list" type JSON (Recommend the top 4 products).
2. IF the query is a SPECIFIC PRODUCT (e.g., "iPhone 15", "Sony WH-1000XM5"):
   Return ONLY a "single" type JSON (Detailed review).
   
CATEGORY ICONS (Choose for the 'icon' field in single type):
- Tech: "fas fa-microchip", Fashion: "fas fa-tshirt", Home: "fas fa-couch", Beauty: "fas fa-magic", General: "fas fa-star"

A) LIST TYPE JSON FORMAT:
{
  "type": "list", 
  "title": "Top Picks for ${query}",
  "items": [ 
    { "name": "Brand and Full Model", "desc": "1-sentence clear reason for recommendation", "tag": "Best Value etc." } 
  ]
}

B) SINGLE PRODUCT TYPE JSON FORMAT:
{
  "type": "single", 
  "title": "${query} Review", 
  "icon": "fas fa-microchip", 
  "verdict": "2-paragraph expert review of the product.",
  "pros": "<ul><li>Pro feature 1</li><li>Pro feature 2</li></ul>", 
  "cons": "<ul><li>Con feature 1</li></ul>",
  "amazon_keyword": "${query}"
}`;
        }

        let parsedData = null;

        // 1. Anthropic Claude API (Primary Model: Claude 3.5 Haiku)
        const anthropicApiKey = env.ANTHROPIC_API_KEY;
        if (anthropicApiKey) {
          try {
            const claudeModel = env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";
            const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "x-api-key": anthropicApiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
              },
              body: JSON.stringify({
                model: claudeModel,
                max_tokens: 1024,
                system: "You are the AI shopping intelligence engine for Pickfast. You MUST respond ONLY with valid raw JSON matching the schema. Never output markdown formatting (```json or ```), commentary, or extra prose.",
                messages: [{ role: "user", content: prompt }]
              })
            });

            if (claudeRes.ok) {
              const claudeData = await claudeRes.json();
              const rawText = claudeData.content?.[0]?.text || "";
              const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
              const jsonMatch = cleanText.match(/(\{|\[)[\s\S]*(\}|\])/);
              if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
              }
            } else {
              console.error("Claude API non-OK status:", claudeRes.status, await claudeRes.text());
            }
          } catch (err) {
            console.error("Claude API invocation error:", err);
          }
        }

        // 2. Fallback: Google Gemini API (Backup Model)
        if (!parsedData) {
          const apiKeysPool = [
            "AIzaSyAyEFDsKsCMix2FNPmHeFquNmDt_6_oyn8", 
            "AIzaSyC8GW-dJOaYNftEY2w2AQcNVswc8VvFwQY", 
            "AIzaSyC83PPMzk0qTVtlJHAesAfTxGuFNaNFMp0"
          ];
          const geminiApiKey = env.GEMINI_API_KEY || apiKeysPool[Math.floor(Date.now() / 1000) % apiKeysPool.length];
          if (geminiApiKey) {
            const modelName = env.GEMINI_MODEL || "gemini-2.5-flash-lite";
            const safetySettings = [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ];

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }], 
                safetySettings,
                generationConfig: { response_mime_type: "application/json" }
              })
            });

            const data = await response.json();
            if (!data.error) {
              const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
              const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
              const jsonMatch = cleanText.match(/(\{|\[)[\s\S]*(\}|\])/);
              if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
              }
            }
          }
        }

        if (!parsedData) {
          throw new Error("AI provider response could not be parsed or no active API key.");
        }

        return new Response(JSON.stringify(parsedData), { headers: corsHeaders });

      } catch (e) {
        console.error("Search API Error:", e);
        return new Response(
          JSON.stringify({ type: "error", message: "High traffic right now. Please try again." }), 
          { status: 200, headers: corsHeaders }
        );
      }
    }
    
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not Found", { status: 404 });
  }
};
