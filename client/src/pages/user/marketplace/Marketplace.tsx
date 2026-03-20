import { useState, useEffect, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";

import MarketplaceControls from "./components/MarketplaceControls";
import { type FilterState } from "./components/MarketplaceControls";
import { defaultFilters } from "./components/MarketplaceControls";
import MarketplaceResults from "./components/MarketplaceResults";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import { auctionToMarketplace } from "@/adapters/auction.adapter";

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { auctions, loading } = useAppSelector((state) => state.auction);
  console.log("auctions:", auctions, "loading:", loading);


  const [viewMode, setViewMode]             = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("newest");
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

  /* ── Fetch once on mount ── */
  useEffect(() => {
    dispatch(auctionActions.fetchAuctionsRequest({}));
  }, [dispatch]);

  /* ── Transform raw auctions ── */
 

const allListings = useMemo(
  () => auctions
    .filter((a) => a.status === "active" || a.status === "upcoming")
    .map(auctionToMarketplace),
  [auctions]
); 
  /* ── Client-side filter + sort ── */
  const listings = useMemo(() => {
    let result = allListings.filter((l) => {
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !l.name.toLowerCase().includes(q) &&
        !l.color.toLowerCase().includes(q) &&
        !l.clarity.toLowerCase().includes(q) &&
        !String(l.carat).includes(q)
      )
        return false;

      if (l.price < appliedFilters.priceRange[0] || l.price > appliedFilters.priceRange[1]) return false;
      if (l.carat < appliedFilters.caratRange[0] || l.carat > appliedFilters.caratRange[1]) return false;

      if (
        appliedFilters.selectedShapes.length > 0 &&
        !appliedFilters.selectedShapes.some((s) =>
          l.name.toLowerCase().includes(s.toLowerCase())
        )
      )
        return false;

      if (appliedFilters.selectedColors.length > 0 && !appliedFilters.selectedColors.includes(l.color))
        return false;

      if (appliedFilters.selectedClarities.length > 0 && !appliedFilters.selectedClarities.includes(l.clarity))
        return false;

      if (appliedFilters.selectedCuts.length > 0 && !appliedFilters.selectedCuts.includes(l.cut))
        return false;

      return true;
    });

    switch (sortBy) {
      case "price-low":  return [...result].sort((a, b) => a.price - b.price);
      case "price-high": return [...result].sort((a, b) => b.price - a.price);
      case "carat-high": return [...result].sort((a, b) => b.carat - a.carat);
      case "carat-low":  return [...result].sort((a, b) => a.carat - b.carat);
      case "most-bids":  return [...result].sort((a, b) => b.bids - a.bids);
      default:           return result;
    }
  }, [allListings, searchQuery, sortBy, appliedFilters]);

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">

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