import { useState, useEffect, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import MarketplaceControls from "./components/MarketplaceControls";
import { type FilterState, defaultFilters } from "./components/MarketplaceControls";
import MarketplaceResults from "./components/MarketplaceResults";
import MarketplaceBanner from "./components/MarketplaceBanner";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { fetchActiveAdsRequest } from "@/store/slices/advertisementSlice";
import { auctionToMarketplace } from "@/adapters/auction.adapter";

const Marketplace = () => {
  const dispatch = useAppDispatch();

  const { auctions, loading } = useAppSelector((state) => state.auction);
  const { activeAds }         = useAppSelector((state) => state.advertisement);

  const [viewMode, setViewMode]             = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("newest");
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

  /* ── Fetch on mount ── */
  useEffect(() => {
    dispatch(auctionActions.fetchAuctionsRequest({}));
    dispatch(fetchActiveAdsRequest("MARKETPLACE")); // GET /ads?section=MARKETPLACE
  }, [dispatch]);

  /* ── Transform raw auctions ── */
  const allListings = useMemo(() => {
  const mapped = auctions
    .filter((a) => a.status === "active" || a.status === "upcoming")
    .map(auctionToMarketplace);

  console.log("🔥 ALL LISTINGS:", mapped);

  return mapped;
}, [auctions]);

  /* ── Client-side filter + sort ── */
const listings = useMemo(() => {
  console.log("🧪 BEFORE FILTER:", allListings);

  let result = allListings.filter((l) => {
    console.log("🔍 CHECKING ITEM:", l);

    const q = searchQuery.toLowerCase();

    if (
      q &&
      !l.name?.toLowerCase().includes(q) &&
      !l.color?.toLowerCase().includes(q) &&
      !l.clarity?.toLowerCase().includes(q) &&
      !String(l.carat).includes(q)
    ) {
      console.log("❌ FILTERED BY SEARCH", l);
      return false;
    }

    if (l.price < appliedFilters.priceRange[0] || l.price > appliedFilters.priceRange[1]) {
      console.log("❌ FILTERED BY PRICE", l);
      return false;
    }

    if (l.carat < appliedFilters.caratRange[0] || l.carat > appliedFilters.caratRange[1]) {
      console.log("❌ FILTERED BY CARAT", l);
      return false;
    }

    return true;
  });

  console.log("✅ FINAL LISTINGS:", result);

  return result;
}, [allListings, searchQuery, sortBy, appliedFilters]);

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-6">

        {/* Sponsored banner — only renders when approved ads exist */}
        {activeAds.length > 0 && (
          <MarketplaceBanner ads={activeAds} />
        )}

        <MarketplaceControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          appliedFilters={appliedFilters}
          onApplyFilters={setAppliedFilters}
          onClearFilters={() => setAppliedFilters(defaultFilters)}
        />

        {loading ? (
          <p className="text-center text-muted-foreground">Loading diamonds...</p>
        ) : (
          <MarketplaceResults listings={listings} viewMode={viewMode} />
        )}

      </div>
    </DashboardShell>
  );
};

export default Marketplace;