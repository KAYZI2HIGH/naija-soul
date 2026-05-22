export interface RecommendationRequest {
  user_id?: string;
  user_persona?: string;
  category?: "food" | "book" | "movie" | "business";
}

export interface Recommendation {
  name: string;
  category: string;
  score: number;
  reason: string;
}

export interface SpokenExplanation {
  audio_base64: string;
  voice_used: string;
  language: string;
  text_transcript: string;
}

export interface RecommendationResponseData {
  recommendations: Recommendation[];
  spoken_explanation: SpokenExplanation;
}

export interface RecommendationResponse {
  success: boolean;
  data?: RecommendationResponseData;
  error?: string;
}
