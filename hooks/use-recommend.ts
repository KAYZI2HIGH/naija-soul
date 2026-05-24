import { useMutation } from "@tanstack/react-query";
import { recommend } from "@/app/actions/recommend";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/types/recommendation";

export function useRecommend() {
  return useMutation<RecommendationResponse, Error, RecommendationRequest>({
    mutationFn: recommend,
    retry: 1,
    onSuccess: (data) => {
      console.log("✅ Recommendation API Success:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to get recommendations:", error);
    },
  });
}
