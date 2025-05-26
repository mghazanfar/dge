import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("=== AI Assistance API Route Started (Grok/xAI) ===");

  try {
    // Parse request body with better error handling
    let body;
    try {
      const requestText = await request.text();
      console.log("Raw request text:", requestText.substring(0, 200));

      if (!requestText) {
        console.error("Empty request body");
        return NextResponse.json(
          { error: "Empty request body" },
          { status: 400 }
        );
      }

      body = JSON.parse(requestText);
      console.log("Request body parsed successfully:", body);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          error: "Invalid request body - must be valid JSON",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parse error",
        },
        { status: 400 }
      );
    }

    const { prompt, currentValue, language } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string") {
      console.error("Missing or invalid prompt in request");
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!language || (language !== "en" && language !== "ar")) {
      console.error("Missing or invalid language in request");
      return NextResponse.json(
        { error: "Language is required and must be 'en' or 'ar'" },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GROK_API_KEY;

    console.log("Environment variables check:");
    console.log("GROK_API_KEY exists:", !!process.env.GROK_API_KEY);
    console.log("Using API key:", apiKey ? "Found" : "Not found");

    if (!apiKey) {
      console.error("No API key found in environment variables");
      return NextResponse.json(
        {
          error: "AI service not configured - API key missing",
          debug: "Checked GROK_API_KEY environment variables",
        },
        { status: 500 }
      );
    }

    console.log("API key found, making Grok request...");

    // Prepare Grok request
    const systemPrompt =
      language === "ar"
        ? "أنت مساعد ذكي متخصص في مساعدة الأشخاص في كتابة طلبات المساعدة المالية. اكتب نصوصاً مهنية ومتعاطفة وصادقة باللغة العربية. اجعل النص بين 80-150 كلمة."
        : "You are an AI assistant specialized in helping people write financial assistance applications. Write professional, empathetic, and honest text in English. Keep the response between 80-150 words.";

    const userPrompt =
      currentValue && currentValue.trim()
        ? `${prompt}\n\nCurrent text: "${currentValue}"\n\nPlease improve this text while keeping it professional and concise.`
        : `${prompt}\n\nPlease write a professional and empathetic response.`;

    const grokPayload = {
      model: "grok-3",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
      stream: false,
    };

    console.log("Grok payload prepared:", {
      model: grokPayload.model,
      messageCount: grokPayload.messages.length,
      maxTokens: grokPayload.max_tokens,
      apiKeyPrefix: apiKey.substring(0, 10) + "...",
    });

    // Make xAI API call with timeout and better error handling
    let grokResponse;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      grokResponse = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(grokPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Grok response status:", grokResponse.status);
      console.log(
        "Grok response headers:",
        Object.fromEntries(grokResponse.headers.entries())
      );
    } catch (fetchError) {
      console.error("Failed to fetch from Grok:", fetchError);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out. Please try again." },
          { status: 408 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to connect to AI service",
          details:
            fetchError instanceof Error
              ? fetchError.message
              : "Unknown fetch error",
        },
        { status: 503 }
      );
    }

    // Handle Grok response with better error handling
    let responseText;
    try {
      responseText = await grokResponse.text();
      console.log("Grok response text length:", responseText.length);
      console.log("Grok response preview:", responseText.substring(0, 200));
    } catch (textError) {
      console.error("Failed to read Grok response:", textError);
      return NextResponse.json(
        {
          error: "Failed to read AI service response",
          details:
            textError instanceof Error
              ? textError.message
              : "Unknown text read error",
        },
        { status: 503 }
      );
    }

    // Check if Grok request was successful
    if (!grokResponse.ok) {
      console.error("Grok API error:", grokResponse.status, responseText);

      // Try to parse error response
      let errorDetails = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorDetails =
          errorData.error?.message || errorData.message || responseText;
      } catch {
        // Keep original response text if not JSON
      }

      if (grokResponse.status === 429) {
        return NextResponse.json(
          {
            error: "AI service is busy. Please try again in a moment.",
            details: errorDetails,
          },
          { status: 429 }
        );
      }

      if (grokResponse.status === 401) {
        return NextResponse.json(
          {
            error: "AI service authentication failed. Please check API key.",
            details: errorDetails,
          },
          { status: 500 }
        );
      }

      if (grokResponse.status === 403) {
        return NextResponse.json(
          {
            error:
              "AI service access denied. Please check API key permissions.",
            details: errorDetails,
          },
          { status: 500 }
        );
      }

      if (grokResponse.status === 404) {
        return NextResponse.json(
          {
            error:
              "AI model not found. Please check if your account has access to the requested model.",
            details: errorDetails,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: `AI service error (${grokResponse.status})`,
          details: errorDetails,
        },
        { status: 500 }
      );
    }

    // Parse Grok JSON response with better error handling
    let grokData;
    try {
      if (!responseText || responseText.trim() === "") {
        throw new Error("Empty response from AI service");
      }

      grokData = JSON.parse(responseText);
      console.log("Grok response parsed successfully");
      console.log("Grok response structure:", Object.keys(grokData));
    } catch (jsonError) {
      console.error("Failed to parse Grok JSON:", jsonError);
      console.error("Response text:", responseText.substring(0, 500));
      return NextResponse.json(
        {
          error: "Invalid response format from AI service",
          details:
            jsonError instanceof Error ? jsonError.message : "JSON parse error",
          responsePreview: responseText.substring(0, 200),
        },
        { status: 500 }
      );
    }

    // Extract suggestion with validation
    const suggestion = grokData?.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      console.error("No suggestion in Grok response:", grokData);
      return NextResponse.json(
        {
          error: "AI service did not generate a suggestion",
          details: "No content found in AI response",
          responseData: grokData,
        },
        { status: 500 }
      );
    }

    console.log("=== AI Assistance API Route Success (Grok-3) ===");
    console.log("Suggestion generated:", suggestion.substring(0, 100) + "...");

    return NextResponse.json({
      suggestion,
      success: true,
      model: "grok-3",
    });
  } catch (error) {
    console.error("=== AI Assistance API Route Error ===");
    console.error("Unexpected error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Always return JSON for any unexpected errors
    return NextResponse.json(
      {
        error: "Internal server error in AI assistance service",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "unexpected_error",
      },
      { status: 500 }
    );
  }
}
