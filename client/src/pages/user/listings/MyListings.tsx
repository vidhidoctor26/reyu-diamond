import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMyListingsRequest } from "@/store/slices/listingsSlice";
import DashboardShell from "@/components/layout/DashboardShell";

import ListingsHeader from "./components/ListingsHeader";
import ListingsStats from "./components/ListingsStats";
import ListingsFilters from "./components/ListingsFilters";
import ListingsList from "./components/ListingsList";

const MyListings = () => {
  const dispatch = useAppDispatch();
  const { listings, loading } = useAppSelector(
    (state) => state.listings
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchMyListingsRequest());
  }, [dispatch]);


  const filteredListings = listings.filter(
    (l) =>
      (activeTab === "all" || l.status === activeTab) &&
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        <ListingsHeader />
        <ListingsStats />
        <ListingsFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ListingsList listings={filteredListings} />
      </div>
    </DashboardShell>
  );
};

export default MyListings;
