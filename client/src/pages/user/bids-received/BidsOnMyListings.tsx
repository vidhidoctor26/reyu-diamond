import { Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useBidsOnMyListings } from "./components/useBidsReceived";
import BidsHeader from "./components/BidsHeader";
import BidsStats from "./components/BidsStats";
import BidsFilters from "./components/BidsFilters";
import ListingBidsGroup from "./components/ListingBidsGroup";
import AcceptBidDialog from "./components/AcceptBidDialog";
import RejectBidDialog from "./components/RejectBidDialog";

const BidsOnMyListings = () => {
  const state = useBidsOnMyListings();

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        <BidsHeader />
        <BidsStats stats={state.stats} />
        <BidsFilters {...state} />

        {state.loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : Object.keys(state.groupedByListing).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No bids received yet.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.values(state.groupedByListing).map((listing: any) => (
              <ListingBidsGroup
                key={listing.listingId}
                listing={listing}
                {...state}
              />
            ))}
          </div>
        )}

        <AcceptBidDialog {...state} />
        <RejectBidDialog {...state} />
      </div>
    </DashboardShell>
  );
};

export default BidsOnMyListings;