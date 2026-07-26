import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DealRating } from "../types/rating.types";
import RatingStars from "./RatingStars";

interface RatingBannerProps {
  isRated: boolean;
  submittedRating?: DealRating | null;
  onRateNow: () => void;
}

const RatingBanner = ({ isRated, submittedRating, onRateNow }: RatingBannerProps) => {
  if (isRated && submittedRating) {
    console.log("Submitted rating:", submittedRating);
    return (
      <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-4">
        <div className="flex items-center gap-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <div>
            <p className="text-sm font-medium">You rated this deal</p>
            <RatingStars value={submittedRating.overall} size="sm" readOnly />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-4">
      <div>
        <p className="text-sm font-medium">You haven't rated this deal yet</p>
        <p className="text-xs text-muted-foreground">Help build trust</p>
      </div>
      <Button size="sm" onClick={onRateNow}>
        Rate Now
      </Button>
    </div>
  );
};

export default RatingBanner;