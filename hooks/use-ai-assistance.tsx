"use client"

import { useState } from "react"

interface AIAssistanceOptions {
  fieldType: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying"
  currentValue?: string
  language: "en" | "ar"
}

interface AIResponse {
  suggestion: string
  error?: string
}

export function useAIAssistance() {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<string>("")
  const [error, setError] = useState<string>("")

  const generateSuggestion = async (options: AIAssistanceOptions): Promise<AIResponse> => {
    setIsLoading(true)
    setError("")
    setSuggestion("")

    try {
      console.log("=== AI Assistance Hook Started ===")
      console.log("Options:", options)

      const prompts = {
        en: {
          currentFinancialSituation:
            "Help me describe my current financial situation for a financial assistance application. Write a professional description of financial hardship including expenses and challenges.",
          employmentCircumstances:
            "Help me describe my employment situation for a financial assistance application. Explain current work status and employment challenges.",
          reasonForApplying:
            "Help me explain why I'm applying for financial assistance and how it will help improve my situation. Write a compelling explanation of the positive impact.",
        },
        ar: {
          currentFinancialSituation:
            "ساعدني في وصف وضعي المالي الحالي لطلب مساعدة مالية. اكتب وصفاً مهنياً للصعوبات المالية والمصاريف والتحديات.",
          employmentCircumstances: "ساعدني في وصف وضع عملي لطلب مساعدة مالية. اشرح وضع عملي الحالي وتحديات التوظيف.",
          reasonForApplying:
            "ساعدني في شرح سبب تقديمي لطلب المساعدة المالية وكيف ستحسن وضعي. اكتب شرحاً مقنعاً للتأثير الإيجابي.",
        },
      }

      const requestBody = {
        prompt: prompts[options.language][options.fieldType],
        currentValue: options.currentValue || "",
        language: options.language,
      }

      console.log("Making API request with body:", requestBody)

      // Make the API request with timeout and better error handling
      let response
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

        response = await fetch("/api/ai-assistance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        console.log("API response received:", response.status, response.statusText)
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)

        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error("Request timed out. Please try again.")
        }

        throw new Error("Network error: Unable to connect to the server")
      }

      // Get response text first to handle both JSON and HTML responses
      let responseText
      try {
        responseText = await response.text()
        console.log("Response text received, length:", responseText.length)
        console.log("Response text preview:", responseText.substring(0, 200))
      } catch (textError) {
        console.error("Error reading response text:", textError)
        throw new Error("Failed to read server response")
      }

      // Check if response is empty
      if (!responseText || responseText.trim() === "") {
        console.error("Empty response received")
        throw new Error("Empty response from server")
      }

      // Check if it's an HTML error page (common when API routes crash)
      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html") ||
        responseText.includes("Internal Server Error") ||
        responseText.includes("Application error") ||
        responseText.startsWith("Internal s") // Catch the specific error you're seeing
      ) {
        console.error("Received HTML error page instead of JSON")
        console.error("HTML response:", responseText.substring(0, 500))
        throw new Error("Server error: The AI service encountered an internal error. Please try again.")
      }

      // Try to parse JSON with better error handling
      let data
      try {
        data = JSON.parse(responseText)
        console.log("JSON parsed successfully:", data)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Response text that failed to parse:", responseText.substring(0, 500))

        // Provide more specific error message
        if (responseText.includes("Unexpected token")) {
          throw new Error("Server returned invalid data format. Please try again.")
        } else {
          throw new Error("Invalid response format from server. Please try again.")
        }
      }

      // Check for API errors with better error handling
      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Server error: ${response.status}`
        console.error("API error:", errorMessage)
        console.error("Error details:", data?.details)

        if (response.status === 429) {
          throw new Error("AI service is busy. Please wait a moment and try again.")
        } else if (response.status === 408) {
          throw new Error("Request timed out. Please try again.")
        } else if (response.status >= 500) {
          throw new Error("AI service is temporarily unavailable. Please try again later.")
        } else if (response.status === 400) {
          throw new Error(`Invalid request: ${errorMessage}`)
        } else {
          throw new Error(errorMessage)
        }
      }

      // Check for suggestion with validation
      if (!data || typeof data !== "object") {
        console.error("Invalid data structure:", data)
        throw new Error("Invalid response structure from AI service")
      }

      if (!data.suggestion || typeof data.suggestion !== "string") {
        console.error("No suggestion in response:", data)
        throw new Error("No suggestion received from AI service")
      }

      if (data.suggestion.trim() === "") {
        console.error("Empty suggestion received:", data)
        throw new Error("AI service returned empty suggestion")
      }

      console.log("=== AI Assistance Hook Success ===")
      console.log("Suggestion received:", data.suggestion.substring(0, 100) + "...")

      setSuggestion(data.suggestion)
      return { suggestion: data.suggestion }
    } catch (err) {
      console.error("=== AI Assistance Hook Error ===")
      console.error("Error details:", err)

      let errorMessage = "Unable to generate suggestion. Please try again."

      if (err instanceof Error) {
        if (err.message.includes("Network error")) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (err.message.includes("Server error") || err.message.includes("internal error")) {
          errorMessage = "Server error. Please try again later."
        } else if (err.message.includes("Invalid response") || err.message.includes("invalid data")) {
          errorMessage = "Server communication error. Please try again."
        } else if (err.message.includes("timed out")) {
          errorMessage = "Request timed out. Please try again."
        } else if (err.message.includes("429") || err.message.includes("busy")) {
          errorMessage = "AI service is busy. Please wait a moment and try again."
        } else if (err.message.includes("Invalid request")) {
          errorMessage = "Request error. Please try again."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      return { suggestion: "", error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateSuggestion,
    isLoading,
    suggestion,
    error,
    clearSuggestion: () => setSuggestion(""),
    clearError: () => setError(""),
  }
}
