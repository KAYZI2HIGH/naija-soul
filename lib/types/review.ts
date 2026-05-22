export interface SimulateReviewRequest {
  user_id?: string;
  user_persona?: string;
  product_name: string;
  product_category: "food" | "book" | "movie" | "business";
  product_description: string;
  business_name?: string;
}

export interface SimulateReviewResponseData {
  review_text: string;
  rating: number; // 1.0 - 5.0
  confidence: number; // 0.0 - 1.0
  audio_base64: string; // Base64 audio or empty string
  voice_used: string; // Voice model used (e.g., "Osagie")
  persona_match_score: number; // 0.0 - 1.0
}

export interface SimulateReviewResponse {
  success: boolean;
  data?: SimulateReviewResponseData;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
