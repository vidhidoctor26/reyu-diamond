import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import DashboardShell from "@/components/layout/DashboardShell";
import { fetchInventoryRequest } from "@/store/slices/inventorySlice";
import { auctionActions } from "@/store/slices/auctionSlice";
import { bidActions } from "@/store/slices/bidSlice";
import { dealActions } from "@/store/slices/dealSlice";
import { notificationActions } from "@/store/slices/notificationsSlice";
import { badgeActions } from "@/store/slices/badgeSlice";

import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import QuickActions from "./components/QuickActions";
import RecentInventory from "./components/RecentInventory";
import ActiveBids from "./components/ActiveBids";
import DealsTimeline from "./components/DealsTimeline";
import BadgesPanel from "./components/BadgesPanel";
import NotificationsPanel from "./components/NotificationsPanel";
import ActivityFeed from "./components/ActivityFeed";

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!user?._id) return;

    dispatch(fetchInventoryRequest());
    dispatch(auctionActions.fetchMyAuctionsRequest({}));
    dispatch(bidActions.fetchAllMyBidsRequest());
    dispatch(bidActions.fetchBidsReceivedRequest());
    dispatch(dealActions.fetchDealsRequest());
    dispatch(notificationActions.fetchNotificationsRequest());
    dispatch(notificationActions.fetchUnreadCount());
    dispatch(badgeActions.fetchMyBadgesRequest());
  }, [dispatch, user?._id]);

  return (
    <DashboardShell>
      <div className="min-h-screen bg-background">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
          <DashboardHeader />
          <StatsGrid />
          <QuickActions />

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column — 2/3 width */}
            <div className="xl:col-span-2 space-y-6">
              <RecentInventory />
              <ActiveBids />
              <DealsTimeline />
            </div>

            {/* Right column — 1/3 width */}
            <div className="space-y-6">
              <NotificationsPanel />
              <BadgesPanel />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default UserDashboard;