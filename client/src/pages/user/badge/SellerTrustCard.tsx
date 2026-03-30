import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Badge } from "@/store/slices/badgeSlice";
import type { Rating, RatingsData } from "@/store/slices/ratingSlice";

// ── Tier colour map ──────────────────────────────
const tierConfig: Record<string, { label: string; className: string }> = {
  BRONZE:   { label: "Bronze",   className: "border-amber-700  text-amber-700  bg-amber-50   dark:bg-amber-900/20" },
  SILVER:   { label: "Silver",   className: "border-slate-400  text-slate-400  bg-slate-50   dark:bg-slate-800/20" },
  GOLD:     { label: "Gold",     className: "border-yellow-500 text-yellow-600 bg-yellow-50  dark:bg-yellow-900/20" },
  PLATINUM: { label: "Platinum", className: "border-cyan-500   text-cyan-600   bg-cyan-50    dark:bg-cyan-900/20"  },
  DIAMOND:  { label: "Diamond",  className: "border-purple-500 text-purple-600 bg-purple-50  dark:bg-purple-900/20"},
};

// ── Small star row ───────────────────────────────
const StarRow = ({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) => {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-transparent text-border"}`}
        />
      ))}
    </div>
  );
};

// ── Category bar ─────────────────────────────────
const CategoryBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="w-32 text-muted-foreground shrink-0">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-amber-400 transition-all duration-500"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
    <span className="w-6 text-right text-xs font-medium text-muted-foreground">
      {value > 0 ? value.toFixed(1) : "—"}
    </span>
  </div>
);

// ── Single review row ────────────────────────────
const ReviewRow = ({ review }: { review: Rating }) => {
  const raterName =
    typeof review.raterId === "object"
      ? (review.raterId as any).name
      : "Anonymous";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
            {review.isAnonymous ? "?" : raterName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm font-medium">
            {review.isAnonymous ? "Anonymous" : raterName}
          </span>
        </div>
        <StarRow value={review.rating} />
      </div>
      {review.review && (
        <p className="text-xs text-muted-foreground pl-9 leading-relaxed">
          {review.review}
        </p>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────
interface SellerTrustCardProps {
  ratingsData: RatingsData | null;
  badges: Badge[];
  ratingsLoading: boolean;
  badgesLoading: boolean;
}

const categoryLabels: Record<string, string> = {
  communication:   "Communication",
  productQuality:  "Product Quality",
  delivery:        "Delivery",
  pricing:         "Pricing",
  professionalism: "Professionalism",
};

const SellerTrustCard = ({
  ratingsData,
  badges,
  ratingsLoading,
  badgesLoading,
}: SellerTrustCardProps) => {
  const ratings = ratingsData?.ratings ?? [];
  const stats   = ratingsData?.user?.stats;

  // Compute per-category averages from ratings
  const categoryAverages = (() => {
    const keys = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    keys.forEach((k) => { sums[k] = 0; counts[k] = 0; });

    ratings.forEach((r) => {
      if (!r.categories) return;
      keys.forEach((k) => {
        const val = (r.categories as any)?.[k];
        if (val && val > 0) {
          sums[k] += val;
          counts[k]++;
        }
      });
    });

    return keys.map((k) => ({
      key: k,
      label: categoryLabels[k],
      avg: counts[k] > 0 ? sums[k] / counts[k] : 0,
    }));
  })();

  const avgRating: number = stats?.averageRating ?? 0;
  const totalReviews: number = stats?.totalRatings ?? ratings.length;
  const earnedBadges = badges.filter((b) => b.isEarned);
  const recentReviews = ratings.slice(0, 3);

  if (ratingsLoading || badgesLoading) {
    return (
      <Card className="card-premium animate-pulse">
        <CardContent className="h-32" />
      </Card>
    );
  }

  return (
    <Card className="card-premium">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base">Seller Trust & Reputation</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* ── Overall rating ── */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-primary leading-none">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </div>
            <StarRow value={avgRating} size="md" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Category bars */}
          <div className="flex-1 space-y-2">
            {categoryAverages.map(({ key, label, avg }) => (
              <CategoryBar key={key} label={label} value={avg} />
            ))}
          </div>
        </div>

        {/* ── Earned badges ── */}
        {earnedBadges.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Earned Badges</p>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map((badge) => {
                  const tc = tierConfig[badge.tier] ?? tierConfig.BRONZE;
                  return (
                    <div
                      key={badge.badgeId}
                      title={badge.description}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-default"
                      style={{}}
                    >
                      <img src={badge.icon} alt={badge.name} className="w-3.5 h-3.5 object-contain" />
                      <span className={`${tc.className} rounded-full`}>{badge.name}</span>
                      <UiBadge variant="outline" className={`text-[10px] px-1.5 py-0 ${tc.className}`}>
                        {tc.label}
                      </UiBadge>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Recent reviews ── */}
        {recentReviews.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Recent Reviews</p>
              {recentReviews.map((r) => (
                <ReviewRow key={r._id} review={r} />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {totalReviews === 0 && earnedBadges.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No reviews yet for this seller.
          </p>
        )}

      </CardContent>
    </Card>
  );
};

export default SellerTrustCard;