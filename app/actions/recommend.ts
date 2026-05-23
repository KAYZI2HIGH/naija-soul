"use server";

import {
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/types/recommendation";

/**
 * Server action to get personalized recommendations via the backend API
 * Handles validation, API calls, and error handling
 * @param formData - The request data containing user info and optional category filter
 * @returns Promise with success status and recommendation data or error
 */
export async function recommend(
  formData: RecommendationRequest,
): Promise<RecommendationResponse> {
  try {
    // Validation: At least one of user_id or user_persona must be provided
    if (!formData.user_id?.trim() && !formData.user_persona?.trim()) {
      return {
        success: false,
        error: "Either user ID or persona must be provided",
      };
    }

    // Prepare the payload
    const payload: Record<string, string> = {};

    if (formData.user_id?.trim()) {
      payload.user_id = formData.user_id.trim();
    }

    if (formData.user_persona?.trim()) {
      payload.user_persona = formData.user_persona.trim();
    }

    if (formData.category) {
      payload.category = formData.category;
    }

    if (formData.language) {
      payload.language = formData.language;
    }

    // Make the API call with timeout
    const API_URL = "https://naija-soul.onrender.com/recommend";
    const TIMEOUT_MS = 30000000; // 3000 second timeout

    console.log("🚀 Calling recommendations API with payload:", payload);

    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Request timeout after", TIMEOUT_MS, "ms");
        controller.abort();
      }, TIMEOUT_MS);

      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("✅ API response received, status:", response.status);
    } catch (fetchError) {
      console.error("❌ Fetch error:", fetchError);

      if (fetchError instanceof Error) {
        const errorMsg = fetchError.message.toLowerCase();

        // Better error messaging based on error type
        if (fetchError.name === "AbortError") {
          return {
            success: false,
            error:
              "Request timeout (30s). The backend may be sleeping or offline. Try again in a moment.",
          };
        }

        if (errorMsg.includes("connect")) {
          return {
            success: false,
            error:
              "Connection failed. The backend service may be down or in sleep mode.",
          };
        }

        if (errorMsg.includes("econnrefused")) {
          return {
            success: false,
            error: "Connection refused. The backend service is not responding.",
          };
        }

        if (errorMsg.includes("timeout")) {
          return {
            success: false,
            error:
              "Connection timeout. The backend is not responding quickly enough.",
          };
        }

        return {
          success: false,
          error: `Network error: ${fetchError.message}`,
        };
      }

      return {
        success: false,
        error:
          "Failed to connect to the API server. Please check your internet and try again.",
      };
    }

    // Handle network errors
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;

      try {
        // Try to read response body as text first (works for both JSON and HTML)
        const responseText = await response.text();
        console.error("❌ API error response body:", responseText);

        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response is HTML or plain text, not JSON
          if (response.status === 500) {
            errorMessage =
              "Backend server error (500). The API may be down or experiencing issues.";
          } else if (response.status === 502 || response.status === 503) {
            errorMessage =
              "Backend service temporarily unavailable. Please try again in a moment.";
          } else {
            // Extract first 100 chars of error for debugging
            errorMessage = responseText.substring(0, 100) || errorMessage;
          }
        }
      } catch (readError) {
        console.error("❌ Could not read error response:", readError);
        errorMessage = `API Error: ${response.status}. Could not read response.`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // Parse successful response
    try {
      const data = await response.json();
      console.log("✅ Successfully got recommendations:", data);
      return {
        success: true,
        data,
      };
    } catch (parseError) {
      console.error("❌ Failed to parse response:", parseError);
      return {
        success: false,
        error: "Received invalid response from API. Please try again.",
      };
    }
  } catch (error) {
    // Handle timeout
    if (error instanceof Error && error.name === "AbortError") {
      console.error("⏱️ Request timeout");
      return {
        success: false,
        error: "Request took too long. Please try again.",
      };
    }

    // Handle other errors
    if (error instanceof Error) {
      console.error("❌ Unexpected error:", error);
      return {
        success: false,
        error: `Failed to get recommendations: ${error.message}`,
      };
    }

    console.error("❌ Unknown error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
