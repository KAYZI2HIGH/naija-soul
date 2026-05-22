"use server";

import type { SimulateReviewResponse } from "@/lib/types/review";

/**
 * Mock server action for testing without a live backend
 * Generates realistic review responses based on input
 */
export async function mockSimulateReview(data: {
  product_name: string;
  product_category: string;
  user_persona: string;
}): Promise<SimulateReviewResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const reviews: Record<string, string> = {
    book: `"Half of a Yellow Sun" is an absolutely gripping masterpiece! Chimamanda Adichie's vivid storytelling transports you directly into the heart of the Biafran War. The character development is phenomenal, especially how she weaves multiple perspectives together. The historical accuracy combined with deeply personal narratives makes this not just a book, but an essential read.`,
    food: `Omo, this jollof rice na the real deal! The grains are perfectly separated, the flavor profile is authentic, and everything is just *chef's kiss*. The accompanying sides are top-notch. The service is friendly and the ambiance is perfect for both casual dining and special occasions. This is what real Nigerian cuisine tastes like!`,
    movie: `An absolute cinematographic gem! The direction is masterful, the cinematography is breathtaking, and the performances are deeply moving. Every scene is carefully crafted to deliver emotional impact. This is the kind of film that stays with you long after the credits roll. A true work of art.`,
    business: `Outstanding customer service and quality products! The team really understands their market and delivers exceptional value. I've been a loyal customer for months and have never been disappointed. The pricing is fair, the quality is consistent, and they genuinely care about their customers.`,
  };

  const voiceOptions = ["Osagie", "Zainab", "Chukwu", "Amara"];
  const randomVoice =
    voiceOptions[Math.floor(Math.random() * voiceOptions.length)];

  const reviewText =
    reviews[data.product_category] ||
    `This product exceeded all my expectations! I'm really impressed with the quality and attention to detail. Highly recommended!`;

  return {
    success: true,
    data: {
      review_text: reviewText,
      rating: 4.5 + Math.random() * 0.5, // 4.5-5.0
      confidence: 0.85 + Math.random() * 0.15, // 0.85-1.0
      audio_base64: "", // Empty for mock (would be base64 encoded audio in real API)
      voice_used: randomVoice,
      persona_match_score: 0.8 + Math.random() * 0.2, // 0.8-1.0
    },
  };
}
