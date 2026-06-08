"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface ReviewSectionProps {
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
}

export default function ReviewSection({
  reviews,
  avgRating,
  totalReviews,
}: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => r.rating === rating).length / totalReviews) *
          100
        : 0,
  }));

  return (
    <section className="py-12 border-t border-border">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Summary */}
        <div className="text-center lg:text-left">
          <div className="text-5xl font-bold text-foreground mb-2">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(avgRating)
                    ? "text-brand-gold fill-brand-gold"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-2 space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium w-8">{rating} ★</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gold rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {displayReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-border rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${
                          j < review.rating
                            ? "text-brand-gold fill-brand-gold"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {review.isVerified && (
                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                      Verified
                    </span>
                  )}
                </div>
                {review.title && (
                  <h4 className="font-semibold text-sm text-foreground">
                    {review.title}
                  </h4>
                )}
              </div>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful
              </button>
            </div>

            {review.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {review.comment}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {review.user.name || "Anonymous"}
              </span>
              <span>·</span>
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 text-sm font-semibold text-brand-red hover:underline"
        >
          {showAll ? "Show less" : `View all ${reviews.length} reviews`}
        </button>
      )}
    </section>
  );
}
