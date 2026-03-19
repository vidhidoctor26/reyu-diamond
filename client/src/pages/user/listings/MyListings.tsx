import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { auctionActions } from "@/store/slices/auctionSlice";
import DashboardShell from "@/components/layout/DashboardShell";

import ListingsHeader from "./components/ListingsHeader";
import ListingsStats from "./components/ListingsStats";
import ListingsFilters from "./components/ListingsFilters";
import ListingsList from "./components/ListingsList";

import { auctionToMarketplace } from "@/adapters/auction.adapter";

const MyListings = () => {
  const dispatch = useAppDispatch();

  const { myAuctions, myLoading } = useAppSelector(
    (state) => state.auction
  );

  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  /* ================= FETCH ================= */
  useEffect(() => {
    const sellerId = user?._id || user?.id;
    if (!sellerId) return;

    dispatch(auctionActions.fetchMyAuctionsRequest({ sellerId }));
  }, [dispatch, user?._id, user?.id]);

  /* ================= MAP ================= */
  const mappedListings = (myAuctions || []).map(auctionToMarketplace);

  /* ================= FILTER ================= */
  const filteredListings = mappedListings.filter((l: any) => {
    const matchesTab =
      activeTab === "all" ||
      l.status?.toLowerCase() === activeTab;

    const searchableText = `
      ${l.name}
      ${l.carat}
      ${l.color}
      ${l.clarity}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(
      searchQuery.toLowerCase()
    );

    return matchesTab && matchesSearch;
  });

  /* ================= UI ================= */
  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">

        <ListingsHeader />

        <ListingsStats listings={mappedListings} loading={myLoading} />

        <ListingsFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ListingsList listings={filteredListings} loading={myLoading} />

      </div>
    </DashboardShell>
  );
};

export default MyListings;