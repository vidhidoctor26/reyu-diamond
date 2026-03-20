import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { bidActions } from "@/store/slices/bidSlice";

export const useMyBids = () => {
  const dispatch = useAppDispatch();
  const { myBids, loading } = useAppSelector((s) => s.bid);

  const [activeTab,    setActiveTab]    = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");

  useEffect(() => {
    dispatch(bidActions.fetchAllMyBidsRequest());
  }, [dispatch]);

  // Transform raw bid → BidCard shape
  const transformed = useMemo(() => myBids.map((bid: any) => {
    const auction = bid.auctionId;
    const inv     = auction?.inventoryId;
    return {
      id:          bid._id,
      listingId:   auction?._id,
      listingName: inv?.shape   ? `${inv.shape} ${inv.carat}ct` : "Diamond",
      specs:       inv ? `${inv.color}/${inv.clarity}/${inv.cut}` : "-",
      seller:      auction?.sellerId?.name || "Seller",
      myBid:       bid.bidAmount,
      askingPrice: auction?.currentBid ?? auction?.basePrice ?? 0,
      status:      bid.status?.toLowerCase(),
      placedAt:    bid.createdAt,
      isHighest:   bid.isHighestBid,
      dealId:      bid.dealId || null,
    };
  }), [myBids]);

  const filtered = useMemo(() => {
    return transformed.filter((bid) => {
      const matchesTab    = activeTab === "all" || bid.status === activeTab;
      const matchesSearch = bid.listingName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [transformed, activeTab, searchQuery]);

  const stats = useMemo(() => ({
    total:    transformed.length,
    active:   transformed.filter((b) => b.status === "active").length,
    accepted: transformed.filter((b) => b.status === "accepted").length,
    rejected: transformed.filter((b) => b.status === "rejected").length,
  }), [transformed]);

  return {
    bids: filtered,
    stats,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  };
};