import RatingBanner from "./RatingBanner";
import RatingModal from "./RatingModal";
import { useRatings } from "../hooks/useRatings";

interface DealRatingSectionProps {
  dealId: string;
  dealStatus: string;
  targetUserId: string;
}

const DealRatingSection = ({ dealId, dealStatus, targetUserId }: DealRatingSectionProps) => {
  const {
    showRatingModal,
    isRated,
    isSubmitting,
    submitRating,
    dismissRating,
    openRatingModal,
  } = useRatings(dealId, dealStatus, targetUserId);

  return (
    <>
      <RatingBanner
        isRated={isRated}
        submittedRating={null}
        onRateNow={openRatingModal}
      />

      <RatingModal
        open={showRatingModal}
        onSubmit={submitRating}
        onDismiss={dismissRating}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default DealRatingSection;