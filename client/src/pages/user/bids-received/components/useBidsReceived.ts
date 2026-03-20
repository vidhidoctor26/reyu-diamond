import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { bidActions } from "@/store/slices/bidSlice";

export const useBidsOnMyListings = () => {
  const dispatch = useAppDispatch();
  const { auctionBids, loading } = useAppSelector((s) => s.bid);

  const [activeTab,    setActiveTab]    = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [sortBy,       setSortBy]       = useState("newest");
  const [selectedBid,  setSelectedBid]  = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<"accept" | "reject" | null>(null);

  // ✅ Single fetch — no loop, no overwriting
  useEffect(() => {
    dispatch(bidActions.fetchBidsReceivedRequest());
  }, [dispatch]);

  // ✅ Transform — use populated auctionId object directly
  const allBids = useMemo(() => auctionBids.map((bid: any) => {
    const auction = bid.auctionId;           // ← populated object from API
    const inv     = auction?.inventoryId;    // ← populated inventory

    return {
      id:          bid._id,
      listingId:   auction?._id,
      listingName: inv ? `${inv.shape} ${inv.carat}ct` : "Diamond",
      specs:       inv ? `${inv.color}/${inv.clarity}/${inv.cut}` : "-",
      askingPrice: auction?.currentBid ?? auction?.basePrice ?? 0,
      bidAmount:   bid.bidAmount,
      status:      bid.status?.toLowerCase(),
      placedAt:    bid.createdAt,
      isHighest:   bid.isHighestBid,
      bidder: {
        name:     bid.buyerId?.name || "Buyer",
        verified: true,
        rating:   "-",
      },
    };
  }), [auctionBids]);

  // Filter
  const filteredBids = useMemo(() => allBids.filter((bid) => {
    const matchesTab    = activeTab === "all" || bid.status === activeTab;
    const matchesSearch = bid.listingName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  }), [allBids, activeTab, searchQuery]);

  // Sort
  const sortedBids = useMemo(() => {
    const sorted = [...filteredBids];
    switch (sortBy) {
      case "highest": return sorted.sort((a, b) => b.bidAmount - a.bidAmount);
      case "lowest":  return sorted.sort((a, b) => a.bidAmount - b.bidAmount);
      case "oldest":  return sorted.sort((a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime());
      default:        return sorted.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    }
  }, [filteredBids, sortBy]);

  // ✅ Group — use populated auction data directly
  const groupedByListing = useMemo(() => {
    return sortedBids.reduce((acc: any, bid: any) => {
      const key = bid.listingId;
      if (!key) return acc;

      if (!acc[key]) {
        const rawBid  = auctionBids.find((b: any) => b._id === bid.id);
        const auction = (rawBid as any)?.auctionId;
        const inv     = auction?.inventoryId;

        acc[key] = {
          listingId:       key,
          listingName:     bid.listingName,
          specs:           bid.specs,
          askingPrice:     bid.askingPrice,
          inventoryStatus: auction?.status || "active",
          endDate:         auction?.endDate,
          thumbnail:       inv?.images?.[0] || null,
          bids:            [],
        };
      }
      acc[key].bids.push(bid);
      return acc;
    }, {});
  }, [sortedBids, auctionBids]);

  // Stats
  const stats = useMemo(() => ({
    total:    allBids.length,
    pending:  allBids.filter((b) => b.status === "active").length,
    accepted: allBids.filter((b) => b.status === "accepted").length,
    rejected: allBids.filter((b) => b.status === "rejected").length,
  }), [allBids]);

  return {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    groupedByListing,
    selectedBid, setSelectedBid,
    actionDialog, setActionDialog,
    stats,
    loading,
  };
};