"use server";

import {
  SimulateReviewRequest,
  SimulateReviewResponse,
} from "@/lib/types/review";

/**
 * Server action to simulate a product review via the backend API
 * Handles validation, API calls, and error handling
 * @param formData - The form data containing product and user information
 * @returns Promise with success status and response data or error
 */
export async function simulateReview(
  formData: SimulateReviewRequest,
): Promise<SimulateReviewResponse> {
  try {
    // Validation: Check required fields
    if (!formData.product_name?.trim()) {
      return {
        success: false,
        error: "Product name is required",
      };
    }

    if (!formData.product_category) {
      return {
        success: false,
        error: "Product category is required",
      };
    }

    if (!formData.product_description?.trim()) {
      return {
        success: false,
        error: "Product description is required",
      };
    }

    // Validation: At least one of user_id or user_persona must be provided
    if (!formData.user_id?.trim() && !formData.user_persona?.trim()) {
      return {
        success: false,
        error: "Either user ID or persona must be provided",
      };
    }

    // Validation: business_name is required for food/business categories
    if (
      (formData.product_category === "food" ||
        formData.product_category === "business") &&
      !formData.business_name?.trim()
    ) {
      return {
        success: false,
        error: "Business name is required for food and business products",
      };
    }

    // Prepare the payload
    const payload = {
      user_id: formData.user_id || undefined,
      user_persona: formData.user_persona || undefined,
      product_name: formData.product_name.trim(),
      product_category: formData.product_category,
      product_description: formData.product_description.trim(),
      business_name: formData.business_name?.trim() || undefined,
    };

    // Remove undefined fields
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === undefined &&
        delete payload[key as keyof typeof payload],
    );

    // Make the API call with timeout
    const API_URL = "https://naija-soul.onrender.com/simulate-review";
    const TIMEOUT_MS = 3000000; // 30 second timeout

    console.log("🚀 Calling API with payload:", payload);

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
              "Request timeout (30s). The Render backend may be sleeping (free tier) or offline. Try again in a moment.",
          };
        }

        if (errorMsg.includes("connect")) {
          return {
            success: false,
            error:
              "Connection failed. The backend service may be down or in sleep mode. Visit render.com to check the service status.",
          };
        }

        if (errorMsg.includes("econnrefused")) {
          return {
            success: false,
            error:
              "Connection refused. The backend service is not responding. It may be restarting.",
          };
        }

        if (errorMsg.includes("timeout")) {
          return {
            success: false,
            error:
              "Connection timeout. The backend is not responding quickly enough. Try again soon.",
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
      console.log("✅ Successfully generated review:", data);
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
        error: `Failed to generate review: ${error.message}`,
      };
    }

    console.error("❌ Unknown error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
