import { Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import BidHeader from "./components/BidHeader";
import BidStats from "./components/BidStats";
import BidFilters from "./components/BidFilters";
import BidList from "./components/BidList";
import { useMyBids } from "./components/hooks/useMyBids";

const MyBids = () => {
  const {
    bids, stats, loading,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
  } = useMyBids();

  return (
    <DashboardShell>
      <div className="p-3 lg:p-2 space-y-8">
        <BidHeader />
        <BidStats stats={stats} />
        <BidFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <BidList bids={bids} />
        )}
      </div>
    </DashboardShell>
  );
};

export default MyBids;