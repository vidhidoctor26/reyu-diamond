import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { ratingActions } from "@/store/slices/ratingSlice";
import type { RootState } from "@/store";
import { toast } from "sonner";

export interface DealRating {
  dealId: string;
  overall: number;
  categories: {
    communication: number;
    productQuality: number;
    delivery: number;
    pricing: number;
    professionalism: number;
  };
  reviewText: string;
  anonymous: boolean;
  submittedAt: string;
}

// Tracks dismissed modals for this browser session only (not persisted)
const sessionDismissed = new Set<string>();

// Tracks which dealIds have been submitted this session
const getSubmittedSet = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem("submitted_ratings") || "[]"));
  } catch {
    return new Set();
  }
};

const markSubmitted = (dealId: string) => {
  const s = getSubmittedSet();
  s.add(dealId);
  localStorage.setItem("submitted_ratings", JSON.stringify([...s]));
};

export const useRatings = (
  dealId: string,
  dealStatus: string,
  targetUserId: string  // the OTHER party's userId to rate
) => {
  const dispatch = useAppDispatch();
  const { submitLoading } = useAppSelector((state: RootState) => state.rating);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isRated, setIsRated] = useState(false);

  useEffect(() => {
    const submitted = getSubmittedSet();
    if (submitted.has(dealId)) {
      setIsRated(true);
      return;
    }

    if (dealStatus === "COMPLETED" && !sessionDismissed.has(dealId)) {
      setTimeout(() => setShowRatingModal(true), 600);
    }
  }, [dealId, dealStatus]);

  const submitRating = useCallback(
    async (rating: Omit<DealRating, "dealId" | "submittedAt">) => {
      dispatch(
        ratingActions.submitRatingRequest({
          userId: targetUserId,
          dealId,
          rating: rating.overall,
          review: rating.reviewText || undefined,
          categories: {
            communication: rating.categories.communication || undefined,
            productQuality: rating.categories.productQuality || undefined,
            delivery: rating.categories.delivery || undefined,
            pricing: rating.categories.pricing || undefined,
            professionalism: rating.categories.professionalism || undefined,
          },
          isAnonymous: rating.anonymous,
          onSuccess: () => {
            markSubmitted(dealId);
            setIsRated(true);
            setShowRatingModal(false);
            toast.success("Rating submitted successfully!");
          },
          onError: (msg: string) => {
            toast.error(msg || "Failed to submit rating");
          },
        })
      );
    },
    [dispatch, dealId, targetUserId]
  );

  const dismissRating = useCallback(() => {
    sessionDismissed.add(dealId);
    setShowRatingModal(false);
  }, [dealId]);

  const openRatingModal = useCallback(() => {
    setShowRatingModal(true);
  }, []);

  return {
    showRatingModal,
    isRated,
    isSubmitting: submitLoading,
    submitRating,
    dismissRating,
    openRatingModal,
  };
};