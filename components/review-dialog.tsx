"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, X, Star, MapPin } from "lucide-react";
import { useState } from "react";
import type { SimulateReviewResponse } from "@/lib/types/review";
import type { RecommendationResponse } from "@/lib/types/recommendation";

type ResponseType = SimulateReviewResponse | RecommendationResponse | null;

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: {
    review: SimulateReviewResponse | null;
    recommendation: RecommendationResponse | null;
  };
  isLoading?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar ?
                "fill-yellow-400 text-yellow-400 opacity-50"
              : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-black dark:text-white">
        {rating.toFixed(1)}/5.0
      </span>
    </div>
  );
}

function isReviewResponse(
  response: ResponseType,
): response is SimulateReviewResponse {
  return !!(
    response?.success &&
    response.data &&
    "review_text" in response.data &&
    "rating" in response.data
  );
}

function isRecommendationResponse(
  response: ResponseType,
): response is RecommendationResponse {
  return !!(
    response?.success &&
    response.data &&
    "recommendations" in response.data &&
    "spoken_explanation" in response.data
  );
}

export function ReviewDialog({
  open,
  onOpenChange,
  response,
  isLoading = false,
}: ReviewDialogProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"review" | "recommendation">(
    "review",
  );

  const copyToClipboard = () => {
    if (activeTab === "review" && response.review?.data?.review_text) {
      navigator.clipboard.writeText(response.review.data.review_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (
      activeTab === "recommendation" &&
      response.recommendation?.data?.spoken_explanation?.text_transcript
    ) {
      navigator.clipboard.writeText(
        response.recommendation.data.spoken_explanation.text_transcript,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reviewSuccess = response.review?.success && response.review?.data;
  const recommendationSuccess =
    response.recommendation?.success && response.recommendation?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl bg-white dark:bg-white/5 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Results</DialogTitle>
          <DialogDescription>
            Your personalized review and recommendations
          </DialogDescription>
        </DialogHeader>

        {isLoading ?
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        : <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as "review" | "recommendation")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="review"
                disabled={!reviewSuccess}
              >
                📝 Review
              </TabsTrigger>
              <TabsTrigger
                value="recommendation"
                disabled={!recommendationSuccess}
              >
                💡 Recommendations
              </TabsTrigger>
            </TabsList>

            {/* REVIEW TAB */}
            <TabsContent
              value="review"
              className="space-y-4 py-4"
            >
              {reviewSuccess && response.review?.data ?
                <div className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent border border-green-200 dark:border-green-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white mb-3">
                      Generated Review
                    </h3>

                    {/* Audio Player - only if audio_base64 is not empty */}
                    {response.review.data?.audio_base64 &&
                      response.review.data.audio_base64.trim() !== "" && (
                        <div className="space-y-2 mb-4">
                          <label className="text-sm font-medium text-black/80 dark:text-white/80">
                            Audio Narration
                          </label>
                          <audio
                            controls
                            className="w-full h-10"
                            src={`data:audio/wav;base64,${response.review.data.audio_base64}`}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                    {/* Main Review Text */}
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded border border-black/10 dark:border-white/10 mb-3">
                      <p className="text-sm leading-relaxed text-black dark:text-white">
                        {response.review.data.review_text}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      <StarRating rating={response.review.data.rating} />
                    </div>

                    {/* Metadata: Confidence & Persona Match */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs font-medium text-black/60 dark:text-white/60">
                          Confidence
                        </p>
                        <p className="font-semibold text-black dark:text-white">
                          {(response.review.data.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-black/60 dark:text-white/60">
                          Persona Match
                        </p>
                        <p className="font-semibold text-black dark:text-white">
                          {(
                            response.review.data.persona_match_score * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              : response.review?.error ?
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {response.review.error}
                  </p>
                </div>
              : <div className="p-4 text-center text-black/60 dark:text-white/60">
                  No review data available
                </div>
              }
            </TabsContent>

            {/* RECOMMENDATION TAB */}
            <TabsContent
              value="recommendation"
              className="space-y-4 py-4"
            >
              {recommendationSuccess && response.recommendation?.data ?
                <div className="space-y-4 p-4 bg-linear-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border border-blue-200 dark:border-blue-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white mb-3">
                      Personalized Recommendations
                    </h3>

                    {/* Audio Player - only if audio_base64 is not empty */}
                    {response.recommendation.data?.spoken_explanation
                      ?.audio_base64 &&
                      response.recommendation.data.spoken_explanation.audio_base64.trim() !==
                        "" && (
                        <div className="space-y-2 mb-4">
                          <label className="text-sm font-medium text-black/80 dark:text-white/80">
                            Audio Explanation
                          </label>
                          <audio
                            controls
                            className="w-full h-10"
                            src={`data:audio/wav;base64,${response.recommendation.data.spoken_explanation.audio_base64}`}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                    {/* Recommendations List */}
                    <div className="space-y-2 mb-4">
                      {response.recommendation.data.recommendations.map(
                        (rec, index) => (
                          <div
                            key={index}
                            className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                  <h4 className="font-semibold text-sm text-black dark:text-white">
                                    {rec.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-black/60 dark:text-white/60 capitalize mt-1">
                                  {rec.category}
                                </p>
                                <p className="text-xs text-black/80 dark:text-white/80 mt-2">
                                  {rec.reason}
                                </p>
                              </div>
                              <div className="shrink-0 text-right">
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {(rec.score * 100).toFixed(0)}%
                                </div>
                                <p className="text-xs text-black/60 dark:text-white/60">
                                  match
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Text Transcript */}
                    {response.recommendation.data.spoken_explanation
                      ?.text_transcript && (
                      <div className="bg-black/5 dark:bg-white/5 p-3 rounded border border-black/10 dark:border-white/10 text-sm">
                        <p className="leading-relaxed text-black dark:text-white">
                          {
                            response.recommendation.data.spoken_explanation
                              .text_transcript
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              : response.recommendation?.error ?
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {response.recommendation.error}
                  </p>
                </div>
              : <div className="p-4 text-center text-black/60 dark:text-white/60">
                  No recommendations data available
                </div>
              }
            </TabsContent>
          </Tabs>
        }

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            disabled={
              (!copied && activeTab === "review" && !reviewSuccess) ||
              (activeTab === "recommendation" && !recommendationSuccess)
            }
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
