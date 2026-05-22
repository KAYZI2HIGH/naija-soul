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
import { Copy, X, Star } from "lucide-react";
import { useState } from "react";
import type { SimulateReviewResponse } from "@/lib/types/review";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: SimulateReviewResponse | null;
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

export function ReviewDialog({
  open,
  onOpenChange,
  response,
  isLoading = false,
}: ReviewDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (response?.data?.review_text) {
      navigator.clipboard.writeText(response.data.review_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl! bg-white dark:bg-white/5 ">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generated Review</DialogTitle>
          <DialogDescription>
            {response?.data?.voice_used &&
              `Narrated by ${response.data.voice_used} • ${response.data?.rating?.toFixed(1)}/5 stars`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-70 overflow-y-auto">
          {isLoading ?
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          : response?.success && response?.data ?
            <>
              {/* Audio Player - only if audio_base64 is not empty */}
              {response.data.audio_base64 &&
                response.data.audio_base64.trim() !== "" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black/80 dark:text-white/80">
                      Audio Narration
                    </label>
                    <audio
                      controls
                      className="w-full h-10"
                      src={`data:audio/wav;base64,${response.data.audio_base64}`}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              {/* Main Review Text */}
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/10 dark:border-white/10">
                <p className="text-base leading-relaxed text-black dark:text-white whitespace-pre-wrap">
                  {response.data.review_text}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <StarRating rating={response.data.rating} />
              </div>

              {/* Metadata: Confidence & Persona Match */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                <div>
                  <p className="text-xs font-medium text-black/60 dark:text-white/60">
                    Confidence Score
                  </p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {(response.data.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-black/60 dark:text-white/60">
                    Persona Match
                  </p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {(response.data.persona_match_score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </>
          : response?.error ?
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {response.error}
              </p>
            </div>
          : null}
        </div>

        <DialogFooter className="flex gap-2">
          {response?.success && response?.data ?
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Review"}
            </Button>
          : null}
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
