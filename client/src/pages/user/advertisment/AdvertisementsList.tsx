import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Plus } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import AdCard from "./components/AdCard";
import AdStats from "./components/AdStats";
import AdFilters from "./components/AdFilters";
import AdEmptyState from "./components/AdEmptyState";
import AdListSkeleton from "./components/AdListSkeleton";
import { fetchMyAdsRequest } from "@/store/slices/advertisementSlice";
import type { RootState } from "@/store";

const AdvertisementsList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { myAds, myAdsLoading, myAdsError } = useAppSelector(
    (state: RootState) => state.advertisement
  );

  const [searchQuery, setSearchQuery]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMyAdsRequest());
  }, [dispatch]);

  const filteredAds = myAds.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      ad.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Advertisements
            </h1>
            <p className="text-muted-foreground mt-1">
              Promote your listings or business to reach more buyers
            </p>
          </div>
          <Button
            onClick={() => navigate("/user/advertisements/create")}
            className="gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Advertisement
          </Button>
        </div>

        <AdStats ads={myAds} />

        <AdFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />

        {myAdsLoading ? (
          <AdListSkeleton />
        ) : myAdsError ? (
          <p className="text-sm text-destructive text-center py-10">{myAdsError}</p>
        ) : filteredAds.length === 0 ? (
          <AdEmptyState />
        ) : (
          <div className="grid gap-4">
            {filteredAds.map((ad, index) => (
              <AdCard key={ad._id} ad={ad} index={index} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default AdvertisementsList;