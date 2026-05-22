import { useMutation } from "@tanstack/react-query";
import { simulateReview } from "@/app/actions/simulate-review";
import type {
  SimulateReviewRequest,
  SimulateReviewResponse,
} from "@/lib/types/review";

export function useSimulateReview() {
  return useMutation<SimulateReviewResponse, Error, SimulateReviewRequest>({
    mutationFn: simulateReview,
    retry: 1,
    onError: (error) => {
      console.error("Failed to simulate review:", error);
    },
  });
}
